import test from 'ava';
import type { ExecutionContext } from 'ava';
import esmock from 'esmock';
import { normalizeYAML } from './test-utils';
import { Logger } from '../src/util/logger';
import type { Config } from '../src/config/config.types';
import type { LintResult, LintRule } from '../src/linter/linter.types';

// Sample configuration
const config: Config = {
  rules: {},
  quiet: false,
  debug: false,
  exclude: [],
};

// Sample lint rule for testing
const mockRule: LintRule = {
  name: 'mock-rule',
  type: 'error',
  category: 'style',
  severity: 'major',
  fixable: false,
  meta: {
    description: 'Mock rule description.',
    url: 'https://example.com/mock-rule',
  },
  check: (context) => [
    {
      rule: 'mock-rule',
      category: 'style',
      severity: 'major',
      message: 'Mock error detected.',
      line: 1,
      column: 1,
      type: 'error',
      fixable: false,
    },
  ],
  fix: (content: string) => content.replace('nginx', 'nginx:latest'),
  getMessage(): string {
    return 'Mock error.';
  },
};

// Define constants to avoid duplication
const mockFilePath = '/path/to/file.yaml';
const mockFilePaths = ['/path/to/file1.yaml', '/path/to/file2.yaml']; // Reusable constant
const mockFileContent = `
version: '3'
services:
  web:
    image: nginx
`;

// @ts-ignore TS2349
test('DCLinter: should lint files correctly', async (t: ExecutionContext) => {
  const mockFindFiles = (): string[] => [mockFilePath];
  const mockLoadLintRules = (): LintRule[] => [mockRule];
  const mockReadFileSync = (): string => mockFileContent;

  // Use esmock to mock both rules-loader and files-finder modules
  // eslint-disable-next-line sonarjs/no-duplicate-string
  const { DCLinter } = await esmock<typeof import('../src/linter/linter')>('../src/linter/linter', {
    '../src/util/rules-utils': { loadLintRules: mockLoadLintRules },
    '../src/util/files-finder': { findFilesForLinting: mockFindFiles },
    'node:fs': { readFileSync: mockReadFileSync },
  });

  const linter = new DCLinter(config);

  // Call lintFiles method
  const result: LintResult[] = await linter.lintFiles([mockFilePath], false);

  // Assertions
  t.is(result.length, 1, 'One file should be linted');
  t.is(result[0].filePath, mockFilePath, 'The linted file path should match the mock file path');
  t.is(result[0].messages.length, 1, 'There should be one lint message');
  t.is(result[0].messages[0].rule, 'mock-rule', 'The rule should be "mock-rule"');
  t.is(result[0].messages[0].message, 'Mock error detected.', 'The message should match the mock error');
  t.is(result[0].errorCount, 1, 'There should be one error');
  t.is(result[0].warningCount, 0, 'There should be no warnings');
});

// @ts-ignore TS2349
test('DCLinter: should disable linter for a file', async (t: ExecutionContext) => {
  const mockReadFileSync = (): string => `# dclint disable-file
    version: '3'
    services:
      web:
        build: .
        image: nginx
  `;
  const mockFindFiles = (): string[] => mockFilePaths;

  const mockWriteFileSync = (filePath: string, content: string): void => {
    // Normalize the content by trimming leading/trailing whitespace
    // and remove all excess newlines to compare correctly
    const originalContent = normalizeYAML(mockReadFileSync());
    const actualContent = normalizeYAML(content);

    t.is(actualContent, originalContent, 'The content should remain unchanged as the rule is disabled');
  };

  const { DCLinter } = await esmock<typeof import('../src/linter/linter')>('../src/linter/linter', {
    'node:fs': { readFileSync: mockReadFileSync, writeFileSync: mockWriteFileSync },
    '../src/util/files-finder': { findFilesForLinting: mockFindFiles },
  });
  const linter = new DCLinter(config);
  const result = await linter.lintFiles([mockFilePath], false);
  t.is(result[0].messages.length, 0, 'No messages should be present when rule is disabled for part of file');

  // Call fixFiles method to apply fixes
  await linter.fixFiles([mockFilePath], false, false); // Dry run is set to false
});

// @ts-ignore TS2349
test('DCLinter: should disable specific rule for part of the file', async (t: ExecutionContext) => {
  const mockReadFileSync = (): string => `--- # dclint disable require-project-name-field
    services:
      web:
        image: nginx:1.0.0
        build: . # dclint disable-line no-build-and-image
  `;
  const mockFindFiles = (): string[] => mockFilePaths;

  const { DCLinter } = await esmock<typeof import('../src/linter/linter')>('../src/linter/linter', {
    'node:fs': { readFileSync: mockReadFileSync },
    '../src/util/files-finder': { findFilesForLinting: mockFindFiles },
  });
  const linter = new DCLinter(config);
  const result = await linter.lintFiles([mockFilePath], false);
  t.is(result[0].messages.length, 0, 'No messages should be present when rule is disabled for part of file');
});

