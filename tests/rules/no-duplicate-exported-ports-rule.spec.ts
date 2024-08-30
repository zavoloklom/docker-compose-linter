import test from 'ava';
import { parseDocument } from 'yaml';
import NoDuplicateExportedPortsRule from '../../src/rules/no-duplicate-exported-ports-rule.js';
import type { LintContext } from '../../src/linter/linter.types.js';

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

const filePath = '/docker-compose.yml';

test('NoDuplicateExportedPortsRule: should return multiple errors when duplicate exported ports are found', (t) => {
    const rule = new NoDuplicateExportedPortsRule();
    const context: LintContext = {
        path: filePath,
        content: parseDocument(yamlWithDuplicatePorts).toJS() as Record<string, unknown>,
        sourceCode: yamlWithDuplicatePorts,
    };

    const errors = rule.check(context);
    t.is(errors.length, 5, 'There should be five errors when duplicate exported ports are found.');

    const expectedMessages = [
        'Service "b-service" is exporting port "8080" which is already used by service "a-service".',
        'Service "c-service" is exporting port "8080" which is already used by service "a-service".',
        'Service "d-service" is exporting port "8080" which is already used by service "a-service".',
        'Service "e-service" is exporting port "8080" which is already used by service "a-service".',
        'Service "f-service" is exporting port "8080" which is already used by service "a-service".',
    ];

    errors.forEach((error, index) => {
        t.true(error.message.includes(expectedMessages[index]));
    });
});

test('NoDuplicateExportedPortsRule: should not return errors when exported ports are unique', (t) => {
    const rule = new NoDuplicateExportedPortsRule();
    const context: LintContext = {
        path: filePath,
        content: parseDocument(yamlWithUniquePorts).toJS() as Record<string, unknown>,
        sourceCode: yamlWithUniquePorts,
    };

    const errors = rule.check(context);
    t.is(errors.length, 0, 'There should be no errors when exported ports are unique.');
});

test('NoDuplicateExportedPortsRule: should return an error when range overlap is detected', (t) => {
    const rule = new NoDuplicateExportedPortsRule();
    const context: LintContext = {
        path: filePath,
        content: parseDocument(yamlWithRangeOverlap).toJS() as Record<string, unknown>,
        sourceCode: yamlWithRangeOverlap,
    };

    const errors = rule.check(context);
    t.is(errors.length, 2, 'There should be two errors when range overlap is detected.');

    const expectedMessages = [
        'Service "b-service" is exporting port "8094" which is already used by service "a-service".',
        'Service "d-service" is exporting port "8000-8085" which is already used by service "c-service".',
    ];

    errors.forEach((error, index) => {
        t.true(error.message.includes(expectedMessages[index]));
    });
});
