import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type OrderServicePortsIssueContext,
  OrderServicePortsRule,
} from '../../../src/plugins/rules/order-service-ports-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
services:
  web:
    image: nginx
    ports:
      - "80:$PORT"
      - "79"
      - 80:80
      - '81'
      - 1001:443
      - published: 8082
        target: 1000
        protocol: tcp
        mode: host
      - "3000-3005"
      - "127.0.0.1:8001:8001"
      - 0.0.0.0:8002:8002
      - 8080:8080
      - "9090-9091:8080-8081"
`;

const invalidYaml = `
services:
  web:
    image: nginx
    ports:
      - "79"
      - 80:80
      - 8080:8080
      - "3000-3005"
      - "80:$PORT"
      - 0.0.0.0:8002:8002
      - "9090-9091:8080-8081"
      - "127.0.0.1:8001:8001"
      - 1001:443
      - published: 8082
        target: 1000
        protocol: tcp
        mode: host
      - '81'
`;

const invalidYamlMulti = `
services:
  web:
    image: nginx
    ports:
      - "81"
      - "80:80"
      - "79"
  api:
    image: nginx
    ports:
      - "8081:81"
      - "8080:80"
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide exact message via getMessage(context)', (t) => {
  const rule = new OrderServicePortsRule();
  const issueContext: OrderServicePortsIssueContext = {
    serviceName: 'web',
    containerPort: '79',
    misplacedAfter: '81',
  };

  const expectedMessage = rule.getMessage(issueContext);
  t.is(
    expectedMessage,
    `Unexpected order of container port "${issueContext.containerPort}" after "${issueContext.misplacedAfter}" in service "${issueContext.serviceName}".`,
  );
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new OrderServicePortsRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when ports are out of order (single service)', (t) => {
  const rule = new OrderServicePortsRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', containerPort: '3000-3005', misplacedAfter: '8080' }),
      line: 9,
    },
    {
      message: rule.getMessage({ serviceName: 'web', containerPort: '$PORT', misplacedAfter: '3000-3005' }),
      line: 10,
    },
    {
      message: rule.getMessage({ serviceName: 'web', containerPort: '8001', misplacedAfter: '8080-8081' }),
      line: 13,
    },
    {
      message: rule.getMessage({ serviceName: 'web', containerPort: '443', misplacedAfter: '8001' }),
      line: 14,
    },
    {
      message: rule.getMessage({ serviceName: 'web', containerPort: '81', misplacedAfter: '1000' }),
      line: 19,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors for multiple services with out-of-order ports', (t) => {
  const rule = new OrderServicePortsRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlMulti);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', containerPort: '80', misplacedAfter: '81' }),
      line: 7,
    },
    {
      message: rule.getMessage({ serviceName: 'web', containerPort: '79', misplacedAfter: '80' }),
      line: 8,
    },
    {
      message: rule.getMessage({ serviceName: 'api', containerPort: '80', misplacedAfter: '81' }),
      line: 13,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('fix(): should reorder ports by container port (alphabetical)', (t) => {
  const rule = new OrderServicePortsRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.deepEqual(fixedYaml.trim(), correctYaml.trim());
});

test('fix(): should not modify correct YAML', (t) => {
  const rule = new OrderServicePortsRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), correctYaml.trim());
});

// Edge case: empty or missing ports should not produce issues
const edgeYamlNoPorts = `
services:
  web:
    image: nginx
  db:
    image: postgres
`;

test('check(): should not return issues when a service has no ports', (t) => {
  const rule = new OrderServicePortsRule();
  const context = new YamlComposeDocument(FILE_PATH, edgeYamlNoPorts);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});
