import test from 'ava';

import { RequireQuotesInPortsRule } from '../../src/rules/require-quotes-in-ports-rule';
import { normalizeYAML, runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// Sample YAML for tests
const yamlWithoutQuotes = `
services:
  web:
    ports:
      - 80
      - 8080:80
    expose:
      - 3000  
`;

const yamlWithSingleQuotes = `
services:
  web:
    ports:
      - '80'
      - '8080:80'
    expose:
      - '3000' 
`;

const yamlWithDoubleQuotes = `
services:
  web:
    ports:
      - "80"
      - "8080:80"
    expose:
      - "3000" 
`;

const yamlWithoutPorts = `
services:
  web:
    image: nginx
`;

const pathToFile = '/docker-compose.yml';

test('RequireQuotesInPortsRule: should return a warning when ports are not quoted', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });
  const context: LintContext = {
    path: pathToFile,
    content: {},
    sourceCode: yamlWithoutQuotes,
  };

  const expectedMessages = [rule.getMessage(), rule.getMessage(), rule.getMessage()];
  runRuleTest(t, rule, context, expectedMessages);
});

test('RequireQuotesInPortsRule: should not return warnings when ports are quoted with single quotes', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });
  const context: LintContext = {
    path: pathToFile,
    content: {},
    sourceCode: yamlWithSingleQuotes,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

test('RequireQuotesInPortsRule: should not return warnings when ports are quoted with double quotes', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });
  const context: LintContext = {
    path: pathToFile,
    content: {},
    sourceCode: yamlWithDoubleQuotes,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

test('RequireQuotesInPortsRule: should handle absence of ports and expose sections gracefully', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });
  const context: LintContext = {
    path: pathToFile,
    content: {},
    sourceCode: yamlWithoutPorts,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

test('RequireQuotesInPortsRule: should fix unquoted ports by adding single quotes and not modify already quoted ports', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });

  const fixedYAML = rule.fix(yamlWithoutQuotes);
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithSingleQuotes),
    'The Ports in `ports` and `expose` sections should be quoted with single quotes.',
  );
});

test('RequireQuotesInPortsRule: should fix double quotes ports by changing them to single quotes', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });

  const fixedYAML = rule.fix(yamlWithDoubleQuotes);
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithSingleQuotes),
    'The Ports in `ports` and `expose` sections should be quoted with single quotes.',
  );
});

test('RequireQuotesInPortsRule: should fix unquoted ports by adding double quotes and not modify already quoted ports', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });

  const fixedYAML = rule.fix(yamlWithoutQuotes);
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithDoubleQuotes),
    'The Ports in `ports` and `expose` sections should be quoted with double quotes.',
  );
});

test('RequireQuotesInPortsRule: should fix single quotes ports by changing them to double quotes', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });

  const fixedYAML = rule.fix(yamlWithSingleQuotes);
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithDoubleQuotes),
    'The Ports in `ports` and `expose` sections should be quoted with double quotes.',
  );
});
