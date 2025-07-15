/* eslint-disable sonarjs/no-duplicate-string */
import test from 'ava';

import {
  extractDisableLineRules,
  extractGlobalDisableRules,
  startsWithDisableFileComment,
} from '../../src/util/comments-handler';

// @ts-ignore TS2349
test('startsWithDisableFileComment should return true when content starts with "# dclint disable-file"', (t) => {
  const content = '# dclint disable-file\nversion: "3"';
  t.true(
    startsWithDisableFileComment(content),
    'Function should return true if content starts with "# dclint disable-file"',
  );
});

// @ts-ignore TS2349
test('startsWithDisableFileComment should return true when content starts with delimiter and "# dclint disable-file"', (t) => {
  const content = '---\n\n# dclint disable-file\nversion: "3"';
  t.true(
    startsWithDisableFileComment(content),
    'Function should return true if content starts with delimiter and "# dclint disable-file"',
  );
});

// @ts-ignore TS2349
test('startsWithDisableFileComment should return false when content does not start with "# dclint disable-file"', (t) => {
  const content = 'version: "3"\n# dclint disable-file';
  t.false(
    startsWithDisableFileComment(content),
    'Function should return false if content does not start with "# dclint disable-file"',
  );
});

// @ts-ignore TS2349
test('startsWithDisableFileComment should return false when content is empty', (t) => {
  const content = '';
  t.false(startsWithDisableFileComment(content), 'Function should return false if content is empty');
});

// @ts-ignore TS2349
test('startsWithDisableFileComment should return false when content starts with different comment', (t) => {
  const content = '# some other comment\nversion: "3"';
  t.false(
    startsWithDisableFileComment(content),
    'Function should return false if content starts with a different comment',
  );
});

// @ts-ignore TS2349
test('extractGlobalDisableRules should disable all rules if # dclint disable is used without specific rules', (t) => {
  const content = `
    # dclint disable
    key: value 1
    key: value 2
  `;
  const result = extractGlobalDisableRules(content);
  t.deepEqual(
    [...result],
    ['*'], // '*' means all rules disabled
    'Should disable all rules for the entire file (comment in the first line)',
  );
});

// @ts-ignore TS2349
test('extractGlobalDisableRules should find disable rules after delimiter', (t) => {
  const content = `
    ---
    
    # dclint disable
    key: value 1
    key: value 2
  `;
  const result = extractGlobalDisableRules(content);
  t.deepEqual(
    [...result],
    ['*'], // '*' means all rules disabled
    'Should disable all rules for the entire file (comment in the line after delimiter)',
  );
});

// @ts-ignore TS2349
test('extractGlobalDisableRules should disable specific rule if # dclint disable rule-name is used', (t) => {
  const content = `
    # dclint disable rule-name
    key: value 1
    key: value 2
  `;
  const result = extractGlobalDisableRules(content);
  t.deepEqual(
    [...result],
    ['rule-name'], // Only "rule-name" should be disabled
    'Should disable only the "rule-name" rule for the entire file (comment in the first line)',
  );
});

// @ts-ignore TS2349
test('extractGlobalDisableRules should disable multiple specific rules if # dclint disable rule-name another-rule-name is used', (t) => {
  const content = `
    # dclint disable rule-name another-rule-name
    key: value 1
    key: value 2
  `;
  const result = extractGlobalDisableRules(content);
  t.deepEqual(
    [...result],
    ['rule-name', 'another-rule-name'], // Both rules should be disabled
    'Should disable "rule-name" and "another-rule-name" for the entire file (comment in the first line)',
  );
});

// @ts-ignore TS2349
test('extractDisableLineRules should correctly extract rules for disabling from a comment on the same line', (t) => {
  const content = `
    key: value 1
    key: value 2  # dclint disable-line no-quotes-in-volumes
    key: value 3
  `;
  const result = extractDisableLineRules(content);
  t.deepEqual(
    [...(result.get(3) || [])],
    ['no-quotes-in-volumes'],
    'Should extract the correct rule ("no-quotes-in-volumes") for the second line',
  );
});

// @ts-ignore TS2349
test('extractDisableLineRules should correctly handle multiple rules for a line on the same line', (t) => {
  const content = `
    key: value 1
    key: value 2  # dclint disable-line no-quotes-in-volumes no-unbound-port-interfaces
    key: value 3
  `;
  const result = extractDisableLineRules(content);
  t.deepEqual(
    [...(result.get(3) || [])],
    ['no-quotes-in-volumes', 'no-unbound-port-interfaces'],
    'Should extract multiple rules ("no-quotes-in-volumes", "no-unbound-port-interfaces") for the second line',
  );
});

// @ts-ignore TS2349
test('extractDisableLineRules should correctly handle rules from a comment on the previous line', (t) => {
  const content = `
    key: value 1
    # dclint disable-line no-quotes-in-volumes
    key: value 2
  `;
  const result = extractDisableLineRules(content);

  t.deepEqual(
    [...(result.get(4) || [])],
    ['no-quotes-in-volumes'],
    'Should extract the correct rule ("no-quotes-in-volumes") for the third line (previous comment)',
  );
});

// @ts-ignore TS2349
test('extractDisableLineRules should correctly handle multiple rules from a comment on the previous line', (t) => {
  const content = `
    key: value 1
    # dclint disable-line no-quotes-in-volumes no-unbound-port-interfaces
    key: value 2
  `;
  const result = extractDisableLineRules(content);
  t.deepEqual(
    [...(result.get(4) || [])],
    ['no-quotes-in-volumes', 'no-unbound-port-interfaces'],
    'Should extract multiple rules ("no-quotes-in-volumes", "no-unbound-port-interfaces") for the third line (previous comment)',
  );
});

// @ts-ignore TS2349
test('extractDisableLineRules should return an empty set if no disable-line comment is present', (t) => {
  const content = `
    key: value 1
    key: value 2
    key: value 3
  `;
  const result = extractDisableLineRules(content);
  t.deepEqual(
    [...(result.get(2) || [])],
    [],
    'Should return an empty set if no disable-line comment is present on that line',
  );
});

// @ts-ignore TS2349
test('extractDisableLineRules should disable all rules for a line with empty disable-line comment', (t) => {
  const content = `
    key: value 1
    key: value 2 # dclint disable-line
    key: value 3
  `;
  const result = extractDisableLineRules(content);
  t.deepEqual(
    [...(result.get(3) || [])],
    ['*'],
    'Should disable all rules when there is no specific rule in the comment',
  );
});

// @ts-ignore TS2349
test('extractDisableLineRules should disable all rules for the next line if the comment is before', (t) => {
  const content = `
    key: value 1
    # dclint disable-line
    key: value 2
  `;
  const result = extractDisableLineRules(content);
  t.deepEqual([...(result.get(4) || [])], ['*'], 'Should disable all rules for the line after the comment');
});
