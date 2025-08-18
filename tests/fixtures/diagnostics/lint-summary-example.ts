import { RuleCategory, RuleSeverity, RuleType } from '../../../src/domain/models/rule';

import type { LintFileReport } from '../../../src/domain/models/lint-file-report';
import type { LintSummary } from '../../../src/domain/models/lint-summary';

const lintFileReports: LintFileReport[] = [
  {
    filePath: 'src/compose.a.yml',
    issues: [
      {
        ruleId: 'rule-1',
        message: 'message one',
        severity: RuleSeverity.MAJOR,
        line: 1,
        column: 1,
        endLine: 7,
        endColumn: 8,
        type: RuleType.WARNING,
        category: RuleCategory.STYLE,
        fixable: true,
        context: {},
        meta: {
          url: 'https://example.com/rules/my-rule',
          description: '',
        },
      },
      {
        ruleId: 'rule-2',
        message: 'message two',
        severity: RuleSeverity.MAJOR,
        line: 333,
        column: 2,
        endLine: 335,
        endColumn: 4,
        type: RuleType.ERROR,
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
      error: 1,
      warning: 1,
      total: 2,
      fixableError: 0,
      fixableWarning: 1,
      fixableTotal: 1,
    },
  },
  {
    filePath: 'src/compose.b.yml',
    issues: [
      {
        ruleId: 'rule-3',
        message: 'message three',
        severity: RuleSeverity.MINOR,
        line: 5,
        column: 6,
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
      fixableWarning: 1,
      fixableTotal: 1,
    },
  },
];

const lintSummaryExample: LintSummary = {
  reports: lintFileReports,
  count: {
    error: 1,
    warning: 2,
    total: 3,
    fixableError: 0,
    fixableWarning: 1,
    fixableTotal: 1,
  },
};

export { lintSummaryExample };
