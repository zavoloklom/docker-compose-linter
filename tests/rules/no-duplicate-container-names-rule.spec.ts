import test from 'ava';
import { parseDocument } from 'yaml';

import NoDuplicateContainerNamesRule from '../../src/rules/no-duplicate-container-names-rule';
import { runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// YAML с дублирующимися именами контейнеров
const yamlWithDuplicateContainerNames = `
services:
  web:
    image: nginx
    container_name: my_container
  db:
    image: postgres
    container_name: my_container
`;

// YAML с уникальными именами контейнеров
const yamlWithUniqueContainerNames = `
services:
  web:
    image: nginx
    container_name: web_container
  db:
    image: postgres
    container_name: db_container
`;

// @ts-ignore TS2349
test('NoDuplicateContainerNamesRule: should return an error when duplicate container names are found', (t) => {
  const rule = new NoDuplicateContainerNamesRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithDuplicateContainerNames).toJS() as Record<string, unknown>,
    sourceCode: yamlWithDuplicateContainerNames,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'db', containerName: 'my_container', anotherService: 'web' }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoDuplicateContainerNamesRule: should not return errors when container names are unique', (t) => {
  const rule = new NoDuplicateContainerNamesRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithUniqueContainerNames).toJS() as Record<string, unknown>,
    sourceCode: yamlWithUniqueContainerNames,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});
