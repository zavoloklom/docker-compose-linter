import test from 'ava';

import { CLI_DEFAULT_OPTIONS } from '../../../src/application/cli-options/defaults';
import { DEFAULT_CONFIG } from '../../../src/application/config/defaults';
import { mergeWithCliOptions } from '../../../src/application/config/merge-with-cli-options';

import type { CliOptions } from '../../../src/application/dto/cli-options';
import type { Config } from '../../../src/application/dto/config';

test('should return defaults for default input', (t) => {
  const config = mergeWithCliOptions(DEFAULT_CONFIG, CLI_DEFAULT_OPTIONS);

  t.is(config.quiet, DEFAULT_CONFIG.quiet);
  t.is(config.debug, DEFAULT_CONFIG.debug);
  t.deepEqual(config.exclude, DEFAULT_CONFIG.exclude);
  t.deepEqual(config.rules, DEFAULT_CONFIG.rules);
});

test('should return override options if provided', (t) => {
  const cliOptions: CliOptions = {
    ...CLI_DEFAULT_OPTIONS,
    quiet: true,
    debug: false,
    exclude: ['path'],
    disableRule: ['rule-id'],
  };

  const providedConfig: Config = {
    rules: {
      'rule-id': 2,
      'rule-id-test': 1,
    },
    quiet: false,
    debug: true,
    exclude: ['path/path'],
    plugins: [],
    recursive: false,
    stats: false,
  };

  const config = mergeWithCliOptions(providedConfig, cliOptions);

  t.is(config.quiet, cliOptions.quiet);
  t.is(config.debug, cliOptions.debug);
  t.deepEqual(config.exclude, cliOptions.exclude);
  t.deepEqual(config.rules, {
    'rule-id': 0,
    'rule-id-test': 1,
  });

  // Check that it is not the same reference
  t.not(config.exclude, cliOptions.exclude);
});
