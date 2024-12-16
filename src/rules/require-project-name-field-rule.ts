import type {
  LintRule,
  LintMessage,
  LintRuleCategory,
  RuleMeta,
  LintRuleSeverity,
  LintMessageType,
  LintContext,
} from '../linter/linter.types';

export default class RequireProjectNameFieldRule implements LintRule {
  public name = 'require-project-name-field';

  public type: LintMessageType = 'warning';

  public category: LintRuleCategory = 'best-practice';

  public severity: LintRuleSeverity = 'minor';

  public meta: RuleMeta = {
    description: 'The `name` field should be included in the configuration.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/require-project-name-field-rule.md',
  };

  public fixable: boolean = false;

  // eslint-disable-next-line class-methods-use-this
  public getMessage(): string {
    return 'The "name" field should be present.';
  }

  public check(context: LintContext): LintMessage[] {
    const errors: LintMessage[] = [];

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
