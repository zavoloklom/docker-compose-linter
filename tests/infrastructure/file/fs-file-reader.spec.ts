import anyTest, { TestFn } from 'ava';
import { mkdir, mkdtemp, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { FsFileReader } from '../../../src/infrastructure/file/fs-file-reader';
import { InMemoryLogger } from '../../fixtures/logger/in-memory-logger';
import { createFileAtPath } from '../../test-utils';

// ----------------------
// Test context
// ----------------------
type TestContext = {
  temporaryWorkspaceAbsolutePath: string;
  workspacePath: string;
  inMemoryLogger: InMemoryLogger;
  fileSystemFileReader: FsFileReader;
};

const test = anyTest as TestFn<TestContext>;

// ----------------------
// Hooks
// ----------------------
test.beforeEach(async (t) => {
  const temporaryWorkspaceAbsolutePath = await mkdtemp(join(tmpdir(), 'fs-file-reader-'));
  t.context.temporaryWorkspaceAbsolutePath = temporaryWorkspaceAbsolutePath;
  t.context.workspacePath = await realpath(temporaryWorkspaceAbsolutePath);
  t.context.inMemoryLogger = new InMemoryLogger();
  t.context.fileSystemFileReader = new FsFileReader(t.context.inMemoryLogger);
});

test.afterEach.always(async (t) => {
  await rm(t.context.temporaryWorkspaceAbsolutePath, { recursive: true, force: true });
});

// ----------------------
// Tests
// ----------------------
test('read() return content of correct file', async (t) => {
  const { workspacePath, fileSystemFileReader } = t.context;
  const filePath = join(workspacePath, 'services', 'docker-compose.yml');
  const fileContent = 'version: 3';

  await createFileAtPath(filePath, fileContent);

  const content = await fileSystemFileReader.read(filePath);

  t.is(content, fileContent);
});

test('read() throws an error on directory', async (t) => {
  const { workspacePath, fileSystemFileReader } = t.context;
  const directoryPath = join(workspacePath, 'docker');
  await mkdir(resolve(directoryPath), { recursive: true });

  const error = await t.throwsAsync(async () => await fileSystemFileReader.read(directoryPath));
  t.truthy(error);
  t.true(String(error.message).includes('EISDIR'));
});

test('read() throws an error on incorrect file', async (t) => {
  const { workspacePath, fileSystemFileReader } = t.context;

  const error = await t.throwsAsync(async () => await fileSystemFileReader.read(join(workspacePath, 'compose.yml')));
  t.truthy(error);
  t.true(String(error.message).includes('ENOENT'));
});
