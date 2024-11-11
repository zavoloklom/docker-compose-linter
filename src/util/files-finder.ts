import fs from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { Logger } from './logger';
import { FileNotFoundError } from '../errors/file-not-found-error';

export function findFilesForLinting(paths: string[], recursive: boolean, excludePaths: string[]): string[] {
  const logger = Logger.getInstance();
  logger.debug('UTIL', `Looking for compose files in ${paths.toString()}`);

  let filesToCheck: string[] = [];

  // Default directories to exclude from the search
  const defaultExcludes = ['node_modules', '.git', '.idea', '.tsimp'];

  // Combine default excludes with user-specified exclude paths
  const excludeSet = new Set(defaultExcludes);
  if (excludePaths && excludePaths.length > 0) {
    excludePaths.forEach((p) => excludeSet.add(p));
  }
  const exclude = [...excludeSet];
  logger.debug('UTIL', `Paths to exclude: ${exclude.toString()}`);

  // Regular expression to match [compose*.yml, compose*.yaml, docker-compose*.yml, docker-compose*.yaml] files
  const dockerComposePattern = /^(docker-)?compose.*\.ya?ml$/;

  paths.forEach((fileOrDirectory) => {
    if (!fs.existsSync(fileOrDirectory)) {
      logger.debug('UTIL', `File or directory not found: ${fileOrDirectory}`);
      throw new FileNotFoundError(fileOrDirectory);
    }

    let allPaths: string[] = [];

    const fileOrDirectoryStats = fs.statSync(fileOrDirectory);

    if (fileOrDirectoryStats.isDirectory()) {
      try {
        allPaths = fs.readdirSync(resolve(fileOrDirectory)).map((f) => join(fileOrDirectory, f));
      } catch (error) {
        logger.debug('UTIL', `Error reading directory: ${fileOrDirectory}`, error);
        allPaths = [];
      }

      allPaths.forEach((path) => {
        // Skip files and directories listed in the exclude array
        if (exclude.some((ex) => path.includes(ex))) {
          logger.debug('UTIL', `Excluding ${path}`);
          return;
        }

        const pathStats = fs.statSync(resolve(path));

        if (pathStats.isDirectory()) {
          if (recursive) {
            // If recursive search is enabled, search within the directory
            logger.debug('UTIL', `Recursive search is enabled, search within the directory: ${path}`);
            const nestedFiles = findFilesForLinting([path], recursive, exclude);
            filesToCheck = [...filesToCheck, ...nestedFiles];
          }
        } else if (pathStats.isFile() && dockerComposePattern.test(basename(path))) {
          // Add the file to the list if it matches the pattern
          filesToCheck.push(path);
        }
      });
    } else if (fileOrDirectoryStats.isFile()) {
      filesToCheck.push(fileOrDirectory);
    }
  });

  logger.debug(
    'UTIL',
    `Found compose files in ${paths.toString()}: ${filesToCheck.length > 0 ? filesToCheck.join(', ') : 'None'}`,
  );

  return filesToCheck;
}
