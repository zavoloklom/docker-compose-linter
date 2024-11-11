import test from 'ava';
import type { ExecutionContext } from 'ava';
import { parseDocument } from 'yaml';
import ServiceImageRequireExplicitTagRule from '../../src/rules/service-image-require-explicit-tag-rule';
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
test('ServiceImageRequireExplicitTagRule: should return a warning when no tag is specified', (t: ExecutionContext) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithoutTag).toJS() as Record<string, unknown>,
    sourceCode: yamlWithoutTag,
  };

  const errors = rule.check(context);
  t.is(errors.length, 4, 'There should be four warnings when no image tag is specified.');

  const expectedMessages = [
    'Service "a-service" is using the image "nginx", which does not have a concrete version tag.',
    'Service "b-service" is using the image "library/nginx", which does not have a concrete version tag.',
    'Service "c-service" is using the image "docker.io/library/nginx", which does not have a concrete version tag.',
    'Service "d-service" is using the image "my_private.registry:5000/nginx", which does not have a concrete version tag.',
  ];

  errors.forEach((error, index) => {
    t.true(error.message.includes(expectedMessages[index]));
  });
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should return a warning when using latest tag', (t: ExecutionContext) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithLatestTag).toJS() as Record<string, unknown>,
    sourceCode: yamlWithLatestTag,
  };

  const errors = rule.check(context);
  t.is(errors.length, 4, 'There should be four warnings when the latest tag is used.');

  const expectedMessages = [
    'Service "a-service" is using the image "nginx:latest", which does not have a concrete version tag.',
    'Service "b-service" is using the image "library/nginx:latest", which does not have a concrete version tag.',
    'Service "c-service" is using the image "docker.io/library/nginx:latest", which does not have a concrete version tag.',
    'Service "d-service" is using the image "my_private.registry:5000/nginx:latest", which does not have a concrete version tag.',
  ];

  errors.forEach((error, index) => {
    t.true(error.message.includes(expectedMessages[index]));
  });
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should return a warning when using stable tag', (t: ExecutionContext) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithStableTag).toJS() as Record<string, unknown>,
    sourceCode: yamlWithStableTag,
  };

  const errors = rule.check(context);
  t.is(errors.length, 4, 'There should be four warnings when the stable tag is used.');

  const expectedMessages = [
    'Service "a-service" is using the image "nginx:stable", which does not have a concrete version tag.',
    'Service "b-service" is using the image "library/nginx:stable", which does not have a concrete version tag.',
    'Service "c-service" is using the image "docker.io/library/nginx:stable", which does not have a concrete version tag.',
    'Service "d-service" is using the image "my_private.registry:5000/nginx:stable", which does not have a concrete version tag.',
  ];

  errors.forEach((error, index) => {
    t.true(error.message.includes(expectedMessages[index]));
  });
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should return a warning when using prohibited tags', (t: ExecutionContext) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithProhibitedTags).toJS() as Record<string, unknown>,
    sourceCode: yamlWithProhibitedTags,
  };

  const errors = rule.check(context);
  t.is(errors.length, 6, 'There should be six warnings when prohibited tags are used.');

  const expectedMessages = [
    'Service "a-service" is using the image "nginx:edge", which does not have a concrete version tag.',
    'Service "b-service" is using the image "library/nginx:test", which does not have a concrete version tag.',
    'Service "c-service" is using the image "docker.io/library/nginx:nightly", which does not have a concrete version tag.',
    'Service "d-service" is using the image "my_private.registry:5000/nginx:dev", which does not have a concrete version tag.',
    'Service "e-service" is using the image "library/nginx:beta", which does not have a concrete version tag.',
    'Service "f-service" is using the image "library/nginx:canary", which does not have a concrete version tag.',
  ];

  errors.forEach((error, index) => {
    t.true(error.message.includes(expectedMessages[index]));
  });
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should use custom prohibitedTags when provided in the constructor', (t: ExecutionContext) => {
  const rule = new ServiceImageRequireExplicitTagRule({ prohibitedTags: ['unstable', 'preview'] });

  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithCustomTags).toJS() as Record<string, unknown>,
    sourceCode: yamlWithCustomTags,
  };

  const errors = rule.check(context);
  t.is(errors.length, 2, 'There should be two warnings for custom prohibited tags "unstable" and "preview".');

  const expectedMessages = [
    'Service "a-service" is using the image "nginx:unstable", which does not have a concrete version tag.',
    'Service "b-service" is using the image "library/nginx:preview", which does not have a concrete version tag.',
  ];

  errors.forEach((error, index) => {
    t.true(error.message.includes(expectedMessages[index]));
  });
});

// @ts-ignore TS2349
test('ServiceImageRequireExplicitTagRule: should not return warnings when a specific version tag or digest is used', (t: ExecutionContext) => {
  const rule = new ServiceImageRequireExplicitTagRule();
  const context: LintContext = {
    path: filePath,
    content: parseDocument(yamlWithSpecificVersion).toJS() as Record<string, unknown>,
    sourceCode: yamlWithSpecificVersion,
  };

  const errors = rule.check(context);
  t.is(errors.length, 0, 'There should be no warnings when a specific version tag or digest is used.');
});
