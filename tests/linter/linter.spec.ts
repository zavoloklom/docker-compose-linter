/* eslint-disable sonarjs/no-duplicate-string, unicorn/consistent-function-scoping */
import test from 'ava';
import esmock from 'esmock';
import { YAMLError } from 'yaml';

import { ComposeValidationError } from '../../src/errors/compose-validation-error';
import { Logger } from '../../src/util/logger';
import { normalizeYAML } from '../test-utils';

import type { Config } from '../../src/config/config.types';
import type { LintResult } from '../../src/linter/linter.types';
import type { Rule } from '../../src/rules/rules.types';

// Sample configuration
const config: Config = {
  rules: {},
  quiet: false,
  debug: false,
  exclude: [],
};

// Sample lint rule for testing
const mockRule: Rule = {
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
      line: 3,
      column: 1,
      type: 'error',
      fixable: false,
      data: {},
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

test('DCLinter: should lint files correctly', async (t) => {
  const mockFindFiles = (): string[] => [mockFilePath];
  const mockLoadLintRules = (): Rule[] => [mockRule];
  const mockReadFileSync = (): string => mockFileContent;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    '../../src/util/rules-utils': { loadLintRules: mockLoadLintRules },
    '../../src/util/files-finder': { findFilesForLinting: mockFindFiles },
    'node:fs': { readFileSync: mockReadFileSync },
  });

  const linter = new DCLinter(config);

  const result: LintResult[] = linter.lintFiles([mockFilePath], false);

  t.is(result.length, 1, 'One file should be linted');
  t.is(result[0].filePath, mockFilePath, 'The linted file path should match the mock file path');
  t.is(result[0].messages.length, 1, 'There should be one lint message');
  t.is(result[0].messages[0].rule, 'mock-rule', 'The rule should be "mock-rule"');
  t.is(result[0].messages[0].message, 'Mock error detected.', 'The message should match the mock error');
  t.is(result[0].errorCount, 1, 'There should be one error');
  t.is(result[0].warningCount, 0, 'There should be no warnings');
});

test('DCLinter: should disable linter for a file', async (t) => {
  const mockReadFileSync = (): string => `# dclint disable-file
    version: '3'
    services:
      web:
        build: .
        image: nginx
  `;
  const mockFindFiles = (): string[] => mockFilePaths;

  const mockWriteFileSync = (filePath: string, content: string): void => {
    // Normalize the content by trimming leading/trailing whitespace and remove all excess newlines to compare correctly
    const originalContent = normalizeYAML(mockReadFileSync());
    const actualContent = normalizeYAML(content);

    t.is(actualContent, originalContent, 'The content should remain unchanged as the rule is disabled');
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    'node:fs': { readFileSync: mockReadFileSync, writeFileSync: mockWriteFileSync },
    '../../src/util/files-finder': { findFilesForLinting: mockFindFiles },
  });
  const linter = new DCLinter(config);
  const result = linter.lintFiles([mockFilePath], false);
  t.is(result[0].messages.length, 0, 'No messages should be present when rule is disabled for part of file');

  // Call fixFiles method to apply fixes
  linter.fixFiles([mockFilePath], false, false); // Dry run is set to false
});

test('DCLinter: should disable specific rule for part of the file', async (t) => {
  const mockReadFileSync = (): string => `--- # dclint disable require-project-name-field
    services:
      web:
        image: nginx:1.0.0
        build: . # dclint disable-line no-build-and-image
  `;
  const mockFindFiles = (): string[] => mockFilePaths;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    'node:fs': { readFileSync: mockReadFileSync },
    '../../src/util/files-finder': { findFilesForLinting: mockFindFiles },
  });
  const linter = new DCLinter(config);
  const result = linter.lintFiles([mockFilePath], false);
  t.is(result[0].messages.length, 0, 'No messages should be present when rule is disabled for part of file');
});

test('DCLinter: should lint multiple files correctly', async (t) => {
  const mockFindFiles = (): string[] => mockFilePaths;
  const mockLoadLintRules = (): Rule[] => [mockRule];
  const mockReadFileSync = (filePath: string): string => mockFileContent;

  // Use esmock to mock both rules-loader and files-finder modules
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    '../../src/util/rules-utils': { loadLintRules: mockLoadLintRules },
    '../../src/util/files-finder': { findFilesForLinting: mockFindFiles },
    'node:fs': { readFileSync: mockReadFileSync },
  });

  const linter = new DCLinter(config);

  // Call lintFiles method
  const result: LintResult[] = linter.lintFiles(mockFilePaths, false);

  // Assertions
  t.is(result.length, 2, 'Two files should be linted');
  t.is(result[0].filePath, mockFilePaths[0], 'The linted file path should match the first mock file path');
  t.is(result[1].filePath, mockFilePaths[1], 'The linted file path should match the second mock file path');
  t.is(result[0].messages.length, 1, 'There should be one lint message for the first file');
  t.is(result[1].messages.length, 1, 'There should be one lint message for the second file');
});

test('DCLinter: should fix files', async (t) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    '../../src/util/rules-utils': { loadLintRules: (): Rule[] => [mockRule] },
    '../../src/util/files-finder': { findFilesForLinting: (): string[] => [mockFilePath] },
    'node:fs': {
      readFileSync: (): string => mockFileContent,
      writeFileSync: (): void => {},
    },
  });

  const linter = new DCLinter(config);

  // Mock logger to capture dry-run output
  let loggedOutput = '';
  Logger.init().info = (...messages: string[]): void => {
    loggedOutput += messages.join(' ');
  };

  // Call fixFiles method in dry-run mode
  linter.fixFiles([mockFilePath], false, true);

  // Assertions
  t.regex(loggedOutput, /Dry run - changes for file/u, 'Dry run should output changes');
  t.regex(loggedOutput, /nginx:latest/u, 'Dry run output should contain "nginx:latest"');
});

