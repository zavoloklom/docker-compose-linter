import test from 'ava';

import {
  parseFileSuppressionComment,
  parseLineSuppressionComment,
} from '../../../src/domain/supressions/parse-suppression-comment';

test('parseFileSuppressionComment(): should disable all rules if # dclint disable is used without specific rules', (t) => {
  const content = `# dclint disable`;
  const result = parseFileSuppressionComment(content);
  t.deepEqual(
    result,
    ['*'], // '*' means all rules disabled
  );
});

test('parseFileSuppressionComment(): should disable specific rule if # dclint disable rule-name is used', (t) => {
  const content = `# dclint disable rule-name`;
  const result = parseFileSuppressionComment(content);
  t.deepEqual(
    result,
    ['rule-name'], // Only "rule-name" should be disabled
  );
});

test('parseFileSuppressionComment(): should disable multiple specific rules if # dclint disable rule-name another-rule-name is used', (t) => {
  const content = `# dclint disable rule-name another-rule-name`;
  const result = parseFileSuppressionComment(content);
  t.deepEqual(
    result,
    ['rule-name', 'another-rule-name'], // Both rules should be disabled
  );
});

test('parseLineSuppressionComment(): should disable multiple specific rules if # dclint disable-line rule-name no-quotes-in-volumes is used', (t) => {
  const content = `# dclint disable-line rule-name no-quotes-in-volumes`;
  const result = parseLineSuppressionComment(content);
  t.deepEqual(
    result,
    ['rule-name', 'no-quotes-in-volumes'], // Both rules should be disabled
  );
});

test('parseSuppressionComment(): should return an empty set if no disable-line comment is present', (t) => {
  const content = `# eslint-disable-line rule-name`;
  const firstResult = parseFileSuppressionComment(content);
  t.is(firstResult.length, 0);

  const result = parseLineSuppressionComment(content);
  t.is(result.length, 0);
});

test('parseSuppressionComment(): should return an empty set for empty comment', (t) => {
  const content = ``;
  const firstResult = parseFileSuppressionComment(content);
  t.is(firstResult.length, 0);
  const result = parseLineSuppressionComment(content);
  t.is(result.length, 0);
});
