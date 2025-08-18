import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { NodeLocation } from '../../domain/models/compose-document';
import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

class NoVersionFieldRule implements Rule {
  static readonly ID = 'no-version-field';
  static readonly TYPE = RuleType.ERROR;

  readonly id = NoVersionFieldRule.ID;

  readonly type: RuleType = NoVersionFieldRule.TYPE;

  readonly category: RuleCategory = RuleCategory.BEST_PRACTICE;

  readonly severity: RuleSeverity = RuleSeverity.MAJOR;

  readonly fixable: boolean = true;

  readonly meta: RuleMeta = {
    description: 'Configuration MUST NOT contain the "version" top-level property.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-version-field-rule.md',
  };

  check(document: YamlComposeDocument): LintIssue[] {
    const issues: LintIssue[] = [];
    this.handleViolation(document, (location) => {
      issues.push(createLintIssue(this, location, {}));
    });
    return issues;
  }

  fix(document: YamlComposeDocument): YamlComposeDocument {
    this.handleViolation(document, (location) => {
      document.set('version', null);
    });
    return document;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(): string {
    return 'Unexpected top-level property "version" in the configuration.';
  }

  // eslint-disable-next-line class-methods-use-this
  private handleViolation(document: YamlComposeDocument, callback: (location: NodeLocation) => void) {
    if (document.has('version')) {
      const location = document.getNodeLocation(['version']);
      callback(location);
    }
  }
}

export { NoVersionFieldRule };
