import test from 'ava';

import { DEFAULT_CONFIG } from '../../../src/application/config/defaults';
import { mergeWithDefaults } from '../../../src/application/config/merge-with-defaults';

import type { Config } from '../../../src/application/dto/config';

test('should return defaults for empty input', (t) => {
  const config = mergeWithDefaults();
  t.deepEqual(DEFAULT_CONFIG, config);
});

test('should return override options if provided', (t) => {
  const partialConfig = {
    exclude: ['path', 'path/path'],
    rules: {
      'rule-1': 2,
      'rule-2': [1, { name: 'foo' }],
    },
    quiet: true,
    plugins: ['@dclint/new-rule-set'],
  } satisfies Partial<Config>;

  const config = mergeWithDefaults(partialConfig);

  t.is(config.debug, DEFAULT_CONFIG.debug);
  t.deepEqual(config.exclude, partialConfig.exclude);
  t.deepEqual(config.rules, partialConfig.rules);
  t.is(config.quiet, partialConfig.quiet);
  t.deepEqual(config.plugins, partialConfig.plugins);

  // Check that it is not the same reference
  t.not(config.exclude, partialConfig.exclude);
});
