import anyTest, { TestFn } from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import { YamlComposeDocumentFactory } from '../../../src/infrastructure/yaml/yaml-compose-document-factory';
import { InMemoryLogger } from '../../fixtures/logger/in-memory-logger';
import { inMemoryLoggerHasSubstring } from '../../test-utils';

import type { FileFinder } from '../../../src/application/ports/file-finder';
import type { FileReader } from '../../../src/application/ports/file-reader';

// ----------------------
// Test context
// ----------------------
type Mocks = {
  fileFinder: FileFinder;
  fileReader: FileReader;
  logger: InMemoryLogger;
};

type TestContext = { mocks: Mocks; factory: YamlComposeDocumentFactory };

const test = anyTest as TestFn<TestContext>;

// ----------------------
// Hooks
// ----------------------
test.beforeEach((t) => {
  const mocks: Mocks = {
    // eslint-disable-next-line @typescript-eslint/require-await
    fileFinder: { discoverPaths: async () => [] },
    // eslint-disable-next-line @typescript-eslint/require-await
    fileReader: { read: async () => '' },
    logger: new InMemoryLogger(),
  };

  t.context.mocks = mocks;
  t.context.factory = new YamlComposeDocumentFactory(mocks.fileFinder, mocks.fileReader, mocks.logger);
});

// ----------------------
// Tests
// ----------------------
test('fromPath() returns documents for all discovered files', async (t) => {
  const { mocks, factory } = t.context;

  const files = ['/workspace/a.yml', '/workspace/services/b.yml', '/workspace/services/c.yaml'];
  const contents: Record<string, string> = {
    [files[0]]: 'version: "3.8"\nservices: {}\n',
    [files[1]]: 'services:\n  app:\n    image: node:20\n',
    [files[2]]: '# empty\n',
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  mocks.fileFinder.discoverPaths = async (paths) => {
    t.deepEqual(paths, ['/workspace'], 'discoverPaths called with provided paths');
    return files;
  };
  // eslint-disable-next-line @typescript-eslint/require-await
  mocks.fileReader.read = async (file) => contents[file];

  const result = await factory.fromPath(['/workspace'], {});

  t.true(Array.isArray(result));
  t.is(result.length, files.length);

  for (const [index, file] of files.entries()) {
    t.true(result[index] instanceof YamlComposeDocument);
    t.is(result[index].filePath, file);
  }
});

test('fromPath() skips files that fail to read and logs a warning', async (t) => {
  const { mocks, factory } = t.context;

  const files = ['/w/ok.yml', '/w/fail.yml', '/w/ok2.yml'];
  const contents: Record<string, string> = {
    [files[0]]: 'ok: 1',
    [files[2]]: 'ok2: 2',
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  mocks.fileFinder.discoverPaths = async () => files;
  // eslint-disable-next-line @typescript-eslint/require-await
  mocks.fileReader.read = async (file) => {
    if (file === files[1]) {
      throw new Error('read failed');
    }
    return contents[file];
  };

  const results = await factory.fromPath(['/w'], {});

  t.is(results.length, 2);
  for (const result of results) {
    t.true(result instanceof YamlComposeDocument);
    t.not(result.filePath, files[1]);
  }
  t.true(inMemoryLoggerHasSubstring(mocks.logger, 'error', files[1]), 'error message is correct');
});

test('fromPath() returns empty array if no files discovered', async (t) => {
  const { factory } = t.context;

  const result = await factory.fromPath(['/nothing'], {});
  t.deepEqual(result, []);
});

test('fromPath() propagates errors from discoverPaths', async (t) => {
  const { mocks, factory } = t.context;

  // eslint-disable-next-line @typescript-eslint/require-await
  mocks.fileFinder.discoverPaths = async () => {
    throw new Error('discovery failed');
  };

  const error = await t.throwsAsync(() => factory.fromPath(['/w'], {}));
  t.truthy(error);
  t.true(String(error.message).includes('discovery failed'));
});
