// eslint-disable-next-line ava/use-test
import { type ExecutionContext } from 'ava';

import { type LintContext } from '../src/linter/linter.types';
import { type Rule } from '../src/rules/rules.types';

const normalizeYAML = (yaml: string) => yaml.replaceAll(/\s+/gu, ' ').trim();

// Helper for testing rules
const runRuleTest = (t: ExecutionContext, rule: Rule, context: LintContext, expectedMessages: string[]) => {
  const errors = rule.check(context);

  t.is(errors.length, expectedMessages.length, 'Number of errors should match the number of expected messages.');

  for (const [index, expectedMessage] of expectedMessages.entries()) {
    t.is(errors[index].message, expectedMessage);
  }
};

export { normalizeYAML, runRuleTest };
