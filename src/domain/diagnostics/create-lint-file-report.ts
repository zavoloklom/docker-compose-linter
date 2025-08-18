import { RuleType } from '../models/rule';

import type { LintFileReport } from '../models/lint-file-report';
import type { LintIssue } from '../models/lint-issue';

const createLintFileReport = (filePath: string, issues: LintIssue[]): LintFileReport => {
  // eslint-disable-next-line unicorn/no-array-reduce
  const { errorCount, warningCount, fixableErrorCount, fixableWarningCount } = issues.reduce(
    (count, issue) => {
      if (issue.type === RuleType.ERROR) count.errorCount += 1;
      if (issue.type === RuleType.WARNING) count.warningCount += 1;
      if (issue.fixable && issue.type === RuleType.ERROR) count.fixableErrorCount += 1;
      if (issue.fixable && issue.type === RuleType.WARNING) count.fixableWarningCount += 1;
      return count;
    },
    { errorCount: 0, warningCount: 0, fixableErrorCount: 0, fixableWarningCount: 0 },
  );

  return {
    filePath,
    issues,
    count: {
      error: errorCount,
      warning: warningCount,
      total: errorCount + warningCount,
      fixableError: fixableErrorCount,
      fixableWarning: fixableWarningCount,
      fixableTotal: fixableErrorCount + fixableWarningCount,
    },
  };
};

export { createLintFileReport };
