import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type NoDuplicateContainerNamesIssueContext,
  NoDuplicateContainerNamesRule,
} from '../../../src/plugins/rules/no-duplicate-container-names-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
services:
  web:
    image: nginx
    container_name: web_container
  db:
    image: postgres
    container_name: db_container
`;

const invalidYaml = `
services:
  web:
    image: nginx
    container_name: my_container
  db:
    image: postgres
    container_name: my_container
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new NoDuplicateContainerNamesRule();
  const issueContext: NoDuplicateContainerNamesIssueContext = {
    serviceName: 'a-service',
    containerName: 'my-container',
    conflictingService: 'b-service',
  };
  const expectedMessage = `Unexpected duplicate container name "${issueContext.containerName}" in service "${issueContext.serviceName}". It conflicts with service "${issueContext.conflictingService}".`;

  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new NoDuplicateContainerNamesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated', (t) => {
  const rule = new NoDuplicateContainerNamesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'db', containerName: 'my_container', conflictingService: 'web' }),
      line: 8,
    },
  ];
  runRuleTest(t, rule, context, expected);
});
