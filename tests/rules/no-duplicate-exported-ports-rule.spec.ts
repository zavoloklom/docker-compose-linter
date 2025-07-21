import test from 'ava';
import { parseDocument } from 'yaml';

import { NoDuplicateExportedPortsRule } from '../../src/rules/no-duplicate-exported-ports-rule';
import { runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// YAML with multiple duplicate exported ports
const yamlWithDuplicatePorts = `
services:
  a-service:
    image: nginx
    ports:
      - '8080'
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

// YAML with unique exported ports using different syntax
const yamlWithUniquePorts = `
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
      - 8000-8085
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

const filePath = '/docker-compose.yml';

// @ts-ignore TS2349
test('NoDuplicateExportedPortsRule: should return multiple errors when duplicate exported ports are found', (t) => {
  const rule = new NoDuplicateExportedPortsRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithDuplicatePorts).toJS() as Record<string, unknown>,
    sourceCode: yamlWithDuplicatePorts,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'b-service', publishedPort: '8080', anotherService: 'a-service' }),
    rule.getMessage({ serviceName: 'c-service', publishedPort: '8080', anotherService: 'a-service' }),
    rule.getMessage({ serviceName: 'd-service', publishedPort: '8080', anotherService: 'a-service' }),
    rule.getMessage({ serviceName: 'e-service', publishedPort: '8080', anotherService: 'a-service' }),
    rule.getMessage({ serviceName: 'f-service', publishedPort: '8080', anotherService: 'a-service' }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoDuplicateExportedPortsRule: should not return errors when exported ports are unique', (t) => {
  const rule = new NoDuplicateExportedPortsRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithUniquePorts).toJS() as Record<string, unknown>,
    sourceCode: yamlWithUniquePorts,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoDuplicateExportedPortsRule: should return an error when range overlap is detected', (t) => {
  const rule = new NoDuplicateExportedPortsRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithRangeOverlap).toJS() as Record<string, unknown>,
    sourceCode: yamlWithRangeOverlap,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'b-service', publishedPort: '8094', anotherService: 'a-service' }),
    rule.getMessage({ serviceName: 'd-service', publishedPort: '8000-8085', anotherService: 'c-service' }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoDuplicateExportedPortsRule: should not return errors when same ports have different protocols', (t) => {
  const rule = new NoDuplicateExportedPortsRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithDifferentProtocols).toJS() as Record<string, unknown>,
    sourceCode: yamlWithDifferentProtocols,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});
