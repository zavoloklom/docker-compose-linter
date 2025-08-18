import test from 'ava';

import { githubFormatter } from '../../../src/plugins/formatters/github';
import { lintSummaryExample } from '../../fixtures/diagnostics/lint-summary-example';

test('Github Formatter: multiple LintResults and messages', (t) => {
  const summary = lintSummaryExample;

  const expectedLines = [
    '::warning file=src/compose.a.yml,line=1,col=1::rule-1: message one',
    '::error file=src/compose.a.yml,line=333,col=2::rule-2: message two',
    '::warning file=src/compose.b.yml,line=5,col=6::rule-3: message three',
  ];
  const actual = githubFormatter(summary);

  t.deepEqual(actual.split('\n'), expectedLines);
});
