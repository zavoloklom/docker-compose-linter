import test from 'ava';

import { type Rule, RuleCategory, RuleSeverity, RuleType } from '../../../src/domain/models/rule';
import { fixContent } from '../../../src/domain/services/fix-content';
import { SuppressionIndex } from '../../../src/domain/supressions/supression-index';

import type { ComposeDocument } from '../../../src/domain/models/compose-document';

// ----------------------
// Helpers
// ----------------------
const makeSuppressions = (options?: { globalAll?: boolean; globalIds?: Iterable<string> }): SuppressionIndex => {
  const index = new SuppressionIndex();
  if (options?.globalAll) index.addGlobal(new Set(['*']));
  if (options?.globalIds) index.addGlobal(new Set(options.globalIds));
  return index;
};

const makeDocument = (content: string, suppressions: SuppressionIndex = makeSuppressions()): ComposeDocument => {
  const base = {
    filePath: '/fake/path.yml',
    suppressions,
    getNodeLocation: () => ({ line: 1, column: 1 }),
    getSyntaxIssues: () => [],
    toJS: () => ({}) as Record<string, unknown>,
  };
  return {
    ...base,
    toString: () => content,
  };
};

const makeRuleFixable = (id: string, fixFunction: (document: ComposeDocument) => ComposeDocument): Rule => {
  return {
    id,
    type: RuleType.ERROR,
    meta: { description: `Rule ${id}`, url: `https://example.com/${id}` },
    category: RuleCategory.STYLE,
    severity: RuleSeverity.MAJOR,
    fixable: true,
    getMessage: () => `Violation of ${id}`,
    check: () => [],
    fix: fixFunction,
  };
};

const makeRuleNonFixable = (id: string): Rule => {
  return {
    id,
    type: RuleType.WARNING,
    meta: { description: `Rule ${id}`, url: `https://example.com/${id}` },
    category: RuleCategory.BEST_PRACTICE,
    severity: RuleSeverity.MINOR,
    fixable: false,
    getMessage: () => `Violation of ${id}`,
    check: () => [],
  };
};

// ----------------------
// Tests
// ----------------------
test('returns original content when all rules globally suppressed via "*"', (t) => {
  const document = makeDocument('original', makeSuppressions({ globalAll: true }));

  // Would change content if run, but must NOT be invoked due to '*'
  const r1 = makeRuleFixable('r1', () => makeDocument('fixed-r1'));

  const result = fixContent(document, [r1]);

  t.is(result, 'original');
});

test('skips a rule when its id is globally suppressed', (t) => {
  const document = makeDocument('original', makeSuppressions({ globalIds: ['r1'] }));

  // Rule r1 should be skipped; r2 should run
  const r1 = makeRuleFixable('r1', () => makeDocument('fixed-r1'));
  const r2 = makeRuleFixable('r2', () => makeDocument('fixed-r2'));

  const result = fixContent(document, [r1, r2]);

  t.is(result, 'fixed-r2');
});

test('applies fix only if rule is fixable and has fix()', (t) => {
  const document = makeDocument('original');

  const nonFixable = makeRuleNonFixable('r0'); // Should be ignored
  const noFixMethod: Rule = {
    ...makeRuleNonFixable('rX'),
    fixable: true, // Misleading, but fix() is missing => should be ignored by type guard
  } as unknown as Rule;

  const fixable = makeRuleFixable('r1', () => makeDocument('fixed'));

  const result = fixContent(document, [nonFixable, noFixMethod, fixable]);

  t.is(result, 'fixed');
});

test('multiple fixable rules: last applicable fix wins (current behavior)', (t) => {
  const document = makeDocument('original');

  // Both are applicable; implementation assigns fixedDocument = rule.fix(document)
  // and passes the ORIGINAL "document" into every fix (not the progressively fixed one).
  const r1 = makeRuleFixable('r1', () => makeDocument('fixed-by-r1'));
  const r2 = makeRuleFixable('r2', () => makeDocument('fixed-by-r2'));

  const result = fixContent(document, [r1, r2]);

  t.is(result, 'fixed-by-r2');
});

test('each fix receives the ORIGINAL document (not the previously fixed one)', (t) => {
  const original = makeDocument('original');
  let r1Argument: ComposeDocument | undefined;
  let r2Argument: ComposeDocument | undefined;

  const r1 = makeRuleFixable('r1', (document) => {
    r1Argument = document;
    return makeDocument('r1-out');
  });
  const r2 = makeRuleFixable('r2', (document) => {
    r2Argument = document;
    return makeDocument('r2-out');
  });

  const result = fixContent(original, [r1, r2]);

  t.is(result, 'r2-out');
  t.is(r1Argument, original);
  t.is(r2Argument, original);
});

test('does nothing when there are no rules', (t) => {
  const document = makeDocument('original');

  const result = fixContent(document, []);

  t.is(result, 'original');
});