// @ts-ignore TS2349
test('DCLinter: should lint multiple files correctly', async (t: ExecutionContext) => {
  const mockFindFiles = (): string[] => mockFilePaths;
  const mockLoadLintRules = (): LintRule[] => [mockRule];
  const mockReadFileSync = (filePath: string): string => mockFileContent;

  // Use esmock to mock both rules-loader and files-finder modules
  // eslint-disable-next-line sonarjs/no-duplicate-string
  const { DCLinter } = await esmock<typeof import('../src/linter/linter')>('../src/linter/linter', {
    '../src/util/rules-utils': { loadLintRules: mockLoadLintRules },
    '../src/util/files-finder': { findFilesForLinting: mockFindFiles },
    'node:fs': { readFileSync: mockReadFileSync },
  });

  const linter = new DCLinter(config);

  // Call lintFiles method
  const result: LintResult[] = await linter.lintFiles(mockFilePaths, false);

  // Assertions
  t.is(result.length, 2, 'Two files should be linted');
  t.is(result[0].filePath, mockFilePaths[0], 'The linted file path should match the first mock file path');
  t.is(result[1].filePath, mockFilePaths[1], 'The linted file path should match the second mock file path');
  t.is(result[0].messages.length, 1, 'There should be one lint message for the first file');
  t.is(result[1].messages.length, 1, 'There should be one lint message for the second file');
});

// @ts-ignore TS2349
test('DCLinter: should fix files', async (t: ExecutionContext) => {
  const mockFindFiles = (): string[] => [mockFilePath];
  const mockLoadLintRules = (): LintRule[] => [mockRule];
  const mockReadFileSync = (): string => mockFileContent;
  const mockWriteFileSync = (): void => {};

  // Use esmock to mock both rules-loader and files-finder modules
  // eslint-disable-next-line sonarjs/no-duplicate-string
  const { DCLinter } = await esmock<typeof import('../src/linter/linter')>('../src/linter/linter', {
    '../src/util/rules-utils': { loadLintRules: mockLoadLintRules },
    '../src/util/files-finder': { findFilesForLinting: mockFindFiles },
    'node:fs': { readFileSync: mockReadFileSync, writeFileSync: mockWriteFileSync },
  });

  const linter = new DCLinter(config);

  // Mock logger to capture dry-run output
  let loggedOutput = '';
  Logger.init().info = (...messages: string[]): void => {
    loggedOutput += messages.join(' ');
  };

  // Call fixFiles method in dry-run mode
  await linter.fixFiles([mockFilePath], false, true);

  // Assertions
  t.regex(loggedOutput, /Dry run - changes for file/, 'Dry run should output changes');
  t.regex(loggedOutput, /nginx:latest/, 'Dry run output should contain "nginx:latest"');
});

// @ts-ignore TS2349
test('DCLinter: should apply fixes correctly while ignoring disabled rules', async (t: ExecutionContext) => {
  const mockReadFileSync = (): string => `
    # dclint disable mock-rule
    version: '3'
    services:
      web:
        image: nginx
  `;

  const mockFindFiles = (): string[] => mockFilePaths;
  const mockLoadLintRules = (): LintRule[] => [mockRule];

  // eslint-disable-next-line sonarjs/no-identical-functions
  const mockWriteFileSync = (filePath: string, content: string): void => {
    const originalContent = normalizeYAML(mockReadFileSync());
    const actualContent = normalizeYAML(content);
    t.is(actualContent, originalContent, 'The content should remain unchanged as the rule is disabled');
  };

  const { DCLinter } = await esmock<typeof import('../src/linter/linter')>('../src/linter/linter', {
    'node:fs': { readFileSync: mockReadFileSync, writeFileSync: mockWriteFileSync },
    '../src/util/rules-utils': { loadLintRules: mockLoadLintRules },
    '../src/util/files-finder': { findFilesForLinting: mockFindFiles },
  });

  const linter = new DCLinter(config);

  // Call fixFiles method to apply fixes
  await linter.fixFiles([mockFilePath], false, false); // Dry run is set to false

  // Check that the "nginx:latest" is added
  // The "mock-rule" rule should be ignored as it was disabled globally in the first line
});
