/**
 * Formatter for Github Annotations
 * See <https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#example-creating-an-annotation-for-an-error>
 */

import type { FormatterFunction } from '../../domain/models/formatter';

const githubFormatter: FormatterFunction = (lintSummary) => {
  return lintSummary.reports
    .flatMap((report) =>
      report.issues.map((issue) => {
        const file = report.filePath;
        const line = issue.line ?? 1;
        const col = issue.column ?? 1;
        const text = `${issue.ruleId}: ${issue.message}`;

        return `::${issue.type} file=${file},line=${line},col=${col}::${text}`;
      }),
    )
    .join('\n');
};

export { githubFormatter };
