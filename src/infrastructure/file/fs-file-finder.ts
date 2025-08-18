import { readdir, realpath, stat } from 'node:fs/promises';
import { basename, join, normalize, resolve, sep } from 'node:path';

import { LogSource, type Logger } from '../../application/ports/logger';

import type { FileDiscoveryOptions, FileFinder } from '../../application/ports/file-finder';

class FsFileFinder implements FileFinder {
  private readonly logger: Logger;
  private readonly defaultOptions: FileDiscoveryOptions = {
    allowedRoot: process.cwd(),
    recursive: false,
    pattern: /^(?:docker-)?compose.*\.ya?ml$/u,
    exclude: ['node_modules', '.git', '.idea', '.tsimp'],
  };

  constructor(logger: Logger) {
    this.logger = logger;
  }

  private mergeWithDefaultOptions(options: Partial<FileDiscoveryOptions>): FileDiscoveryOptions {
    return {
      allowedRoot: options.allowedRoot ?? this.defaultOptions.allowedRoot,
      recursive: options.recursive ?? this.defaultOptions.recursive,
      pattern: options.pattern ?? this.defaultOptions.pattern,
      exclude: [...new Set([...this.defaultOptions.exclude, ...(options.exclude ?? [])])],
    };
  }

  async discoverPaths(inputs: string[], options: Partial<FileDiscoveryOptions> = {}): Promise<string[]> {
    const discoveryOptions = this.mergeWithDefaultOptions(options);
    this.logger.debug(LogSource.CORE, `Looking for compose files in ${inputs.join(', ')}`);

    const accumulator = new Set<string>();

    const realRoot = await realpath(discoveryOptions.allowedRoot);

    const tasks = inputs.map((path) => {
      return this.processEntry(path, realRoot, discoveryOptions, accumulator).catch((error) => {
        this.logger.debug(
          LogSource.CORE,
          `Unexpected error resolving path: ${path}`,
          error instanceof Error ? error.message : '',
        );
      });
    });
    await Promise.all(tasks);

    const results = [...accumulator];
    this.logger.debug(
      LogSource.CORE,
      `Found compose files in ${inputs.join(', ')}: ${results.length > 0 ? results.join(', ') : 'None'}`,
    );

    return results;
  }

  private async processEntry(
    path: string,
    realRoot: string,
    discoveryOptions: FileDiscoveryOptions,
    accumulator: Set<string>,
  ): Promise<void> {
    const realPath = await this.safeResolvePath(path, realRoot);

    if (this.isPathExcluded(realPath, discoveryOptions.exclude)) return;

    const stats = await stat(realPath);
    if (stats.isDirectory()) {
      const entries = await readdir(realPath, { withFileTypes: true });

      const tasks = entries
        .filter((dirent) => dirent.isFile() || (dirent.isDirectory() && discoveryOptions.recursive))
        .map((dirent) => {
          const child = join(realPath, dirent.name);
          return this.processEntry(child, realRoot, discoveryOptions, accumulator);
        });

      await Promise.all(tasks);
      return;
    }

    if (stats.isFile() && discoveryOptions.pattern.test(basename(realPath))) {
      accumulator.add(realPath);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async safeResolvePath(path: string, realRoot: string): Promise<string> {
    // Normalize input to remove redundant segments like "../"
    const normalized = normalize(path);

    // Build candidate path: if `path` is absolute, resolve returns it as-is; otherwise it is anchored under allowedRoot
    const candidate = resolve(realRoot, normalized);

    // Resolve real paths to handle symlinks
    const realCandidate = await realpath(candidate);

    // Enforce containment: realCandidate must be the root or inside it
    if (realCandidate !== realRoot && !realCandidate.startsWith(realRoot + sep)) {
      throw new Error(`Path escapes allowed root: ${path}`);
    }

    return realCandidate;
  }

  private isPathExcluded(path: string, exclude: string[]): boolean {
    const normalizedFullWithGuards = sep + normalize(path) + sep;

    for (const rawExcluded of exclude) {
      const normalizedExcludedWithGuards = sep + normalize(rawExcluded) + sep;

      if (normalizedFullWithGuards.includes(normalizedExcludedWithGuards)) {
        this.logger.debug(LogSource.CORE, `Excluding ${path}`);
        return true;
      }
    }
    return false;
  }
}

export { FsFileFinder };
