import test from 'ava';

import { codeclimateFormatter } from '../../../src/plugins/formatters/codeclimate';
import { lintSummaryExample } from '../../fixtures/diagnostics/lint-summary-example';

test('Codeclimate Formatter: multiple files and messages', (t) => {
  const summary = lintSummaryExample;

  const expected = [
    {
      type: 'issue',
      // eslint-disable-next-line camelcase
      check_name: 'rule-1',
      description: 'message one',
      content: { body: 'Error found in rule-1' },
      categories: ['Style'],
      location: {
        path: 'src/compose.a.yml',
        lines: { begin: 1, end: 7 },
        positions: {
          begin: { line: 1, column: 1 },
          end: { line: 7, column: 8 },
        },
      },
      severity: 'major',
      fingerprint: '8d82e4e7c6f45033fa92c68f2b77991e',
    },
    {
      type: 'issue',
      // eslint-disable-next-line camelcase
      check_name: 'rule-2',
      description: 'message two',
      content: { body: 'Error found in rule-2' },
      categories: ['Style'],
      location: {
        path: 'src/compose.a.yml',
        lines: { begin: 333, end: 335 },
        positions: {
          begin: { line: 333, column: 2 },
          end: { line: 335, column: 4 },
        },
      },
      severity: 'major',
      fingerprint: '1925fe71d848d0aec3a8b0850a17b0f3',
    },
    {
      type: 'issue',
      // eslint-disable-next-line camelcase
      check_name: 'rule-3',
      description: 'message three',
      content: { body: 'Error found in rule-3' },
      categories: ['Style'],
      location: {
        path: 'src/compose.b.yml',
        lines: { begin: 5, end: 5 },
        positions: {
          begin: { line: 5, column: 6 },
          end: { line: 5, column: 6 },
        },
      },
      severity: 'minor',
      fingerprint: 'c812a78fd5d60ca832edb4d22a005da4',
    },
  ];

  const actual = JSON.parse(codeclimateFormatter(summary)) as [];

  t.deepEqual(actual, expected);
});
