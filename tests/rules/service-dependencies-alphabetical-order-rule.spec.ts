import test from 'ava';
import type { ExecutionContext } from 'ava';
import { parseDocument } from 'yaml';
import ServiceDependenciesAlphabeticalOrderRule from '../../src/rules/service-dependencies-alphabetical-order-rule';
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

// Helper function to normalize YAML
const normalizeYAML = (yaml: string) => yaml.replaceAll(/\s+/g, ' ').trim();

const filePath = '/docker-compose.yml';

// Short syntax tests
// @ts-ignore TS2349
test('ServiceDependenciesAlphabeticalOrderRule: should return a warning when short syntax services are not in alphabetical order', (t: ExecutionContext) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithIncorrectShortSyntax).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectShortSyntax,
  };

  const errors = rule.check(context);
  t.is(errors.length, 1, 'There should be one warning when short syntax services are out of order.');
  t.true(errors[0].message.includes(`Services in "depends_on" for service "web" should be in alphabetical order.`));
});

// @ts-ignore TS2349
test('ServiceDependenciesAlphabeticalOrderRule: should not return warnings when short syntax services are in alphabetical order', (t: ExecutionContext) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithCorrectShortSyntax).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectShortSyntax,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when short syntax services are in alphabetical order.');
});

// @ts-ignore TS2349
test('ServiceDependenciesAlphabeticalOrderRule: should fix the order of short syntax services', (t: ExecutionContext) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectShortSyntax);

  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithCorrectShortSyntax),
    'The short syntax services should be reordered alphabetically.',
  );
});

// Long syntax tests
// @ts-ignore TS2349
test('ServiceDependenciesAlphabeticalOrderRule: should return a warning when long syntax services are not in alphabetical order', (t: ExecutionContext) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithIncorrectLongSyntax).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectLongSyntax,
  };

  const errors = rule.check(context);
  t.is(errors.length, 1, 'There should be one warning when long syntax services are out of order.');
  t.true(errors[0].message.includes(`Services in "depends_on" for service "web" should be in alphabetical order.`));
});

// @ts-ignore TS2349
test('ServiceDependenciesAlphabeticalOrderRule: should not return warnings when long syntax services are in alphabetical order', (t: ExecutionContext) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithCorrectLongSyntax).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectLongSyntax,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when long syntax services are in alphabetical order.');
});

// @ts-ignore TS2349
test('ServiceDependenciesAlphabeticalOrderRule: should fix the order of long syntax services', (t: ExecutionContext) => {
  const rule = new ServiceDependenciesAlphabeticalOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectLongSyntax);

  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithCorrectLongSyntax),
    'The long syntax services should be reordered alphabetically.',
  );
});
