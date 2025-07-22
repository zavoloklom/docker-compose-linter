import test from 'ava';
import esmock from 'esmock';

import * as Rules from '../../src/rules/index';
import { RequireQuotesInPortsRule } from '../../src/rules/require-quotes-in-ports-rule';
import { loadLintRules } from '../../src/util/rules-utils';

import type { Config, ConfigRule } from '../../src/config/config.types';
import type { Rule, RuleName } from '../../src/rules/rules.types';

// Grab all your exported rule classes
const ruleClasses = Object.values(Rules).filter((rule) => typeof rule === 'function') as Array<
  new (...arguments_: Rule[]) => Rule
>;
const ruleNames = ruleClasses.map((cls) => (cls as unknown as Rule).name).sort((a, b) => a.localeCompare(b));

const makeConfig = (overrides: { [ruleName: RuleName]: ConfigRule }): Config => ({
  rules: overrides,
  quiet: false,
  debug: false,
  exclude: [],
});

test('empty config loads all rules', (t) => {
  const config = makeConfig({});
  const active = loadLintRules(config);
  const activeNames = active.map((rule) => rule.name).sort((a, b) => a.localeCompare(b));

  t.deepEqual(activeNames, ruleNames);
});

test('disabling one rule excludes it', (t) => {
  // eslint-disable-next-line prefer-destructuring
  const disabled = ruleNames[0];
  const config = makeConfig({ [disabled]: 0 });
  const active = loadLintRules(config);
  const activeNames = active.map((rule) => rule.name);

  t.is(active.length, ruleClasses.length - 1, 'should load all but the disabled rule');
  t.false(activeNames.includes(disabled));
});

test('single-level config sets target to warning and loads all rules', (t) => {
  // eslint-disable-next-line prefer-destructuring
  const target = ruleNames[1];
  const config = makeConfig({ [target]: 1 });
  const active = loadLintRules(config);

  t.is(active.length, ruleClasses.length, 'should load every rule');

  const targetInst = active.find((rule) => rule.name === target);
  t.truthy(targetInst);
  t.is(targetInst!.type, 'warning', 'target rule type should be warning');

  // Other rules unchanged (not warning if originally different)
  for (const inst of active) {
    if (inst.name === target) continue;
    if (inst.type === 'warning') continue; // Skip if default was warning
    t.not(inst.name, target, `rule ${inst.name} should retain its original type`);
  }
});

test('array config sets error level and passes options', (t) => {
  const target = RequireQuotesInPortsRule.name;
  const options = { quoteType: 'single' };
  const config = makeConfig({ [target]: [2, options] });
  const active = loadLintRules(config);
  const expectedOptions = {
    portsSections: ['ports', 'expose'],
    quoteType: 'single',
  };

  // All rules should load
  t.is(active.length, ruleClasses.length, 'should load every rule');

  // Target rule should have error level and correct options
  const instance = active.find((rule) => rule.name === target) as Rule;
  t.truthy(instance, 'target rule should be present');
  t.is(instance.type, 'error', 'target rule type should be error');
  t.deepEqual(instance.options, expectedOptions, 'target rule options should be passed through');
});

test('non-function export logs error and skips', async (t) => {
  let loggedMessage = '';
  const fakeLogger = {
    init: () => ({
      error: (message: string) => {
        loggedMessage = message;
      },
    }),
  };

  // Mock `Rules` module and `Logger` dependency
  const stubRules = { __esModule: true, NotARule: { toString: () => 'NotARule' } };
  const { loadLintRules: stubbedLoader }: { loadLintRules: (config: Config) => Promise<Rule[]> } = await esmock(
    '../../src/util/rules-utils',
    {
      '../../src/util/logger': { Logger: fakeLogger },
      '../../src/rules/index': stubRules,
    },
  );

  const active = await stubbedLoader(makeConfig({}));

  t.is(active.length, ruleClasses.length, 'Wrong rule should not skip rule loading');
  t.is(loggedMessage, 'Error loading rule: [object Object]');
});

test('constructor throws logs error and skips', async (t) => {
  const loggerError: string[] = [];
  const fakeLogger = {
    init: () => ({
      error: (message: string, error: Error) => loggerError.push(message),
    }),
  };

  class ThrowingRule {
    static readonly name = 'ThrowingRule';
    constructor() {
      throw new Error('broken');
    }
  }
  const { loadLintRules: stubLoader }: { loadLintRules: (config: Config) => Promise<Rule[]> } = await esmock(
    '../../src/util/rules-utils',
    {
      '../../src/util/logger': { Logger: fakeLogger },
      '../../src/rules/index': { ThrowingRule },
    },
  );

  const active = await stubLoader(makeConfig({}));

  t.is(active.length, ruleClasses.length, 'Constructor failure should not skip rule loading');
  t.is(loggerError[0], 'Error loading rule: ThrowingRule');
});
