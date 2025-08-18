import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type RequireQuotesInPortsIssueContext,
  RequireQuotesInPortsRule,
} from '../../../src/plugins/rules/require-quotes-in-ports-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYamlWithDefaultOptions = `
services:
  web:
    ports:
      - '80'
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
      - '8080:80'
    expose:
      - '3000' 
`;

const invalidYamlWithDefaultOptions = `
services:
  web:
    ports:
      - 80
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
      - 8080:80
    expose:
      - 3000  
`;

const yamlToTestOptionQuoteTypeDouble = `
services:
  web:
    ports:
      - "80"
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
      - "8080:80"
    expose:
      - "3000" 
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new RequireQuotesInPortsRule();
  let issueContext: RequireQuotesInPortsIssueContext = {
    serviceName: 'service-a',
    section: 'expose',
    port: '8080',
    hasQuotes: false,
  };
  let expectedMessage = `Expected quotes around port "${issueContext.port}" in section "${issueContext.section}" in service "${issueContext.serviceName}".`;

  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);

  issueContext = {
    serviceName: 'service-a',
    section: 'expose',
    port: '8080',
    hasQuotes: true,
  };
  expectedMessage = `Unexpected quotes type around port "${issueContext.port}" in section "${issueContext.section}" in service "${issueContext.serviceName}".`;

  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new RequireQuotesInPortsRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated', (t) => {
  const rule = new RequireQuotesInPortsRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', section: 'ports', port: '80', hasQuotes: false }),
      line: 5,
    },
    {
      message: rule.getMessage({ serviceName: 'web', section: 'ports', port: '8080:80', hasQuotes: false }),
      line: 10,
    },
    {
      message: rule.getMessage({ serviceName: 'web', section: 'expose', port: '3000', hasQuotes: false }),
      line: 12,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when { quoteType: "double" }', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', section: 'ports', port: '80', hasQuotes: true }),
      line: 5,
    },
    {
      message: rule.getMessage({ serviceName: 'web', section: 'ports', port: '8080:80', hasQuotes: true }),
      line: 10,
    },
    {
      message: rule.getMessage({ serviceName: 'web', section: 'expose', port: '3000', hasQuotes: true }),
      line: 12,
    },
  ];
  runRuleTest(t, rule, context, expected);

  const correctDoubleQuotes = new YamlComposeDocument(FILE_PATH, yamlToTestOptionQuoteTypeDouble);
  runRuleTest(t, rule, correctDoubleQuotes, []);
});

test('fix(): should fix YAML correctly', (t) => {
  const rule = new RequireQuotesInPortsRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlWithDefaultOptions);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.true(rule.fixable);
  t.is(fixedYaml.trim(), correctYamlWithDefaultOptions.trim());
});

test('fix(): should not modify correct YAML', (t) => {
  const rule = new RequireQuotesInPortsRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), correctYamlWithDefaultOptions.trim());
});

test('fix(): should fix YAML correctly when { quoteType: "double" }', (t) => {
  const rule = new RequireQuotesInPortsRule({ quoteType: 'double' });
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), yamlToTestOptionQuoteTypeDouble.trim());
});
