import { Pair, type ParsedNode, isMap, isPair, isScalar, isSeq } from 'yaml';

import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';
import { findViolationsInAlphabeticalOrder, isSortedAlphabetically, sortAlphabetically } from '../../shared/sorting';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface OrderServiceDependenciesIssueContext {
  serviceName: string;
  dependency: string;
  misplacedAfter: string;
}

class OrderServiceDependenciesRule implements Rule<OrderServiceDependenciesIssueContext> {
  static readonly ID = 'order-service-dependencies';
  static readonly TYPE = RuleType.WARNING;

  readonly id = OrderServiceDependenciesRule.ID;

  readonly type: RuleType = OrderServiceDependenciesRule.TYPE;

  readonly category: RuleCategory = RuleCategory.STYLE;

  readonly severity: RuleSeverity = RuleSeverity.INFO;

  readonly fixable: boolean = true;

  readonly meta: RuleMeta = {
    // TODO: Provide short description of the rule.
    description: '',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/order-service-dependencies-rule.md',
  };

  check(document: YamlComposeDocument): LintIssue<OrderServiceDependenciesIssueContext>[] {
    const issues: LintIssue<OrderServiceDependenciesIssueContext>[] = [];

    this.handleViolation(document, (serviceName, items) => {
      const orderViolations = findViolationsInAlphabeticalOrder(items, (x) => this.getSortedValue(x));
      for (const orderViolation of orderViolations) {
        const dependency = orderViolation.current.value;
        const misplacedAfter = orderViolation.previous.value;
        const location = document.getNodeLocation([
          'services',
          serviceName,
          'depends_on',
          orderViolation.current.value,
        ]);
        issues.push(createLintIssue(this, location, { serviceName, dependency, misplacedAfter }));
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
  getMessage(context: OrderServiceDependenciesIssueContext): string {
    return `Unexpected order of depends_on value "${context.dependency}" after "${context.misplacedAfter}" in service "${context.serviceName}".`;
  }

  private handleViolation(document: YamlComposeDocument, callback: (serviceName: string, items: ParsedNode[]) => void) {
    for (const service of document.getServices()) {
      const dependsOn = service.get('depends_on');
      if (!isSeq(dependsOn) && !isMap(dependsOn)) continue;
      const items = dependsOn.items as ParsedNode[];

      // Fail-fast check
      if (!isSortedAlphabetically(items, (x) => this.getSortedValue(x))) {
        callback(service.name, items);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getSortedValue(node: ParsedNode): string {
    if (isScalar(node)) {
      return String(node.value);
    }
    return isPair(node) ? String(node.key) : '';
  }
}

export { OrderServiceDependenciesRule, type OrderServiceDependenciesIssueContext };
