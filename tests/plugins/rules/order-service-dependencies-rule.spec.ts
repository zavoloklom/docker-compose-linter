import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type OrderServiceDependenciesIssueContext,
  OrderServiceDependenciesRule,
} from '../../../src/plugins/rules/order-service-dependencies-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
services:
  web:
    image: nginx
    depends_on:
      - db
      - redis
  db:
    image: postgres
  redis:
    image: redis
`;

const invalidYaml = `
services:
  web:
    image: nginx
    depends_on:
      - redis
      - db
  db:
    image: postgres
  redis:
    image: redis
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message structure', (t) => {
  const rule = new OrderServiceDependenciesRule();
  const issueContext: OrderServiceDependenciesIssueContext = {
    serviceName: 'web',
    dependency: 'db',
    misplacedAfter: 'redis',
  };

  const expectedMessage = `Unexpected order of depends_on value "${issueContext.dependency}" after "${issueContext.misplacedAfter}" in service "${issueContext.serviceName}".`;
  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);
});

test('check(): should not return errors for a compliant compose file (short syntax, alphabetical)', (t) => {
  const rule = new OrderServiceDependenciesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return an error when depends_on items are out of order (short syntax)', (t) => {
  const rule = new OrderServiceDependenciesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', dependency: 'db', misplacedAfter: 'redis' }),
      line: 7,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('fix(): should reorder short-syntax depends_on alphabetically', (t) => {
  const rule = new OrderServiceDependenciesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  // Ensure the list is reordered so "- db" comes before "- redis"
  const databaseIndex = fixedYaml.indexOf('- db');
  const redisIndex = fixedYaml.indexOf('- redis');

  t.true(databaseIndex !== -1 && redisIndex !== -1, 'Both dependencies should be present after fix.');
  t.true(databaseIndex < redisIndex, '"- db" should precede "- redis" after fix.');
});

test('fix(): should not modify correct YAML', (t) => {
  const rule = new OrderServiceDependenciesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), correctYaml.trim());
});

// Edge case: long syntax should not be ignored by this rule
const longSyntaxYaml = `
services:
  web:
    image: nginx
    depends_on:
      redis:
        condition: service_started
      db:
        condition: service_healthy
  db:
    image: postgres
  redis:
    image: redis
  a-service:
    image: nginx  
`;
const longSyntaxYamlCorrect = `
services:
  web:
    image: nginx
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
  db:
    image: postgres
  redis:
    image: redis
  a-service:
    image: nginx  
`;

test('check()/fix(): should find errors and reorder long-syntax depends_on (mapping)', (t) => {
  const rule = new OrderServiceDependenciesRule();
  const context = new YamlComposeDocument(FILE_PATH, longSyntaxYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', dependency: 'db', misplacedAfter: 'redis' }),
      line: 8,
    },
  ];
  runRuleTest(t, rule, context, expected);

  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), longSyntaxYamlCorrect.trim());
});
