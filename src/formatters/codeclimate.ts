import { generateFingerprint } from '../util/generate-fingerprint';

import type { LintResult } from '../linter/linter.types';

export default function codeclimateFormatter(results: LintResult[]): string {
  const hashes = new Set<string>();

  const issues = results.flatMap((result) => {
    return result.messages.map((message) => ({
      type: 'issue',
      // eslint-disable-next-line camelcase
      check_name: message.rule,
      description: message.message,
      content: {
        body: `Error found in ${message.rule}`,
      },
      categories: ['Style'],
      location: {
        path: result.filePath,
        lines: {
          begin: message.line,
          end: message.endLine ?? message.line,
        },
        positions: {
          begin: {
            line: message.line,
            column: message.column,
          },
          end: {
            line: message.endLine ?? message.line,
            column: message.endColumn ?? message.column,
          },
        },
      },
      severity: message.severity,
      fingerprint: generateFingerprint(
        [result.filePath, message.rule, message.message, `${message.line}`, `${message.column}`],
        hashes,
      ),
    }));
  });

  return JSON.stringify(issues);
}
