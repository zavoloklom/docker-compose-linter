import { readFile, stat } from 'node:fs/promises';
import { isAbsolute, normalize, resolve } from 'node:path';

import { LogSource, type Logger } from '../../application/ports/logger';

import type { FileReadOptions, FileReader } from '../../application/ports/file-reader';

class FsFileReader implements FileReader {
  private readonly logger: Logger;
  private readonly defaultOptions: FileReadOptions = {
    encoding: 'utf8',
  };

  constructor(logger: Logger) {
    this.logger = logger;
  }

  private mergeWithDefaultOptions(options: Partial<FileReadOptions>): FileReadOptions {
    return {
      encoding: options.encoding ?? this.defaultOptions.encoding,
    };
  }

  async read(path: string, options: Partial<FileReadOptions> = {}): Promise<string> {
    this.logger.debug(LogSource.CORE, `Reading file from: ${path}`);
    const readOptions = this.mergeWithDefaultOptions(options);
    const fullPath = isAbsolute(path) ? path : resolve(normalize(path));

    const pathStat = await stat(fullPath);

    if (!pathStat.isFile()) {
      throw new Error(`EISDIR: Not a regular file: ${fullPath}`);
    }

    const content = await readFile(fullPath, { encoding: readOptions.encoding });

    this.logger.debug(LogSource.CORE, `Successfully read file: ${path}`);

    return content;
  }
}

export { FsFileReader };
