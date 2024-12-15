import test from 'ava';
import type { ExecutionContext } from 'ava';
import { normalizeYAML } from '../test-utils';
import RequireQuotesInPortsRule from '../../src/rules/require-quotes-in-ports-rule';
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

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should return a warning when ports are not quoted', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });
  const context: LintContext = {
    path: pathToFile,
    content: {},
    sourceCode: yamlWithoutQuotes,
  };

  const errors = rule.check(context);
  t.is(errors.length, 3, 'There should be one warning when ports are not quoted.');

  const expectedMessage = 'Ports in `ports` and `expose` sections should be enclosed in quotes.';

  errors.forEach((error, index) => {
    t.true(error.message.includes(expectedMessage));
  });
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should not return warnings when ports are quoted with single quotes', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });
  const context: LintContext = {
    path: pathToFile,
    content: {},
    sourceCode: yamlWithSingleQuotes,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when ports are quoted with single quotes.');
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should not return warnings when ports are quoted with double quotes', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });
  const context: LintContext = {
    path: pathToFile,
    content: {},
    sourceCode: yamlWithDoubleQuotes,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when ports are quoted with double quotes.');
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should handle absence of ports and expose sections gracefully', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });
  const context: LintContext = {
    path: pathToFile,
    content: {},
    sourceCode: yamlWithoutPorts,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when `ports` and `expose` sections are absent.');
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should fix unquoted ports by adding single quotes and not modify already quoted ports', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });

  const fixedYAML = rule.fix(yamlWithoutQuotes);
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithSingleQuotes),
    'The Ports in `ports` and `expose` sections should be quoted with single quotes.',
  );
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should fix double quotes ports by changing them to single quotes', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });

  const fixedYAML = rule.fix(yamlWithDoubleQuotes);
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithSingleQuotes),
    'The Ports in `ports` and `expose` sections should be quoted with single quotes.',
  );
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should fix unquoted ports by adding double quotes and not modify already quoted ports', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });

  const fixedYAML = rule.fix(yamlWithoutQuotes);
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithDoubleQuotes),
    'The Ports in `ports` and `expose` sections should be quoted with double quotes.',
  );
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should fix single quotes ports by changing them to double quotes', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });

  const fixedYAML = rule.fix(yamlWithSingleQuotes);
  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithDoubleQuotes),
    'The Ports in `ports` and `expose` sections should be quoted with double quotes.',
  );
});
