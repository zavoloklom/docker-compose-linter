import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type NoQuotesInVolumesIssueContext,
  NoQuotesInVolumesRule,
} from '../../../src/plugins/rules/no-quotes-in-volumes-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
services:
  web:
    volumes:
      - data
      - type: volume
        source: db-data
        target: /data
        volume:
          nocopy: true
          subpath: sub
      - data:data
`;

const invalidYaml = `
services:
  web:
    volumes:
      - 'data'
      - type: volume
        source: "db-data"
        target: '/data'
        volume:
          nocopy: true
          subpath: 'sub'
      - "data:data"
`;

const FILE_PATH = '/docker-compose.yml';

test('getMessage(): should provide correct message', (t) => {
  const rule = new NoQuotesInVolumesRule();
  const issueContext: NoQuotesInVolumesIssueContext = { serviceName: 'a-service', volume: 'path' };
  const expectedMessage = `Unexpected quotes around volume "${issueContext.volume}" in service "${issueContext.serviceName}".`;

  t.regex(rule.getMessage(issueContext), /^(?:Expected|Unexpected)/u);
  t.is(rule.getMessage(issueContext), expectedMessage);
});

test('check(): should not return errors for a compliant compose file', (t) => {
  const rule = new NoQuotesInVolumesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors when the rule is violated', (t) => {
  const rule = new NoQuotesInVolumesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ serviceName: 'web', volume: 'data' }),
      line: 5,
    },
    {
      message: rule.getMessage({ serviceName: 'web', volume: 'db-data' }),
      line: 7,
    },
    {
      message: rule.getMessage({ serviceName: 'web', volume: '/data' }),
      line: 8,
    },
    {
      message: rule.getMessage({ serviceName: 'web', volume: 'sub' }),
      line: 11,
    },
    {
      message: rule.getMessage({ serviceName: 'web', volume: 'data:data' }),
      line: 12,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('fix(): should fix YAML with quotes around volumes', (t) => {
  const rule = new NoQuotesInVolumesRule();
  const context = new YamlComposeDocument(FILE_PATH, invalidYaml);

  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.true(fixedYaml.includes('- data'), 'The quotes around volume name should be removed.');
  t.false(fixedYaml.includes('"data"'), 'The volume name should no longer have quotes.');
});

test('fix(): should not modify YAML without quotes around volumes', (t) => {
  const rule = new NoQuotesInVolumesRule();
  const context = new YamlComposeDocument(FILE_PATH, correctYaml);

  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), correctYaml.trim());
});
