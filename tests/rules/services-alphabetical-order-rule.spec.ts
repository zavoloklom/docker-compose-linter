import test from 'ava';
import type { ExecutionContext } from 'ava';
import { parseDocument } from 'yaml';
import ServicesAlphabeticalOrderRule from '../../src/rules/services-alphabetical-order-rule';
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

// Helper function to normalize strings for comparison
const normalizeYAML = (yaml: string) => yaml.replaceAll(/\s+/g, ' ').trim();

// @ts-ignore TS2349
test('ServicesAlphabeticalOrderRule: should return a warning when services are out of order', (t: ExecutionContext) => {
  const rule = new ServicesAlphabeticalOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithIncorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectOrder,
  };

  const errors = rule.check(context);
  t.is(errors.length, 3, 'There should be 3 warnings when services are out of order.');

  // Check error messages
  t.true(errors[0].message.includes('Service "b-service" should be before "database".'));
  t.true(errors[1].message.includes('Service "app" should be before "b-service".'));
  t.true(errors[2].message.includes('Service "cache" should be before "database".'));
});

// @ts-ignore TS2349
test('ServicesAlphabeticalOrderRule: should not return warnings when services are in alphabetical order', (t: ExecutionContext) => {
  const rule = new ServicesAlphabeticalOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithCorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectOrder,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when services are in alphabetical order.');
});

// @ts-ignore TS2349
test('ServicesAlphabeticalOrderRule: should fix the order of services', (t: ExecutionContext) => {
  const rule = new ServicesAlphabeticalOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectOrder);

  // Normalize both YAML strings for comparison
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithCorrectOrder),
    'The services should be reordered alphabetically.',
  );
});
