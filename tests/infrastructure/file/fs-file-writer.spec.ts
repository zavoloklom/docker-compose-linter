/* eslint-disable sonarjs/no-duplicate-string */
import anyTest, { TestFn } from 'ava';
import esmock from 'esmock';
import { mkdir, mkdtemp, readFile, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';

import { FsFileWriter } from '../../../src/infrastructure/file/fs-file-writer';
import { InMemoryLogger } from '../../fixtures/logger/in-memory-logger';
import { createFileAtPath } from '../../test-utils';

// ----------------------
// Test context
// ----------------------
type TestContext = {
  temporaryWorkspaceAbsolutePath: string;
  workspacePath: string;
  filePath: string;
  fileContent: string;
  inMemoryLogger: InMemoryLogger;
  fileSystemFileWriter: FsFileWriter;
};

const test = anyTest as TestFn<TestContext>;

// ----------------------
// Hooks
// ----------------------
test.beforeEach(async (t) => {
  const temporaryWorkspaceAbsolutePath = await mkdtemp(join(tmpdir(), 'fs-file-writer-'));
  const workspacePath = await realpath(temporaryWorkspaceAbsolutePath);
  t.context.temporaryWorkspaceAbsolutePath = temporaryWorkspaceAbsolutePath;
  t.context.workspacePath = workspacePath;
  t.context.filePath = join(workspacePath, 'services', 'docker-compose.yml');
  t.context.fileContent = 'version: 3';
  t.context.inMemoryLogger = new InMemoryLogger();
  t.context.fileSystemFileWriter = new FsFileWriter(t.context.inMemoryLogger);
});

test.afterEach.always(async (t) => {
  await rm(t.context.temporaryWorkspaceAbsolutePath, { recursive: true, force: true });
});

// ----------------------
// Tests
// ----------------------
test('write() with { atomic: false, backup: false } direct write to existing file', async (t) => {
  const { fileSystemFileWriter, filePath, fileContent } = t.context;

  // Ensure that original file exists
  await createFileAtPath(filePath, '{ atomic: false, backup: false }');

  await fileSystemFileWriter.write(filePath, fileContent, { atomic: false, backup: false });
  const content = await readFile(filePath, 'utf8');

  t.is(content, fileContent);
});

test('write() with { atomic: true, backup: false } atomic write to existing file', async (t) => {
  const { fileSystemFileWriter, filePath, fileContent } = t.context;

  // Ensure that original file exists
  await createFileAtPath(filePath, '{ atomic: true, backup: false }');

  await fileSystemFileWriter.write(filePath, fileContent, { atomic: true, backup: false });
  const content = await readFile(filePath, 'utf8');

  t.is(content, fileContent);
});

test('write() with { atomic: false, backup: true } create backup and direct write to file', async (t) => {
  const { fileSystemFileWriter, filePath, fileContent } = t.context;

  // Ensure that original file exists
  const originalContent = '{ atomic: false, backup: true }';
  await createFileAtPath(filePath, originalContent);

  await fileSystemFileWriter.write(filePath, fileContent, { atomic: false, backup: true });
  const content = await readFile(filePath, 'utf8');
  const backupContent = await readFile(`${filePath}.bak`, 'utf8');

  t.is(content, fileContent);
  t.is(backupContent, originalContent);
});

test('write() with { atomic: true, backup: true } create backup and atomic write to file', async (t) => {
  const { fileSystemFileWriter, filePath, fileContent } = t.context;

  // Ensure that original file exists
  const originalContent = '{ atomic: true, backup: true }';
  await createFileAtPath(filePath, originalContent);

  await fileSystemFileWriter.write(filePath, fileContent, { atomic: true, backup: true });
  const content = await readFile(filePath, 'utf8');
  const backupContent = await readFile(`${filePath}.bak`, 'utf8');

  t.is(content, fileContent);
  t.is(backupContent, originalContent);
});

test('write() throw an error during backup if original file not exists', async (t) => {
  const { workspacePath, fileSystemFileWriter, filePath, fileContent } = t.context;

  // Ensure that directory exists
  await mkdir(resolve(workspacePath, 'services'), { recursive: true });

  const directError = await t.throwsAsync(
    async () => await fileSystemFileWriter.write(filePath, fileContent, { atomic: false, backup: true }),
  );
  t.truthy(directError);
  t.true(String(directError.message).includes('ENOENT'));
  t.true(String(directError.message).includes('copyfile'));

  const atomicError = await t.throwsAsync(
    async () => await fileSystemFileWriter.write(filePath, fileContent, { atomic: true, backup: true }),
  );
  t.truthy(atomicError);
  t.true(String(atomicError.message).includes('ENOENT'));
  t.true(String(atomicError.message).includes('copyfile'));
});

test('write() throw an error if directory not exists', async (t) => {
  const { fileSystemFileWriter, filePath, fileContent } = t.context;

  const directError = await t.throwsAsync(
    async () => await fileSystemFileWriter.write(filePath, fileContent, { atomic: false, backup: false }),
  );
  t.truthy(directError);
  t.true(String(directError.message).includes('ENOENT'));
  t.true(String(directError.message).includes('no such file or directory'));

  const atomicError = await t.throwsAsync(
    async () => await fileSystemFileWriter.write(filePath, fileContent, { atomic: true, backup: false }),
  );
  t.truthy(atomicError);
  t.true(String(atomicError.message).includes('ENOENT'));
  t.true(String(atomicError.message).includes('no such file or directory'));
});

test('write() atomic write fallback on EPERM succeeds', async (t) => {
  const { filePath, fileContent, inMemoryLogger } = t.context;

  // Ensure that original file exists
  const originalContent = 'ORIGINAL';
  await createFileAtPath(filePath, originalContent);

  // Mock rename function to throw exception
  const realFs = await import('node:fs/promises');
  let isFirstCall = true;
  const renameMock = async (...parameters: Parameters<typeof realFs.rename>) => {
    if (isFirstCall) {
      isFirstCall = false;
      const error = new Error('EPERM simulated');
      // @ts-expect-error Property code does not exist on type Error
      error.code = 'EPERM';
      throw error;
    }
    return realFs.rename(...parameters);
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment
  const { FsFileWriter: MockedFsFileWriter } = await esmock('../../../src/infrastructure/file/fs-file-writer.ts', {
    'node:fs/promises': {
      ...realFs,
      rename: renameMock,
    },
    'node:crypto': { randomBytes: () => Buffer.from('a1b2c3a1b2c3', 'hex') },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const writer = new MockedFsFileWriter(inMemoryLogger) as FsFileWriter;

  await writer.write(filePath, fileContent, { atomic: true, backup: false });

  const content = await readFile(filePath, 'utf8');
  t.is(content, fileContent);
});

test('write() atomic write fallback on EPERM throw error', async (t) => {
  const { filePath, fileContent, inMemoryLogger } = t.context;

  // Ensure that original file exists
  const originalContent = 'ORIGINAL';
  await createFileAtPath(filePath, originalContent);

  // Mock rename function to throw exception
  const realFs = await import('node:fs/promises');
  // eslint-disable-next-line @typescript-eslint/require-await
  const renameMock = async (...parameters: Parameters<typeof realFs.rename>) => {
    const error = new Error('EPERM simulated');
    // @ts-expect-error Property code does not exist on type Error
    error.code = 'EPERM';
    throw error;
  };

  // Temporary file
  const randomBytesResult = Buffer.from('cafebabecafe', 'hex'); // 6 байт
  const temporaryName = (target: string) => `.${basename(target)}.dclint-${randomBytesResult.toString('hex')}.tmp`;
  const temporaryPath = join(dirname(filePath), temporaryName(filePath));

  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment
  const { FsFileWriter: MockedFsFileWriter } = await esmock('../../../src/infrastructure/file/fs-file-writer.ts', {
    'node:fs/promises': {
      ...realFs,
      rename: renameMock,
    },
    'node:crypto': { randomBytes: () => randomBytesResult },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const writer = new MockedFsFileWriter(inMemoryLogger) as FsFileWriter;

  // Expecting error
  const error = await t.throwsAsync(() => writer.write(filePath, fileContent, { atomic: true, backup: false }));
  t.truthy(error);

  // Original file was deleted
  const originalFileReadError = await t.throwsAsync(() => readFile(filePath, 'utf8'));
  t.truthy(originalFileReadError);
  t.true(String(originalFileReadError.message).includes('ENOENT'));
  t.true(String(originalFileReadError.message).includes('no such file or directory'));

  // Temporary file was deleted
  const temporaryFileReadError = await t.throwsAsync(() => readFile(temporaryPath, 'utf8'));
  t.truthy(temporaryFileReadError);
  t.true(String(temporaryFileReadError.message).includes('ENOENT'));
  t.true(String(temporaryFileReadError.message).includes('no such file or directory'));

  // Backup was created despite { backup: false }
  const content = await readFile(`${filePath}.bak`, 'utf8');
  t.is(content, originalContent);
});

test('write() atomic write throw an error if rename fails', async (t) => {
  const { filePath, fileContent, inMemoryLogger } = t.context;

  // Ensure that original file exists
  const originalContent = 'ORIGINAL';
  await createFileAtPath(filePath, originalContent);

  // Mock rename function to throw exception
  const realFs = await import('node:fs/promises');
  // eslint-disable-next-line @typescript-eslint/require-await
  const renameMock = async (...parameters: Parameters<typeof realFs.rename>) => {
    throw new Error('Unknown Error');
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment
  const { FsFileWriter: MockedFsFileWriter } = await esmock('../../../src/infrastructure/file/fs-file-writer.ts', {
    'node:fs/promises': {
      ...realFs,
      rename: renameMock,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const writer = new MockedFsFileWriter(inMemoryLogger) as FsFileWriter;

  // Expecting error
  const error = await t.throwsAsync(() => writer.write(filePath, fileContent, { atomic: true, backup: false }));
  t.truthy(error);
  t.true(String(error.message).includes('Unknown Error'));

  // Original file exists
  const content = await readFile(filePath, 'utf8');
  t.is(content, originalContent);
});
