import type { LintRule, LintMessageType, LintRuleDefinition } from '../linter/linter.types';
import type { Config, ConfigRuleLevel, ConfigRule } from '../config/config.types';
import { Logger } from './logger';
import Rules from '../rules/index';

async function loadLintRules(config: Config): Promise<LintRule[]> {
  const logger = Logger.init();
  const activeRules: LintRule[] = [];

  Object.values(Rules).forEach((RuleClass) => {
    if (typeof RuleClass !== 'function') {
      logger.error(`Error loading rule: ${String(RuleClass)}`);
      return;
    }

    try {
      const ruleInstance = new (RuleClass as new () => LintRule)();
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
          ? new (RuleClass as new (options?: Record<string, unknown>) => LintRule)(ruleOptions)
          : ruleInstance;

        const typeMap: { [key: number]: LintMessageType } = {
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

function getRuleDefinition(rule: LintRule): LintRuleDefinition {
  return {
    name: rule.name,
    type: rule.type,
    category: rule.category,
    severity: rule.severity,
    fixable: rule.fixable,
    meta: rule.meta,
    hasFixFunction: 'fix' in rule,
    hasOptions: 'options' in rule,
  };
}

export { loadLintRules, getRuleDefinition };
