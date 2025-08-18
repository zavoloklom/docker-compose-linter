import test from 'ava';
import esmock from 'esmock';

import { CliOptions } from '../../../src/application/dto/cli-options';
import { InMemoryLogger } from '../../fixtures/logger/in-memory-logger';
import { inMemoryLoggerHasSubstring } from '../../test-utils';

import type { ConfigValidator } from '../../../src/application/ports/config-validator';

// ----------------------
// Helper functions
// ----------------------
// Simple validator stub
const makeValidator = (errors: unknown[] = []) => {
  return {
    validate: (option: unknown) => errors,
    isValid: (option: unknown) => errors.length === 0,
  } as ConfigValidator;
};

// Load module with mocked dependencies
type MockOptions = {
  isFileExists?: boolean;
  searchResult?: { filepath: string; config: unknown } | null;
  loadResult?: { filepath: string; config: unknown } | null;
  mergeDefaults?: (cfg: object) => object;
  mergeCli?: (cfg: object, options: object) => object;
};
const createMockedLoader = async (options: MockOptions = {}) => {
  const {
    isFileExists = true,
    searchResult = null,
    loadResult = null,
    mergeDefaults = (config: object) => ({ ...config, mergedDefaults: true }),
    mergeCli = (config: object, cli: object) => ({ ...config, ...cli, mergedCli: true }),
  } = options;

  const cosmiconfigMock = {
    cosmiconfigSync: () => ({
      search: () => searchResult,
      load: () => loadResult,
    }),
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { CosmicConfigLoader } = await esmock<typeof import('../../../src/infrastructure/config/cosmic-config-loader')>(
    '../../../src/infrastructure/config/cosmic-config-loader',
    {
      cosmiconfig: cosmiconfigMock,
      'node:fs': {
        existsSync: () => isFileExists,
      },
      '../../../src/application/config/merge-with-defaults': {
        mergeWithDefaults: mergeDefaults,
      },
      '../../../src/application/config/merge-with-cli-options': {
        mergeWithCliOptions: mergeCli,
      },
    },
  );

  return CosmicConfigLoader;
};

test('load(): throws an error if custom path does not exist', async (t) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const CosmicConfigLoader = await createMockedLoader({ isFileExists: false });

  const logger = new InMemoryLogger();
  const validator = makeValidator();

  const loader = new CosmicConfigLoader(validator, logger);

  const error = t.throws(() => loader.load('/does/not/exist.json'));

  t.regex(error?.message ?? '', /not found/iu);
  t.true(inMemoryLoggerHasSubstring(logger, 'debug', 'Configuration file not found at custom path'));
});

test('load(): uses search and stores config', async (t) => {
  const config = { quiet: true };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const CosmicConfigLoader = await createMockedLoader({
    searchResult: { filepath: 'f.json', config },
  });

  const logger = new InMemoryLogger();
  const validator = makeValidator();
  const loader = new CosmicConfigLoader(validator, logger);

  loader.load();

  t.deepEqual(loader.get(), config);
  t.true(inMemoryLoggerHasSubstring(logger, 'debug', 'Configuration load from f.json'));
});

test('load(path): uses load and stores config', async (t) => {
  const config = { debug: true };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const CosmicConfigLoader = await createMockedLoader({
    loadResult: { filepath: 'g.json', config },
  });

  const logger = new InMemoryLogger();
  const validator = makeValidator();
  const loader = new CosmicConfigLoader(validator, logger);

  loader.load('g.json');

  t.deepEqual(loader.get(), config);
  t.true(inMemoryLoggerHasSubstring(logger, 'debug', 'Configuration load from g.json'));
});

test('withDefaults(): merges config using mergeWithDefaults', async (t) => {
  const base = { a: 1 };
  const merged = { a: 1, b: 2 };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const CosmicConfigLoader = await createMockedLoader({
    searchResult: { filepath: 'f.json', config: base },
    mergeDefaults: () => merged,
  });

  const logger = new InMemoryLogger();
  const validator = makeValidator();
  const loader = new CosmicConfigLoader(validator, logger);

  loader.load().withDefaults();

  t.deepEqual(loader.get(), merged);
  t.true(inMemoryLoggerHasSubstring(logger, 'debug', 'Merging with defaults'));
});

test('mergeCliOptions(): merges config with CLI options', async (t) => {
  const base = { quiet: false };
  const cli = { quiet: true };
  const merged = { ...base, ...cli, mark: 1 };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const CosmicConfigLoader = await createMockedLoader({
    searchResult: { filepath: 'f.json', config: base },
    mergeCli: (config, options) => ({ ...config, ...options, mark: 1 }),
  });

  const logger = new InMemoryLogger();
  const validator = makeValidator();
  const loader = new CosmicConfigLoader(validator, logger);

  loader.load().mergeCliOptions(cli as CliOptions);

  t.deepEqual(loader.get(), merged);
  t.true(inMemoryLoggerHasSubstring(logger, 'debug', 'Merging with CLI options'));
});

test('validate(): passes when no errors', async (t) => {
  const config = { quiet: true };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const CosmicConfigLoader = await createMockedLoader({
    searchResult: { filepath: 'f.json', config },
  });

  const logger = new InMemoryLogger();
  const validator = makeValidator([]);
  const loader = new CosmicConfigLoader(validator, logger);

  t.notThrows(() => loader.load().validate());
  t.true(inMemoryLoggerHasSubstring(logger, 'debug', 'Starting config validation'));
  t.true(inMemoryLoggerHasSubstring(logger, 'debug', 'Validation complete'));
});

test('validate(): throws when errors exist', async (t) => {
  const config = { debug: 'oops' };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const CosmicConfigLoader = await createMockedLoader({
    searchResult: { filepath: 'f.json', config },
  });

  const errors = [{ message: 'invalid debug' }, { message: 'unknown prop' }];

  const logger = new InMemoryLogger();
  const validator = makeValidator(errors);
  const loader = new CosmicConfigLoader(validator, logger);

  const error = t.throws(() => loader.load().validate());
  t.regex(error?.message ?? '', /Config validation failed/u);

  t.true(inMemoryLoggerHasSubstring(logger, 'debug', 'Validation error: invalid debug'));
  t.true(inMemoryLoggerHasSubstring(logger, 'debug', 'Validation error: unknown prop'));
});
