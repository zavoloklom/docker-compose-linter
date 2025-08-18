import test from 'ava';

import { RuleCategory, RuleSeverity, RuleType } from '../../../src/domain/models/rule';
import { ajvErrorToIssueMapper } from '../../../src/infrastructure/compose-validator/ajv-error-to-issue-mapper';

import type { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import type { ErrorObject } from 'ajv/lib/types';

test('maps AJV error to LintIssue with default location when not found', (t) => {
  const document = {
    getNodeLocation: (path: string[]) => {},
  } as YamlComposeDocument;

  const error = {
    keyword: 'additionalProperties',
    instancePath: '/services/web/fake',
    schemaPath: '#/properties',
    message: 'should be string',
    params: { type: 'string' },
  } as ErrorObject;

  const issue = ajvErrorToIssueMapper(document, error);

  t.is(issue.ruleId, 'invalid-schema');
  t.is(issue.type, RuleType.ERROR);
  t.is(issue.category, RuleCategory.SYNTAX);
  t.is(issue.severity, RuleSeverity.CRITICAL);
  t.false(issue.fixable);
  t.deepEqual(issue.meta, {
    description: 'An error encountered while validating against Compose Schema.',
    url: 'https://github.com/compose-spec/compose-spec/blob/main/schema/compose-spec.json',
  });
  t.is(
    issue.message,
    `YAML content violates specified JSON schema: instancePath="${error.instancePath}", schemaPath="${error.schemaPath}", message="${error.message}".`,
  );

  // Default when location not found
  t.is(issue.line, 1);
  t.is(issue.column, 1);
  t.is(issue.endLine, 1);
  t.is(issue.endColumn, 1);

  // Context
  t.deepEqual(issue.context, {
    source: 'ajv',
    instancePath: error.instancePath,
    params: error.params,
    keyword: error.keyword,
    schemaPath: error.schemaPath,
  });
});

test('maps AJV error to LintIssue using resolved node location', (t) => {
  const location = {
    line: 10,
    column: 5,
    endLine: 10,
    endColumn: 20,
  };
  const document = {
    getNodeLocation: (path: string[]) => {
      t.deepEqual(path, ['', 'services', 'web', 'ports', '0']); // Split('/')
      return location;
    },
  } as YamlComposeDocument;

  const error = {
    keyword: 'type',
    instancePath: '/services/web/ports/0',
    schemaPath: '#/properties/services/.../items',
    message: 'must be integer',
    params: { type: 'integer' },
  } as ErrorObject;

  const issue = ajvErrorToIssueMapper(document, error);

  // Check location
  t.is(issue.line, location.line);
  t.is(issue.column, location.column);
  t.is(issue.endLine, location.endLine);
  t.is(issue.endColumn, location.endColumn);

  // Other
  t.is(issue.type, RuleType.ERROR);
  t.is(issue.category, RuleCategory.SYNTAX);
  t.is(issue.severity, RuleSeverity.CRITICAL);
  t.true(issue.message.includes(`instancePath="${error.instancePath}"`));
  t.true(issue.message.includes(`message="${error.message}"`));
});
