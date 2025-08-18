import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import { type OrderServicesIssueContext, OrderServicesRule } from '../../../src/plugins/rules/order-services-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
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

const invalidYaml = `
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

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide exact message via getMessage(context)', (t) => {
  const rule = new OrderServicesRule();
  const context: OrderServicesIssueContext = {
    serviceName: 'api',
    misplacedAfter: 'db',
  };

  const expectedMessage = rule.getMessage(context);
  t.is(expectedMessage, `Unexpected order of service "${context.serviceName}" after "${context.misplacedAfter}".`);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new OrderServicesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return an error when services are out of order', (t) => {
  const rule = new OrderServicesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'b-service', misplacedAfter: 'database' }),
      line: 5,
    },
    {
      message: rule.getMessage({ serviceName: 'app', misplacedAfter: 'b-service' }),
      line: 7,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('fix(): should reorder services alphabetically', (t) => {
  const rule = new OrderServicesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), correctYaml.trim());
});

test('fix(): should not modify correct YAML', (t) => {
  const rule = new OrderServicesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), correctYaml.trim());
});
