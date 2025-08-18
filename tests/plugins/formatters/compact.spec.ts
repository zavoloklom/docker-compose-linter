import test from 'ava';

import { compactFormatter } from '../../../src/plugins/formatters/compact';
import { lintSummaryExample } from '../../fixtures/diagnostics/lint-summary-example';

test('Compact Formatter: multiple LintResults and messages', (t) => {
  const summary = lintSummaryExample;

  const expected = [
    'src/compose.a.yml:1:1 message one [rule-1]',
    'src/compose.a.yml:333:2 message two [rule-2]',
    '',
    'src/compose.b.yml:5:6 message three [rule-3]',
  ].join('\n');
  const actual = compactFormatter(summary);

  t.is(actual, expected);
});
