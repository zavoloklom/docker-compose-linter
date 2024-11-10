import type { LintResult } from '../linter/linter.types.js';

export default function jsonFormatter(results: LintResult[]): string {
  return JSON.stringify(results, null, 2);
}
