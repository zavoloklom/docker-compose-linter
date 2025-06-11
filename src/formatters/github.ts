/**
 * Formatter for Github Annotations
 * See <https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#example-creating-an-annotation-for-an-error>
 */

import type { LintResult } from '../linter/linter.types';

export default function githubFormatter(results: LintResult[]): string {
  return results
    .flatMap((result) =>
      result.messages.map((message) => {
        const file = result.filePath;
        const line = message.line ?? 1;
        const col = message.column ?? 1;
        const text = `${message.rule}: ${message.message}`;

        return `::${message.type} file=${file},line=${line},col=${col}::${text}`;
      }),
    )
    .join('\n');
}
