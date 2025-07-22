import test from 'ava';
import { parseDocument } from 'yaml';

import { ServicePortsAlphabeticalOrderRule } from '../../src/rules/service-ports-alphabetical-order-rule';
import { normalizeYAML, runRuleTest } from '../test-utils';

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

test('ServicePortsAlphabeticalOrderRule: should return a warning when ports are not alphabetically ordered', (t) => {
  const rule = new ServicePortsAlphabeticalOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithIncorrectPortOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectPortOrder,
  };

  const expectedMessages = [rule.getMessage({ serviceName: 'web' })];
  runRuleTest(t, rule, context, expectedMessages);
});

test('ServicePortsAlphabeticalOrderRule: should not return warnings when ports are alphabetically ordered', (t) => {
  const rule = new ServicePortsAlphabeticalOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithCorrectPortOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectPortOrder,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

test('ServicePortsAlphabeticalOrderRule: should fix the order of ports', (t) => {
  const rule = new ServicePortsAlphabeticalOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectPortOrder);

  t.is(normalizeYAML(fixedYAML), normalizeYAML(yamlWithCorrectPortOrder), 'The ports should be reordered correctly.');
});
