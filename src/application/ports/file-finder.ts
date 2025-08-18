interface FileDiscoveryOptions {
  allowedRoot: string;
  recursive: boolean;
  exclude: string[];
  pattern: RegExp;
}

interface FileFinder {
  /**
   * Discover candidate compose files from input roots/patterns.
   * @param inputs  Roots or glob patterns to search from.
   * @param options Search strategy and filters.
   * @returns Absolute (or project-relative) file paths.
   */
  discoverPaths(inputs: string[], options?: Partial<FileDiscoveryOptions>): Promise<string[]>;
}

export { FileFinder, FileDiscoveryOptions };
