import fs from 'node:fs';
import path from 'node:path';
import { Logger } from './logger.js';
import { FileNotFoundError } from '../errors/file-not-found-error.js';

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
    const exclude = Array.from(excludeSet);
    logger.debug('UTIL', `Paths to exclude: ${exclude.toString()}`);

    // Regular expression to match [compose*.yml, compose*.yaml, docker-compose*.yml, docker-compose*.yaml] files
    const dockerComposePattern = /^(docker-)?compose.*\.ya?ml$/;

    paths.forEach((fileOrDir) => {
        if (!fs.existsSync(fileOrDir)) {
            logger.debug('UTIL', `File or directory not found: ${fileOrDir}`);
            throw new FileNotFoundError(fileOrDir);
        }

        let allFiles: string[] = [];

        const stat = fs.statSync(fileOrDir);
        if (stat.isDirectory()) {
            allFiles = fs.readdirSync(fileOrDir).map((f) => path.join(fileOrDir, f));
        } else if (stat.isFile()) {
            allFiles.push(fileOrDir);
        }

        allFiles.forEach((file) => {
            const fileStat = fs.statSync(file);

            // Skip files and directories listed in the exclude array
            if (exclude.some((ex) => file.includes(ex))) {
                logger.debug('UTIL', `Excluding ${file}`);
                return;
            }

            if (fileStat.isDirectory()) {
                if (recursive) {
                    // If recursive search is enabled, search within the directory
                    logger.debug('UTIL', `Recursive search is enabled, search within the directory: ${file}`);
                    const nestedFiles = findFilesForLinting([file], recursive, exclude);
                    filesToCheck = filesToCheck.concat(nestedFiles);
                }
            } else if (fileStat.isFile() && dockerComposePattern.test(path.basename(file))) {
                // Add the file to the list if it matches the pattern
                filesToCheck.push(file);
            }
        });
    });

    logger.debug(
        'UTIL',
        `Found compose files in ${paths.toString()}: ${filesToCheck.length > 0 ? filesToCheck.join(', ') : 'None'}`,
    );

    return filesToCheck;
}
