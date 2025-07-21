import { findLineNumberByKey } from '../util/line-finder';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

class NoVersionFieldRule implements Rule {
  static readonly name = 'no-version-field';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return NoVersionFieldRule.name;
  }

  public type: RuleType = 'error';

  public category: RuleCategory = 'best-practice';

  public severity: RuleSeverity = 'minor';

  public meta: RuleMeta = {
    description: 'The `version` field must be absent in the configuration.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-version-field-rule.md',
  };

  public fixable: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  public getMessage(): string {
    return 'The "version" field should not be present.';
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];

    if (context.content && 'version' in context.content) {
      errors.push({
        rule: this.name,
        type: this.type,
        category: this.category,
        severity: this.severity,
        message: this.getMessage(),
        line: findLineNumberByKey(context.sourceCode, 'version'),
        column: 1,
        meta: this.meta,
        fixable: this.fixable,
        data: {},
      });
    }

    return errors;
  }

  // eslint-disable-next-line class-methods-use-this
  public fix(content: string): string {
    const lines = content.split('\n');
    const versionLineIndex = lines.findIndex((line) => line.trim().startsWith('version:'));

    if (versionLineIndex !== -1) {
      lines.splice(versionLineIndex, 1); // Remove the line with the version
    }

    return lines.join('\n');
  }
}

export { NoVersionFieldRule };
