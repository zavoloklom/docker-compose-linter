import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface RequireExplicitImageTagRuleOptions {
  prohibitedTags: string[];
}

interface RequireExplicitImageTagIssueContext {
  serviceName: string;
  image: string;
  tag: string | null;
}

class RequireExplicitImageTagRule
  implements Rule<RequireExplicitImageTagIssueContext, RequireExplicitImageTagRuleOptions>
{
  static readonly ID = 'require-explicit-image-tag';
  static readonly TYPE = RuleType.ERROR;

  readonly id = RequireExplicitImageTagRule.ID;

  readonly type: RuleType = RequireExplicitImageTagRule.TYPE;

  readonly category: RuleCategory = RuleCategory.SECURITY;

  readonly severity: RuleSeverity = RuleSeverity.MAJOR;

  readonly fixable: boolean = false;

  readonly meta: RuleMeta = {
    description: 'Service image tag MUST be specific and MUST NOT be "latest", "stable" or omitted.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/require-explicit-image-tag-rule.md',
  };

  readonly options: RequireExplicitImageTagRuleOptions;

  static readonly DEFAULT_OPTIONS: RequireExplicitImageTagRuleOptions = {
    prohibitedTags: ['latest', 'stable', 'edge', 'test', 'nightly', 'dev', 'beta', 'canary', 'lts'],
  };

  constructor(options: Partial<RequireExplicitImageTagRuleOptions> = {}) {
    this.options = { ...RequireExplicitImageTagRule.DEFAULT_OPTIONS, ...options };
  }

  check(document: YamlComposeDocument): LintIssue<RequireExplicitImageTagIssueContext>[] {
    const issues: LintIssue<RequireExplicitImageTagIssueContext>[] = [];
    for (const service of document.getServices()) {
      const image = service.getImage();
      if (!image) continue;
      const tag = image.getTagDigest();
      if (tag === null || (tag && this.options.prohibitedTags.includes(tag))) {
        const location = document.getNodeLocation(['services', service.name, 'image']);
        issues.push(
          createLintIssue(this, location, {
            serviceName: service.name,
            image: image.getFullName(),
            tag,
          }),
        );
      }
    }
    return issues;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: RequireExplicitImageTagIssueContext): string {
    if (context.tag !== null) {
      return `Unexpected image tag "${context.tag}" for image "${context.image}" in service "${context.serviceName}".`;
    }
    return `Expected specific image tag for image "${context.image}" in service "${context.serviceName}".`;
  }
}

export {
  RequireExplicitImageTagRule,
  type RequireExplicitImageTagRuleOptions,
  type RequireExplicitImageTagIssueContext,
};
