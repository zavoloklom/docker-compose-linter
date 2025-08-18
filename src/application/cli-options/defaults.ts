import type { CliOptions } from '../dto/cli-options';

const CLI_DEFAULT_OPTIONS: CliOptions = {
  files: [],
  color: true,
  debug: false,
  disableRule: [],
  exclude: [],
  fix: false,
  fixDryRun: false,
  formatter: 'stylish',
  maxWarnings: -1,
  quiet: false,
  recursive: false,
  stats: false,
};

export { CLI_DEFAULT_OPTIONS };
