import test from 'ava';
import type { ExecutionContext } from 'ava';
import { parseDocument } from 'yaml';
import ServicePortsAlphabeticalOrderRule from '../../src/rules/service-ports-alphabetical-order-rule';
import type { LintContext } from '../../src/linter/linter.types';

// Sample YAML for tests
const yamlWithIncorrectPortOrder = `
services:
  web:
    image: nginx
    ports:
      - '81'
      - "79"
      - 80:80
      - 8080:8080
      - "3000-3005"
      - 0.0.0.0:8002:8002
      - "9090-9091:8080-8081"
      - "127.0.0.1:8001:8001"
      - 1001:443
      - target: 1000
        published: 8082
        protocol: tcp
        mode: host
      - "$WEB_PORT:80"
`;

const yamlWithCorrectPortOrder = `
services:
  web:
    image: nginx
    ports:
      - "$WEB_PORT:80"
      - "79"
      - 80:80
      - '81'
      - 1001:443
      - "3000-3005"
      - "127.0.0.1:8001:8001"
      - 0.0.0.0:8002:8002
      - 8080:8080
      - target: 1000
        published: 8082
        protocol: tcp
        mode: host
      - "9090-9091:8080-8081"
`;

// Helper function to strip spaces and normalize strings for comparison
const normalizeYAML = (yaml: string) => yaml.replaceAll(/\s+/g, ' ').trim();

// @ts-ignore TS2349
test('ServicePortsAlphabeticalOrderRule: should return a warning when ports are not alphabetically ordered', (t: ExecutionContext) => {
  const rule = new ServicePortsAlphabeticalOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithIncorrectPortOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectPortOrder,
  };

  const errors = rule.check(context);
  t.is(errors.length, 1, 'There should be one warning when ports are out of order.');

  t.true(errors[0].message.includes(`Ports in service "web" should be in alphabetical order.`));
});

// @ts-ignore TS2349
test('ServicePortsAlphabeticalOrderRule: should not return warnings when ports are alphabetically ordered', (t: ExecutionContext) => {
  const rule = new ServicePortsAlphabeticalOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithCorrectPortOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectPortOrder,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when ports are in alphabetical order.');
});

// @ts-ignore TS2349
test('ServicePortsAlphabeticalOrderRule: should fix the order of ports', (t: ExecutionContext) => {
  const rule = new ServicePortsAlphabeticalOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectPortOrder);

  t.is(normalizeYAML(fixedYAML), normalizeYAML(yamlWithCorrectPortOrder), 'The ports should be reordered correctly.');
});
