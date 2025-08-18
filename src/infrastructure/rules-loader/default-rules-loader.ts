import { resolve } from 'node:path';

import { LogSource, type Logger } from '../../application/ports/logger';
import { type Rule, RuleType } from '../../domain/models/rule';
import { type RuleConstructor, isRuleConstructor } from '../../domain/models/rule-constructor';
import * as Rules from '../../plugins/rules/index';

import type { Config, ConfigRuleLevel, ConfigRuleOptions } from '../../application/dto/config';
import type { RulesLoader } from '../../application/ports/rules-loader';

class DefaultRulesLoader implements RulesLoader {
  readonly logger: Logger;
  readonly config: Config;
  rulesCache!: Rule[];

  constructor(config: Config, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  async load(): Promise<Rule[]> {
    this.logger.debug(LogSource.CORE, 'Start rules initialization');

    if (this.rulesCache) {
      this.logger.debug(LogSource.CORE, `Load rules from cache: ${this.rulesCache.length}`);
      return [...this.rulesCache];
    }

    const defaultRules = this.initializeRules(this.getDefaultRuleClasses());
    const customRules = this.initializeRules(await this.getCustomRuleClasses());
    const activeRules = [...defaultRules, ...customRules];
    this.logger.debug(LogSource.CORE, `Initialize rules: ${activeRules.length}`);

    this.rulesCache = activeRules;
    return [...this.rulesCache];
  }

  private initializeRules(rulesInput: RuleConstructor[]): Rule[] {
    const activeRules = [];
    const ruleTypeByLevel: { [key: number]: RuleType } = {
      1: RuleType.WARNING,
      2: RuleType.ERROR,
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const RuleClass of rulesInput) {
      // Get rule level and options from config if they exist there
      const { ruleLevel, ruleOptions } = this.getRuleOptionsFromConfig(RuleClass.ID, this.config.rules);

      // Skip rules with 0
      if (ruleLevel === 0) continue;

      // Set new type for rule if provided
      if (ruleLevel) RuleClass.TYPE = ruleTypeByLevel[ruleLevel];

      try {
        const instance = ruleOptions ? new RuleClass(ruleOptions) : new RuleClass();
        activeRules.push(instance);
      } catch (error) {
        this.logger.error(`Error rule initialization: ${RuleClass?.name}`, error instanceof Error ? error.message : '');
      }
    }

    return activeRules;
  }

  private getRuleOptionsFromConfig(
    ruleId: string,
    config: typeof this.config.rules,
  ): { ruleLevel: ConfigRuleLevel | null; ruleOptions: Record<string, unknown> | null } {
    let ruleLevel = null;
    let ruleOptions = null;

    if (ruleId in config) {
      const ruleConfig = config[ruleId];
      if (Array.isArray(ruleConfig)) {
        [ruleLevel, ruleOptions] = ruleConfig;
      } else {
        ruleLevel = ruleConfig;
      }
    }

    return { ruleLevel, ruleOptions };
  }

  private getDefaultRuleClasses(): RuleConstructor[] {
    this.logger.debug(LogSource.CORE, 'Start searching default rules');
    const defaultRules: RuleConstructor[] = Object.values(Rules as Record<string, RuleConstructor>);
    this.logger.debug(LogSource.CORE, `Default rules found: ${defaultRules.length}`);
    return defaultRules;
  }

  private async getCustomRuleClasses(): Promise<RuleConstructor[]> {
    this.logger.debug(LogSource.CORE, 'Start searching custom rules');

    const plugins = this.config.plugins ?? [];
    const loaders = plugins.map(async (plugin) => {
      // Resolve path
      const modulePath = this.resolveModulePath(plugin);

      // Dynamic import
      let candidates;
      try {
        // Shape is flexible, we normalize below.
        const module = (await import(modulePath)) as { default?: unknown; rules?: unknown; [k: string]: unknown };
        // Prefer "rules", then "default", then the whole module.
        const exported = module.rules ?? module.default ?? module;

        // Normalize to an array of RuleConstructor.
        candidates = Array.isArray(exported) ? exported : Object.values(exported);
        if (candidates.length === 0) {
          throw new Error(`Module at ${modulePath} does not export rules.`);
        }
      } catch {
        throw new Error(`Module at ${modulePath} does not export rules.`);
      }

      return candidates.map((candidate) => {
        if (!isRuleConstructor(candidate)) {
          throw new Error(`Class is not implementing Rule interface: ${candidate}`);
        }
        return candidate;
      });
    });

    const ruleArrays = await Promise.all(loaders);
    const customRules = ruleArrays.flat();

    this.logger.debug(LogSource.CORE, `Custom rules found: ${customRules.length}`);
    return customRules;
  }

  // eslint-disable-next-line class-methods-use-this
  private resolveModulePath(plugin: string) {
    let modulePath = '';
    if (plugin.startsWith('.')) {
      modulePath = resolve(process.cwd(), plugin);
    }
    if (plugin.includes('dclint-plugin-')) {
      modulePath = plugin;
    }
    if (!modulePath) {
      throw new Error(`Unsupported reference: "${plugin}". Use a relative path or "dclint-plugin-*".`);
    }
    return modulePath;
  }
}

export { DefaultRulesLoader };
