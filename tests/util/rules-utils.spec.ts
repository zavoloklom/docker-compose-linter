/* eslint-disable max-classes-per-file, class-methods-use-this */

import test from 'ava';
import esmock from 'esmock';
import type { Config } from '../../src/config/config.types';
import type {
  LintMessage,
  LintMessageType,
  LintRule,
  LintRuleCategory,
  LintRuleSeverity,
} from '../../src/linter/linter.types';
import { getRuleDefinition } from '../../src/util/rules-utils';

class MockRule implements LintRule {
  name = 'mock-rule';

  type: LintMessageType = 'warning';

  category: LintRuleCategory = 'style';

  severity: LintRuleSeverity = 'minor';

  fixable = true;

  meta = { description: 'Mock rule description', url: 'https://example.com' };

  check(content: object, type?: LintMessageType): LintMessage[] {
    return [];
  }

  fix(content: string): string {
    return '';
  }

  getMessage(details?: object): string {
    return '';
  }
}

class AnotherMockRule implements LintRule {
  name = 'another-mock-rule';

  type: LintMessageType = 'error';

  category: LintRuleCategory = 'security';

  severity: LintRuleSeverity = 'critical';

  fixable = false;

  meta = { description: 'Another mock rule description', url: 'https://example.com/another' };

  options: { customOption: boolean };

  check(content: object, type?: LintMessageType): LintMessage[] {
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
  const { loadLintRules }: { loadLintRules: (config: Config) => Promise<LintRule[]> } = await esmock(
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
  // @ts-ignore
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
  const { loadLintRules }: { loadLintRules: (config: Config) => Promise<LintRule[]> } = await esmock(
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

// @ts-ignore TS2349
test('getRuleDefinition - should return correct rule definition', (t) => {
  const rule = new MockRule();
  const definition = getRuleDefinition(rule);

  t.deepEqual(definition, {
    name: 'mock-rule',
    type: 'warning',
    category: 'style',
    severity: 'minor',
    fixable: true,
    meta: { description: 'Mock rule description', url: 'https://example.com' },
    hasFixFunction: true,
    hasOptions: false,
  });
});
