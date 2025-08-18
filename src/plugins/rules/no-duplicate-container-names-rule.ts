import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface NoDuplicateContainerNamesIssueContext {
  serviceName: string;
  containerName: string;
  conflictingService: string;
}

class NoDuplicateContainerNamesRule implements Rule<NoDuplicateContainerNamesIssueContext> {
  static readonly ID = 'no-duplicate-container-names';
  static readonly TYPE = RuleType.ERROR;

  readonly id = NoDuplicateContainerNamesRule.ID;

  readonly type: RuleType = NoDuplicateContainerNamesRule.TYPE;

  readonly category: RuleCategory = RuleCategory.SECURITY;

  readonly severity: RuleSeverity = RuleSeverity.CRITICAL;

  readonly fixable: boolean = false;

  readonly meta: RuleMeta = {
    description: 'Service MUST have a unique "container_name" property to avoid conflicts.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-duplicate-container-names-rule.md',
  };

  check(document: YamlComposeDocument): LintIssue<NoDuplicateContainerNamesIssueContext>[] {
    const issues = [];
    const containerNames: Map<string, string> = new Map();
    for (const service of document.getServices()) {
      if (!service.has('container_name')) continue;

      const containerName = String(service.get('container_name'));

      if (containerNames.has(containerName)) {
        const conflictingService = String(containerNames.get(containerName));
        const location = document.getNodeLocation(['services', service.name, 'container_name']);

        issues.push(
          createLintIssue(this, location, {
            serviceName: service.name,
            containerName,
            conflictingService,
          }),
        );
      } else {
        containerNames.set(containerName, service.name);
      }
    }

    return issues;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: NoDuplicateContainerNamesIssueContext): string {
    return `Unexpected duplicate container name "${context.containerName}" in service "${context.serviceName}". It conflicts with service "${context.conflictingService}".`;
  }
}

export { NoDuplicateContainerNamesRule, type NoDuplicateContainerNamesIssueContext };
