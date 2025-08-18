/**
 * Index of suppressions extracted from a document.
 * Provides efficient lookup of whether a rule is suppressed at a given location.
 */
class SuppressionIndex {
  private readonly lines: Map<number, Set<string>>;
  private readonly globals: Set<string>;

  constructor() {
    this.lines = new Map();
    this.globals = new Set();
  }

  /**
   * Add a new suppression entry to the index.
   */
  add(line: number, ruleIds: Set<string>): void {
    if (line < 1) return;
    const set = this.lines.get(line) ?? new Set<string>();
    for (const ruleId of ruleIds) set.add(ruleId);
    this.lines.set(line, set);
  }

  /**
   * Add a new suppression entry to the global index.
   */
  addGlobal(ruleIds: Set<string>): void {
    for (const ruleId of ruleIds) this.globals.add(ruleId);
  }

  /**
   * Returns true if the given rule is suppressed at the given location.
   */
  isSuppressed(ruleId: string, line?: number): boolean {
    // Search in globals in there is no line
    if (!line) return this.globals.has(ruleId);

    if (!this.lines.has(line)) return false;

    const rules = this.lines.get(line) ?? new Set();

    return rules.has('*') || rules.has(ruleId);
  }

  /**
   * Returns all suppression entries (useful for debugging).
   */
  list() {
    return [...this.lines].map(([number, set]) => [number, [...set]]);
  }

  /**
   * Returns all global suppression rules (useful for debugging).
   */
  listGlobals() {
    return [...this.globals];
  }
}

export { SuppressionIndex };
