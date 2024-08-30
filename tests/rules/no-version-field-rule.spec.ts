import test from 'ava';
import NoVersionFieldRule from '../../src/rules/no-version-field-rule.js';
import type { LintContext } from '../../src/linter/linter.types.js';

// Sample YAML for tests
const yamlWithVersion = `
version: '3'
services:
  web:
    image: nginx
`;

const yamlWithoutVersion = `
services:
  web:
    image: nginx
`;

test('NoVersionFieldRule: should return an error when "version" field is present', (t) => {
    const rule = new NoVersionFieldRule();
    const context: LintContext = {
        path: '/docker-compose.yml',
        content: {
            version: '3',
            services: {
                web: {
                    image: 'nginx',
                },
            },
        },
        sourceCode: yamlWithVersion,
    };

    const errors = rule.check(context);
    t.is(errors.length, 1, 'There should be one error when the "version" field is present.');
    t.is(errors[0].message, 'The "version" field should not be present.');
    t.is(errors[0].rule, 'no-version-field');
    t.is(errors[0].severity, 'minor');
});

test('NoVersionFieldRule: should not return errors when "version" field is not present', (t) => {
    const rule = new NoVersionFieldRule();
    const context: LintContext = {
        path: '/docker-compose.yml',
        content: {
            services: {
                web: {
                    image: 'nginx',
                },
            },
        },
        sourceCode: yamlWithoutVersion,
    };

    const errors = rule.check(context);
    t.is(errors.length, 0, 'There should be no errors when the "version" field is absent.');
});

test('NoVersionFieldRule: should fix by removing the "version" field', (t) => {
    const rule = new NoVersionFieldRule();
    const fixedYAML = rule.fix(yamlWithVersion);

    t.false(fixedYAML.includes('version:'), 'The "version" field should be removed.');
});

test('NoVersionFieldRule: should not modify YAML without "version" field', (t) => {
    const rule = new NoVersionFieldRule();
    const fixedYAML = rule.fix(yamlWithoutVersion);

    t.is(fixedYAML.trim(), yamlWithoutVersion.trim(), 'YAML without "version" should remain unchanged.');
});
