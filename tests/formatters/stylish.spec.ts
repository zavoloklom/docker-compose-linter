import test from 'ava';
import { resolve } from 'node:path';

import stylishFormatter from '../../src/formatters/stylish';

import type { LintResult } from '../../src/linter/linter.types';

// @ts-ignore TS2349
test('stylishFormatter: single file explicit output', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'lib/foo.js',
      messages: [
        {
          rule: 'rule1',
          message: 'first error',
          severity: 'major',
          line: 1,
          column: 1,
          type: 'error',
          category: 'security',
          fixable: true,
          data: {},
        },
        {
          rule: 'rule2',
          message: 'second warning',
          severity: 'minor',
          line: 2,
          column: 2,
          type: 'warning',
          category: 'style',
          fixable: true,
          data: {},
        },
      ],
      errorCount: 1,
      warningCount: 1,
    },
  ];

  const actual = stylishFormatter(input);
  const filePath = resolve('lib/foo.js');

  const expected = `
${filePath}
   1:1     error  first error  rule1
   2:2     warning  second warning  rule2

✖ 2 problems (1 errors, 1 warnings)
1 errors and 1 warnings potentially fixable with the \`--fix\` option.
`;

  t.is(actual, expected);
});

// @ts-ignore TS2349
test('stylishFormatter: multiple files explicit output', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'lib/a.js',
      messages: [
        {
          rule: 'r1',
          message: 'error A',
          severity: 'major',
          line: 1,
          column: 1,
          type: 'error',
          category: 'security',
          fixable: true,
          data: {},
        },
      ],
      errorCount: 1,
      warningCount: 0,
    },
    {
      filePath: 'lib/b.js',
      messages: [
        {
          rule: 'r2',
          message: 'warn B1',
          severity: 'minor',
          line: 21,
          column: 21,
          type: 'warning',
          category: 'style',
          fixable: true,
          data: {},
        },
        {
          rule: 'r3',
          message: 'warn B2',
          severity: 'minor',
          line: 333,
          column: 1,
          type: 'warning',
          category: 'style',
          fixable: true,
          data: {},
        },
      ],
      errorCount: 0,
      warningCount: 2,
    },
  ];

  const actual = stylishFormatter(input);
  const pathA = resolve('lib/a.js');
  const pathB = resolve('lib/b.js');

  const expected = `
${pathA}
   1:1     error  error A  r1

${pathB}
  21:21    warning  warn B1  r2
 333:1     warning  warn B2  r3

✖ 3 problems (1 errors, 2 warnings)
1 errors and 2 warnings potentially fixable with the \`--fix\` option.
`;

  t.is(actual, expected);
});
