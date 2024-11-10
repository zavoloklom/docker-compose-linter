import type { LintResult } from '../linter/linter.types.js';

export default function jsonFormatter(results: LintResult[]): string {
  // eslint-disable-next-line unicorn/no-null
  return JSON.stringify(results, null, 2);
}
