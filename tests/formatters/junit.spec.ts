import test from 'ava';

import junitFormatter from '../../src/formatters/junit';

import type { LintResult } from '../../src/linter/linter.types';

// Helper to normalize XML strings by trimming each line and removing empty lines
const normalize = (xml: string): string => {
  return xml
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
};

// @ts-ignore TS2349
test('JUnit Formatter: single LintResult with explicit output', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'lib/foo.js',
      messages: [
        {
          rule: 'no-<bug>',
          message: 'some & error',
          severity: 'minor',
          line: 1,
          column: 2,
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
        },
      ],
      errorCount: 0,
      warningCount: 1,
    },
  ];

  const actual = junitFormatter(input);

  const expected = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<testsuites>`,
    `<testsuite name="lib/foo.js" errors="1" tests="1">`,
    `<testcase name="no-&lt;bug&gt;" classname="lib/foo.js" time="0">`,
    `<failure message="some &amp; error">lib/foo.js:1:2</failure>`,
    `</testcase>`,
    `</testsuite>`,
    `</testsuites>`,
  ].join('\n');

  t.is(normalize(actual), normalize(expected));
});

// @ts-ignore TS2349
test('JUnit Formatter: multiple LintResults with explicit output', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'a&b.js',
      messages: [
        {
          rule: 'rule1',
          message: 'first <test>',
          severity: 'minor',
          line: 10,
          column: 20,
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
        },
        {
          rule: 'rule2',
          message: 'second >test<',
          severity: 'major',
          line: 11,
          column: 21,
          type: 'error',
          category: 'security',
          fixable: true,
          data: {},
        },
      ],
      errorCount: 1,
      warningCount: 1,
    },
    {
      filePath: 'c.js',
      messages: [
        {
          rule: 'rule3',
          message: 'only one',
          severity: 'minor',
          line: 5,
          column: 6,
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
        },
      ],
      errorCount: 0,
      warningCount: 1,
    },
  ];

  const actual = junitFormatter(input);

  const expected = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<testsuites>`,
    `<testsuite name="a&amp;b.js" errors="2" tests="2">`,
    `<testcase name="rule1" classname="a&amp;b.js" time="0">`,
    `<failure message="first &lt;test&gt;">a&amp;b.js:10:20</failure>`,
    `</testcase>`,
    `<testcase name="rule2" classname="a&amp;b.js" time="0">`,
    `<failure message="second &gt;test&lt;">a&amp;b.js:11:21</failure>`,
    `</testcase>`,
    `</testsuite>`,
    `<testsuite name="c.js" errors="1" tests="1">`,
    `<testcase name="rule3" classname="c.js" time="0">`,
    `<failure message="only one">c.js:5:6</failure>`,
    `</testcase>`,
    `</testsuite>`,
    `</testsuites>`,
  ].join('\n');

  t.is(normalize(actual), normalize(expected));
});
