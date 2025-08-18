import { type Pair, isMap, isScalar } from 'yaml';

import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';
import { findViolationsInAlphabeticalOrder, isSortedAlphabetically, sortAlphabetically } from '../../shared/sorting';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface OrderServicesIssueContext {
  serviceName: string;
  misplacedAfter: string;
}

class OrderServicesRule implements Rule<OrderServicesIssueContext> {
  static readonly ID = 'order-services';
  static readonly TYPE = RuleType.WARNING;

  readonly id = OrderServicesRule.ID;

  readonly type: RuleType = OrderServicesRule.TYPE;

  readonly category: RuleCategory = RuleCategory.STYLE;

  readonly severity: RuleSeverity = RuleSeverity.INFO;

  readonly fixable: boolean = true;

  readonly meta: RuleMeta = {
    description: 'Services SHOULD be sorted alphabetically.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/order-services-rule.md',
  };

  check(document: YamlComposeDocument): LintIssue<OrderServicesIssueContext>[] {
    const issues: LintIssue<OrderServicesIssueContext>[] = [];
    this.handleViolation(document, (items) => {
      const orderViolations = findViolationsInAlphabeticalOrder(items, (x) => this.getSortedValue(x));
      for (const orderViolation of orderViolations) {
        const serviceName = orderViolation.current.value;
        const misplacedAfter = orderViolation.previous.value;
        const location = document.getNodeLocation(['services', serviceName]);
        issues.push(createLintIssue(this, location, { serviceName, misplacedAfter }));
      }
    });

    return issues;
  }

  fix(document: YamlComposeDocument): YamlComposeDocument {
    this.handleViolation(document, (items) => {
      sortAlphabetically(items, (x) => this.getSortedValue(x));
    });

    return document;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: OrderServicesIssueContext): string {
    return `Unexpected order of service "${context.serviceName}" after "${context.misplacedAfter}".`;
  }

  private handleViolation(document: YamlComposeDocument, callback: (items: Pair[]) => void) {
    const services = document.parsedDocument.get('services');
    if (!isMap(services)) return;

    // Fail-fast check
    if (!isSortedAlphabetically(services.items, (x) => this.getSortedValue(x))) {
      callback(services.items);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getSortedValue(node: Pair): string {
    return isScalar(node.key) ? String(node.key.value) : '';
  }
}

export { OrderServicesRule, type OrderServicesIssueContext };
