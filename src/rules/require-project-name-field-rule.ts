import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

class RequireProjectNameFieldRule implements Rule {
  static readonly name = 'require-project-name-field';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return RequireProjectNameFieldRule.name;
  }

  public type: RuleType = 'warning';

  public category: RuleCategory = 'best-practice';

  public severity: RuleSeverity = 'minor';

  public meta: RuleMeta = {
    description: 'The `name` field should be included in the configuration.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/require-project-name-field-rule.md',
  };

  public fixable: boolean = false;

  // eslint-disable-next-line class-methods-use-this
  public getMessage(): string {
    return 'The "name" field should be present.';
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];

    if (context.content && !('name' in context.content)) {
      errors.push({
        rule: this.name,
        type: this.type,
        category: this.category,
        severity: this.severity,
        message: this.getMessage(),
        line: 1, // Default to the top of the file if the field is missing
        column: 1,
        meta: this.meta,
        fixable: this.fixable,
        data: {},
      });
    }

    return errors;
  }
}

export { RequireProjectNameFieldRule };
