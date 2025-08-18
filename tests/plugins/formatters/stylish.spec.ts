import test from 'ava';
import { resolve } from 'node:path';
import stripAnsi from 'strip-ansi';

import { stylishFormatter } from '../../../src/plugins/formatters/stylish';
import { lintSummaryExample } from '../../fixtures/diagnostics/lint-summary-example';

test('stylishFormatter: multiple files explicit output', (t) => {
  const summary = lintSummaryExample;

  const pathA = resolve('src/compose.a.yml');
  const pathB = resolve('src/compose.b.yml');

  const expected = `
${pathA}
   1:1     warning  message one  rule-1
 333:2     error  message two  rule-2

${pathB}
   5:6     warning  message three  rule-3

✖ 3 problems (1 errors, 2 warnings)
0 errors and 1 warnings potentially fixable with the \`--fix\` option.
`;

  const actual = stylishFormatter(summary);

  t.is(stripAnsi(actual), expected);
});
