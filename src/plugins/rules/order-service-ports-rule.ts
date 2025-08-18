import { type ParsedNode, isMap, isScalar, isSeq } from 'yaml';

import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';
import { YamlComposeServicePort } from '../../infrastructure/yaml/yaml-compose-service-port';
import { findViolationsInAlphabeticalOrder, isSortedAlphabetically, sortAlphabetically } from '../../shared/sorting';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface OrderServicePortsIssueContext {
  serviceName: string;
  containerPort: string;
  misplacedAfter: string;
}

class OrderServicePortsRule implements Rule<OrderServicePortsIssueContext> {
  static readonly ID = 'order-service-ports';
  static readonly TYPE = RuleType.WARNING;

  readonly id = OrderServicePortsRule.ID;

  readonly type: RuleType = OrderServicePortsRule.TYPE;

  readonly category: RuleCategory = RuleCategory.STYLE;

  readonly severity: RuleSeverity = RuleSeverity.INFO;

  readonly fixable: boolean = true;

  readonly meta: RuleMeta = {
    description: 'Ports in services SHOULD be sorted alphabetically by container port (target).',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/order-service-ports-rule.md',
  };

  check(document: YamlComposeDocument): LintIssue<OrderServicePortsIssueContext>[] {
    const issues: LintIssue<OrderServicePortsIssueContext>[] = [];

    this.handleViolation(document, (serviceName, items) => {
      const orderViolations = findViolationsInAlphabeticalOrder(items, (x) => this.getSortedValue(x));
      for (const orderViolation of orderViolations) {
        const containerPort = orderViolation.current.value;
        const misplacedAfter = orderViolation.previous.value;
        const location = document.getNodeLocation(['services', serviceName, 'ports', orderViolation.current.index]);
        issues.push(createLintIssue(this, location, { serviceName, containerPort, misplacedAfter }));
      }
    });

    return issues;
  }

  fix(document: YamlComposeDocument): YamlComposeDocument {
    this.handleViolation(document, (serviceName, items) => {
      sortAlphabetically(items, (x) => this.getSortedValue(x));
    });

    return document;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: OrderServicePortsIssueContext): string {
    return `Unexpected order of container port "${context.containerPort}" after "${context.misplacedAfter}" in service "${context.serviceName}".`;
  }

  private handleViolation(document: YamlComposeDocument, callback: (serviceName: string, items: ParsedNode[]) => void) {
    for (const service of document.getServices()) {
      const ports = service.get('ports');
      if (!isSeq(ports)) continue;
      const items = ports.items;

      // Fail-fast check
      if (!isSortedAlphabetically(items, (x) => this.getSortedValue(x))) {
        callback(service.name, items);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getSortedValue(node: ParsedNode): string {
    if (!isScalar(node) && !isMap(node)) return '';
    return new YamlComposeServicePort(node).get('container') ?? '';
  }
}

export { OrderServicePortsRule, type OrderServicePortsIssueContext };
