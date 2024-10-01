/* eslint-disable sonarjs/no-duplicate-string, @stylistic/indent */

import test from 'ava';
import esmock from 'esmock';
import { Logger } from '../../src/util/logger.js';
import { FileNotFoundError } from '../../src/errors/file-not-found-error.js';

const mockDirectory = '/path/to/directory';
const mockNodeModulesDirectory = '/path/to/directory/node_modules';
const mockFolderDirectory = '/path/to/directory/another_dir';
const mockDockerComposeFile = '/path/to/directory/docker-compose.yml';
const mockComposeFile = '/path/to/directory/compose.yaml';
const mockAnotherFile = '/path/to/directory/another-file.yaml';
const mockSubDirectoryFile = '/path/to/directory/another_dir/docker-compose.yml';
const mockNonExistentPath = '/path/nonexistent';

// Mock files and directories for testing
const mockFilesInDirectory = ['docker-compose.yml', 'compose.yaml', 'another-file.yaml', 'example.txt'];
const mockDirectoriesInDirectory = ['another_dir', 'node_modules'];
const mockFilesInSubDirectory = ['docker-compose.yml', 'another-file.yaml', 'example.txt'];

test.beforeEach(() => {
    Logger.init(false); // Initialize logger
});

const mockReaddirSync = (dir: string): string[] => {
    if (dir === mockDirectory) {
        return [...mockFilesInDirectory, ...mockDirectoriesInDirectory];
    }
    if (dir === mockNodeModulesDirectory || dir === mockFolderDirectory) {
        return mockFilesInSubDirectory;
    }
    return [];
};

const mockStatSync = (filePath: string) => {
    const isDirectory =
        filePath === mockDirectory || filePath === mockNodeModulesDirectory || filePath === mockFolderDirectory;
    return {
        isDirectory: () => isDirectory,
        isFile: () => !isDirectory,
    };
};
const mockExistsSync = () => true;

test('findFilesForLinting: should handle recursive search and find only compose files in directory and exclude node_modules', async (t) => {
    // Use esmock to mock fs module
    const { findFilesForLinting } = await esmock<typeof import('../../src/util/files-finder.js')>(
        '../../src/util/files-finder.js',
        {
            'node:fs': { existsSync: mockExistsSync, readdirSync: mockReaddirSync, statSync: mockStatSync },
        },
    );

    const result = findFilesForLinting([mockDirectory], false, []);

    t.deepEqual(result, [mockDockerComposeFile, mockComposeFile], 'Should return only compose files on higher level');

    const resultRecursive = findFilesForLinting([mockDirectory], true, []);

    t.deepEqual(
        resultRecursive,
        [mockDockerComposeFile, mockComposeFile, mockSubDirectoryFile],
        'Should should handle recursive search and return only compose files and exclude files in node_modules subdirectory',
    );
});

test('findFilesForLinting: should return file directly if file is passed and search only compose in directory', async (t) => {
    // Use esmock to mock fs module
    const { findFilesForLinting } = await esmock<typeof import('../../src/util/files-finder.js')>(
        '../../src/util/files-finder.js',
        {
            'node:fs': { existsSync: mockExistsSync, statSync: mockStatSync, readdirSync: mockReaddirSync },
        },
    );

    const result = findFilesForLinting([mockAnotherFile], false, []);

    t.deepEqual(result, [mockAnotherFile], 'Should return the another file directly when passed');

    const resultWithDirectory = findFilesForLinting([mockAnotherFile, mockFolderDirectory], false, []);

    t.deepEqual(
        resultWithDirectory,
        [mockAnotherFile, mockSubDirectoryFile],
        'Should return the another file directly when passed',
    );
});

test('findFilesForLinting: should throw error if path does not exist', async (t) => {
    // Use esmock to mock fs module
    const { findFilesForLinting } = await esmock<typeof import('../../src/util/files-finder.js')>(
        '../../src/util/files-finder.js',
        {
            'node:fs': { existsSync: () => false },
        },
    );

    const error = t.throws(() => findFilesForLinting([mockNonExistentPath], false, []), {
        instanceOf: FileNotFoundError,
    });

    t.is(
        error.message,
        `File or directory not found: ${mockNonExistentPath}`,
        'Should throw FileNotFoundError if path does not exist',
    );
});
