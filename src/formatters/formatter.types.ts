import type { LintResult } from '../linter/linter.types';

export type FormatterFunction = (results: LintResult[]) => string;
