/* eslint-disable max-classes-per-file, class-methods-use-this */

import test from 'ava';
import esmock from 'esmock';
import type { Config } from '../../src/config/config.types';
import type { Rule, RuleCategory, RuleSeverity, RuleType, RuleMessage } from '../../src/rules/rules.types';

class MockRule implements Rule {
  name = 'mock-rule';

  type: RuleType = 'warning';

  category: RuleCategory = 'style';

  severity: RuleSeverity = 'minor';

  fixable = true;

  meta = { description: 'Mock rule description', url: 'https://example.com' };

  check(content: object, type?: RuleType): RuleMessage[] {
    return [];
  }

  fix(content: string): string {
    return '';
  }

  getMessage(details?: object): string {
    return '';
  }
}

class AnotherMockRule implements Rule {
  name = 'another-mock-rule';

  type: RuleType = 'error';

  category: RuleCategory = 'security';

  severity: RuleSeverity = 'critical';

  fixable = false;

  meta = { description: 'Another mock rule description', url: 'https://example.com/another' };

  options: { customOption: boolean };

  check(content: object, type?: RuleType): RuleMessage[] {
    return [];
  }

  getMessage(details?: object): string {
    return '';
  }

  constructor(options?: { customOption: boolean }) {
    const defaultOptions = {
      customOption: false,
    };
    this.options = { ...defaultOptions, ...options };
  }
}

// @ts-ignore TS2349
test('loadLintRules - should load and configure rules based on config', async (t) => {
  // Mock configuration
  const mockConfig: Config = {
    rules: {
      'mock-rule': [2],
      'another-mock-rule': [1, { customOption: true }],
    },
    quiet: false,
    debug: false,
    exclude: [],
  };

  // Mock logger
  const mockLogger = {
    init: () => ({
      error: () => {},
    }),
  };

  // Mock `Rules` module and `Logger` dependency
  const { loadLintRules }: { loadLintRules: (config: Config) => Promise<Rule[]> } = await esmock(
    '../../src/util/rules-utils',
    {
      '../../src/util/logger': { Logger: mockLogger },
      '../../src/rules/index': { default: { MockRule, AnotherMockRule } },
    },
  );

  const rules = await loadLintRules(mockConfig);

  t.is(rules.length, 2);

  const [rule1, rule2] = rules;

  t.is(rule1.name, 'mock-rule');
  t.is(rule1.type, 'error');
  t.is(rule1.category, 'style');
  t.true(rule1.fixable);

  t.is(rule2.name, 'another-mock-rule');
  t.is(rule2.type, 'warning');
  t.is(rule2.category, 'security');
  t.false(rule2.fixable);
  // @ts-expect-error
  t.truthy(rule2.options?.customOption);
});

// @ts-ignore TS2349
test('loadLintRules - should log error for invalid rules', async (t) => {
  const mockConfig: Config = {
    rules: {},
    quiet: false,
    debug: false,
    exclude: [],
  };

  // Mock Logger
  const loggerError = [];
  const mockLogger = {
    init: () => ({
      error: (message: string) => loggerError.push(message),
      info: () => {},
      warn: () => {},
      debug: () => {},
    }),
  };

  // Mock `Rules` module with an invalid rule
  const { loadLintRules }: { loadLintRules: (config: Config) => Promise<Rule[]> } = await esmock(
    '../../src/util/rules-utils',
    {
      '../../src/util/logger': { Logger: mockLogger },
      '../../src/rules/index': {
        default: {
          // Invalid rule without required structure
          InvalidRule: 'test',
        },
      },
    },
  );

  const rules = await loadLintRules(mockConfig);

  t.is(rules.length, 0);
  t.is(loggerError.length, 2);
});
