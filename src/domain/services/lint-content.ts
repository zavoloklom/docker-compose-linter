import { ComposeDocument } from '../models/compose-document';
import { LintIssue } from '../models/lint-issue';
import { Rule } from '../models/rule';

const lintContent = (document: ComposeDocument, rules: Rule[]): LintIssue[] => {
  const issues: LintIssue[] = [];

  // Exit if all rules globally suppressed
  if (document.suppressions.isSuppressed('*')) return issues;

  for (const rule of rules) {
    // Continue if rule is globally suppressed
    if (document.suppressions.isSuppressed(rule.id)) continue;

    const lintIssues = rule.check(document).filter((issue) => {
      return !document.suppressions.isSuppressed(rule.id, issue.line);
    });

    issues.push(...lintIssues);
  }

  return issues;
};

export { lintContent };
