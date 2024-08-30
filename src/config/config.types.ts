type ConfigRuleLevel = 0 | 1 | 2;

type ConfigRule = ConfigRuleLevel | [ConfigRuleLevel, Record<string, unknown>?];

interface Config {
    rules: {
        [ruleName: string]: ConfigRule;
    };
    quiet: boolean;
    debug: boolean;
    exclude: string[];
}

export { Config, ConfigRule, ConfigRuleLevel };
