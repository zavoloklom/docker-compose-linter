import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type NoDuplicateExportedPortsIssueContext,
  NoDuplicateExportedPortsRule,
} from '../../../src/plugins/rules/no-duplicate-exported-ports-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
services:
  a-service:
    image: nginx
    ports:
      - '8080'
  b-service:
    image: nginx
    ports:
      - 8081
      - 9090
  c-service:
    image: nginx
    ports:
      - 8082:8082
  d-service:
    image: nginx
    ports:
      - 0.0.0.0:8083:8003
  e-service:
    image: nginx
    ports:
      - "127.0.0.1:8084:8004"
  f-service:
    image: nginx
    ports:
      - target: 1000
        published: 8085
        protocol: tcp
        mode: host
`;

const invalidYaml = `
services:
  a-service:
    image: nginx
    ports:
      - '8080:8080'
  b-service:
    image: nginx
    ports:
      - 8080
      - 9090
  c-service:
    image: nginx
    ports:
      - 8080:8080
  d-service:
    image: nginx
    ports:
      - 0.0.0.0:8080:8002
  e-service:
    image: nginx
    ports:
      - "127.0.0.1:8080:8001"
  f-service:
    image: nginx
    ports:
      - target: 1000
        published: 8080
        protocol: tcp
        mode: host
  g-service:
    image: nginx:latest
    ports:
      - "$WEB_PORT:80"
      - "$WEB_PORT:81"
      - "$WEB_PORT-9000:80-81"
`;

// YAML with range overlap in ports
const yamlWithRangeOverlap = `
services:
  a-service:
    image: nginx
    ports:
      - "8093-9000:80"
  b-service:
    image: postgres
    ports:
      - "8094:5432"
  c-service:
    image: nginx
    ports:
      - target: 1000
        published: 8080-8090
        protocol: tcp
        mode: host
  d-service:
    image: postgres
    ports:
      - 8000-8085:8000-8085
`;

// YAML with same ports but different protocols
const yamlWithDifferentProtocols = `
services:
  myservice:
    ports:
      - '127.0.0.1:8388:8388/tcp'
      - '127.0.0.1:8388:8388/udp'
      - '127.0.0.1:8888:8888/tcp'
  another-service:
    ports:
      - '127.0.0.1:8080:8080/tcp'
  one-more-service:
    ports:
      - '127.0.0.1:8080:8080/udp'
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new NoDuplicateExportedPortsRule();
  const issueContext: NoDuplicateExportedPortsIssueContext = {
    serviceName: 'a-service',
    servicePort: '8081',
    conflictingService: 'b-service',
    hostPortProtocol: '8081/tcp',
  };
  const expectedMessage = `Unexpected port conflict for exported port "${issueContext.servicePort}" ("${issueContext.hostPortProtocol}") in service "${issueContext.serviceName}". It conflicts with service "${issueContext.conflictingService}".`;

  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new NoDuplicateExportedPortsRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated', (t) => {
  const rule = new NoDuplicateExportedPortsRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({
        serviceName: 'c-service',
        servicePort: '8080',
        hostPortProtocol: '8080/tcp',
        conflictingService: 'a-service',
      }),
      line: 15,
    },
    {
      message: rule.getMessage({
        serviceName: 'd-service',
        servicePort: '8080',
        hostPortProtocol: '8080/tcp',
        conflictingService: 'a-service',
      }),
      line: 19,
    },
    {
      message: rule.getMessage({
        serviceName: 'e-service',
        servicePort: '8080',
        hostPortProtocol: '8080/tcp',
        conflictingService: 'a-service',
      }),
      line: 23,
    },
    {
      message: rule.getMessage({
        serviceName: 'f-service',
        servicePort: '8080',
        hostPortProtocol: '8080/tcp',
        conflictingService: 'a-service',
      }),
      line: 28,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return an error when range overlap is detected', (t) => {
  const rule = new NoDuplicateExportedPortsRule();
  const context = new YamlComposeDocument(FILE_PATH, yamlWithRangeOverlap);

  const expectedMessages: ExpectedIssue[] = [
    {
      message: rule.getMessage({
        serviceName: 'b-service',
        servicePort: '8094',
        hostPortProtocol: '8094/tcp',
        conflictingService: 'a-service',
      }),
      line: 10,
    },
    {
      message: rule.getMessage({
        serviceName: 'd-service',
        servicePort: '8000-8085',
        hostPortProtocol: '8080/tcp',
        conflictingService: 'c-service',
      }),
      line: 21,
    },
    {
      message: rule.getMessage({
        serviceName: 'd-service',
        servicePort: '8000-8085',
        hostPortProtocol: '8081/tcp',
        conflictingService: 'c-service',
      }),
      line: 21,
    },
    {
      message: rule.getMessage({
        serviceName: 'd-service',
        servicePort: '8000-8085',
        hostPortProtocol: '8082/tcp',
        conflictingService: 'c-service',
      }),
      line: 21,
    },
    {
      message: rule.getMessage({
        serviceName: 'd-service',
        servicePort: '8000-8085',
        hostPortProtocol: '8083/tcp',
        conflictingService: 'c-service',
      }),
      line: 21,
    },
    {
      message: rule.getMessage({
        serviceName: 'd-service',
        servicePort: '8000-8085',
        hostPortProtocol: '8084/tcp',
        conflictingService: 'c-service',
      }),
      line: 21,
    },
    {
      message: rule.getMessage({
        serviceName: 'd-service',
        servicePort: '8000-8085',
        hostPortProtocol: '8085/tcp',
        conflictingService: 'c-service',
      }),
      line: 21,
    },
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

test('check(): should not return errors when same ports have different protocols', (t) => {
  const rule = new NoDuplicateExportedPortsRule();
  const context = new YamlComposeDocument(FILE_PATH, yamlWithDifferentProtocols);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});
