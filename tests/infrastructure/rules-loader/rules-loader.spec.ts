import test from 'ava';

import { Rule, RuleType } from '../../../src/domain/models/rule';
import { RuleConstructor } from '../../../src/domain/models/rule-constructor';
import { DefaultRulesLoader } from '../../../src/infrastructure/rules-loader/default-rules-loader';
import * as Rules from '../../../src/plugins/rules/index';
import { NoBuildAndImageRule } from '../../../src/plugins/rules/no-build-and-image-rule';
import { InMemoryLogger } from '../../fixtures/logger/in-memory-logger';
import { DummyAnotherRule, DummyRule } from '../../fixtures/rules/index';

import type { Config, ConfigRuleOptions } from '../../../src/application/dto/config';

// ----------------------
// Helper functions
// ----------------------
// Grab all your exported rule classes
const ruleClasses = Object.values(Rules).filter((rule) => typeof rule === 'function') as Array<RuleConstructor>;
const ruleNames = ruleClasses
  .map((rule) => {
    return rule.ID;
  })
  .sort((a, b) => a.localeCompare(b));
// Grab all your exported rule classes
const customRulesNames = [DummyRule.ID, DummyAnotherRule.ID];
const allRulesNames = [...ruleNames, ...customRulesNames].sort((a, b) => a.localeCompare(b));
// Logger
const logger = new InMemoryLogger();

const makeConfig = (overrides: { [ruleName: string]: ConfigRuleOptions }): Config => ({
  rules: overrides,
  quiet: false,
  debug: false,
  exclude: [],
  plugins: [],
});

// ----------------------
// Tests
// ----------------------
test('load(): empty config loads all rules + cache', async (t) => {
  const config = makeConfig({});
  const rulesLoader = new DefaultRulesLoader(config, logger);

  const active = await rulesLoader.load();
  const activeNames = active.map((rule) => rule.id).sort((a, b) => a.localeCompare(b));

  t.deepEqual(activeNames, ruleNames);

  const fromCache = await rulesLoader.load();
  const activeNamesFromCache = fromCache.map((rule) => rule.id).sort((a, b) => a.localeCompare(b));
  t.deepEqual(activeNamesFromCache, ruleNames);
});

test('load(): plugins loaded correctly for "export from"', async (t) => {
  const config = {
    rules: {},
    quiet: false,
    debug: false,
    exclude: [],
    plugins: ['./tests/fixtures/rules/index.ts'],
  };
  const rulesLoader = new DefaultRulesLoader(config, logger);

  const active = await rulesLoader.load();
  const activeNames = active.map((rule) => rule.id).sort((a, b) => a.localeCompare(b));

  t.deepEqual(activeNames, allRulesNames);
});

test('load(): plugins loaded correctly for "export const rules"', async (t) => {
  const config = {
    rules: {},
    quiet: false,
    debug: false,
    exclude: [],
    plugins: ['./tests/fixtures/rules/index-rules.ts'],
  };
  const rulesLoader = new DefaultRulesLoader(config, logger);

  const active = await rulesLoader.load();
  const activeNames = active.map((rule) => rule.id).sort((a, b) => a.localeCompare(b));

  t.deepEqual(activeNames, allRulesNames);
});

test('load(): plugins loaded correctly for "export default"', async (t) => {
  const config = {
    rules: {},
    quiet: false,
    debug: false,
    exclude: [],
    plugins: ['./tests/fixtures/rules/index-default.ts'],
  };
  const rulesLoader = new DefaultRulesLoader(config, logger);

  const active = await rulesLoader.load();
  const activeNames = active.map((rule) => rule.id).sort((a, b) => a.localeCompare(b));

  t.deepEqual(activeNames, allRulesNames);
});

test('load(): plugins loaded with error for incorrect export', async (t) => {
  const config = {
    rules: {},
    quiet: false,
    debug: false,
    exclude: [],
    plugins: ['./tests/fixtures/rules/index-wrong.ts'],
  };
  const rulesLoader = new DefaultRulesLoader(config, logger);

  const error = await t.throwsAsync(async () => await rulesLoader.load());
  t.truthy(error);
  t.true(String(error.message).includes('does not export rules'));
});

test('load(): plugins loaded with error for empty export', async (t) => {
  const config = {
    rules: {},
    quiet: false,
    debug: false,
    exclude: [],
    plugins: ['./tests/fixtures/rules/index-empty.ts'],
  };
  const rulesLoader = new DefaultRulesLoader(config, logger);

  const error = await t.throwsAsync(async () => await rulesLoader.load());
  t.truthy(error);
  t.true(String(error.message).includes('does not export rules'));
});

test('load(): plugins loaded with error for incorrect rule', async (t) => {
  const config = {
    rules: {},
    quiet: false,
    debug: false,
    exclude: [],
    plugins: ['./tests/fixtures/rules/index-wrong-rule.ts'],
  };
  const rulesLoader = new DefaultRulesLoader(config, logger);

  const error = await t.throwsAsync(async () => await rulesLoader.load());
  t.truthy(error);
  t.true(String(error.message).includes('Class is not implementing Rule interface'));
});

test('load(): disabling one rule in config excludes it', async (t) => {
  const disabled = ruleNames[0];

  const config = makeConfig({ [disabled]: 0 });
  const rulesLoader = new DefaultRulesLoader(config, logger);

  const active = await rulesLoader.load();
  const activeNames = active.map((rule) => rule.id).sort((a, b) => a.localeCompare(b));

  t.is(active.length, ruleClasses.length - 1, 'should load all but the disabled rule');
  t.false(activeNames.includes(disabled));
});

test('load(): single-level config sets target to warning and loads all rules (including customs)', async (t) => {
  const warnings: { [ruleName: string]: ConfigRuleOptions } = {};
  for (const ruleName of ruleNames) {
    warnings[ruleName] = 1;
  }
  for (const ruleName of customRulesNames) {
    warnings[ruleName] = 1;
  }

  const config = {
    rules: warnings,
    quiet: false,
    debug: false,
    exclude: [],
    plugins: ['./tests/fixtures/rules/index.ts'],
  };
  const rulesLoader = new DefaultRulesLoader(config, logger);

  const rules = await rulesLoader.load();

  t.is(rules.length, allRulesNames.length);

  for (const rule of rules) {
    t.is(rule.type, RuleType.WARNING);
  }
});

test('load(): array config sets error level and passes options', async (t) => {
  const target = NoBuildAndImageRule.ID;
  const options = { checkPullPolicy: false };
  const config = makeConfig({ [target]: [2, options] });

  const rulesLoader = new DefaultRulesLoader(config, logger);
  const active = await rulesLoader.load();

  // All rules should load
  t.is(active.length, ruleClasses.length, 'should load every rule');

  // Target rule should have error level and correct options
  const instance = active.find((rule) => rule.id === target) as Rule;
  t.truthy(instance, 'target rule should be present');
  t.is(instance.type, RuleType.ERROR, 'target rule type should be error');
  t.deepEqual(instance.options, options, 'target rule options should be passed through');
});
