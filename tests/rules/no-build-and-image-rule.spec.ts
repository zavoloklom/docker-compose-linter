import test from 'ava';
import { parseDocument } from 'yaml';
import NoBuildAndImageRule from '../../src/rules/no-build-and-image-rule.js';
import type { LintContext } from '../../src/linter/linter.types.js';

// YAML with services using both build and image
const yamlWithBuildAndImage = `
services:
  web:
    build: .
    image: nginx
  db:
    build: ./db
    image: postgres
`;

// YAML with services using only build
const yamlWithOnlyBuild = `
services:
  web:
    build: .
  db:
    build: ./db
`;

// YAML with services using only image
const yamlWithOnlyImage = `
services:
  web:
    image: nginx
  db:
    image: postgres
`;

const filePath = '/docker-compose.yml';

test('NoBuildAndImageRule: should return a warning when both "build" and "image" are used in a service', (t) => {
    const rule = new NoBuildAndImageRule();
    const context: LintContext = {
        path: filePath,
        content: parseDocument(yamlWithBuildAndImage).toJS() as Record<string, unknown>,
        sourceCode: yamlWithBuildAndImage,
    };

    const errors = rule.check(context);
    t.is(errors.length, 2, 'There should be two warnings when both "build" and "image" are used.');

    const expectedMessages = [
        'Service "web" is using both "build" and "image". Use either "build" or "image" but not both.',
        'Service "db" is using both "build" and "image". Use either "build" or "image" but not both.',
    ];

    errors.forEach((error, index) => {
        t.true(error.message.includes(expectedMessages[index]));
    });
});

test('NoBuildAndImageRule: should not return warnings when only "build" is used', (t) => {
    const rule = new NoBuildAndImageRule();
    const context: LintContext = {
        path: filePath,
        content: parseDocument(yamlWithOnlyBuild).toJS() as Record<string, unknown>,
        sourceCode: yamlWithOnlyBuild,
    };

    const errors = rule.check(context);
    t.is(errors.length, 0, 'There should be no warnings when only "build" is used.');
});

test('NoBuildAndImageRule: should not return warnings when only "image" is used', (t) => {
    const rule = new NoBuildAndImageRule();
    const context: LintContext = {
        path: filePath,
        content: parseDocument(yamlWithOnlyImage).toJS() as Record<string, unknown>,
        sourceCode: yamlWithOnlyImage,
    };

    const errors = rule.check(context);
    t.is(errors.length, 0, 'There should be no warnings when only "image" is used.');
});
