import test from 'ava';

import NoQuotesInVolumesRule from '../../src/rules/no-quotes-in-volumes-rule';
import { runRuleTest } from '../test-utils';

import type { LintContext } from '../../src/linter/linter.types';

// Sample YAML for tests
const correctYAML = `
services:
  web:
    volumes:
      - data
`;

const incorrectYAML = `
services:
  web:
    volumes:
      - "data"
`;

// @ts-ignore TS2349
test('NoQuotesInVolumesRule: should not return errors for YAML without quotes in volumes', (t) => {
  const rule = new NoQuotesInVolumesRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: {}, // You can mock content if necessary for your logic
    sourceCode: correctYAML,
  };

  const expectedMessages: string[] = [];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoQuotesInVolumesRule: should return errors for YAML with quotes in volumes', (t) => {
  const rule = new NoQuotesInVolumesRule();
  const context: LintContext = {
    path: '/docker-compose.yml',
    content: {}, // Mock content as needed
    sourceCode: incorrectYAML,
  };

  const expectedMessages = [rule.getMessage()];
  runRuleTest(t, rule, context, expectedMessages);
});

// @ts-ignore TS2349
test('NoQuotesInVolumesRule: should fix YAML with quotes in volumes', (t) => {
  const rule = new NoQuotesInVolumesRule();
  const fixedYAML = rule.fix(incorrectYAML);

  t.true(fixedYAML.includes('- data'), 'The quotes around volume name should be removed.');
  t.false(fixedYAML.includes('"data"'), 'The volume name should no longer have quotes.');
});

// @ts-ignore TS2349
test('NoQuotesInVolumesRule: should not modify YAML without quotes in volumes', (t) => {
  const rule = new NoQuotesInVolumesRule();
  const fixedYAML = rule.fix(correctYAML);

  t.is(fixedYAML.trim(), correctYAML.trim(), 'YAML without quotes should remain unchanged.');
});
