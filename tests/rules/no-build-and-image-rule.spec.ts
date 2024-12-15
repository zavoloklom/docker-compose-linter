import test from 'ava';
import type { ExecutionContext } from 'ava';
import { parseDocument } from 'yaml';
import NoBuildAndImageRule from '../../src/rules/no-build-and-image-rule';
import type { LintContext } from '../../src/linter/linter.types';

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

// YAML with services using both build and image, including pull_policy
const yamlWithBuildImageAndPullPolicy = `
services:
  web:
    build: .
    image: nginx
    pull_policy: always
  db:
    build: ./db
    image: postgres
    pull_policy: always
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

// @ts-ignore TS2349
test('NoBuildAndImageRule: should return a warning when both "build" and "image" are used in a service', (t: ExecutionContext) => {
  const rule = new NoBuildAndImageRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithBuildAndImage).toJS() as Record<string, unknown>,
    sourceCode: yamlWithBuildAndImage,
  };

  const errors = rule.check(context);
  t.is(
    errors.length,
    2,
    'There should be two warnings when both "build" and "image" are used and checkPullPolicy is false.',
  );

  const expectedMessages = [
    'Service "web" is using both "build" and "image". Use either "build" or "image" but not both.',
    'Service "db" is using both "build" and "image". Use either "build" or "image" but not both.',
  ];

  errors.forEach((error, index) => {
    t.true(error.message.includes(expectedMessages[index]));
  });
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should return a warning when both "build" and "image" are used in a service and checkPullPolicy is false', (t: ExecutionContext) => {
  const rule = new NoBuildAndImageRule({ checkPullPolicy: false });
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithBuildImageAndPullPolicy).toJS() as Record<string, unknown>,
    sourceCode: yamlWithBuildImageAndPullPolicy,
  };

  const errors = rule.check(context);
  t.is(
    errors.length,
    2,
    'There should be two warnings when both "build" and "image" are used and checkPullPolicy is false.',
  );

  const expectedMessages = [
    'Service "web" is using both "build" and "image". Use either "build" or "image" but not both.',
    'Service "db" is using both "build" and "image". Use either "build" or "image" but not both.',
  ];

  errors.forEach((error, index) => {
    t.true(error.message.includes(expectedMessages[index]));
  });
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should not return warnings when "build" and "image" are used with pull_policy and checkPullPolicy is true', (t: ExecutionContext) => {
  const rule = new NoBuildAndImageRule({ checkPullPolicy: true });
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithBuildImageAndPullPolicy).toJS() as Record<string, unknown>,
    sourceCode: yamlWithBuildImageAndPullPolicy,
  };

  const errors = rule.check(context);
  t.is(
    errors.length,
    0,
    'There should be no warnings when "build" and "image" are used together with pull_policy and checkPullPolicy is true.',
  );
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should respect default options when no options are provided', (t: ExecutionContext) => {
  const rule = new NoBuildAndImageRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithBuildImageAndPullPolicy).toJS() as Record<string, unknown>,
    sourceCode: yamlWithBuildImageAndPullPolicy,
  };

  const errors = rule.check(context);
  t.is(
    errors.length,
    0,
    'There should be no warnings when "build" and "image" are used together with pull_policy and default checkPullPolicy is true.',
  );
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should not return warnings when only "build" is used', (t: ExecutionContext) => {
  const rule = new NoBuildAndImageRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithOnlyBuild).toJS() as Record<string, unknown>,
    sourceCode: yamlWithOnlyBuild,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when only "build" is used.');
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should not return warnings when only "image" is used', (t: ExecutionContext) => {
  const rule = new NoBuildAndImageRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithOnlyImage).toJS() as Record<string, unknown>,
    sourceCode: yamlWithOnlyImage,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when only "image" is used.');
});
