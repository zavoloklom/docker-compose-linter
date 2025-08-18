import anyTest, { TestFn } from 'ava';
import { resolve } from 'node:path';

import { DefaultFormatterLoader } from '../../../src/infrastructure/formatter-loader/default-formatter-loader';
import * as Formatters from '../../../src/plugins/formatters/index';
import { InMemoryLogger } from '../../fixtures/logger/in-memory-logger';

import type { FormatterLoader } from '../../../src/application/ports/formatter-loader';
import type { LintSummary } from '../../../src/domain/models/lint-summary';

// ----------------------
// Test context
// ----------------------
type TestContext = {
  loader: FormatterLoader;
};

const test = anyTest as TestFn<TestContext>;

// ----------------------
// Hooks
// ----------------------
test.beforeEach((t) => {
  const logger = new InMemoryLogger();
  t.context.loader = new DefaultFormatterLoader(logger);
});

// ----------------------
// Tests
// ----------------------
test('loadFormatter: built-in formatter by name', async (t) => {
  const formatter = await t.context.loader.load('json');
  t.is(formatter, Formatters.jsonFormatter);
});

test('loadFormatter: unknown formatter falls back to stylish', async (t) => {
  const formatter = await t.context.loader.load('unknown');
  t.is(formatter, Formatters.stylishFormatter);
});

test('loadFormatter: custom file formatter via relative path', async (t) => {
  const dummyPath = resolve(import.meta.dirname, '../../fixtures/formatters/dummy-formatter.ts');
  const formatter = await t.context.loader.load(`.${dummyPath.slice(process.cwd().length)}`);
  const result = formatter({} as LintSummary);
  t.is(result, 'dummy');
});

test('loadFormatter: non-existent relative path throws error', async (t) => {
  const badPath = './no-such-file.ts';
  const absolute = resolve(badPath);
  await t.throwsAsync(() => t.context.loader.load(badPath), {
    message: `Module at ${absolute} does not export a formatter.`,
  });
});

test('loadFormatter: dclint-formatter- branch loads custom module correctly', async (t) => {
  const modulePath = resolve(import.meta.dirname, '../../fixtures/formatters/dclint-formatter-foo.ts');
  const formatter = await t.context.loader.load(modulePath);
  t.is(typeof formatter, 'function', 'Should return a formatter function');
  t.is(formatter({} as LintSummary), 'foo', 'Formatter should produce correct output');
});

test('loadFormatter: dclint-formatter- branch throws for missing module', async (t) => {
  const name = 'dclint-formatter-nonexistent';
  await t.throwsAsync(() => t.context.loader.load(name), {
    message: `Module at ${name} does not export a formatter.`,
  });
});
