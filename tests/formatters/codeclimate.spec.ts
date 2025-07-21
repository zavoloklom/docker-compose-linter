import test from 'ava';

import { codeclimateFormatter } from '../../src/formatters/codeclimate';

import type { LintResult } from '../../src/linter/linter.types';

// @ts-ignore TS2349
test('Codeclimate Formatter: single LintResult with one message', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'lib/foo.js',
      messages: [
        {
          rule: 'no-unused-vars',
          message: 'x is defined but never used',
          severity: 'minor',
          line: 12,
          column: 4,
          endLine: 12,
          endColumn: 5,
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

  const expected = [
    {
      type: 'issue',
      // eslint-disable-next-line camelcase
      check_name: 'no-unused-vars',
      description: 'x is defined but never used',
      content: { body: 'Error found in no-unused-vars' },
      categories: ['Style'],
      location: {
        path: 'lib/foo.js',
        lines: { begin: 12, end: 12 },
        positions: {
          begin: { line: 12, column: 4 },
          end: { line: 12, column: 5 },
        },
      },
      severity: 'minor',
      fingerprint: '7fe5947903ddb8f49eb72e21d5ba5c5b',
    },
  ];

  const actual = JSON.parse(codeclimateFormatter(input)) as [];

  t.deepEqual(actual, expected);
});

// @ts-ignore TS2349
test('Codeclimate Formatter: multiple files and messages', (t) => {
  const input: LintResult[] = [
    {
      filePath: 'src/a.js',
      messages: [
        {
          rule: 'r1',
          message: 'm1',
          severity: 'major',
          line: 1,
          column: 1,
          type: 'warning',
          category: 'style',
          fixable: false,
          data: {},
        },
        {
          rule: 'r2',
          message: 'm2',
          severity: 'major',
          line: 2,
          column: 2,
          endLine: 3,
          endColumn: 4,
          type: 'error',
          category: 'style',
          fixable: false,
          data: {},
        },
      ],
      errorCount: 1,
      warningCount: 1,
    },
    {
      filePath: 'src/b.js',
      messages: [
        {
          rule: 'r3',
          message: 'm3',
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

  const expected = [
    {
      type: 'issue',
      // eslint-disable-next-line camelcase
      check_name: 'r1',
      description: 'm1',
      content: { body: 'Error found in r1' },
      categories: ['Style'],
      location: {
        path: 'src/a.js',
        lines: { begin: 1, end: 1 },
        positions: {
          begin: { line: 1, column: 1 },
          end: { line: 1, column: 1 },
        },
      },
      severity: 'major',
      fingerprint: 'bf79d96718924b4244f1b5708dc319c9',
    },
    {
      type: 'issue',
      // eslint-disable-next-line camelcase
      check_name: 'r2',
      description: 'm2',
      content: { body: 'Error found in r2' },
      categories: ['Style'],
      location: {
        path: 'src/a.js',
        lines: { begin: 2, end: 3 },
        positions: {
          begin: { line: 2, column: 2 },
          end: { line: 3, column: 4 },
        },
      },
      severity: 'major',
      fingerprint: 'd644026d4b8d1e20065b2dbff618179f',
    },
    {
      type: 'issue',
      // eslint-disable-next-line camelcase
      check_name: 'r3',
      description: 'm3',
      content: { body: 'Error found in r3' },
      categories: ['Style'],
      location: {
        path: 'src/b.js',
        lines: { begin: 5, end: 5 },
        positions: {
          begin: { line: 5, column: 6 },
          end: { line: 5, column: 6 },
        },
      },
      severity: 'minor',
      fingerprint: '7c97a4927f2c73676de457bf237f42de',
    },
  ];

  const actual = JSON.parse(codeclimateFormatter(input)) as [];

  t.deepEqual(actual, expected);
});
