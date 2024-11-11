import test from 'ava';
import type { ExecutionContext } from 'ava';
import { parseDocument } from 'yaml';
import TopLevelPropertiesOrderRule, { TopLevelKeys } from '../../src/rules/top-level-properties-order-rule';
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

// Helper function to normalize YAML strings for comparison
const normalizeYAML = (yaml: string) => yaml.replaceAll(/\s+/g, ' ').trim();

// @ts-ignore TS2349
test('TopLevelPropertiesOrderRule: should return a warning when top-level properties are out of order', (t: ExecutionContext) => {
  const rule = new TopLevelPropertiesOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithIncorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithIncorrectOrder,
  };

  const errors = rule.check(context);
  t.is(errors.length, 3, 'There should be 3 warnings for out-of-order properties.');

  // Check error messages
  t.true(errors[0].message.includes('Property "x-b" is out of order.'));
  t.true(errors[1].message.includes('Property "x-a" is out of order.'));
  t.true(errors[2].message.includes('Property "networks" is out of order.'));
});

// @ts-ignore TS2349
test('TopLevelPropertiesOrderRule: should not return warnings when top-level properties are in the correct order', (t: ExecutionContext) => {
  const rule = new TopLevelPropertiesOrderRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithCorrectOrder).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCorrectOrder,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when top-level properties are in the correct order.');
});

// @ts-ignore TS2349
test('TopLevelPropertiesOrderRule: should fix the order of top-level properties', (t: ExecutionContext) => {
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

// @ts-ignore TS2349
test('TopLevelPropertiesOrderRule: should return warnings based on custom order', (t: ExecutionContext) => {
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

  const errors = rule.check(context);
  t.is(errors.length, 4, 'There should be 4 warnings for out-of-order properties based on the custom order.');

  // Check error messages
  t.true(errors[0].message.includes('Property "version" is out of order.'));
  t.true(errors[1].message.includes('Property "volumes" is out of order.'));
  t.true(errors[2].message.includes('Property "x-a" is out of order.'));
  t.true(errors[3].message.includes('Property "networks" is out of order.'));
});

// @ts-ignore TS2349
test('TopLevelPropertiesOrderRule: should fix the order of top-level properties based on custom order', (t: ExecutionContext) => {
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
