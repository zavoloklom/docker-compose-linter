import { resolve } from 'node:path';
import pc from 'picocolors';
import type { LintResult } from '../linter/linter.types';

export default function stylishFormatter(results: LintResult[]): string {
  let output = '';
  let errorCount = 0;
  let warningCount = 0;
  let fixableErrorCount = 0;
  let fixableWarningCount = 0;

  results.forEach((result) => {
    if (result.messages.length === 0) {
      return;
    }

    const filePath = pc.underline(resolve(result.filePath));
    output += `\n${filePath}\n`;

    result.messages.forEach((message) => {
      const { type } = message;
      const color = type === 'error' ? pc.red : pc.yellow;
      const line = message.line.toString().padStart(4, ' ');
      const column = message.column.toString().padEnd(4, ' ');

      const position = pc.dim(`${line}:${column}`);
      const formattedType = color(type);
      const ruleInfo = pc.dim(message.rule);

      output += `${position}  ${formattedType}  ${message.message}  ${ruleInfo}\n`;

      if (type === 'error') {
        errorCount += 1;
        if (message.fixable) {
          fixableErrorCount += 1;
        }
      } else {
        warningCount += 1;
        if (message.fixable) {
          fixableWarningCount += 1;
        }
      }
    });
  });

  const totalProblems = errorCount + warningCount;
  if (totalProblems > 0) {
    const problemSummary = pc.red(pc.bold(`✖ ${totalProblems} problems`));
    const errorSummary = pc.red(pc.bold(`${errorCount} errors`));
    const warningSummary = pc.yellow(pc.bold(`${warningCount} warnings`));
    output += `\n${problemSummary} (${errorSummary}, ${warningSummary})\n`;
  }

  if (fixableErrorCount > 0 || fixableWarningCount > 0) {
    const fixableSummary = pc.green(
      pc.bold(
        `${fixableErrorCount} errors and ${fixableWarningCount} warnings potentially fixable with the \`--fix\` option.`,
      ),
    );
    output += `${fixableSummary}\n`;
  }

  return output;
}
