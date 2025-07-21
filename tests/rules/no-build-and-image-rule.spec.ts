import test from 'ava';
import { parseDocument } from 'yaml';

import { NoBuildAndImageRule } from '../../src/rules/no-build-and-image-rule';
import { runRuleTest } from '../test-utils';

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
test('NoBuildAndImageRule: should return a warning when both "build" and "image" are used in a service', (t) => {
  const rule = new NoBuildAndImageRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithBuildAndImage).toJS() as Record<string, unknown>,
    sourceCode: yamlWithBuildAndImage,
  };

  const expectedMessages = [rule.getMessage({ serviceName: 'web' }), rule.getMessage({ serviceName: 'db' })];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should return a warning when both "build" and "image" are used in a service and checkPullPolicy is false', (t) => {
  const rule = new NoBuildAndImageRule({ checkPullPolicy: false });
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithBuildImageAndPullPolicy).toJS() as Record<string, unknown>,
    sourceCode: yamlWithBuildImageAndPullPolicy,
  };

  const expectedMessages = [rule.getMessage({ serviceName: 'web' }), rule.getMessage({ serviceName: 'db' })];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should not return warnings when "build" and "image" are used with pull_policy and checkPullPolicy is true', (t) => {
  const rule = new NoBuildAndImageRule({ checkPullPolicy: true });
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithBuildImageAndPullPolicy).toJS() as Record<string, unknown>,
    sourceCode: yamlWithBuildImageAndPullPolicy,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should respect default options when no options are provided', (t) => {
  const rule = new NoBuildAndImageRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithBuildImageAndPullPolicy).toJS() as Record<string, unknown>,
    sourceCode: yamlWithBuildImageAndPullPolicy,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should not return warnings when only "build" is used', (t) => {
  const rule = new NoBuildAndImageRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithOnlyBuild).toJS() as Record<string, unknown>,
    sourceCode: yamlWithOnlyBuild,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoBuildAndImageRule: should not return warnings when only "image" is used', (t) => {
  const rule = new NoBuildAndImageRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithOnlyImage).toJS() as Record<string, unknown>,
    sourceCode: yamlWithOnlyImage,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});
