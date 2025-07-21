import test from 'ava';
import { parseDocument } from 'yaml';

import { ServiceImageRequireExplicitTagRule } from '../../src/rules/service-image-require-explicit-tag-rule';
import { runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// YAML with services using no tag, but valid image formats
const yamlWithoutTag = `
services:
  a-service:
    image: nginx
  b-service:
    image: library/nginx
  c-service:
    image: docker.io/library/nginx
  d-service:
    image: my_private.registry:5000/nginx
`;

// YAML with services using the latest tag
const yamlWithLatestTag = `
services:
  a-service:
    image: nginx:latest
  b-service:
    image: library/nginx:latest
  c-service:
    image: docker.io/library/nginx:latest
  d-service:
    image: my_private.registry:5000/nginx:latest
`;

// YAML with services using the stable tag
const yamlWithStableTag = `
services:
  a-service:
    image: nginx:stable
  b-service:
    image: library/nginx:stable
  c-service:
    image: docker.io/library/nginx:stable
  d-service:
    image: my_private.registry:5000/nginx:stable
`;

// YAML with services using prohibited tags
const yamlWithProhibitedTags = `
services:
  a-service:
    image: nginx:edge
  b-service:
    image: library/nginx:test
  c-service:
    image: docker.io/library/nginx:nightly
  d-service:
    image: my_private.registry:5000/nginx:dev
  e-service:
    image: library/nginx:beta
  f-service:
    image: library/nginx:canary
`;

// YAML with services using a specific version tag and some custom tags
const yamlWithCustomTags = `
services:
  a-service:
    image: nginx:unstable
  b-service:
    image: library/nginx:preview
  c-service:
    image: docker.io/library/nginx:1.21.0
  d-service:
    image: my_private.registry:5000/nginx:1.21.0
`;

// YAML with services using a specific version tag or digest
const yamlWithSpecificVersion = `
services:
  a-service:
    image: nginx:1.21.0
  b-service:
    image: library/nginx:1.21.0
  c-service:
    image: docker.io/library/nginx:1.21.0
  d-service:
    image: my_private.registry:5000/nginx:1.21.0
  e-service:
    image: nginx@sha256:0ed5d5928d4737458944eb604cc8509e245c3e19d02ad83935398bc4b991aac7
  f-service:
    build:
      context: .
      dockerfile: Dockerfile
`;

const filePath = '/docker-compose.yml';

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should return a warning when no tag is specified', (t) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithoutTag).toJS() as Record<string, unknown>,
    sourceCode: yamlWithoutTag,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'a-service', image: 'nginx' }),
    rule.getMessage({ serviceName: 'b-service', image: 'library/nginx' }),
    rule.getMessage({ serviceName: 'c-service', image: 'docker.io/library/nginx' }),
    rule.getMessage({ serviceName: 'd-service', image: 'my_private.registry:5000/nginx' }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should return a warning when using latest tag', (t) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithLatestTag).toJS() as Record<string, unknown>,
    sourceCode: yamlWithLatestTag,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'a-service', image: 'nginx:latest' }),
    rule.getMessage({ serviceName: 'b-service', image: 'library/nginx:latest' }),
    rule.getMessage({ serviceName: 'c-service', image: 'docker.io/library/nginx:latest' }),
    rule.getMessage({ serviceName: 'd-service', image: 'my_private.registry:5000/nginx:latest' }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should return a warning when using stable tag', (t) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithStableTag).toJS() as Record<string, unknown>,
    sourceCode: yamlWithStableTag,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'a-service', image: 'nginx:stable' }),
    rule.getMessage({ serviceName: 'b-service', image: 'library/nginx:stable' }),
    rule.getMessage({ serviceName: 'c-service', image: 'docker.io/library/nginx:stable' }),
    rule.getMessage({ serviceName: 'd-service', image: 'my_private.registry:5000/nginx:stable' }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should return a warning when using prohibited tags', (t) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithProhibitedTags).toJS() as Record<string, unknown>,
    sourceCode: yamlWithProhibitedTags,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'a-service', image: 'nginx:edge' }),
    rule.getMessage({ serviceName: 'b-service', image: 'library/nginx:test' }),
    rule.getMessage({ serviceName: 'c-service', image: 'docker.io/library/nginx:nightly' }),
    rule.getMessage({ serviceName: 'd-service', image: 'my_private.registry:5000/nginx:dev' }),
    rule.getMessage({ serviceName: 'e-service', image: 'library/nginx:beta' }),
    rule.getMessage({ serviceName: 'f-service', image: 'library/nginx:canary' }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should use custom prohibitedTags when provided in the constructor', (t) => {
  const rule = new ServiceImageRequireExplicitTagRule({ prohibitedTags: ['unstable', 'preview'] });

  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithCustomTags).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCustomTags,
  };

  const expectedMessages = [
    rule.getMessage({ serviceName: 'a-service', image: 'nginx:unstable' }),
    rule.getMessage({ serviceName: 'b-service', image: 'library/nginx:preview' }),
  ];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should not return warnings when a specific version tag or digest is used', (t) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithSpecificVersion).toJS() as Record<string, unknown>,
    sourceCode: yamlWithSpecificVersion,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});
