// Use the --stats CLI option.
interface FixStats {
  times: {
    parse: number;
    fix: number;
    total: number;
  };
}

interface FixSummary {
  documents: string[];
  stats?: FixStats;
}

export { FixSummary, FixStats };
