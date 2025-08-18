import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface NoBuildAndImageRuleOptions {
  checkPullPolicy: boolean;
}

interface NoBuildAndImageIssueContext {
  serviceName: string;
}

class NoBuildAndImageRule implements Rule<NoBuildAndImageIssueContext, NoBuildAndImageRuleOptions> {
  static readonly ID = 'no-build-and-image';
  static readonly TYPE = RuleType.ERROR;

  readonly id = NoBuildAndImageRule.ID;

  readonly type: RuleType = NoBuildAndImageRule.TYPE;

  readonly category: RuleCategory = RuleCategory.BEST_PRACTICE;

  readonly severity: RuleSeverity = RuleSeverity.MAJOR;

  readonly fixable: boolean = false;

  readonly meta: RuleMeta = {
    description: 'Service MUST NOT have both "build" and "image" properties.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-build-and-image-rule.md',
  };

  readonly options: NoBuildAndImageRuleOptions;

  static readonly DEFAULT_OPTIONS: NoBuildAndImageRuleOptions = {
    checkPullPolicy: true,
  };

  constructor(options: Partial<NoBuildAndImageRuleOptions> = {}) {
    this.options = { ...NoBuildAndImageRule.DEFAULT_OPTIONS, ...options };
  }

  check(document: YamlComposeDocument): LintIssue<NoBuildAndImageIssueContext>[] {
    const issues = [];

    for (const service of document.getServices()) {
      const hasBuild = service.has('build');
      const hasImage = service.has('image');
      const hasPullPolicy = service.has('pull_policy');

      if (hasBuild && hasImage && (!this.options.checkPullPolicy || !hasPullPolicy)) {
        const location = document.getNodeLocation(['services', service.name, 'build']);
        issues.push(createLintIssue(this, location, { serviceName: service.name }));
      }
    }

    return issues;
  }

  // eslint-disable-next-line class-methods-use-this
  public getMessage(context: NoBuildAndImageIssueContext): string {
    return `Unexpected simultaneous use of "build" and "image" properties in service "${context.serviceName}".`;
  }
}

export { NoBuildAndImageRule, type NoBuildAndImageRuleOptions, type NoBuildAndImageIssueContext };
