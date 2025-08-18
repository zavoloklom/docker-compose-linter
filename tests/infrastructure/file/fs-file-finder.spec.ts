/* eslint-disable sonarjs/no-duplicate-string */
import anyTest, { TestFn } from 'ava';
import { mkdtemp, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

import { FsFileFinder } from '../../../src/infrastructure/file/fs-file-finder';
import { InMemoryLogger } from '../../fixtures/logger/in-memory-logger';
import { createFileAtPath, inMemoryLoggerHasSubstring } from '../../test-utils';

// ----------------------
// Test context
// ----------------------
type TestContext = {
  temporaryWorkspaceAbsolutePath: string;
  workspacePath: string;
  inMemoryLogger: InMemoryLogger;
  fileSystemFileFinder: FsFileFinder;
};

const test = anyTest as TestFn<TestContext>;

// ----------------------
// Helper functions
// ----------------------
const toRelativePathsSorted = (basePath: string, absolutePaths: string[]): string[] => {
  return absolutePaths.map((absolutePath) => relative(basePath, absolutePath)).sort((a, b) => a.localeCompare(b));
};

// ----------------------
// Hooks
// ----------------------
test.beforeEach(async (t) => {
  const temporaryWorkspaceAbsolutePath = await mkdtemp(join(tmpdir(), 'fs-file-finder-'));
  t.context.temporaryWorkspaceAbsolutePath = temporaryWorkspaceAbsolutePath;
  t.context.workspacePath = await realpath(temporaryWorkspaceAbsolutePath);
  t.context.inMemoryLogger = new InMemoryLogger();
  t.context.fileSystemFileFinder = new FsFileFinder(t.context.inMemoryLogger);
});

test.afterEach.always(async (t) => {
  await rm(t.context.temporaryWorkspaceAbsolutePath, { recursive: true, force: true });
});

// ----------------------
// Tests
// ----------------------
test('discoverPaths() with { recursive: true } finds compose files recursively and ignores excluded directories (including defaults)', async (t) => {
  const { workspacePath, fileSystemFileFinder } = t.context;

  // Arrange
  await createFileAtPath(join(workspacePath, 'services', 'docker-compose.yml'));
  await createFileAtPath(join(workspacePath, 'services', 'compose.yaml'));
  await createFileAtPath(join(workspacePath, 'nested', 'deeper', 'compose.yml'));
  await createFileAtPath(join(workspacePath, 'directory_to_exclude_pass', 'compose.yml'));
  // Non-matching file
  await createFileAtPath(join(workspacePath, 'services', 'not-compose.txt'));
  // Excluded directories (should be ignored)
  await createFileAtPath(join(workspacePath, 'node_modules', 'compose.yml'));
  await createFileAtPath(join(workspacePath, '.git', 'compose.yml'));
  await createFileAtPath(join(workspacePath, '.idea', 'compose.yml'));
  await createFileAtPath(join(workspacePath, '.tsimp', 'compose.yml'));
  await createFileAtPath(join(workspacePath, 'directory_to_exclude', 'deeper', 'compose.yml'));
  await createFileAtPath(join(workspacePath, 'nested', 'deeper_exclude', 'compose.yml'));
  await createFileAtPath(join(workspacePath, 'file_to_exclude', 'compose.yml'));

  // Act
  const discovered = await fileSystemFileFinder.discoverPaths(['.'], {
    allowedRoot: workspacePath,
    recursive: true,
    exclude: ['directory_to_exclude', './file_to_exclude/compose.yml', 'deeper_exclude'],
  });

  // Assert
  t.deepEqual(
    toRelativePathsSorted(workspacePath, discovered),
    [
      'nested/deeper/compose.yml',
      'services/compose.yaml',
      'services/docker-compose.yml',
      'directory_to_exclude_pass/compose.yml',
    ].sort((a, b) => a.localeCompare(b)),
  );
});

test('discoverPaths() with { recursive: false } returns only top-level matches', async (t) => {
  const { workspacePath, fileSystemFileFinder } = t.context;

  // Arrange
  await createFileAtPath(join(workspacePath, 'compose.top-level.yml'));
  await createFileAtPath(join(workspacePath, 'nested', 'compose.yml')); // Should be skipped when recursive = false

  // Act
  const discovered = await fileSystemFileFinder.discoverPaths(['.'], {
    allowedRoot: workspacePath,
    recursive: false,
  });

  // Assert
  t.deepEqual(toRelativePathsSorted(workspacePath, discovered), ['compose.top-level.yml']);
});

test('discoverPaths() return empty array if nothing found', async (t) => {
  const { workspacePath, fileSystemFileFinder } = t.context;

  // Arrange
  await createFileAtPath(join(workspacePath, 'file.yml'));
  await createFileAtPath(join(workspacePath, 'nested', 'another-file.yml'));

  // Act
  const discovered = await fileSystemFileFinder.discoverPaths(['.'], {
    allowedRoot: workspacePath,
    recursive: true,
  });

  // Assert
  t.deepEqual(toRelativePathsSorted(workspacePath, discovered), []);
});

test('discoverPaths() logs and skips inputs that are outside of allowedRoot', async (t) => {
  const { workspacePath, fileSystemFileFinder, inMemoryLogger } = t.context;

  // Arrange: inside allowed root (valid)
  await createFileAtPath(join(workspacePath, 'inside', 'compose.yml'));

  // Arrange: outside allowed root (invalid)
  const externalTemporaryDirectoryAbsolutePath = await mkdtemp(join(tmpdir(), 'fs-file-finder-external-'));
  const externalComposeFileAbsolutePath = join(externalTemporaryDirectoryAbsolutePath, 'compose.yml');
  await createFileAtPath(externalComposeFileAbsolutePath);

  // Act
  const discovered = await fileSystemFileFinder.discoverPaths(['inside', externalComposeFileAbsolutePath], {
    allowedRoot: workspacePath,
  });

  // Assert
  t.deepEqual(toRelativePathsSorted(workspacePath, discovered), ['inside/compose.yml']);

  t.true(
    inMemoryLoggerHasSubstring(inMemoryLogger, 'debug', 'Unexpected error resolving path:'),
    'Expected a debug log about the path outside of allowedRoot',
  );

  // Cleanup external directory
  await rm(externalTemporaryDirectoryAbsolutePath, { recursive: true, force: true });
});

test('discoverPaths() pattern matching accepts variations like compose-prod.yml and docker-compose.dev.yaml', async (t) => {
  const { workspacePath, fileSystemFileFinder } = t.context;

  // Arrange
  await createFileAtPath(join(workspacePath, 'compose-prod.yml'));
  await createFileAtPath(join(workspacePath, 'docker-compose.dev.yaml'));
  await createFileAtPath(join(workspacePath, 'compose.txt')); // Should not match
  await createFileAtPath(join(workspacePath, 'docker-compose')); // Should not match

  // Act
  const discovered = await fileSystemFileFinder.discoverPaths(['.'], {
    allowedRoot: workspacePath,
  });

  // Assert
  t.deepEqual(
    toRelativePathsSorted(workspacePath, discovered),
    ['compose-prod.yml', 'docker-compose.dev.yaml'].sort((a, b) => a.localeCompare(b)),
  );
});
