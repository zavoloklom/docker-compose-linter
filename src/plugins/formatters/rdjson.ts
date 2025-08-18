/**
 * Formatter for Reviewdog <https://github.com/reviewdog/reviewdog>
 * Scheme <https://github.com/reviewdog/reviewdog/blob/master/proto/rdf/jsonschema/Diagnostic.json>
 */

import { RuleType } from '../../domain/models/rule';

import type { FormatterFunction } from '../../domain/models/formatter';

interface RdjsonPosition {
  line: number;
  column: number;
}

interface RdjsonRange {
  start: RdjsonPosition;
  end?: RdjsonPosition;
}

interface RdjsonLocation {
  path: string;
  range: RdjsonRange;
}

interface RdjsonCode {
  value: string;
  url?: string;
}

interface RdjsonSuggestion {
  range: RdjsonRange;
  text: string;
}

interface RdjsonDiagnostic {
  message: string;
  location: RdjsonLocation;
  severity?: 'INFO' | 'WARNING' | 'ERROR';
  code?: RdjsonCode;
  suggestions?: RdjsonSuggestion[];
  original_output?: string;
}

const mapSeverity = (type: RuleType): RdjsonDiagnostic['severity'] => {
  switch (type) {
    case RuleType.ERROR:
      return 'ERROR';
    case RuleType.WARNING:
      return 'WARNING';
    default:
      return 'INFO';
  }
};

const rdjsonFormatter: FormatterFunction = (lintSummary) => {
  const diagnostics = lintSummary.reports.flatMap((report) =>
    report.issues.map((issue) => {
      const start = {
        line: issue.line,
        column: issue.column,
      };

      const end =
        issue.endLine || issue.endColumn
          ? {
              line: issue.endLine ?? issue.line,
              column: issue.endColumn ?? issue.column,
            }
          : null;

      const diagnostic: RdjsonDiagnostic = {
        message: issue.message,
        location: {
          path: report.filePath,
          range: {
            start,
            ...(end ? { end } : {}),
          },
        },
        severity: mapSeverity(issue.type),
        code: {
          value: issue.ruleId,
          ...(issue.meta?.url ? { url: issue.meta.url } : {}),
        },
        // eslint-disable-next-line camelcase
        original_output: JSON.stringify(issue),
      };

      if (issue.fixable) {
        diagnostic.suggestions = [
          {
            range: {
              start,
              ...(end ? { end } : {}),
            },
            text: `This issue can be fixed automatically. Run: dclint --fix "${report.filePath}"`,
          },
        ];
      }

      return diagnostic;
    }),
  );

  return JSON.stringify({
    source: {
      name: 'dclint',
      url: 'https://github.com/zavoloklom/dclint',
    },
    diagnostics,
  });
};

export { rdjsonFormatter };
