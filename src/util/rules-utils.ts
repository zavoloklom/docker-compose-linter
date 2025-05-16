import { Logger } from './logger';
import Rules from '../rules/index';
import type { Config, ConfigRuleLevel, ConfigRule } from '../config/config.types';
import type { Rule, RuleType } from '../rules/rules.types';

function loadLintRules(config: Config): Rule[] {
  const logger = Logger.init();
  const activeRules: Rule[] = [];

  Object.values(Rules).forEach((RuleClass) => {
    if (typeof RuleClass !== 'function') {
      logger.error(`Error loading rule: ${String(RuleClass)}`);
      return;
    }

    try {
      const ruleInstance = new (RuleClass as new () => Rule)();
      const ruleConfig: ConfigRule = config.rules[ruleInstance.name];

      let ruleLevel: ConfigRuleLevel;
      let ruleOptions: Record<string, unknown> | undefined;

      if (Array.isArray(ruleConfig)) {
        [ruleLevel, ruleOptions] = ruleConfig;
      } else {
        ruleLevel = ruleConfig;
      }

      if (ruleLevel !== 0) {
        const instance = ruleOptions
          ? new (RuleClass as new (options?: Record<string, unknown>) => Rule)(ruleOptions)
          : ruleInstance;

        const typeMap: { [key: number]: RuleType } = {
          1: 'warning',
          2: 'error',
        };

        instance.type = typeMap[ruleLevel] || instance.type;
        activeRules.push(instance);
      }
    } catch (error) {
      logger.error(`Error loading rule: ${RuleClass?.name}`, error);
    }
  });

  return activeRules;
}

export { loadLintRules };
