import type { RuleMessage } from '../rules/rules.types';

interface LintContext {
  path: string;
  content: object;
  sourceCode: string;
}

interface LintResult {
  filePath: string; // Path to the file that was linted
  messages: RuleMessage[]; // Array of lint messages (errors and warnings)
  errorCount: number; // Total number of errors found
  warningCount: number; // Total number of warnings found
  fixableErrorCount?: number; // Total number of fixable errors (optional)
  fixableWarningCount?: number; // Total number of fixable warnings (optional)
}

export { LintContext, LintResult };
