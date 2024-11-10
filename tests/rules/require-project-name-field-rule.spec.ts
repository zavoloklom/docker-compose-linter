import test from 'ava';
import type { ExecutionContext } from 'ava';
import RequireProjectNameFieldRule from '../../src/rules/require-project-name-field-rule.js';
import type { LintContext } from '../../src/linter/linter.types.js';

// Sample YAML for tests
const yamlWithName = `
name: my-project
services:
  web:
    image: nginx
`;

const yamlWithoutName = `
services:
  web:
    image: nginx
`;

// @ts-ignore TS2349
test('RequiredProjectNameFieldRule: should return a warning when "name" field is missing', (t: ExecutionContext) => {
  const rule = new RequireProjectNameFieldRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: {
      services: {
        web: {
          image: 'nginx',
        },
      },
    },
    sourceCode: yamlWithoutName,
  };

  const errors = rule.check(context);
  t.is(errors.length, 1, 'There should be one warning when the "name" field is missing.');
  t.is(errors[0].message, 'The "name" field should be present.');
  t.is(errors[0].rule, 'require-project-name-field');
  t.is(errors[0].severity, 'minor');
});

// @ts-ignore TS2349
test('RequiredProjectNameFieldRule: should not return warnings when "name" field is present', (t: ExecutionContext) => {
  const rule = new RequireProjectNameFieldRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: {
      name: 'my-project',
      services: {
        web: {
          image: 'nginx',
        },
      },
    },
    sourceCode: yamlWithName,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when the "name" field is present.');
});
