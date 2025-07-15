import test from 'ava';
import { parseDocument } from 'yaml';

import NoUnboundPortInterfacesRule from '../../src/rules/no-unbound-port-interfaces-rule';

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

  const errors = rule.check(context);
  t.is(errors.length, 3, 'There should be two errors when ports without host_ip are found.');

  const expectedMessages = [
    'Service "a-service" is exporting port "8080:80" without specifying the interface to listen on.',
    'Service "a-service" is exporting port "8080" without specifying the interface to listen on.',
    'Service "b-service" is exporting port "{"target":1000,"published":8081,"protocol":"tcp","mode":"host"}" without specifying the interface to listen on.',
  ];

  errors.forEach((error, index) => {
    t.true(error.message.includes(expectedMessages[index]));
  });
});

// @ts-ignore TS2349
test('NoUnboundPortInterfacesRule: should not return errors when exported ports have host_ip configured', (t) => {
  const rule = new NoUnboundPortInterfacesRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithExplicitListenIPPorts).toJS() as Record<string, unknown>,
    sourceCode: yamlWithExplicitListenIPPorts,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should not be any errors.');
});
