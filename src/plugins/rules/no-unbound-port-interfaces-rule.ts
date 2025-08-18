import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { NodeLocation } from '../../domain/models/compose-document';
import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';
import type { YamlComposeServicePort } from '../../infrastructure/yaml/yaml-compose-service-port';

interface NoUnboundPortInterfacesRuleOptions {
  allowedIps: string[];
  fallbackInterface: string;
}

interface NoUnboundPortInterfacesIssueContext {
  serviceName: string;
  containerPort: string;
  hostPort: string | null;
  hostIp: string | null;
}

class NoUnboundPortInterfacesRule
  implements Rule<NoUnboundPortInterfacesIssueContext, NoUnboundPortInterfacesRuleOptions>
{
  static readonly ID = 'no-unbound-port-interfaces';
  static readonly TYPE = RuleType.WARNING;

  readonly id = NoUnboundPortInterfacesRule.ID;

  readonly type: RuleType = NoUnboundPortInterfacesRule.TYPE;

  readonly category: RuleCategory = RuleCategory.SECURITY;

  readonly severity: RuleSeverity = RuleSeverity.MINOR;

  readonly fixable: boolean = true;

  readonly meta: RuleMeta = {
    description: 'Service exported ports MUST be bound to specific interfaces to avoid unintentional exposure.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-unbound-port-interfaces-rule.md',
  };

  readonly options: NoUnboundPortInterfacesRuleOptions;

  static readonly DEFAULT_OPTIONS: NoUnboundPortInterfacesRuleOptions = {
    allowedIps: [],
    fallbackInterface: '',
  };

  constructor(options: Partial<NoUnboundPortInterfacesRuleOptions> = {}) {
    this.options = { ...NoUnboundPortInterfacesRule.DEFAULT_OPTIONS, ...options };
    // It's only possible to fix this issue if `fallbackInterface` is provided
    this.fixable = this.options.fallbackInterface !== '';
  }

  check(document: YamlComposeDocument): LintIssue<NoUnboundPortInterfacesIssueContext>[] {
    const issues: LintIssue<NoUnboundPortInterfacesIssueContext>[] = [];
    this.handleViolation(document, (serviceName, port, location) => {
      issues.push(
        createLintIssue(this, location, {
          serviceName,
          containerPort: port.get('container') ?? '',
          hostPort: port.get('host'),
          hostIp: port.get('hostIP'),
        }),
      );
    });
    return issues;
  }

  fix(document: YamlComposeDocument): YamlComposeDocument {
    if (!this.fixable) return document;

    this.handleViolation(document, (serviceName, port, location) => {
      port.set('hostIP', this.options.fallbackInterface);
    });
    return document;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: NoUnboundPortInterfacesIssueContext): string {
    const hostPortSubstring = context.hostPort ? ` as "${context.hostPort}"` : '';
    const interfaceSubstring = context.hostIp
      ? `Unexpected host interface "${context.hostIp}"`
      : `Expected host interface`;

    return `${interfaceSubstring} when publishing port "${context.containerPort}"${hostPortSubstring} in service "${context.serviceName}".`;
  }

  private handleViolation(
    document: YamlComposeDocument,
    callback: (serviceName: string, port: YamlComposeServicePort, location: NodeLocation) => void,
  ) {
    for (const service of document.getServices()) {
      for (const [index, port] of service.getPorts().entries()) {
        const location = document.getNodeLocation(['services', service.name, 'ports', index]);
        // If host IP is not defined
        // If host IP is defined and not in allowedIps
        if (
          !port.has('hostIP') ||
          (this.options.allowedIps.length > 0 && !this.options.allowedIps.includes(port.get('hostIP')))
        ) {
          callback(service.name, port, location);
        }
      }
    }
  }
}

export {
  NoUnboundPortInterfacesRule,
  type NoUnboundPortInterfacesRuleOptions,
  type NoUnboundPortInterfacesIssueContext,
};
