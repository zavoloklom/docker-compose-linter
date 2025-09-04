import type { LintFileReport, TotalCounts } from './lint-file-report';
import type { RuleCategory } from './rule';

// Use the --stats CLI option.
interface LintStats {
  times: {
    loadRules: number;
    parse: number;
    lint: number;
    total: number;
  };
  rules?: {
    active: number;
    fixable?: number;
  };
  byCategory: Record<RuleCategory, number>;
  byRule: Record<string, number>;
}

interface LintSummary {
  reports: LintFileReport[];
  count: TotalCounts;
  stats?: LintStats;
}

export { LintSummary, LintStats };
