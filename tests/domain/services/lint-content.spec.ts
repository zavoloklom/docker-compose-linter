/* eslint-disable no-magic-numbers */
import test from 'ava';

import { type Rule, RuleCategory, RuleSeverity, RuleType } from '../../../src/domain/models/rule';
import { lintContent } from '../../../src/domain/services/lint-content';
import { SuppressionIndex } from '../../../src/domain/supressions/supression-index';

import type { ComposeDocument } from '../../../src/domain/models/compose-document';
import type { LintIssue } from '../../../src/domain/models/lint-issue';

// ----------------------
// Helpers
// ----------------------
const makeSuppressions = (options?: {
  globalAll?: boolean;
  globalIds?: Iterable<string>;
  lineMap?: Iterable<[number, Iterable<string>]>;
}): SuppressionIndex => {
  const index = new SuppressionIndex();

  if (options?.globalAll) {
    index.addGlobal(new Set(['*']));
  }

  if (options?.globalIds) {
    index.addGlobal(new Set(options.globalIds));
  }

  if (options?.lineMap) {
    for (const [line, ruleIds] of options.lineMap) {
      index.add(line, new Set(ruleIds));
    }
  }

  return index;
};

const makeDocument = (suppressions: SuppressionIndex): ComposeDocument => {
  return {
    filePath: '/fake/path/docker-compose.yml',
    suppressions,
    getNodeLocation: () => ({ line: 1, column: 1 }),
    getSyntaxIssues: () => [],
    toString: () => '',
    toJS: () => ({}),
  };
};

const makeRule = (id: string, issues: LintIssue[] = []): Rule => {
  return {
    id,
    type: RuleType.ERROR,
    meta: { description: `Rule ${id}`, url: `https://example.com/${id}` },
    category: RuleCategory.STYLE,
    severity: RuleSeverity.MAJOR,
    fixable: false,
    getMessage: () => `Violation of ${id}`,
    check: () => issues,
  };
};

const issue = (ruleId: string, line: number, column = 1): LintIssue => {
  return {
    ruleId,
    type: RuleType.ERROR,
    severity: RuleSeverity.MAJOR,
    category: RuleCategory.STYLE,
    message: `Issue ${ruleId} at ${line}:${column}`,
    line,
    column,
    meta: { description: 'desc', url: 'https://example.com' },
    fixable: false,
    context: {},
  };
};

// ----------------------
// Tests
// ----------------------
test('returns empty when all rules are globally suppressed via "*"', (t) => {
  const document = makeDocument(makeSuppressions({ globalAll: true }));
  const rules = [makeRule('r1', [issue('r1', 1)])];

  const result = lintContent(document, rules);

  t.deepEqual(result, []);
});

test('skips an entire rule when that ruleId is globally suppressed', (t) => {
  const document = makeDocument(makeSuppressions({ globalIds: ['r1'] }));
  const rules = [makeRule('r1', [issue('r1', 1), issue('r1', 2)]), makeRule('r2', [issue('r2', 3)])];

  const result = lintContent(document, rules);

  // Only r2 issues should remain
  t.is(result.length, 1);
  t.true(result.every((i) => i.ruleId === 'r2'));
});

test('filters out line-level suppressions for a rule', (t) => {
  const document = makeDocument(
    makeSuppressions({
      lineMap: [
        [2, ['r1']], // Suppress r1 on line 2
        [4, ['r1']], // Suppress r1 on line 4
      ],
    }),
  );

  const rules = [makeRule('r1', [issue('r1', 1), issue('r1', 2), issue('r1', 4), issue('r1', 5)])];

  const result = lintContent(document, rules);

  // Lines 2 and 4 should be filtered out
  const lines = result.map((i) => i.line).sort((a, b) => a - b);
  t.deepEqual(lines, [1, 5]);
  t.true(result.every((i) => i.ruleId === 'r1'));
});

test('line-level "*" suppresses every rule on that line', (t) => {
  const document = makeDocument(
    makeSuppressions({
      lineMap: [[2, ['*']]], // Suppress everything on line 2
    }),
  );

  const rules = [makeRule('r1', [issue('r1', 1), issue('r1', 2)]), makeRule('r2', [issue('r2', 2), issue('r2', 3)])];

  const result = lintContent(document, rules);

  t.deepEqual(
    result.map((i) => `${i.ruleId}@${i.line}`).sort((a, b) => a.localeCompare(b)),
    ['r1@1', 'r2@3'].sort((a, b) => a.localeCompare(b)),
  );
});

test('aggregates issues from multiple rules when not suppressed', (t) => {
  const document = makeDocument(makeSuppressions());
  const rules = [
    makeRule('r1', [issue('r1', 1), issue('r1', 3)]),
    makeRule('r2', [issue('r2', 2)]),
    makeRule('r3', []),
  ];

  const result = lintContent(document, rules);

  t.is(result.length, 3);
  t.deepEqual(
    result.map((i) => `${i.ruleId}@${i.line}`).sort((a, b) => a.localeCompare(b)),
    ['r1@1', 'r1@3', 'r2@2'].sort((a, b) => a.localeCompare(b)),
  );
});

test('returns empty when there are no rules', (t) => {
  const document = makeDocument(makeSuppressions());

  const result = lintContent(document, []);

  t.deepEqual(result, []);
});

test('does not suppress other rules when one rule is globally suppressed', (t) => {
  const document = makeDocument(makeSuppressions({ globalIds: ['r2'] }));
  const rules = [
    makeRule('r1', [issue('r1', 10)]),
    makeRule('r2', [issue('r2', 11)]),
    makeRule('r3', [issue('r3', 12)]),
  ];

  const result = lintContent(document, rules);

  const ids = new Set(result.map((i) => i.ruleId));
  t.deepEqual(ids, new Set(['r1', 'r3']));
});
