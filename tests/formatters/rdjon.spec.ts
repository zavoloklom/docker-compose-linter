import test from 'ava';

import { rdjsonFormatter } from '../../src/formatters/rdjson';

import type { LintResult } from '../../src/linter/linter.types';

test('RDJson Formatter: basic diagnostic without end position or fix', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'lib/foo.js',
      messages: [
        {
          rule: 'no-unused-vars',
          message: 'x is defined but never used',
          severity: 'minor',
          line: 1,
          column: 2,
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

  const expected = {
    source: {
      name: 'dclint',
      url: 'https://github.com/zavoloklom/dclint',
    },
    diagnostics: [
      {
        message: 'x is defined but never used',
        location: {
          path: 'lib/foo.js',
          range: {
            start: { line: 1, column: 2 },
          },
        },
        severity: 'WARNING',
        code: { value: 'no-unused-vars' },
        // eslint-disable-next-line camelcase
        original_output: JSON.stringify(input[0].messages[0]),
      },
    ],
  };

  const actual = JSON.parse(rdjsonFormatter(input)) as [];
  t.deepEqual(actual, expected);
});

test('RDJson Formatter: diagnostic with end position, code URL, and suggestion', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'src/bar.js',
      messages: [
        {
          rule: 'my-rule',
          message: 'something broke',
          severity: 'major',
          line: 5,
          column: 6,
          endLine: 7,
          endColumn: 8,
          type: 'error',
          category: 'security',
          fixable: true,
          data: {},
          meta: {
            url: 'https://example.com/rules/my-rule',
            description: '',
          },
        },
      ],
      errorCount: 1,
      warningCount: 0,
    },
  ];

  // eslint-disable-next-line prefer-destructuring
  const diag = input[0].messages[0];
  const expectedSuggestionText = `This issue can be fixed automatically. Run: dclint --fix "${input[0].filePath}"`;

  const expected = {
    source: {
      name: 'dclint',
      url: 'https://github.com/zavoloklom/dclint',
    },
    diagnostics: [
      {
        message: 'something broke',
        location: {
          path: 'src/bar.js',
          range: {
            start: { line: 5, column: 6 },
            end: { line: 7, column: 8 },
          },
        },
        severity: 'ERROR',
        code: {
          value: 'my-rule',
          url: 'https://example.com/rules/my-rule',
        },
        // eslint-disable-next-line camelcase
        original_output: JSON.stringify(diag),
        suggestions: [
          {
            range: {
              start: { line: 5, column: 6 },
              end: { line: 7, column: 8 },
            },
            text: expectedSuggestionText,
          },
        ],
      },
    ],
  };

  const actual = JSON.parse(rdjsonFormatter(input)) as [];
  t.deepEqual(actual, expected);
});
