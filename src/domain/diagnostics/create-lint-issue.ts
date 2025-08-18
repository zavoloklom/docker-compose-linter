import type { NodeLocation } from '../models/compose-document';
import type { LintIssue } from '../models/lint-issue';
import type { Rule } from '../models/rule';

const createLintIssue = <C, O>(rule: Rule<C, O>, location: NodeLocation, context: C): LintIssue<C> => {
  return {
    ruleId: rule.id,
    type: rule.type,
    severity: rule.severity,
    category: rule.category,
    message: rule.getMessage(context),
    line: location.line,
    column: location.column,
    endLine: location.endLine,
    endColumn: location.endColumn,
    meta: rule.meta,
    fixable: rule.fixable,
    context,
  };
};

export { createLintIssue };
