import { resolve } from 'node:path';
import pc from 'picocolors';

import { RuleType } from '../../domain/models/rule';

import type { FormatterFunction } from '../../domain/models/formatter';

const stylishFormatter: FormatterFunction = (lintSummary) => {
  let output = '';
  for (const report of lintSummary.reports) {
    if (report.issues.length === 0) continue;

    const filePath = pc.underline(resolve(report.filePath));
    output += `\n${filePath}\n`;

    for (const issue of report.issues) {
      const { type } = issue;
      const color = type === RuleType.ERROR ? pc.red : pc.yellow;

      // Pad line/column numbers to align up to 4-digit values
      const PAD = 4;

      const line = issue.line.toString().padStart(PAD, ' ');
      const column = issue.column.toString().padEnd(PAD, ' ');

      const position = pc.dim(`${line}:${column}`);
      const formattedType = color(type);
      const ruleInfo = pc.dim(issue.ruleId);

      output += `${position}  ${formattedType}  ${issue.message}  ${ruleInfo}\n`;
    }
  }

  if (lintSummary.count.total > 0) {
    const problemSummary = pc.red(pc.bold(`✖ ${lintSummary.count.total} problems`));
    const errorSummary = pc.red(pc.bold(`${lintSummary.count.error} errors`));
    const warningSummary = pc.yellow(pc.bold(`${lintSummary.count.warning} warnings`));
    output += `\n${problemSummary} (${errorSummary}, ${warningSummary})\n`;
  }

  if (lintSummary.count.fixableTotal > 0) {
    const fixableSummary = pc.green(
      pc.bold(
        `${lintSummary.count.fixableError} errors and ${lintSummary.count.fixableWarning} warnings potentially fixable with the \`--fix\` option.`,
      ),
    );
    output += `${fixableSummary}\n`;
  }

  return output;
};

export { stylishFormatter };
