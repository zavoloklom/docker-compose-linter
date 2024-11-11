import test from 'ava';
import type { ExecutionContext } from 'ava';
import RequireQuotesInPortsRule from '../../src/rules/require-quotes-in-ports-rule.js';
import type { LintContext } from '../../src/linter/linter.types.js';

// Sample YAML for tests
const yamlWithoutQuotes = `
services:
  web:
    ports:
      - 8080:80
`;

const yamlWithSingleQuotes = `
services:
  web:
    ports:
      - '8080:80'
`;

const yamlWithDoubleQuotes = `
services:
  web:
    ports:
      - "8080:80"
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
  t.is(errors.length, 1, 'There should be one warning when ports are not quoted.');
  t.is(
    errors[0].message,
    'Ports in `ports` and `expose` sections should be enclosed in quotes.',
  );
  t.is(errors[0].rule, 'require-quotes-in-ports');
  t.is(errors[0].severity, 'minor');
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
test('RequireQuotesInPortsRule: should fix unquoted ports by adding single quotes and not modify already quoted ports', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });

  const fixedYAML = rule.fix(yamlWithoutQuotes);
  t.true(
    fixedYAML.includes(`'8080:80'`),
    'The Ports in `ports` and `expose` sections should be quoted with single quotes.',
  );
  t.false(fixedYAML.includes('ports:\n      - 8080:80'), 'The unquoted ports should no longer exist.');
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should fix double quotes ports by changing them to single quotes', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'single' });

  const fixedYAML = rule.fix(yamlWithSingleQuotes);
  t.true(
    fixedYAML.includes(`'8080:80'`),
    'The Ports in `ports` and `expose` sections should be quoted with single quotes.',
  );
  t.false(fixedYAML.includes(`"8080:80"`), 'The ports should not have double quotes.');
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should fix unquoted ports by adding double quotes and not modify already quoted ports', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });

  const fixedYAML = rule.fix(yamlWithoutQuotes);
  t.true(
    fixedYAML.includes(`"8080:80"`),
    'The Ports in `ports` and `expose` sections should be quoted with double quotes.',
  );
  t.false(fixedYAML.includes('ports:\n      - 8080:80'), 'The unquoted ports should no longer exist.');
});

// @ts-ignore TS2349
test('RequireQuotesInPortsRule: should fix single quotes ports by changing them to double quotes', (t: ExecutionContext) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });

  const fixedYAML = rule.fix(yamlWithSingleQuotes);
  t.true(
    fixedYAML.includes(`"8080:80"`),
    'The Ports in `ports` and `expose` sections should be quoted with double quotes.',
  );
  t.false(fixedYAML.includes(`'8080:80'`), 'The ports should not have single quotes.');
});
