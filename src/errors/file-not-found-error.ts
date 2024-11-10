class FileNotFoundError extends Error {
  constructor(filePath?: string) {
    super();
    this.message = `File or directory not found: ${filePath}`;
    this.name = 'FileNotFoundError';
  }
}

export { FileNotFoundError };
