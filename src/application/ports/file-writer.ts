interface FileWriteOptions {
  atomic: boolean;
  backup: boolean;
}

interface FileWriter {
  write(path: string, content: string, options?: Partial<FileWriteOptions>): Promise<void>;
}

export { FileWriter, FileWriteOptions };
