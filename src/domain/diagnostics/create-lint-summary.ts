import type { LintFileReport } from '../models/lint-file-report';
import type { LintStats, LintSummary } from '../models/lint-summary';

const countStat = (reports: LintFileReport[]) => {
  const byCategory: Record<string, number> = {};
  const byRule: Record<string, number> = {};

  for (const report of reports) {
    for (const { category, ruleId } of report.issues) {
      byCategory[category] = (byCategory[category] ?? 0) + 1;
      byRule[ruleId] = (byRule[ruleId] ?? 0) + 1;
    }
  }

  return { byCategory, byRule };
};

const createLintSummary = (reports: LintFileReport[], stats?: Pick<LintStats, 'times'>): LintSummary => {
  // eslint-disable-next-line unicorn/no-array-reduce
  const { errorCount, warningCount, fixableErrorCount, fixableWarningCount } = reports.reduce(
    (count, report) => {
      count.errorCount += report.count.error;
      count.warningCount += report.count.warning;
      count.fixableErrorCount += report.count.fixableError;
      count.fixableWarningCount += report.count.fixableWarning;
      return count;
    },
    { errorCount: 0, warningCount: 0, fixableErrorCount: 0, fixableWarningCount: 0 },
  );

  return {
    reports,
    count: {
      error: errorCount,
      warning: warningCount,
      total: errorCount + warningCount,
      fixableError: fixableErrorCount,
      fixableWarning: fixableWarningCount,
      fixableTotal: fixableErrorCount + fixableWarningCount,
    },
    ...(stats ? { stats: { ...countStat(reports), ...stats } } : {}),
  };
};

export { createLintSummary };
