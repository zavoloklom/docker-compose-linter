import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type OrderServicePropertiesIssueContext,
  OrderServicePropertiesRule,
} from '../../../src/plugins/rules/order-service-properties-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
services:
  web:
    image: nginx
    container_name: web
    depends_on:
      - db
    volumes:
      - data:/data
    environment:
      - NODE_ENV=production
    ports:
      - "80:80"
    command: [ "npm", "start" ]
    labels:
      com.example: "ok"
    user: "1000:1000"
    cpu_rt_period: '1400us'
    cpu_rt_runtime: '400ms'
  db:
    image: postgres
`;

const invalidYamlSingle = `
services:
  web:
    image: nginx
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    cpu_rt_runtime: '400ms'
    cpu_rt_period: '1400us'
`;

const invalidYamlMulti = `
services:
  web:
    container_name: web
    image: nginx
    labels:
      com.example: "ok"
    depends_on:
      - db
    environment:
      - NODE_ENV=production
    ports:
      - "80:80"
  api:
    image: nginx
    ports:
      - "8081:81"
    depends_on:
      - web
`;

const correctYamlMulti = `
services:
  web:
    image: nginx
    container_name: web
    depends_on:
      - db
    environment:
      - NODE_ENV=production
    ports:
      - "80:80"
    labels:
      com.example: "ok"
  api:
    image: nginx
    depends_on:
      - web
    ports:
      - "8081:81"
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide exact message via getMessage(context)', (t) => {
  const rule = new OrderServicePropertiesRule();
  const context: OrderServicePropertiesIssueContext = {
    serviceName: 'web',
    propertyName: 'ports',
    misplacedAfter: 'environment',
  };

  const expectedMessage = rule.getMessage(context);
  t.is(
    expectedMessage,
    `Unexpected order of property "${context.propertyName}" after "${context.misplacedAfter}" in service "${context.serviceName}".`,
  );
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new OrderServicePropertiesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when properties are out of order (single service)', (t) => {
  const rule = new OrderServicePropertiesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlSingle);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', propertyName: 'environment', misplacedAfter: 'ports' }),
      line: 7,
    },
    {
      message: rule.getMessage({ serviceName: 'web', propertyName: 'cpu_rt_period', misplacedAfter: 'cpu_rt_runtime' }),
      line: 10,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return multiple errors across services (multiple misorders)', (t) => {
  const rule = new OrderServicePropertiesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlMulti);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', propertyName: 'image', misplacedAfter: 'container_name' }),
      line: 5,
    },
    {
      message: rule.getMessage({ serviceName: 'web', propertyName: 'depends_on', misplacedAfter: 'labels' }),
      line: 8,
    },
    {
      message: rule.getMessage({ serviceName: 'api', propertyName: 'depends_on', misplacedAfter: 'ports' }),
      line: 18,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('fix(): should reorder properties into the correct groups order (default options)', (t) => {
  const rule = new OrderServicePropertiesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlSingle);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  // "environment" must appear before "ports" after fix
  const environmentIndex = fixedYaml.indexOf('\n    environment:');
  const portsIndex = fixedYaml.indexOf('\n    ports:');
  t.true(environmentIndex !== -1 && portsIndex !== -1, 'Both keys should be present after fix.');
  t.true(environmentIndex < portsIndex, '"environment" should precede "ports" after fix.');
});

test('fix(): should reorder multiple services independently', (t) => {
  const rule = new OrderServicePropertiesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlMulti);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.deepEqual(fixedYaml.trim(), correctYamlMulti.trim());
});

test('fix(): should not modify correct YAML', (t) => {
  const rule = new OrderServicePropertiesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), correctYaml.trim());
});

// Custom options: NETWORK before ENVIRONMENT to verify options are respected
const customGroupOrder = [
  // Swap NETWORK and ENVIRONMENT relative order
  // CORE, DEPENDENCIES, DATA_MANAGEMENT keep defaults implicitly
  // We include full order for determinism
  // (values are enums inside the rule)
  OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder[0], // CORE
  OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder[1], // DEPENDENCIES
  OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder[2], // DATA_MANAGEMENT
  OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder[4], // NETWORK
  OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder[3], // ENVIRONMENT
  OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder[5], // RUNTIME
  OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder[6], // METADATA
  OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder[7], // SECURITY
  OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder[8], // OTHER
];
const correctYamlNetworkBeforeEnvironment = `
services:
  web:
    image: nginx
    depends_on:
      - db
    volumes:
      - data:/data
    ports:
      - "80:80"
    networks:
      - default
    environment:
      - NODE_ENV=production
  db:
    image: postgres
`;
const invalidYamlNetworkBeforeEnvironment = `
services:
  web:
    image: nginx
    depends_on:
      - db
    volumes:
      - data:/data
    environment:
      - NODE_ENV=production
    ports:
      - "80:80"
    networks:
      - default
  db:
    image: postgres
`;

test('check(): should respect custom groupOrder (NETWORK before ENVIRONMENT)', (t) => {
  const custom = new OrderServicePropertiesRule({
    groupOrder: customGroupOrder,
  });

  // With NETWORK before ENVIRONMENT, invalidYamlSingle becomes valid
  const context = new YamlComposeDocument(FILE_PATH, correctYamlNetworkBeforeEnvironment);
  const expected: ExpectedIssue[] = [];
  runRuleTest(t, custom, context, expected);
});

test('fix(): should reorder properties according to custom groupOrder (NETWORK before ENVIRONMENT)', (t) => {
  const custom = new OrderServicePropertiesRule({
    groupOrder: customGroupOrder,
  });

  const context = new YamlComposeDocument(FILE_PATH, invalidYamlNetworkBeforeEnvironment);
  const fixedDocument = custom.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.deepEqual(fixedYaml.trim(), correctYamlNetworkBeforeEnvironment.trim());
});
