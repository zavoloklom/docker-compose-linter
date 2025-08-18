/* eslint-disable sonarjs/no-duplicate-string */
import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type RequireExplicitImageTagIssueContext,
  RequireExplicitImageTagRule,
} from '../../../src/plugins/rules/require-explicit-image-tag-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYamlWithDefaultOptions = `
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
  g-service:
    image: nginx:latest@sha256:0ed5d5928d4737458944eb604cc8509e245c3e19d02ad83935398bc4b991aac7
`;

const invalidYamlWithDefaultOptions = `
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

// YAML with services using prohibited tags
const yamlWithProhibitedTags = `
services:
  a-service:
    image: nginx:latest
  b-service:
    image: library/nginx:stable
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
    image: docker.io/library/nginx:latest
  d-service:
    image: my_private.registry:5000/nginx:1.21.0
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new RequireExplicitImageTagRule();

  let issueContext: RequireExplicitImageTagIssueContext = {
    serviceName: 'service-a',
    image: 'redis',
    tag: null,
  };
  let expectedMessage = `Expected specific image tag for image "${issueContext.image}" in service "${issueContext.serviceName}".`;

  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);

  issueContext = { serviceName: 'service-a', image: 'redis', tag: '5' };
  expectedMessage = `Unexpected image tag "${issueContext.tag}" for image "${issueContext.image}" in service "${issueContext.serviceName}".`;

  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new RequireExplicitImageTagRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated (empty tags)', (t) => {
  const rule = new RequireExplicitImageTagRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYamlWithDefaultOptions);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'a-service', image: 'nginx', tag: null }),
      line: 4,
    },
    {
      message: rule.getMessage({ serviceName: 'b-service', image: 'library/nginx', tag: null }),
      line: 6,
    },
    {
      message: rule.getMessage({ serviceName: 'c-service', image: 'docker.io/library/nginx', tag: null }),
      line: 8,
    },
    {
      message: rule.getMessage({ serviceName: 'd-service', image: 'my_private.registry:5000/nginx', tag: null }),
      line: 10,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated (prohibited tags)', (t) => {
  const rule = new RequireExplicitImageTagRule();
  const context = new YamlComposeDocument(FILE_PATH, yamlWithProhibitedTags);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'a-service', image: 'nginx', tag: 'latest' }),
      line: 4,
    },
    {
      message: rule.getMessage({ serviceName: 'b-service', image: 'library/nginx', tag: 'stable' }),
      line: 6,
    },
    {
      message: rule.getMessage({ serviceName: 'c-service', image: 'docker.io/library/nginx', tag: 'nightly' }),
      line: 8,
    },
    {
      message: rule.getMessage({ serviceName: 'd-service', image: 'my_private.registry:5000/nginx', tag: 'dev' }),
      line: 10,
    },
    {
      message: rule.getMessage({ serviceName: 'e-service', image: 'library/nginx', tag: 'beta' }),
      line: 12,
    },
    {
      message: rule.getMessage({ serviceName: 'f-service', image: 'library/nginx', tag: 'canary' }),
      line: 14,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when { prohibitedTags: ["unstable", "preview"] }', (t) => {
  const rule = new RequireExplicitImageTagRule({ prohibitedTags: ['unstable', 'preview'] });
  const context = new YamlComposeDocument(FILE_PATH, yamlWithCustomTags);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'a-service', image: 'nginx', tag: 'unstable' }),
      line: 4,
    },
    {
      message: rule.getMessage({ serviceName: 'b-service', image: 'library/nginx', tag: 'preview' }),
      line: 6,
    },
  ];
  runRuleTest(t, rule, context, expected);
});
