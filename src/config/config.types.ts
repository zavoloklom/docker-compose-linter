import { RuleName } from '../rules/rules.types';

type ConfigRuleLevel = 0 | 1 | 2;

type ConfigRule = ConfigRuleLevel | [ConfigRuleLevel, Record<string, unknown>?];

type Config = {
  rules: {
    [ruleName: RuleName]: ConfigRule;
  };
  quiet: boolean;
  debug: boolean;
  exclude: string[];
};

export { Config, ConfigRule, ConfigRuleLevel };
