import test from 'ava';

import { createLintIssue } from '../../../src/domain/diagnostics/create-lint-issue';
import { ComposeDocument } from '../../../src/domain/models/compose-document';
import { LintIssue } from '../../../src/domain/models/lint-issue';
import { type Rule, RuleCategory, RuleSeverity, RuleType } from '../../../src/domain/models/rule';

test('createLintIssue(): falls back to rule.getMessage when message is not provided', (t) => {
  const mockRule: Rule = {
    id: 'require-bar',
    type: RuleType.WARNING,
    category: RuleCategory.PERFORMANCE,
    meta: { url: '', description: 'No foo allowed' },
    severity: RuleSeverity.CRITICAL,
    fixable: false,
    getMessage: (context: { value: string }) => `Value is ${context.value}`,
    check(document: ComposeDocument): LintIssue<object>[] {
      return [];
    },
  };

  const location = {
    line: 2,
    column: 1,
  };

  const issue = createLintIssue(mockRule, location, { value: 'baz' });

  t.is(issue.message, 'Value is baz');
  t.is(issue.ruleId, mockRule.id);
  t.is(issue.line, location.line);
  t.is(issue.column, location.column);
});
