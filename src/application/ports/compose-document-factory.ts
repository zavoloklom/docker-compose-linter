import type { FileDiscoveryOptions } from './file-finder';
import type { ComposeDocument } from '../../domain/models/compose-document';

interface ComposeDocumentFactory {
  fromPath(path: string[], options?: Partial<FileDiscoveryOptions>): Promise<ComposeDocument[]>;
}

export { ComposeDocumentFactory };
