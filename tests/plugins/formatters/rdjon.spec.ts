import test from 'ava';

import { RuleCategory, RuleSeverity, RuleType } from '../../../src/domain/models/rule';
import { rdjsonFormatter } from '../../../src/plugins/formatters/rdjson';
import { lintSummaryExample } from '../../fixtures/diagnostics/lint-summary-example';

import type { LintFileReport } from '../../../src/domain/models/lint-file-report';

test('RDJson Formatter: basic diagnostic without end position or fix', (t) => {
  const lintFileReports: LintFileReport[] = [
    {
      filePath: 'lib/compose.yml',
      issues: [
        {
          ruleId: 'no-unused-vars',
          message: 'x is defined but never used',
          severity: RuleSeverity.MINOR,
          line: 1,
          column: 2,
          type: RuleType.WARNING,
          category: RuleCategory.STYLE,
          fixable: false,
          context: {},
          meta: {
            url: '',
            description: '',
          },
        },
      ],
      count: {
        error: 0,
        warning: 1,
        total: 1,
        fixableError: 0,
        fixableWarning: 0,
        fixableTotal: 0,
      },
    },
  ];
  const summary = {
    reports: lintFileReports,
    count: {
      error: 0,
      warning: 1,
      total: 1,
      fixableError: 0,
      fixableWarning: 0,
      fixableTotal: 0,
    },
  };

  const expected = {
    source: {
      name: 'dclint',
      url: 'https://github.com/zavoloklom/dclint',
    },
    diagnostics: [
      {
        message: 'x is defined but never used',
        location: {
          path: 'lib/compose.yml',
          range: {
            start: { line: 1, column: 2 },
          },
        },
        severity: 'WARNING',
        code: { value: 'no-unused-vars' },
        // eslint-disable-next-line camelcase
        original_output: JSON.stringify(lintFileReports[0].issues[0]),
      },
    ],
  };

  const actual = JSON.parse(rdjsonFormatter(summary)) as [];
  t.deepEqual(actual, expected);
});

test('RDJson Formatter: diagnostic with end position, code URL, and suggestion', (t) => {
  const summary = lintSummaryExample;

  const expected = {
    source: {
      name: 'dclint',
      url: 'https://github.com/zavoloklom/dclint',
    },
    diagnostics: [
      {
        message: 'message one',
        location: {
          path: 'src/compose.a.yml',
          range: {
            start: { line: 1, column: 1 },
            end: { line: 7, column: 8 },
          },
        },
        severity: 'WARNING',
        code: {
          value: 'rule-1',
          url: 'https://example.com/rules/my-rule',
        },
        // eslint-disable-next-line camelcase
        original_output: JSON.stringify(summary.reports[0].issues[0]),
        suggestions: [
          {
            range: {
              start: { line: 1, column: 1 },
              end: { line: 7, column: 8 },
            },
            text: `This issue can be fixed automatically. Run: dclint --fix "${summary.reports[0].filePath}"`,
          },
        ],
      },
      {
        message: 'message two',
        location: {
          path: 'src/compose.a.yml',
          range: {
            start: { line: 333, column: 2 },
            end: { line: 335, column: 4 },
          },
        },
        severity: 'ERROR',
        code: {
          value: 'rule-2',
        },
        // eslint-disable-next-line camelcase
        original_output: JSON.stringify(summary.reports[0].issues[1]),
      },
      {
        message: 'message three',
        location: {
          path: 'src/compose.b.yml',
          range: {
            start: { line: 5, column: 6 },
          },
        },
        severity: 'WARNING',
        code: {
          value: 'rule-3',
        },
        // eslint-disable-next-line camelcase
        original_output: JSON.stringify(summary.reports[1].issues[0]),
      },
    ],
  };

  const actual = JSON.parse(rdjsonFormatter(summary)) as [];

  t.deepEqual(actual, expected);
});
