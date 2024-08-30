import type { LintResult } from '../linter/linter.types.js';

export default function compactFormatter(results: LintResult[]): string {
    return results
        .map((result) => {
            return result.messages
                .map((error) => {
                    return `${result.filePath}:${error.line}:${error.column} ${error.message} [${error.rule}]`;
                })
                .join('\n');
        })
        .join('\n\n');
}
