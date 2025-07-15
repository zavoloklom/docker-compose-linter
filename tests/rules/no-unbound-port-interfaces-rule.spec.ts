import test from 'ava';
import { parseDocument } from 'yaml';

import NoUnboundPortInterfacesRule from '../../src/rules/no-unbound-port-interfaces-rule';
import { runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// YAML with multiple duplicate exported ports
const yamlWithImplicitListenEverywherePorts = `
services:
  a-service:
    image: nginx
    ports:
      - 8080:80
      - 8080
  b-service:
    image: nginx
    ports:
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
`;

// YAML with unique exported ports using different syntax
const yamlWithExplicitListenIPPorts = `
services:
  a-service:
    image: nginx
    ports:
      - 0.0.0.0:8080:8080
  b-service:
    image: nginx
    ports:
      - 127.0.0.1:8081:8081
      - '[::1]:8082:8082'
`;

const filePath = '/docker-compose.yml';

// @ts-ignore TS2349
test('NoUnboundPortInterfacesRule: should return multiple errors when duplicate exported ports are found', (t) => {
  const rule = new NoUnboundPortInterfacesRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithImplicitListenEverywherePorts).toJS() as Record<string, unknown>,
    sourceCode: yamlWithImplicitListenEverywherePorts,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'a-service', port: '8080:80' }),
    rule.getMessage({ serviceName: 'a-service', port: '8080' }),
    rule.getMessage({
      serviceName: 'b-service',
      port: '{"target":1000,"published":8081,"protocol":"tcp","mode":"host"}',
    }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoUnboundPortInterfacesRule: should not return errors when exported ports have host_ip configured', (t) => {
  const rule = new NoUnboundPortInterfacesRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithExplicitListenIPPorts).toJS() as Record<string, unknown>,
    sourceCode: yamlWithExplicitListenIPPorts,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});
