import { randomBytes } from 'node:crypto';
import { copyFile, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

import { LogSource, type Logger } from '../../application/ports/logger';

import type { FileWriteOptions, FileWriter } from '../../application/ports/file-writer';

export class FsFileWriter implements FileWriter {
  private readonly logger: Logger;
  private readonly defaultOptions: FileWriteOptions = {
    atomic: true,
    backup: false,
  };

  constructor(logger: Logger) {
    this.logger = logger;
  }

  private mergeWithDefaultOptions(options: Partial<FileWriteOptions>): FileWriteOptions {
    return {
      atomic: options.atomic ?? this.defaultOptions.atomic,
      backup: options.backup ?? this.defaultOptions.backup,
    };
  }

  async write(targetPath: string, content: string, options: Partial<FileWriteOptions> = {}): Promise<void> {
    this.logger.debug(LogSource.CORE, `Start writing file: ${targetPath}`);
    const writeOptions = this.mergeWithDefaultOptions(options);

    await (writeOptions.atomic
      ? this.atomicWrite(targetPath, content, writeOptions.backup)
      : this.directWrite(targetPath, content, writeOptions.backup));
    this.logger.debug(LogSource.CORE, `Successfully write file: ${targetPath}`);
  }

  private async directWrite(targetPath: string, content: string, shouldCreateBackup: FileWriteOptions['backup']) {
    if (shouldCreateBackup) await this.createBackup(targetPath);

    await writeFile(targetPath, content, { encoding: 'utf8' });
  }

  private async atomicWrite(targetPath: string, content: string, shouldCreateBackup: FileWriteOptions['backup']) {
    if (shouldCreateBackup) await this.createBackup(targetPath);

    const directory = dirname(targetPath);
    const base = basename(targetPath);
    const BYTES_SIZE = 6;
    const temporaryPath = join(directory, `.${base}.dclint-${randomBytes(BYTES_SIZE).toString('hex')}.tmp`);

    // Write content to temporary file
    await writeFile(temporaryPath, content, { encoding: 'utf8' });

    // Rename temp to target
    try {
      await rename(temporaryPath, targetPath);
    } catch (error) {
      // Windows could exit with codes EPERM or EEXIST if target is existing
      // In this case we should create backup, delete original file and retry
      // @see https://github.com/nodejs/node/issues/29481
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error?.code === 'EPERM' || error?.code === 'EEXIST')
      ) {
        this.logger.debug(
          LogSource.CORE,
          `Fallback for atomic write started: ${targetPath}. Error Code: ${error.code}`,
        );
        await this.createBackup(targetPath);
        await rm(targetPath, { force: true });
        await rename(temporaryPath, targetPath);
        this.logger.debug(LogSource.CORE, `Fallback for atomic write completed: ${targetPath}`);
      } else {
        this.logger.debug(LogSource.CORE, `Fallback for atomic write error`);
        throw error;
      }
    } finally {
      await rm(temporaryPath, { force: true });
    }
  }

  private async createBackup(targetPath: string) {
    const backupPath = `${targetPath}.bak`;
    await copyFile(targetPath, backupPath);
    this.logger.debug(LogSource.CORE, `Backup created: ${targetPath}`);
  }
}
