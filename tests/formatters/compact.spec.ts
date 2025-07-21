import test from 'ava';

import { compactFormatter } from '../../src/formatters/compact';

import type { LintResult } from '../../src/linter/linter.types';

// @ts-ignore TS2349
test('Compact Formatter: single LintResult with one message', (t) => {
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

  const expected = 'lib/foo.js:12:4 x is defined but never used [no-unused-vars]';

  const actual = compactFormatter(input);
  t.is(actual, expected);
});

// @ts-ignore TS2349
test('Compact Formatter: multiple LintResults and messages', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'src/a.js',
      messages: [
        {
          rule: 'r1',
          message: 'first message',
          severity: 'major',
          line: 1,
          column: 2,
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
        },
        {
          rule: 'r2',
          message: 'second message',
          severity: 'minor',
          line: 3,
          column: 4,
          endLine: 4,
          endColumn: 5,
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
        },
      ],
      errorCount: 0,
      warningCount: 2,
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

  const expected = [
    'src/a.js:1:2 first message [r1]',
    'src/a.js:3:4 second message [r2]',
    '',
    'src/b.js:5:6 another one [r3]',
  ].join('\n');

  const actual = compactFormatter(input);
  t.is(actual, expected);
});
