import test from 'ava';

import { jsonFormatter } from '../../../src/plugins/formatters/json';
import { lintSummaryExample } from '../../fixtures/diagnostics/lint-summary-example';

test('JSON Formatter: multiple LintResults', (t) => {
  const summary = lintSummaryExample;

  const expected = JSON.stringify(summary, null, 2);
  const actual = jsonFormatter(summary);

  t.is(actual, expected);
});
