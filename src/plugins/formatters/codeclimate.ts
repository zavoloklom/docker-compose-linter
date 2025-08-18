import { generateFingerprint } from '../../shared/generate-fingerprint';

import type { FormatterFunction } from '../../domain/models/formatter';

const codeclimateFormatter: FormatterFunction = (lintSummary) => {
  const hashes = new Set<string>();

  const issues = lintSummary.reports.flatMap((report) => {
    return report.issues.map((issue) => ({
      type: 'issue',
      // eslint-disable-next-line camelcase
      check_name: issue.ruleId,
      description: issue.message,
      content: {
        body: `Error found in ${issue.ruleId}`,
      },
      categories: ['Style'],
      location: {
        path: report.filePath,
        lines: {
          begin: issue.line,
          end: issue.endLine ?? issue.line,
        },
        positions: {
          begin: {
            line: issue.line,
            column: issue.column,
          },
          end: {
            line: issue.endLine ?? issue.line,
            column: issue.endColumn ?? issue.column,
          },
        },
      },
      severity: issue.severity,
      fingerprint: generateFingerprint(
        [report.filePath, issue.ruleId, issue.message, `${issue.line}`, `${issue.column}`],
        hashes,
      ),
    }));
  });

  return JSON.stringify(issues);
};

export { codeclimateFormatter };
