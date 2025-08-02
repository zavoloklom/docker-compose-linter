// eslint-disable-next-line max-classes-per-file
import fs from 'node:fs';
import { basename, join } from 'node:path';

import { safeResolveFile } from './files-handler';
import { LogSource, Logger } from './logger';
import { FileNotFoundError } from '../errors/file-not-found-error';

interface FinderOptions {
  recursive?: boolean;
  excludePaths?: string[];
  allowedRoot?: string;
  logger?: Logger;
}

class PathValidationError extends Error {}

/**
 * Finds compose-like files under given paths with safe resolution and exclusion.
 */
class FileFinder {
  private readonly recursive: boolean;
  private readonly exclude: string[];
  private readonly allowedRoot: string;
  private readonly logger: Logger;
  private readonly dockerComposePattern = /^(?:docker-)?compose.*\.ya?ml$/u;
  private visited = new Set<string>();

  constructor(options: FinderOptions = {}) {
    this.recursive = options.recursive ?? false;
    this.exclude = [...new Set(['node_modules', '.git', '.idea', '.tsimp', ...(options.excludePaths ?? [])])];
    this.allowedRoot = options.allowedRoot ?? process.cwd();
    this.logger = options.logger ?? Logger.init();
  }

  public find(paths: string[]): string[] {
    this.logger.debug(LogSource.UTIL, `Looking for compose files in ${paths.toString()}`);
    this.visited.clear();
    const results: string[] = [];

    for (const path of paths) {
      this.processEntry(path, true, results);
    }

    this.logger.debug(
      LogSource.UTIL,
      `Found compose files in ${paths.toString()}: ${results.length > 0 ? results.join(', ') : 'None'}`,
    );
    return results;
  }

  private processEntry(raw: string, isTopLevel: boolean, accumulator: string[]): void {
    if (isTopLevel && !fs.existsSync(raw)) {
      this.logger.debug(LogSource.UTIL, `File or directory not found: ${raw}`);
      throw new FileNotFoundError(raw);
    }

    let realPath: string;
    try {
      realPath = safeResolveFile(raw, this.allowedRoot);
    } catch (error) {
      if (error instanceof PathValidationError) {
        this.logger.debug(
          LogSource.UTIL,
          `Skipping path due to validation/resolution failure: ${raw} (${error.message})`,
        );
        return;
      }
      this.logger.debug(LogSource.UTIL, `Unexpected error resolving path: ${raw}`, error);
      return;
    }

    if (this.visited.has(realPath)) return;
    this.visited.add(realPath);

    if (this.exclude.some((ex) => realPath.includes(ex))) {
      this.logger.debug(LogSource.UTIL, `Excluding ${realPath}`);
      return;
    }

    let stats: fs.Stats;
    try {
      stats = fs.statSync(realPath);
    } catch (error) {
      this.logger.debug(LogSource.UTIL, `Cannot stat path: ${realPath}`, error);
      return;
    }

    if (stats.isDirectory()) {
      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(realPath, { withFileTypes: true });
      } catch (error) {
        this.logger.debug(LogSource.UTIL, `Error reading directory: ${realPath}`, error);
        return;
      }

      for (const dirent of entries) {
        const childRaw = join(realPath, dirent.name);
        if (dirent.isDirectory()) {
          if (this.recursive) {
            this.logger.debug(LogSource.UTIL, `Recursive search into directory: ${childRaw}`);
            this.processEntry(childRaw, false, accumulator);
          }
        } else if (dirent.isFile() && this.dockerComposePattern.test(basename(dirent.name))) {
          try {
            const resolvedFile = safeResolveFile(childRaw, this.allowedRoot);
            if (this.exclude.some((ex) => resolvedFile.includes(ex))) {
              this.logger.debug(LogSource.UTIL, `Excluding matched file ${resolvedFile}`);
              continue;
            }
            accumulator.push(resolvedFile);
          } catch (error) {
            this.logger.debug(LogSource.UTIL, `Skipping candidate file due to resolution error: ${childRaw}`, error);
          }
        }
      }
    } else if (stats.isFile()) {
      accumulator.push(realPath);
    }
  }
}

export { FileFinder };
