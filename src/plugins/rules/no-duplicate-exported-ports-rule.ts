import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';
import { parseRangeToArray } from '../../shared/parse-range-to-array';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface NoDuplicateExportedPortsIssueContext {
  // Service name that violates rule
  serviceName: string;
  // Host port value, could be a range
  servicePort: string;
  // Exact port with protocol
  hostPortProtocol: string;
  // Conflicting service
  conflictingService: string;
}

class NoDuplicateExportedPortsRule implements Rule<NoDuplicateExportedPortsIssueContext> {
  static readonly ID = 'no-duplicate-exported-ports';
  static readonly TYPE = RuleType.ERROR;

  readonly id = NoDuplicateExportedPortsRule.ID;

  readonly type: RuleType = NoDuplicateExportedPortsRule.TYPE;

  readonly category: RuleCategory = RuleCategory.SECURITY;

  readonly severity: RuleSeverity = RuleSeverity.CRITICAL;

  readonly fixable: boolean = false;

  readonly meta: RuleMeta = {
    description: 'Service exported ports MUST be unique to avoid conflicts.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-duplicate-exported-ports-rule.md',
  };

  check(document: YamlComposeDocument): LintIssue<NoDuplicateExportedPortsIssueContext>[] {
    const issues: LintIssue<NoDuplicateExportedPortsIssueContext>[] = [];
    const exportedPortsMap: Map<string, string> = new Map();

    for (const service of document.getServices()) {
      for (const [index, port] of service.getPorts().entries()) {
        if (!port.has('host')) continue;

        const currentPortRange = parseRangeToArray(port.get('host'));

        for (const rangePort of currentPortRange) {
          // Default value by spec https://docs.docker.com/reference/compose-file/services/#ports
          const protocol = port.get('protocol') ?? 'tcp';
          const rangeKey = `${rangePort}/${protocol}`;

          if (exportedPortsMap && exportedPortsMap.has(rangeKey)) {
            const location = port.isShortSyntax
              ? document.getNodeLocation(['services', service.name, 'ports', index])
              : document.getNodeLocation(['services', service.name, 'ports', index, 'published']);
            issues.push(
              createLintIssue(this, location, {
                serviceName: service.name,
                servicePort: port.get('host') ?? '',
                hostPortProtocol: rangeKey,
                conflictingService: String(exportedPortsMap.get(rangeKey)),
              }),
            );
            continue;
          }

          // Map ports to the service
          exportedPortsMap.set(rangeKey, service.name);
        }
      }
    }

    return issues;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: NoDuplicateExportedPortsIssueContext): string {
    return `Unexpected port conflict for exported port "${context.servicePort}" ("${context.hostPortProtocol}") in service "${context.serviceName}". It conflicts with service "${context.conflictingService}".`;
  }
}

export { NoDuplicateExportedPortsRule, type NoDuplicateExportedPortsIssueContext };
