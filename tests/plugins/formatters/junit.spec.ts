import test from 'ava';

import { junitFormatter } from '../../../src/plugins/formatters/junit';
import { lintSummaryExample } from '../../fixtures/diagnostics/lint-summary-example';

// Helper to normalize XML strings by trimming each line and removing empty lines
const normalize = (xml: string): string => {
  return xml
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
};

test('JUnit Formatter: multiple LintResults with explicit output', (t) => {
  const summary = lintSummaryExample;

  const expected = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<testsuites>`,
    `<testsuite name="src/compose.a.yml" errors="2" tests="2">`,
    `<testcase name="rule-1" classname="src/compose.a.yml" time="0">`,
    `<failure message="message one">src/compose.a.yml:1:1</failure>`,
    `</testcase>`,
    `<testcase name="rule-2" classname="src/compose.a.yml" time="0">`,
    `<failure message="message two">src/compose.a.yml:333:2</failure>`,
    `</testcase>`,
    `</testsuite>`,
    `<testsuite name="src/compose.b.yml" errors="1" tests="1">`,
    `<testcase name="rule-3" classname="src/compose.b.yml" time="0">`,
    `<failure message="message three">src/compose.b.yml:5:6</failure>`,
    `</testcase>`,
    `</testsuite>`,
    `</testsuites>`,
  ].join('\n');
  const actual = junitFormatter(summary);

  t.is(normalize(actual), normalize(expected));
});
