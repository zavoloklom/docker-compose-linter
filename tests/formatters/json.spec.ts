import test from 'ava';

import { jsonFormatter } from '../../src/formatters/json';

import type { LintResult } from '../../src/linter/linter.types';

// @ts-ignore TS2349
test('JSON Formatter: single LintResult', (t) => {
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

  const expected = `[
  {
    "filePath": "lib/foo.js",
    "messages": [
      {
        "rule": "no-unused-vars",
        "message": "x is defined but never used",
        "severity": "minor",
        "line": 12,
        "column": 4,
        "endLine": 12,
        "endColumn": 5,
        "type": "warning",
        "category": "style",
        "fixable": false,
        "data": {}
      }
    ],
    "errorCount": 0,
    "warningCount": 1
  }
]`;

  const actual = jsonFormatter(input);
  t.is(actual, expected);
});

// @ts-ignore TS2349
test('JSON Formatter: multiple LintResults', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'src/a.js',
      messages: [
        {
          rule: 'r1',
          message: 'm1',
          severity: 'major',
          line: 1,
          column: 1,
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
        },
      ],
      errorCount: 0,
      warningCount: 0,
    },
    {
      filePath: 'src/b.js',
      messages: [
        {
          rule: 'r2',
          message: 'm2',
          severity: 'minor',
          line: 5,
          column: 6,
          endLine: 5,
          endColumn: 6,
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
        },
        {
          rule: 'r3',
          message: 'm3',
          severity: 'critical',
          line: 7,
          column: 8,
          type: 'error',
          category: 'security',
          fixable: true,
          data: { info: 'extra' },
        },
      ],
      errorCount: 1,
      warningCount: 1,
    },
  ];

  const expected = `[
  {
    "filePath": "src/a.js",
    "messages": [
      {
        "rule": "r1",
        "message": "m1",
        "severity": "major",
        "line": 1,
        "column": 1,
        "type": "warning",
        "category": "style",
        "fixable": false,
        "data": {}
      }
    ],
    "errorCount": 0,
    "warningCount": 0
  },
  {
    "filePath": "src/b.js",
    "messages": [
      {
        "rule": "r2",
        "message": "m2",
        "severity": "minor",
        "line": 5,
        "column": 6,
        "endLine": 5,
        "endColumn": 6,
        "type": "warning",
        "category": "style",
        "fixable": false,
        "data": {}
      },
      {
        "rule": "r3",
        "message": "m3",
        "severity": "critical",
        "line": 7,
        "column": 8,
        "type": "error",
        "category": "security",
        "fixable": true,
        "data": {
          "info": "extra"
        }
      }
    ],
    "errorCount": 1,
    "warningCount": 1
  }
]`;

  const actual = jsonFormatter(input);
  t.is(actual, expected);
});
