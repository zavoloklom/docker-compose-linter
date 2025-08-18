import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type NoUnboundPortInterfacesIssueContext,
  NoUnboundPortInterfacesRule,
} from '../../../src/plugins/rules/no-unbound-port-interfaces-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYamlWithDefaultOptions = `
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

const invalidYamlWithDefaultOptions = `
services:
  a-service:
    image: nginx
    ports:
      - 8080:80
      - 8080
  b-service:
    image: nginx
    ports:
      # comment
      - 127.0.0.1:3000
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
      - 127.0.0.1:3002
`;

const correctYamlWithFallbackInterface = `
services:
  a-service:
    image: nginx
    ports:
      - 127.0.0.1:8080:80
      - 127.0.0.1:8080
  b-service:
    image: nginx
    ports:
      # comment
      - 127.0.0.1:3000
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
        host_ip: 127.0.0.1
      - 127.0.0.1:3002
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new NoUnboundPortInterfacesRule();
  let issueContext: NoUnboundPortInterfacesIssueContext = {
    serviceName: 'service-a',
    containerPort: '80',
    hostPort: null,
    hostIp: null,
  };
  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);

  let expectedMessage = `Expected host interface when publishing port "${issueContext.containerPort}" in service "${issueContext.serviceName}".`;
  t.is(rule.getMessage(issueContext), expectedMessage);

  issueContext = {
    serviceName: 'service-a',
    containerPort: '80',
    hostPort: '8080',
    hostIp: null,
  };
  expectedMessage = `Expected host interface when publishing port "${issueContext.containerPort}" as "${issueContext.hostPort}" in service "${issueContext.serviceName}".`;
  t.is(rule.getMessage(issueContext), expectedMessage);

  issueContext = {
    serviceName: 'service-a',
    containerPort: '80',
    hostPort: '8080',
    hostIp: '0.0.0.0',
  };
  expectedMessage = `Unexpected host interface "${issueContext.hostIp}" when publishing port "${issueContext.containerPort}" as "${issueContext.hostPort}" in service "${issueContext.serviceName}".`;
  t.is(rule.getMessage(issueContext), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new NoUnboundPortInterfacesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated', (t) => {
  const rule = new NoUnboundPortInterfacesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'a-service', containerPort: '80', hostPort: '8080', hostIp: null }),
      line: 6,
    },
    {
      message: rule.getMessage({ serviceName: 'a-service', containerPort: '8080', hostPort: null, hostIp: null }),
      line: 7,
    },
    {
      message: rule.getMessage({ serviceName: 'b-service', containerPort: '1000', hostPort: '8081', hostIp: null }),
      line: 13,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when { allowedIps: ["127.0.0.1"] }', (t) => {
  const rule = new NoUnboundPortInterfacesRule({ allowedIps: ['127.0.0.1'] });
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({
        serviceName: 'a-service',
        containerPort: '8080',
        hostPort: '8080',
        hostIp: '0.0.0.0',
      }),
      line: 6,
    },
    {
      message: rule.getMessage({ serviceName: 'b-service', containerPort: '8082', hostPort: '8082', hostIp: '::1' }),
      line: 11,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should not return errors when { allowedIps: ["127.0.0.1"] }', (t) => {
  const rule = new NoUnboundPortInterfacesRule({ allowedIps: ['127.0.0.1'] });
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithFallbackInterface);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('fix(): rule.fixable=false and should return the same document for default options', (t) => {
  const rule = new NoUnboundPortInterfacesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlWithDefaultOptions);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.false(rule.fixable);
  t.is(fixedYaml.trim(), invalidYamlWithDefaultOptions.trim());
});

test('fix(): should fix YAML correctly', (t) => {
  const rule = new NoUnboundPortInterfacesRule({ fallbackInterface: '127.0.0.1' });
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlWithDefaultOptions);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.true(rule.fixable);
  t.is(fixedYaml.trim(), correctYamlWithFallbackInterface.trim());
});

test('fix(): should not modify correct YAML', (t) => {
  const rule = new NoUnboundPortInterfacesRule({ fallbackInterface: '127.0.0.1' });
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithFallbackInterface);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.true(rule.fixable);
  t.is(fixedYaml.trim(), correctYamlWithFallbackInterface.trim());
});
