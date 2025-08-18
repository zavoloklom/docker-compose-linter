import { YamlComposeDocument } from './yaml-compose-document';

import type { ComposeDocumentFactory } from '../../application/ports/compose-document-factory';
import type { FileDiscoveryOptions, FileFinder } from '../../application/ports/file-finder';
import type { FileReader } from '../../application/ports/file-reader';
import type { Logger } from '../../application/ports/logger';

class YamlComposeDocumentFactory implements ComposeDocumentFactory {
  private readonly fileFinder: FileFinder;
  private readonly fileReader: FileReader;
  private readonly logger: Logger;

  constructor(fileFinder: FileFinder, fileReader: FileReader, logger: Logger) {
    this.fileFinder = fileFinder;
    this.fileReader = fileReader;
    this.logger = logger;
  }

  async fromPath(path: string[], options?: Partial<FileDiscoveryOptions>): Promise<YamlComposeDocument[]> {
    const files = await this.fileFinder.discoverPaths(path, options);

    const documents: YamlComposeDocument[] = [];

    const tasks = files.map(async (file) => {
      try {
        const text = await this.fileReader.read(file);
        documents.push(new YamlComposeDocument(file, text));
      } catch (error) {
        this.logger.error(`Skip file ${file} with error:`, error instanceof Error ? error.message : '');
      }
    });

    await Promise.all(tasks);

    return documents;
  }
}

export { YamlComposeDocumentFactory };
