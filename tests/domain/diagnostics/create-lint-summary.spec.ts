import test from 'ava';

import { createLintSummary } from '../../../src/domain/diagnostics/create-lint-summary';
import { RuleCategory, RuleSeverity, RuleType } from '../../../src/domain/models/rule';

import type { LintFileReport } from '../../../src/domain/models/lint-file-report';

test('createLintSummary(): aggregates counts correctly without stats', (t) => {
  const reports: LintFileReport[] = [
    {
      filePath: 'file1.ts',
      issues: [
        {
          ruleId: 'no-foo',
          category: RuleCategory.STYLE,
          type: RuleType.ERROR,
          fixable: false,
          severity: RuleSeverity.INFO,
          message: '',
          line: 0,
          column: 0,
          meta: {
            url: '',
            description: '',
          },
          context: {},
        },
        {
          ruleId: 'require-bar',
          category: RuleCategory.BEST_PRACTICE,
          type: RuleType.WARNING,
          fixable: true,
          severity: RuleSeverity.INFO,
          message: '',
          line: 0,
          column: 0,
          meta: {
            url: '',
            description: '',
          },
          context: {},
        },
      ],
      count: {
        error: 1,
        warning: 1,
        total: 2,
        fixableError: 0,
        fixableWarning: 1,
        fixableTotal: 1,
      },
    },
    {
      filePath: 'file2.ts',
      issues: [
        {
          ruleId: 'no-foo',
          category: RuleCategory.STYLE,
          type: RuleType.ERROR,
          fixable: true,
          severity: RuleSeverity.INFO,
          message: '',
          line: 0,
          column: 0,
          meta: {
            url: '',
            description: '',
          },
          context: {},
        },
      ],
      count: {
        error: 1,
        warning: 0,
        total: 1,
        fixableError: 1,
        fixableWarning: 0,
        fixableTotal: 1,
      },
    },
  ];

  const summary = createLintSummary(reports);

  t.deepEqual(summary.count, {
    error: 2,
    warning: 1,
    total: 3,
    fixableError: 1,
    fixableWarning: 1,
    fixableTotal: 2,
  });

  t.false('stats' in summary);
  t.is(summary.reports.length, 2);
});

test('createLintSummary(): includes stats with byCategory and byRule', (t) => {
  const reports: LintFileReport[] = [
    {
      filePath: 'file1.ts',
      issues: [
        {
          ruleId: 'no-foo',
          category: RuleCategory.STYLE,
          type: RuleType.ERROR,
          fixable: false,
          severity: RuleSeverity.INFO,
          message: '',
          line: 0,
          column: 0,
          meta: {
            url: '',
            description: '',
          },
          context: {},
        },
        {
          ruleId: 'no-foo',
          category: RuleCategory.STYLE,
          type: RuleType.WARNING,
          fixable: true,
          severity: RuleSeverity.INFO,
          message: '',
          line: 0,
          column: 0,
          meta: {
            url: '',
            description: '',
          },
          context: {},
        },
        {
          ruleId: 'require-bar',
          category: RuleCategory.BEST_PRACTICE,
          type: RuleType.WARNING,
          fixable: true,
          severity: RuleSeverity.INFO,
          message: '',
          line: 0,
          column: 0,
          meta: {
            url: '',
            description: '',
          },
          context: {},
        },
      ],
      count: {
        error: 2,
        warning: 1,
        total: 3,
        fixableError: 1,
        fixableWarning: 0,
        fixableTotal: 1,
      },
    },
  ];

  const times = {
    parse: 123,
    operation: 123,
    total: 123,
  };

  const summary = createLintSummary(reports, { times });

  t.deepEqual(summary.count, {
    error: 2,
    warning: 1,
    total: 3,
    fixableError: 1,
    fixableWarning: 0,
    fixableTotal: 1,
  });

  t.truthy(summary.stats);
  t.deepEqual(summary.stats?.times, times);

  t.deepEqual(summary.stats?.byCategory, {
    style: 2,
    'best-practice': 1,
  });

  t.deepEqual(summary.stats?.byRule, {
    'no-foo': 2,
    'require-bar': 1,
  });
});
