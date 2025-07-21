/**
 * Formatter for Reviewdog <https://github.com/reviewdog/reviewdog>
 * Scheme <https://github.com/reviewdog/reviewdog/blob/master/proto/rdf/jsonschema/Diagnostic.json>
 */

import type { FormatterFunction } from './formatter.types';
import type { RuleType } from '../rules/rules.types';

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
    case 'error':
      return 'ERROR';
    case 'warning':
      return 'WARNING';
    default:
      return 'INFO';
  }
};

const rdjsonFormatter: FormatterFunction = (results) => {
  const diagnostics = results.flatMap((result) =>
    result.messages.map((message) => {
      const start = {
        line: message.line ?? 1,
        column: message.column ?? 1,
      };

      const end =
        message.endLine || message.endColumn
          ? {
              line: message.endLine ?? message.line ?? 1,
              column: message.endColumn ?? message.column ?? 1,
            }
          : null;

      const diagnostic: RdjsonDiagnostic = {
        message: message.message,
        location: {
          path: result.filePath,
          range: {
            start,
            ...(end ? { end } : {}),
          },
        },
        severity: mapSeverity(message.type),
        code: {
          value: message.rule,
          ...(message.meta?.url ? { url: message.meta.url } : {}),
        },
        // eslint-disable-next-line camelcase
        original_output: JSON.stringify(message),
      };

      if (message.fixable) {
        diagnostic.suggestions = [
          {
            range: {
              start,
              ...(end ? { end } : {}),
            },
            text: `This issue can be fixed automatically. Run: dclint --fix "${result.filePath}"`,
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
