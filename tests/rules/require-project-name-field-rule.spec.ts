import test from 'ava';

import { RequireProjectNameFieldRule } from '../../src/rules/require-project-name-field-rule';
import { runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

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

test('RequiredProjectNameFieldRule: should return a warning when "name" field is missing', (t) => {
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

  const expectedMessages = [rule.getMessage()];
  runRuleTest(t, rule, context, expectedMessages);
});

test('RequiredProjectNameFieldRule: should not return warnings when "name" field is present', (t) => {
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

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});
