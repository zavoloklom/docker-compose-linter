import test from 'ava';

import { RuleCategory, RuleSeverity, RuleType } from '../../../src/domain/models/rule';
import { yamlErrorToIssueMapper } from '../../../src/infrastructure/yaml/yaml-error-to-issue-mapper';

import type { YAMLError } from 'yaml';

test('maps YAML error without linePos to defaults', (t) => {
  const error = {
    name: 'YAMLParseError',
    code: 'BAD_INDENT',
    message: 'Unexpected token at document start',
    pos: [0, 0],
  } as YAMLError;

  const issue = yamlErrorToIssueMapper(error);

  // Core fields
  t.is(issue.ruleId, 'invalid-yaml');
  t.is(issue.type, RuleType.ERROR);
  t.is(issue.category, RuleCategory.SYNTAX);
  t.is(issue.severity, RuleSeverity.CRITICAL);

  // Message format
  t.is(issue.message, `${error.code}. Invalid YAML format. ${error.message}`);

  // Meta
  t.deepEqual(issue.meta, {
    description: 'An error encountered while parsing a source as YAML.',
    url: 'https://eemeli.org/yaml/#errors',
  });

  // Defaults when no position is provided
  t.is(issue.line, 1);
  t.is(issue.column, 1);

  // Other flags/context
  t.false(issue.fixable);
  t.deepEqual(issue.context, {
    source: 'yaml',
    code: error.code,
  });
});

test('maps YAML error with object linePos', (t) => {
  const location = { line: 8, col: 4 };
  const error = {
    name: 'YAMLParseError',
    code: 'BAD_INDENT',
    message: 'Bad indentation of a sequence entry',
    linePos: [location, { line: 12, col: 10 }],
    pos: [0, 0],
  } as YAMLError;

  const issue = yamlErrorToIssueMapper(error);

  // Position taken from object
  t.is(issue.line, location.line);
  t.is(issue.column, location.col);

  // Sanity checks
  t.is(issue.type, RuleType.ERROR);
  t.is(issue.category, RuleCategory.SYNTAX);
  t.true(issue.message.includes(error.code));
  t.true(issue.message.includes(error.message));
});
