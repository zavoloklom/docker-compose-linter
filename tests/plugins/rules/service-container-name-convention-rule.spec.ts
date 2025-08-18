import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type ServiceContainerNameConventionIssueContext,
  ServiceContainerNameConventionRule,
} from '../../../src/plugins/rules/service-container-name-convention-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYamlWithDefaultOptions = `
services:
  web:
    image: nginx
    container_name: "my-app-123"
`;

const invalidYamlWithDefaultOptions = `
services:
  web:
    image: nginx
    container_name: "my-app@123"
`;

const yamlToTestOptionContainerNameRegex = `
services:
  web:
    image: nginx
    container_name: "dclint-my-app"
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new ServiceContainerNameConventionRule();
  const issueContext: ServiceContainerNameConventionIssueContext = {
    serviceName: 'service-a',
    containerName: 'container-a',
  };
  const expectedMessage = `Unexpected container name "${issueContext.containerName}" in service "${issueContext.serviceName}". It must match the regex pattern ${rule.options.containerNameRegex}.`;

  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new ServiceContainerNameConventionRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated', (t) => {
  const rule = new ServiceContainerNameConventionRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', containerName: 'my-app@123' }),
      line: 5,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when { containerNameRegex: /^dclint-/gu }', (t) => {
  const rule = new ServiceContainerNameConventionRule({ containerNameRegex: /^dclint-/gu });

  let context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);
  let expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', containerName: 'my-app-123' }),
      line: 5,
    },
  ];
  runRuleTest(t, rule, context, expected);

  context = new YamlComposeDocument(FILE_PATH, yamlToTestOptionContainerNameRegex);
  expected = [];
  runRuleTest(t, rule, context, expected);
});