test('DCLinter: should apply fixes correctly while ignoring disabled rules', async (t) => {
  const mockReadFileSync = (): string => `
    # dclint disable mock-rule
    version: '3'
    services:
      web:
        image: nginx
  `;

  const mockFindFiles = (): string[] => mockFilePaths;
  const mockLoadLintRules = (): Rule[] => [mockRule];

  // eslint-disable-next-line sonarjs/no-identical-functions
  const mockWriteFileSync = (filePath: string, content: string): void => {
    const originalContent = normalizeYAML(mockReadFileSync());
    const actualContent = normalizeYAML(content);
    t.is(actualContent, originalContent, 'The content should remain unchanged as the rule is disabled');
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    'node:fs': { readFileSync: mockReadFileSync, writeFileSync: mockWriteFileSync },
    '../../src/util/rules-utils': { loadLintRules: mockLoadLintRules },
    '../../src/util/files-finder': { findFilesForLinting: mockFindFiles },
  });

  const linter = new DCLinter(config);

  // Call fixFiles method to apply fixes
  linter.fixFiles([mockFilePath], false, false); // Dry run is set to false

  // Check that the "nginx:latest" is added
  // The "mock-rule" rule should be ignored as it was disabled globally in the first line
});

test('DCLinter: adds error message for invalid YAML (YAMLError)', async (t) => {
  const mockReadFileSync = () => 'invalid: [unclosed';

  const ERROR_POSITION = { line: 3, col: 5 };
  const mockParseDocument = () => {
    const error = new YAMLError(
      'YAMLParseError',
      [ERROR_POSITION.line, ERROR_POSITION.col],
      'BAD_DIRECTIVE',
      'Mock YAML error',
    );
    error.linePos = [ERROR_POSITION];
    return { errors: [error] };
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    'node:fs': { readFileSync: mockReadFileSync },
    yaml: { parseDocument: mockParseDocument },
    '../../src/util/files-finder': { findFilesForLinting: () => [mockFilePath] },
  });

  const linter = new DCLinter(config);
  const result = linter.lintFiles([mockFilePath], false);
  // eslint-disable-next-line prefer-destructuring
  const message = result[0].messages[0];

  t.is(message.rule, 'invalid-yaml');
  t.is(message.line, ERROR_POSITION.line);
  t.is(message.column, ERROR_POSITION.col);
  t.is(message.message, 'Invalid YAML format.');
});

test('DCLinter: adds error message for ComposeValidationError', async (t) => {
  const mockReadFileSync = () => 'version: "3"';
  const mockParseDocument = () => ({ errors: [], toJS: () => ({}) });
  const mockValidateSchema = () => {
    throw new ComposeValidationError({
      instancePath: '/',
      message: 'Mock schema error',
      schemaPath: '#/',
      keyword: 'custom',
      params: {},
    });
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    'node:fs': { readFileSync: mockReadFileSync },
    yaml: { parseDocument: mockParseDocument },
    '../../src/util/compose-validation': { validationComposeSchema: mockValidateSchema },
    '../../src/util/files-finder': { findFilesForLinting: () => [mockFilePath] },
  });

  const linter = new DCLinter(config);
  const result = linter.lintFiles([mockFilePath], false);
  // eslint-disable-next-line prefer-destructuring
  const message = result[0].messages[0];

  t.is(message.rule, 'invalid-schema');
  t.true(message.message.includes('Mock schema error'));
});

test('DCLinter: adds error message for unknown error', async (t) => {
  const mockReadFileSync = () => 'version: "3"';
  const mockParseDocument = () => {
    throw new Error('Unexpected crash');
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    'node:fs': { readFileSync: mockReadFileSync },
    yaml: { parseDocument: mockParseDocument },
    '../../src/util/files-finder': { findFilesForLinting: () => [mockFilePath] },
  });

  const linter = new DCLinter(config);
  const result = linter.lintFiles([mockFilePath], false);
  // eslint-disable-next-line prefer-destructuring
  const message = result[0].messages[0];

  t.is(message.rule, 'unknown-error');
  t.true(message.message.includes('Unexpected crash'));
});

test('DCLinter: calls formatter and returns formatted result', async (t) => {
  const mockFormatter = (results: LintResult[]) => `Formatted ${results.length} result(s)`;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    '../../src/util/formatter-loader': { loadFormatter: () => mockFormatter },
  });

  const linter = new DCLinter(config);
  const formatted = await linter.formatResults(
    [
      {
        filePath: 'foo.yaml',
        messages: [],
        errorCount: 0,
        warningCount: 0,
      },
    ],
    'mock',
  );

  t.is(formatted, 'Formatted 1 result(s)');
});

test('DCLinter: should filter out rule message if line has disable-line *', async (t) => {
  const sourceWithDisableLine = `services:
  web:
    image: nginx # dclint disable-line *
  `;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DCLinter } = await esmock<typeof import('../../src/linter/linter')>('../../src/linter/linter', {
    '../../src/util/rules-utils': { loadLintRules: () => [mockRule] },
    '../../src/util/files-finder': { findFilesForLinting: () => ['mock.yaml'] },
    'node:fs': { readFileSync: () => sourceWithDisableLine },
  });

  const linter = new DCLinter(config);
  const results = linter.lintFiles(['mock.yaml'], false);

  t.is(results[0].messages.length, 0, 'Message should be filtered out by disable-line *');
});
