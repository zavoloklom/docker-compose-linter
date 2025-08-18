import { type Pair, isMap, isPair, isScalar } from 'yaml';

import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';
import {
  findViolationsInAlphabeticalOrder,
  findViolationsInOrder,
  isSortedAlphabetically,
  isSortedByOrder,
  sortAlphabetically,
  sortByOrder,
} from '../../shared/sorting';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

enum TopLevelKeys {
  X_PROPERTIES = 'x-properties',
  VERSION = 'version',
  NAME = 'name',
  INCLUDE = 'include',
  SERVICES = 'services',
  NETWORKS = 'networks',
  VOLUMES = 'volumes',
  SECRETS = 'secrets',
  CONFIGS = 'configs',
}

const ALPHABETICAL_ORDER = 'alphabetical';

interface OrderTopLevelPropertiesRuleOptions {
  order: TopLevelKeys[] | typeof ALPHABETICAL_ORDER;
}

interface OrderTopLevelPropertiesIssueContext {
  propertyName: string;
  misplacedAfter: string;
}

class OrderTopLevelPropertiesRule
  implements Rule<OrderTopLevelPropertiesIssueContext, OrderTopLevelPropertiesRuleOptions>
{
  static readonly ID = 'order-top-level-properties';
  static readonly TYPE = RuleType.WARNING;

  readonly id = OrderTopLevelPropertiesRule.ID;

  readonly type: RuleType = OrderTopLevelPropertiesRule.TYPE;

  readonly category: RuleCategory = RuleCategory.STYLE;

  readonly severity: RuleSeverity = RuleSeverity.INFO;

  readonly fixable: boolean = true;

  readonly meta: RuleMeta = {
    description: 'Top-level properties SHOULD follow the defined order.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/order-top-level-properties-rule.md',
  };

  readonly options: OrderTopLevelPropertiesRuleOptions;

  static readonly DEFAULT_OPTIONS: OrderTopLevelPropertiesRuleOptions = {
    order: [
      TopLevelKeys.X_PROPERTIES,
      TopLevelKeys.VERSION,
      TopLevelKeys.NAME,
      TopLevelKeys.INCLUDE,
      TopLevelKeys.SERVICES,
      TopLevelKeys.NETWORKS,
      TopLevelKeys.VOLUMES,
      TopLevelKeys.SECRETS,
      TopLevelKeys.CONFIGS,
    ],
  };

  constructor(options: Partial<OrderTopLevelPropertiesRuleOptions> = {}) {
    this.options = { ...OrderTopLevelPropertiesRule.DEFAULT_OPTIONS, ...options };
  }

  check(document: YamlComposeDocument): LintIssue<OrderTopLevelPropertiesIssueContext>[] {
    const issues: LintIssue<OrderTopLevelPropertiesIssueContext>[] = [];

    this.handleViolation(document, (items, correctOrder) => {
      const orderViolations = correctOrder
        ? findViolationsInOrder(items, correctOrder, (x) => this.getSortedValue(x))
        : findViolationsInAlphabeticalOrder(items, (x) => this.getSortedValue(x));

      for (const orderViolation of orderViolations) {
        const propertyName = orderViolation.current.value;
        const misplacedAfter = orderViolation.previous.value;
        const location = document.getNodeLocation([propertyName]);
        issues.push(createLintIssue(this, location, { propertyName, misplacedAfter }));
      }
    });

    return issues;
  }

  fix(document: YamlComposeDocument): YamlComposeDocument {
    this.handleViolation(document, (items, correctOrder) => {
      if (correctOrder) {
        sortByOrder(items, correctOrder, (x) => this.getSortedValue(x));
      } else {
        sortAlphabetically(items, (x) => this.getSortedValue(x));
      }
    });

    return document;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: OrderTopLevelPropertiesIssueContext): string {
    return `Unexpected order of top-level property "${context.propertyName}" after "${context.misplacedAfter}".`;
  }

  private handleViolation(
    document: YamlComposeDocument,
    callback: (items: Pair[], correctOrder: string[] | null) => void,
  ) {
    if (!isMap(document.parsedDocument.contents)) return;

    const topLevelProperties = document.parsedDocument.contents.items;

    if (this.options.order === ALPHABETICAL_ORDER) {
      // Fail-fast check
      if (!isSortedAlphabetically(topLevelProperties, (x) => this.getSortedValue(x))) {
        callback(topLevelProperties, null);
      }
      return;
    }

    // Get and sort all 'x-' prefixed properties alphabetically
    const sortedXProperties = [...topLevelProperties]
      .map((node) => (isPair(node) && isScalar(node.key) ? node.key.toString() : null))
      .filter((value) => value && value.startsWith('x-')) as string[];
    sortAlphabetically(sortedXProperties);

    // Replace 'TopLevelKeys.XProperties' in the order with the actual sorted x-prefixed properties
    const correctOrder = this.options.order.flatMap((key) =>
      key === TopLevelKeys.X_PROPERTIES ? sortedXProperties : [key],
    );

    // Fail-fast check
    if (!isSortedByOrder(topLevelProperties, correctOrder, (x) => this.getSortedValue(x))) {
      callback(topLevelProperties, correctOrder);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getSortedValue(node: Pair): string {
    return isScalar(node.key) ? String(node.key.value) : '';
  }
}

export {
  OrderTopLevelPropertiesRule,
  type OrderTopLevelPropertiesRuleOptions,
  type OrderTopLevelPropertiesIssueContext,
  TopLevelKeys,
};
