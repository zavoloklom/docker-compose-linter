import { RuleCategory, RuleMeta, RuleSeverity, RuleType } from './rule';

interface LintIssue<TContext = object> {
  ruleId: string; // Rule id (e.g. 'no-quotes-in-volumes')
  type: RuleType; // The type of the message (e.g. 'error')
  severity: RuleSeverity; // The severity level of the issue
  category: RuleCategory; // The category of the issue (e.g. style, security, etc.)
  message: string; // Error message
  line: number; // The line number where the issue is located
  column: number; // The column number where the issue starts
  endLine?: number; // The line number where the issue ends (optional)
  endColumn?: number; // The column number where the issue ends (optional)
  meta: RuleMeta; // Metadata about the rule, including description and URL
  fixable: boolean; // Is it possible to auto-fix this issue
  context: TContext; // Additional context about violation
}

export { LintIssue };
