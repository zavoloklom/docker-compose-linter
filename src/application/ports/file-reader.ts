interface FileReadOptions {
  encoding: BufferEncoding;
}

interface FileReader {
  read(path: string, options?: Partial<FileReadOptions>): Promise<string>;
}

export { FileReader, FileReadOptions };
