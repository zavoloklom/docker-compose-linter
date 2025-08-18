import test from 'ava';

import { createLintFileReport } from '../../../src/domain/diagnostics/create-lint-file-report';
import { LintIssue } from '../../../src/domain/models/lint-issue';
import { RuleType } from '../../../src/domain/models/rule';

test('createLintFileReport(): counts errors and warnings correctly', (t) => {
  const issues = [
    { type: RuleType.ERROR, fixable: false } as LintIssue,
    { type: RuleType.ERROR, fixable: true } as LintIssue,
    { type: RuleType.WARNING, fixable: false } as LintIssue,
    { type: RuleType.WARNING, fixable: true } as LintIssue,
  ];
  const filePath = 'test/compose.yaml';

  const report = createLintFileReport(filePath, issues);

  t.deepEqual(report.count, {
    error: 2,
    warning: 2,
    total: 4,
    fixableError: 1,
    fixableWarning: 1,
    fixableTotal: 2,
  });

  t.is(report.filePath, filePath);
  t.is(report.issues.length, issues.length);
});

test('createLintFileReport(): works with no issues', (t) => {
  const report = createLintFileReport('empty/file.ts', []);

  t.deepEqual(report.count, {
    error: 0,
    warning: 0,
    total: 0,
    fixableError: 0,
    fixableWarning: 0,
    fixableTotal: 0,
  });

  t.is(report.issues.length, 0);
});
