import type {
  LintRule,
  LintMessage,
  LintRuleCategory,
  RuleMeta,
  LintRuleSeverity,
  LintMessageType,
  LintContext,
} from '../linter/linter.types.js';
import { findLineNumberByKey } from '../util/line-finder.js';

export default class NoVersionFieldRule implements LintRule {
  public name = 'no-version-field';

  public type: LintMessageType = 'error';

  public category: LintRuleCategory = 'best-practice';

  public severity: LintRuleSeverity = 'minor';

  public meta: RuleMeta = {
    description: 'Ensure that the "version" field is not present in the Docker Compose file.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-version-field-rule.md',
  };

  public fixable: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  public getMessage(): string {
    return 'The "version" field should not be present.';
  }

  public check(context: LintContext): LintMessage[] {
    const errors: LintMessage[] = [];

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
