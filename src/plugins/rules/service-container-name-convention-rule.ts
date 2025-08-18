import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface ServiceContainerNameConventionRuleOptions {
  containerNameRegex: RegExp;
}

interface ServiceContainerNameConventionIssueContext {
  serviceName: string;
  containerName: string;
}

class ServiceContainerNameConventionRule
  implements Rule<ServiceContainerNameConventionIssueContext, ServiceContainerNameConventionRuleOptions>
{
  static readonly ID = 'service-container-name-convention';
  static readonly TYPE = RuleType.ERROR;

  readonly id = ServiceContainerNameConventionRule.ID;

  readonly type: RuleType = ServiceContainerNameConventionRule.TYPE;

  readonly category: RuleCategory = RuleCategory.SYNTAX;

  readonly severity: RuleSeverity = RuleSeverity.MAJOR;

  readonly fixable: boolean = false;

  readonly meta: RuleMeta = {
    description:
      'Service container name MUST match `[a-zA-Z0-9][a-zA-Z0-9_.-]+` to comply with Docker naming conventions.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/service-container-name-convention-rule.md',
  };

  readonly options: ServiceContainerNameConventionRuleOptions;

  static readonly DEFAULT_OPTIONS: ServiceContainerNameConventionRuleOptions = {
    // See https://docs.docker.com/reference/compose-file/services/#container_name
    containerNameRegex: /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/u,
  };

  constructor(options: Partial<ServiceContainerNameConventionRuleOptions> = {}) {
    this.options = { ...ServiceContainerNameConventionRule.DEFAULT_OPTIONS, ...options };
  }

  check(document: YamlComposeDocument): LintIssue<ServiceContainerNameConventionIssueContext>[] {
    const issues = [];
    for (const service of document.getServices()) {
      if (!service.has('container_name')) continue;

      const containerName = String(service.get('container_name'));

      if (!this.options.containerNameRegex.test(containerName)) {
        const location = document.getNodeLocation(['services', service.name, 'container_name']);

        issues.push(
          createLintIssue(this, location, {
            serviceName: service.name,
            containerName,
          }),
        );
      }
    }

    return issues;
  }

  getMessage(context: ServiceContainerNameConventionIssueContext): string {
    return `Unexpected container name "${context.containerName}" in service "${context.serviceName}". It must match the regex pattern ${this.options.containerNameRegex}.`;
  }
}

export {
  ServiceContainerNameConventionRule,
  type ServiceContainerNameConventionRuleOptions,
  type ServiceContainerNameConventionIssueContext,
};
