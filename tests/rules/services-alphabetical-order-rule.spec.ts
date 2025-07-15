import test from 'ava';
import { parseDocument } from 'yaml';

import ServicesAlphabeticalOrderRule from '../../src/rules/services-alphabetical-order-rule';
import { normalizeYAML, runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// Sample YAML for tests
const yamlWithIncorrectOrder = `
services:
  database:
    image: postgres
  b-service:
    image: nginx
  app:
    image: node
  cache:
    image: redis
  elastic:
    image: elastic
`;

const yamlWithCorrectOrder = `
services:
  app:
    image: node
  b-service:
    image: nginx
  cache:
    image: redis
  database:
    image: postgres
  elastic:
    image: elastic
`;

// @ts-ignore TS2349
test('ServicesAlphabeticalOrderRule: should return a warning when services are out of order', (t) => {
  const rule = new ServicesAlphabeticalOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithIncorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectOrder,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'b-service', misplacedBefore: 'database' }),
    rule.getMessage({ serviceName: 'app', misplacedBefore: 'b-service' }),
    rule.getMessage({ serviceName: 'cache', misplacedBefore: 'database' }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('ServicesAlphabeticalOrderRule: should not return warnings when services are in alphabetical order', (t) => {
  const rule = new ServicesAlphabeticalOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithCorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectOrder,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('ServicesAlphabeticalOrderRule: should fix the order of services', (t) => {
  const rule = new ServicesAlphabeticalOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectOrder);

  // Normalize both YAML strings for comparison
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithCorrectOrder),
    'The services should be reordered alphabetically.',
  );
});
