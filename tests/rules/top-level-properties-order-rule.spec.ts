import test from 'ava';
import { parseDocument } from 'yaml';

import { TopLevelKeys, TopLevelPropertiesOrderRule } from '../../src/rules/top-level-properties-order-rule';
import { normalizeYAML, runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// Sample YAML content with incorrect order of top-level properties
const yamlWithIncorrectOrder = `
version: '3'
services:
  web:
    image: nginx
x-b:
  some-key: some-value
volumes:
  db-data:
    driver: local
x-a:
  some-other-key: some-other-value
networks:
  default:
    driver: bridge
`;

const yamlWithCorrectOrder = `
x-a:
  some-other-key: some-other-value
x-b:
  some-key: some-value
version: '3'
services:
  web:
    image: nginx
networks:
  default:
    driver: bridge
volumes:
  db-data:
    driver: local
`;

const filePath = '/docker-compose.yml';

test('TopLevelPropertiesOrderRule: should return a warning when top-level properties are out of order', (t) => {
  const rule = new TopLevelPropertiesOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithIncorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectOrder,
  };

  const correctOrder = [
    'x-a',
    'x-b',
    'version',
    'name',
    'include',
    'services',
    'networks',
    'volumes',
    'secrets',
    'configs',
  ];
  const expectedMessages = [
    rule.getMessage({ key: 'x-b', correctOrder }),
    rule.getMessage({ key: 'x-a', correctOrder }),
    rule.getMessage({ key: 'networks', correctOrder }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

test('TopLevelPropertiesOrderRule: should not return warnings when top-level properties are in the correct order', (t) => {
  const rule = new TopLevelPropertiesOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithCorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectOrder,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

test('TopLevelPropertiesOrderRule: should fix the order of top-level properties', (t) => {
  const rule = new TopLevelPropertiesOrderRule();
  const fixedYAML = rule.fix(yamlWithIncorrectOrder);

  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithCorrectOrder),
    'The top-level properties should be reordered correctly.',
  );
});

// Custom order tests
const yamlWithCustomOrder = `
services:
  web:
    image: nginx
version: '3'
x-b:
  some-key: some-value
volumes:
  db-data:
    driver: local
x-a:
  some-other-key: some-other-value
networks:
  default:
    driver: bridge
`;

const yamlWithCustomOrderCorrected = `
version: '3'
services:
  web:
    image: nginx
volumes:
  db-data:
    driver: local
networks:
  default:
    driver: bridge
x-a:
  some-other-key: some-other-value
x-b:
  some-key: some-value
`;

test('TopLevelPropertiesOrderRule: should return warnings based on custom order', (t) => {
  const customOrder = [
    TopLevelKeys.Version,
    TopLevelKeys.Services,
    TopLevelKeys.Volumes,
    TopLevelKeys.Networks,
    TopLevelKeys.XProperties,
  ];

  const rule = new TopLevelPropertiesOrderRule({ customOrder });
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithCustomOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCustomOrder,
  };

  const correctOrder = ['version', 'services', 'volumes', 'networks', 'x-a', 'x-b'];
  const expectedMessages = [
    rule.getMessage({ key: 'version', correctOrder }),
    rule.getMessage({ key: 'volumes', correctOrder }),
    rule.getMessage({ key: 'x-a', correctOrder }),
    rule.getMessage({ key: 'networks', correctOrder }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

test('TopLevelPropertiesOrderRule: should handle absence of x-* properties correctly', (t) => {
  const yamlWithoutXProperties = `
version: '3'
services:
  web:
    image: nginx
networks:
  default:
    driver: bridge
`;
  const rule = new TopLevelPropertiesOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithoutXProperties).toJS() as Record<string, unknown>,
    sourceCode: yamlWithoutXProperties,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

test('TopLevelPropertiesOrderRule: should fix the order of top-level properties based on custom order', (t) => {
  const customOrder = [
    TopLevelKeys.Version,
    TopLevelKeys.Services,
    TopLevelKeys.Volumes,
    TopLevelKeys.Networks,
    TopLevelKeys.XProperties,
  ];

  const rule = new TopLevelPropertiesOrderRule({ customOrder });
  const fixedYAML = rule.fix(yamlWithCustomOrder);

  t.is(
    normalizeYAML(fixedYAML),
    normalizeYAML(yamlWithCustomOrderCorrected),
    'The top-level properties should be reordered correctly based on custom order.',
  );
});
