import test from 'ava';
import { resolve } from 'node:path';

import * as Formatters from '../../src/formatters/index';
import { loadFormatter } from '../../src/util/formatter-loader';

// @ts-ignore TS2345
test('loadFormatter: built-in formatter by name', async (t) => {
  const formatter = await loadFormatter('json');
  t.is(formatter, Formatters.jsonFormatter);
});

// @ts-ignore TS2345
test('loadFormatter: unknown formatter falls back to stylish', async (t) => {
  const formatter = await loadFormatter('unknown');
  t.is(formatter, Formatters.stylishFormatter);
});

// @ts-ignore TS2345
test('loadFormatter: custom file formatter via relative path', async (t) => {
  const dummyPath = resolve(import.meta.dirname, '../fixtures/formatters/dummy-formatter.ts');
  const formatter = await loadFormatter(`.${dummyPath.slice(process.cwd().length)}`);
  const result = formatter([]);
  t.is(result, 'dummy');
});

// @ts-ignore TS2345
test('loadFormatter: non-existent relative path throws error', async (t) => {
  const badPath = './no-such-file.ts';
  const absolute = resolve(badPath);
  await t.throwsAsync(() => loadFormatter(badPath), {
    message: `Module at ${absolute} does not export a formatter.`,
  });
});

// @ts-ignore TS2345
test('loadFormatter: dclint-formatter- branch loads custom module correctly', async (t) => {
  const modulePath = resolve(import.meta.dirname, '../fixtures/formatters/dclint-formatter-foo.ts');
  const formatter = await loadFormatter(modulePath);
  t.is(typeof formatter, 'function', 'Should return a formatter function');
  t.is(formatter([]), 'foo', 'Formatter should produce correct output');
});

// @ts-ignore TS2345
test('loadFormatter: dclint-formatter- branch throws for missing module', async (t) => {
  const name = 'dclint-formatter-nonexistent';
  await t.throwsAsync(() => loadFormatter(name), {
    message: `Module at ${name} does not export a formatter.`,
  });
});
