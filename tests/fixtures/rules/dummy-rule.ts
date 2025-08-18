import { ComposeDocument } from '../../../src/domain/models/compose-document';
import { LintIssue } from '../../../src/domain/models/lint-issue';
import { Rule, RuleCategory, RuleMeta, RuleSeverity, RuleType } from '../../../src/domain/models/rule';

class DummyRule implements Rule {
  static readonly ID = 'dummy';
  static readonly TYPE = RuleType.ERROR;
  readonly id: string = DummyRule.ID;
  readonly type: RuleType = DummyRule.TYPE;
  readonly category: RuleCategory = RuleCategory.BEST_PRACTICE;
  readonly fixable: boolean = false;
  readonly meta: RuleMeta = {
    description: '',
    url: '',
  };
  readonly severity: RuleSeverity = RuleSeverity.INFO;

  check(document: ComposeDocument): LintIssue<object>[] {
    return [
      {
        ruleId: this.id,
        type: this.type,
        severity: this.severity,
        category: this.category,
        message: this.getMessage(),
        line: 0,
        column: 0,
        meta: this.meta,
        fixable: this.fixable,
        context: {},
      },
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context?: object): string {
    return 'Dummy message';
  }
}

export { DummyRule };
