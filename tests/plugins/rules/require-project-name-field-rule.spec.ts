import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import { RequireProjectNameFieldRule } from '../../../src/plugins/rules/require-project-name-field-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
name: my-project
services:
  web:
    image: nginx
`;

const invalidYaml = `
services:
  web:
    image: nginx
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new RequireProjectNameFieldRule();
  const expectedMessage = 'Expected top-level property "name" in the configuration.';

  t.regex(rule.getMessage(), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new RequireProjectNameFieldRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated', (t) => {
  const rule = new RequireProjectNameFieldRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage(),
      line: 1,
    },
  ];
  runRuleTest(t, rule, context, expected);
});
