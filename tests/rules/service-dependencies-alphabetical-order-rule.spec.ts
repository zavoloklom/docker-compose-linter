import test from 'ava';
import { parseDocument } from 'yaml';

import { ServiceDependenciesAlphabeticalOrderRule } from '../../src/rules/service-dependencies-alphabetical-order-rule';
import { normalizeYAML, runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// YAML with short syntax (incorrect order)
const yamlWithIncorrectShortSyntax = `
services:
  web:
    image: nginx
    depends_on:
      - redis
      - db
`;

// YAML with short syntax (correct order)
const yamlWithCorrectShortSyntax = `
services:
  web:
    image: nginx
    depends_on:
      - db
      - redis
`;

// YAML with long syntax (incorrect order)
const yamlWithIncorrectLongSyntax = `
services:
  web:
    image: nginx
    depends_on:
      redis:
        condition: service_started
      db:
        condition: service_healthy
`;

// YAML with long syntax (correct order)
const yamlWithCorrectLongSyntax = `
services:
  web:
    image: nginx
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
`;

const filePath = '/docker-compose.yml';

test('ServiceDependenciesAlphabeticalOrderRule: should return a warning when short syntax services are not in alphabetical order', (t) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithIncorrectShortSyntax).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectShortSyntax,
  };

  const expectedMessages = [rule.getMessage({ serviceName: 'web' })];
  runRuleTest(t, rule, context, expectedMessages);
});

test('ServiceDependenciesAlphabeticalOrderRule: should not return warnings when short syntax services are in alphabetical order', (t) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithCorrectShortSyntax).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectShortSyntax,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

test('ServiceDependenciesAlphabeticalOrderRule: should fix the order of short syntax services', (t) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectShortSyntax);

  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithCorrectShortSyntax),
    'The short syntax services should be reordered alphabetically.',
  );
});

test('ServiceDependenciesAlphabeticalOrderRule: should return a warning when long syntax services are not in alphabetical order', (t) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithIncorrectLongSyntax).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectLongSyntax,
  };

  const expectedMessages = [rule.getMessage({ serviceName: 'web' })];
  runRuleTest(t, rule, context, expectedMessages);
});

test('ServiceDependenciesAlphabeticalOrderRule: should not return warnings when long syntax services are in alphabetical order', (t) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithCorrectLongSyntax).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectLongSyntax,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

test('ServiceDependenciesAlphabeticalOrderRule: should fix the order of long syntax services', (t) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectLongSyntax);

  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithCorrectLongSyntax),
    'The long syntax services should be reordered alphabetically.',
  );
});
