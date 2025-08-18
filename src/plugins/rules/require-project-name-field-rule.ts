import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

class RequireProjectNameFieldRule implements Rule {
  static readonly ID = 'require-project-name-field';
  static readonly TYPE = RuleType.WARNING;

  readonly id = RequireProjectNameFieldRule.ID;

  readonly type: RuleType = RequireProjectNameFieldRule.TYPE;

  readonly category: RuleCategory = RuleCategory.BEST_PRACTICE;

  readonly severity: RuleSeverity = RuleSeverity.MINOR;

  readonly fixable: boolean = false;

  readonly meta: RuleMeta = {
    description: 'Configuration MUST contain the "name" top-level property.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/require-project-name-field-rule.md',
  };

  check(document: YamlComposeDocument): LintIssue[] {
    const issues: LintIssue[] = [];
    if (!document.has('name')) {
      issues.push(createLintIssue(this, { line: 1, column: 1 }, {}));
    }
    return issues;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(): string {
    return 'Expected top-level property "name" in the configuration.';
  }
}

export { RequireProjectNameFieldRule };
