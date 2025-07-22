import test from 'ava';
import { parseDocument } from 'yaml';

import { ServiceContainerNameRegexRule } from '../../src/rules/service-container-name-regex-rule';
import { runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// YAML with incorrect syntax
const yamlWithInvalidContainerName = `
services:
  web:
    image: nginx
    container_name: "my-app@123"
`;

// YAML with correct syntax
const yamlWithValidContainerName = `
services:
  web:
    image: nginx
    container_name: "my-app-123"
`;

test('ServiceContainerNameRegexRule: should return an error for invalid container name', (t) => {
  const rule = new ServiceContainerNameRegexRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithInvalidContainerName).toJS() as Record<string, unknown>,
    sourceCode: yamlWithInvalidContainerName,
  };

  const expectedMessages = [rule.getMessage({ serviceName: 'web', containerName: 'my-app@123' })];
  runRuleTest(t, rule, context, expectedMessages);
});

test('ServiceContainerNameRegexRule: should not return an error for valid container name', (t) => {
  const rule = new ServiceContainerNameRegexRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithValidContainerName).toJS() as Record<string, unknown>,
    sourceCode: yamlWithValidContainerName,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});
