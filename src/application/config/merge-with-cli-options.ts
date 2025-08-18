import { CliOptions } from '../dto/cli-options';
import { Config } from '../dto/config';

type CliOptionsSubset = Pick<CliOptions, 'quiet' | 'debug' | 'exclude' | 'stats' | 'recursive' | 'disableRule'>;

const mergeWithCliOptions = (config: Config, cli: CliOptionsSubset): Config => {
  config.quiet = cli.quiet;
  config.debug = cli.debug;
  config.stats = cli.stats;
  config.recursive = cli.recursive;

  if (cli.exclude.length > 0) config.exclude = [...cli.exclude];

  if (cli.disableRule.length > 0) {
    for (const ruleName of cli.disableRule) {
      config.rules[ruleName] = 0;
    }
  }

  return config;
};

export { mergeWithCliOptions };
