import type { LintSummary } from './lint-summary';

export type FormatterFunction = (lintSummary: LintSummary) => string;
