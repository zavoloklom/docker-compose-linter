import test from 'ava';
import { parseDocument } from 'yaml';
import ServiceKeysOrderRule from '../../src/rules/service-keys-order-rule.js';
import type { LintContext } from '../../src/linter/linter.types.js';

// Sample YAML for tests
const yamlWithIncorrectOrder = `
services:
  web:
    image: nginx
    ports:
      - 80:80
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/data
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
`;

// Helper function to strip spaces and normalize strings for comparison
const normalizeYAML = (yaml: string) => yaml.replace(/\s+/g, ' ').trim();

test('ServiceKeysOrderRule: should return a warning when service keys are in the wrong order', (t) => {
    const rule = new ServiceKeysOrderRule();
    const context: LintContext = {
        path: '/docker-compose.yml',
        content: parseDocument(yamlWithIncorrectOrder).toJS() as Record<string, unknown>,
        sourceCode: yamlWithIncorrectOrder,
    };

    const errors = rule.check(context);
    t.is(errors.length, 2, 'There should be two warnings when service keys are out of order.');

    t.true(errors[0].message.includes(`Key "environment" in service "web" is out of order.`));
    t.true(errors[1].message.includes(`Key "volumes" in service "web" is out of order.`));
});

test('ServiceKeysOrderRule: should not return warnings when service keys are in the correct order', (t) => {
    const rule = new ServiceKeysOrderRule();
    const context: LintContext = {
        path: '/docker-compose.yml',
        content: parseDocument(yamlWithCorrectOrder).toJS() as Record<string, unknown>,
        sourceCode: yamlWithCorrectOrder,
    };

    const errors = rule.check(context);
    t.is(errors.length, 0, 'There should be no warnings when service keys are in the correct order.');
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
