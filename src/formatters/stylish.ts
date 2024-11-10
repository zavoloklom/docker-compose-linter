import { resolve } from 'node:path';
import chalk from 'chalk';
import type { LintResult } from '../linter/linter.types.js';

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

    // Format the file path header without nested template literals
    const filePath = chalk.underline(resolve(result.filePath));
    output += `\n${filePath}\n`;

    result.messages.forEach((message) => {
      const { type } = message;
      const color = type === 'error' ? chalk.red : chalk.yellow;
      const line = message.line.toString().padStart(4, ' ');
      const column = message.column.toString().padEnd(4, ' ');

      // Break down message formatting into separate parts
      const position = chalk.dim(`${line}:${column}`);
      const formattedType = color(type);
      const ruleInfo = chalk.dim(message.rule);

      output += `${position}  ${formattedType}  ${message.message}  ${ruleInfo}\n`;

      // Increment counts without using the ++ operator
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
    const problemSummary = chalk.red.bold(`✖ ${totalProblems} problems`);
    const errorSummary = chalk.red.bold(`${errorCount} errors`);
    const warningSummary = chalk.yellow.bold(`${warningCount} warnings`);
    output += `\n${problemSummary} (${errorSummary}, ${warningSummary})\n`;
  }

  if (fixableErrorCount > 0 || fixableWarningCount > 0) {
    const fixableSummary = chalk.green.bold(
      `${fixableErrorCount} errors and ${fixableWarningCount} warnings potentially fixable with the \`--fix\` option.`,
    );
    output += `${fixableSummary}\n`;
  }

  return output;
}
