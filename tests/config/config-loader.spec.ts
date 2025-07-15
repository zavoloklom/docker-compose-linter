import test from 'ava';
import esmock from 'esmock';

import { ConfigValidationError } from '../../src/errors/config-validation-error';
import { FileNotFoundError } from '../../src/errors/file-not-found-error';

import type { CLIConfig } from '../../src/cli/cli.types';
import type { ConfigLoader } from '../../src/config/config-loader';

type MockOptions = {
  isFileFound?: boolean;
  searchReturnsNull?: boolean;
};

async function createMockedLoader(options: MockOptions = {}): Promise<ConfigLoader> {
  const { isFileFound = true, searchReturnsNull = false } = options;

  // Fake config returned by explorer.load()
  const fakeConfig = {
    config: {
      rules: {
        'no-version-field': 1,
      },
      quiet: true,
      debug: false,
      exclude: ['tmp'],
    },
    filepath: '/some/path/.dclintrc',
  };

  const mockExistsSync = () => isFileFound;
  const mockExplorer = () => ({
    load: () => fakeConfig,
    search: () => (searchReturnsNull ? null : fakeConfig),
  });

  const { ConfigLoader } = await esmock<typeof import('../../src/config/config-loader')>(
    '../../src/config/config-loader',
    {
      'node:fs': { existsSync: mockExistsSync },
      cosmiconfig: { cosmiconfigSync: () => mockExplorer() },
    },
  );

  return ConfigLoader.init();
}

// @ts-ignore TS2349
test('loads config from custom file path if it exists', async (t) => {
  const configLoader = await createMockedLoader({ isFileFound: true });

  const config = configLoader.load('/some/path/.dclintrc').withDefaults().validate().get();

  t.deepEqual(config, {
    rules: {
      'no-version-field': 1,
    },
    quiet: true,
    debug: false,
    exclude: ['tmp'],
  });
});

// @ts-ignore TS2349
test('throws if config file is not found at custom path', async (t) => {
  const configLoader = await createMockedLoader({ isFileFound: false });

  const error = t.throws(() => {
    configLoader.load('/non/existing/path/to/config.json');
  });

  t.true(error instanceof FileNotFoundError);
});

// @ts-ignore TS2349
test('merges CLI arguments into config', async (t) => {
  const configLoader = await createMockedLoader({ isFileFound: true });

  const cli: CLIConfig = {
    color: false,
    files: [],
    fix: false,
    fixDryRun: false,
    formatter: '',
    maxWarnings: 0,
    recursive: false,
    quiet: true,
    debug: true,
    exclude: ['node_modules'],
    disableRule: ['no-version-field'],
  };

  const config = configLoader.load().mergeCli(cli).get();

  t.true(config.quiet);
  t.true(config.debug);
  t.deepEqual(config.exclude, ['node_modules']);
  t.is(config.rules['no-version-field'], 0);
});

// @ts-ignore TS2349
test('throws on unknown rule name in config', async (t) => {
  const configLoader = await createMockedLoader({ isFileFound: true });
  // @ts-expect-error
  configLoader.config = {
    rules: {
      'non-existent-rule': 1,
    },
    quiet: false,
    debug: false,
    exclude: [],
  };

  const error = t.throws(() => configLoader.validate());
  t.assert(error?.message.includes('Unknown rule name "non-existent-rule"'));
});

// @ts-ignore TS2349
test('uses DEFAULT_CONFIG when no config file is found and no path is provided', async (t) => {
  const configLoader = await createMockedLoader({ searchReturnsNull: true });

  const config = configLoader.load().get();

  t.deepEqual(config, {
    rules: {},
    quiet: false,
    debug: false,
    exclude: [],
  });
});

// @ts-ignore TS2349
test('throws ConfigValidationError when schema validation fails', async (t) => {
  const configLoader = await createMockedLoader();

  // @ts-ignore
  configLoader.config = {
    // @ts-expect-error `rules` should be an object
    rules: 123,
    quiet: false,
    debug: false,
    exclude: [],
  };

  const error = t.throws(() => configLoader.validate());

  t.true(error instanceof ConfigValidationError);
});
