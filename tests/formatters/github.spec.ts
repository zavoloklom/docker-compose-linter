import test from 'ava';

import { githubFormatter } from '../../src/formatters/github';

import type { LintResult } from '../../src/linter/linter.types';

// @ts-ignore TS2349
test('Github Formatter: single LintResult with one message', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'lib/foo.js',
      messages: [
        {
          rule: 'no-unused-vars',
          message: 'x is defined but never used',
          severity: 'minor',
          line: 12,
          column: 4,
          endLine: 12,
          endColumn: 5,
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
        },
      ],
      errorCount: 0,
      warningCount: 1,
    },
  ];

  const expected = '::warning file=lib/foo.js,line=12,col=4::no-unused-vars: x is defined but never used';

  const actual = githubFormatter(input);
  t.is(actual, expected);
});

// @ts-ignore TS2349
test('Github Formatter: multiple LintResults and messages', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'src/a.js',
      messages: [
        {
          rule: 'r1',
          message: 'first issue',
          severity: 'major',
          line: 1,
          column: 2,
          type: 'error',
          category: 'security',
          fixable: false,
          data: {},
        },
        {
          rule: 'r2',
          message: 'second issue',
          severity: 'minor',
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
          line: 1,
          column: 1,
        },
      ],
      errorCount: 1,
      warningCount: 1,
    },
    {
      filePath: 'src/b.js',
      messages: [
        {
          rule: 'r3',
          message: 'another one',
          severity: 'critical',
          line: 5,
          column: 6,
          type: 'error',
          category: 'security',
          fixable: true,
          data: {},
        },
      ],
      errorCount: 1,
      warningCount: 0,
    },
  ];

  const expectedLines = [
    '::error file=src/a.js,line=1,col=2::r1: first issue',
    '::warning file=src/a.js,line=1,col=1::r2: second issue',
    '::error file=src/b.js,line=5,col=6::r3: another one',
  ];

  const actual = githubFormatter(input);
  t.deepEqual(actual.split('\n'), expectedLines);
});
