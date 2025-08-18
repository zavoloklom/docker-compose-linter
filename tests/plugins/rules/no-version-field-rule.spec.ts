import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import { NoVersionFieldRule } from '../../../src/plugins/rules/no-version-field-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
services:
  web:
    image: nginx
`;

const invalidYaml = `
version: '3'
services:
  web:
    image: nginx
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new NoVersionFieldRule();
  const expectedMessage = 'Unexpected top-level property "version" in the configuration.';

  t.regex(rule.getMessage(), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new NoVersionFieldRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated', (t) => {
  const rule = new NoVersionFieldRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage(),
      line: 2,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('fix(): should fix YAML correctly', (t) => {
  const rule = new NoVersionFieldRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.true(rule.fixable);
  t.false(fixedYaml.includes('version:'));
  t.is(fixedYaml.trim(), correctYaml.trim());
});

test('fix(): should not modify correct YAML', (t) => {
  const rule = new NoVersionFieldRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.true(rule.fixable);
  t.is(fixedYaml.trim(), correctYaml.trim());
});
