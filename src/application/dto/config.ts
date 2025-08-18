type ConfigRuleLevel = 0 | 1 | 2;

type ConfigRuleOptions = ConfigRuleLevel | [ConfigRuleLevel, Record<string, unknown>];

interface Config {
  rules: {
    [ruleName: string]: ConfigRuleOptions;
  };
  quiet: boolean;
  debug: boolean;
  recursive: boolean;
  stats: boolean;
  exclude: string[];
  plugins: string[];
}

export { Config, ConfigRuleOptions, ConfigRuleLevel };
