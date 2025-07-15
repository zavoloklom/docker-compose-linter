import test from 'ava';
import { parseDocument } from 'yaml';

import ServiceContainerNameRegexRule from '../../src/rules/service-container-name-regex-rule';

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

// @ts-ignore TS2349
test('ServiceContainerNameRegexRule: should return an error for invalid container name', (t) => {
  const rule = new ServiceContainerNameRegexRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithInvalidContainerName).toJS() as Record<string, unknown>,
    sourceCode: yamlWithInvalidContainerName,
  };

  const errors = rule.check(context);
  t.is(errors.length, 1, 'There should be one error when the container name is invalid.');

  const expectedMessage =
    'Service "web" has an invalid container name "my-app@123". It must match the regex pattern /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/.';
  t.true(errors[0].message.includes(expectedMessage));
});

// @ts-ignore TS2349
test('ServiceContainerNameRegexRule: should not return an error for valid container name', (t) => {
  const rule = new ServiceContainerNameRegexRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithValidContainerName).toJS() as Record<string, unknown>,
    sourceCode: yamlWithValidContainerName,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no errors when the container name is valid.');
});
