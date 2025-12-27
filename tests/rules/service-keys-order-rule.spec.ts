import test from 'ava';
import { parseDocument } from 'yaml';

import { ServiceKeyGroup, ServiceKeysOrderRule } from '../../src/rules/service-keys-order-rule';
import { normalizeYAML, runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// Sample YAML for tests
const yamlWithIncorrectOrder = `
services:
  web:
    image: nginx
    annotations:
      - com.example.foo=bar
    ports:
      - 80:80
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/data
    cpu_rt_runtime: '400ms'
    cpu_rt_period: '1400us'
`;

const yamlWithCorrectOrder = `
services:
  web:
    image: nginx
    volumes:
      - ./data:/data
    environment:
      - NODE_ENV=production
    ports:
      - 80:80
    annotations:
      - com.example.foo=bar
    cpu_rt_period: '1400us'
    cpu_rt_runtime: '400ms'
`;

test('ServiceKeysOrderRule: should return a warning when service keys are in the wrong order', (t) => {
  const rule = new ServiceKeysOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithIncorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectOrder,
  };

  const correctOrder = [
    'image, build, container_name, depends_on, volumes, volumes_from, configs, secrets, environment, env_file, ports, networks, network_mode, extra_hosts, command, entrypoint, working_dir, restart, healthcheck, logging, labels, profiles, user, isolation, annotations, cpu_rt_period, cpu_rt_runtime',
  ];
  const expectedMessages = [
    rule.getMessage({ serviceName: 'web', key: 'ports', correctOrder }),
    rule.getMessage({ serviceName: 'web', key: 'environment', correctOrder }),
    rule.getMessage({ serviceName: 'web', key: 'volumes', correctOrder }),
    rule.getMessage({ serviceName: 'web', key: 'cpu_rt_period', correctOrder }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

test('ServiceKeysOrderRule: should not return warnings when service keys are in the correct order', (t) => {
  const rule = new ServiceKeysOrderRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: parseDocument(yamlWithCorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectOrder,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

test('ServiceKeysOrderRule: should respect custom groupOrder and groups from options', (t) => {
  const customGroups = {
    [ServiceKeyGroup.CORE]: ['container_name', 'build', 'image'],
    [ServiceKeyGroup.NETWORK]: ['extra_hosts', 'ports'],
  };

  const customGroupOrder = [ServiceKeyGroup.NETWORK, ServiceKeyGroup.CORE];

  const rule = new ServiceKeysOrderRule({
    groups: customGroups,
    groupOrder: customGroupOrder,
  });

  const yamlWithCustomOrder = `
services:
  web:
    container_name: my-web-container
    image: nginx
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ports:
      - 8080:80
    build: ./web
  db:
    ports:
      - 5432:5432
    image: postgres
  `;

  const correctOrderWithCustomOptions = `
services:
  web:
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ports:
      - 8080:80
    container_name: my-web-container
    build: ./web
    image: nginx
  db:
    ports:
      - 5432:5432
    image: postgres
  `;

  const fixedYAML = rule.fix(yamlWithCustomOrder);

  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(correctOrderWithCustomOptions),
    'The service keys should be reordered correctly according to custom options.',
  );
});

test('ServiceKeysOrderRule: should use default options when no options are provided', (t) => {
  const rule = new ServiceKeysOrderRule();

  const yamlWithDefaultOrderViolation = `
services:
  web:
    labels:
      - com.example.key=value
    image: nginx
    ports:
      - 8080:80
    environment:
      - NODE_ENV=production
  `;

  const correctOrderWithDefaultOptions = `
services:
  web:
    image: nginx
    environment:
      - NODE_ENV=production
    ports:
      - 8080:80
    labels:
      - com.example.key=value
  `;

  const fixedYAML = rule.fix(yamlWithDefaultOrderViolation);

  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(correctOrderWithDefaultOptions),
    'The service keys should be reordered correctly using default options.',
  );
});

test('ServiceKeysOrderRule: should fix the order of service keys', (t) => {
  const rule = new ServiceKeysOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectOrder);

  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithCorrectOrder),
    'The service keys should be reordered correctly.',
  );
});
