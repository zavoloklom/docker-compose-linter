import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type NoBuildAndImageIssueContext,
  NoBuildAndImageRule,
} from '../../../src/plugins/rules/no-build-and-image-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYamlWithDefaultOptions = `
services:
  web:
    build: .
  nginx:
    image: nginx
  db:
    build: ./db
    image: postgres
    pull_policy: always
`;

const invalidYamlWithDefaultOptions = `
services:
  web:
    build: .
    image: nginx
  db:
    build: ./db
    image: postgres
`;

const yamlToTestOptionPullPolicy = `
services:
  db:
    image: postgres
    build: ./db
    pull_policy: always
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new NoBuildAndImageRule();
  const issueContext: NoBuildAndImageIssueContext = { serviceName: 'value' };
  const expectedMessage = `Unexpected simultaneous use of "build" and "image" properties in service "${issueContext.serviceName}".`;

  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new NoBuildAndImageRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated', (t) => {
  const rule = new NoBuildAndImageRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web' }),
      line: 4,
    },
    {
      message: rule.getMessage({ serviceName: 'db' }),
      line: 7,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return an error when checkPullPolicy is false', (t) => {
  const rule = new NoBuildAndImageRule({ checkPullPolicy: false });
  const context = new YamlComposeDocument(FILE_PATH, yamlToTestOptionPullPolicy);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'db' }),
      line: 5,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should not return an error when checkPullPolicy is true', (t) => {
  const rule = new NoBuildAndImageRule({ checkPullPolicy: true });
  const context = new YamlComposeDocument(FILE_PATH, yamlToTestOptionPullPolicy);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});
