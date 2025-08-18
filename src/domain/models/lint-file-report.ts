import type { LintIssue } from './lint-issue';

interface TotalCounts {
  error: number; // Total number of errors found
  warning: number; // Total number of warnings found
  total: number; // Total number of errors and warnings found
  fixableError: number; // Total number of fixable errors
  fixableWarning: number; // Total number of fixable warnings
  fixableTotal: number; // Total number of fixable errors and warnings
}

interface LintFileReport {
  filePath: string; // Path to the file that was linted
  issues: LintIssue[]; // Array of lint issues
  count: TotalCounts; // Total number of errors and warnings
}

export { LintFileReport, TotalCounts };
