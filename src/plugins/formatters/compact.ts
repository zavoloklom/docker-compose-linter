import type { FormatterFunction } from '../../domain/models/formatter';

const compactFormatter: FormatterFunction = (lintSummary) => {
  return lintSummary.reports
    .map((report) => {
      return report.issues
        .map((error) => {
          return `${report.filePath}:${error.line}:${error.column} ${error.message} [${error.ruleId}]`;
        })
        .join('\n');
    })
    .join('\n\n');
};

export { compactFormatter };
