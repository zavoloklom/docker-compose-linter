import { type Pair } from 'yaml';

import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';
import { findViolationsInOrder, isSortedByOrder, sortAlphabetically, sortByOrder } from '../../shared/sorting';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

enum ServicePropertiesGroup {
  CORE = 'Core Definitions',
  DEPENDENCIES = 'Service Dependencies',
  DATA_MANAGEMENT = 'Data Management and Configuration',
  ENVIRONMENT = 'Environment Configuration',
  NETWORK = 'Networking',
  RUNTIME = 'Runtime Behavior',
  METADATA = 'Operational Metadata',
  SECURITY = 'Security and Execution Context',
  OTHER = 'Other',
}

interface OrderServicePropertiesRuleOptions {
  groupOrder: ServicePropertiesGroup[];
  groups: Record<ServicePropertiesGroup, string[]>;
}

interface OrderServicePropertiesIssueContext {
  serviceName: string;
  propertyName: string;
  misplacedAfter: string;
}

class OrderServicePropertiesRule
  implements Rule<OrderServicePropertiesIssueContext, OrderServicePropertiesRuleOptions>
{
  static readonly ID = 'order-service-properties';
  static readonly TYPE = RuleType.WARNING;

  readonly id = OrderServicePropertiesRule.ID;

  readonly type: RuleType = OrderServicePropertiesRule.TYPE;

  readonly category: RuleCategory = RuleCategory.STYLE;

  readonly severity: RuleSeverity = RuleSeverity.INFO;

  readonly fixable: boolean = true;

  readonly meta: RuleMeta = {
    // TODO: Provide short description of the rule.
    description: '',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/order-service-properties-rule.md',
  };

  readonly options: OrderServicePropertiesRuleOptions;

  static readonly DEFAULT_OPTIONS: OrderServicePropertiesRuleOptions = {
    groups: {
      [ServicePropertiesGroup.CORE]: ['image', 'build', 'container_name'],
      [ServicePropertiesGroup.DEPENDENCIES]: ['depends_on'],
      [ServicePropertiesGroup.DATA_MANAGEMENT]: ['volumes', 'volumes_from', 'configs', 'secrets'],
      [ServicePropertiesGroup.ENVIRONMENT]: ['environment', 'env_file'],
      [ServicePropertiesGroup.NETWORK]: ['ports', 'networks', 'network_mode', 'extra_hosts'],
      [ServicePropertiesGroup.RUNTIME]: ['command', 'entrypoint', 'working_dir', 'restart', 'healthcheck'],
      [ServicePropertiesGroup.METADATA]: ['logging', 'labels'],
      [ServicePropertiesGroup.SECURITY]: ['user', 'isolation'],
      [ServicePropertiesGroup.OTHER]: [],
    },
    groupOrder: [
      ServicePropertiesGroup.CORE,
      ServicePropertiesGroup.DEPENDENCIES,
      ServicePropertiesGroup.DATA_MANAGEMENT,
      ServicePropertiesGroup.ENVIRONMENT,
      ServicePropertiesGroup.NETWORK,
      ServicePropertiesGroup.RUNTIME,
      ServicePropertiesGroup.METADATA,
      ServicePropertiesGroup.SECURITY,
      ServicePropertiesGroup.OTHER,
    ],
  };

  constructor(options: Partial<OrderServicePropertiesRuleOptions> = {}) {
    this.options = {
      groups: {
        ...OrderServicePropertiesRule.DEFAULT_OPTIONS.groups,
        ...options?.groups,
      },
      groupOrder: options?.groupOrder || OrderServicePropertiesRule.DEFAULT_OPTIONS.groupOrder,
    };
  }

  check(document: YamlComposeDocument): LintIssue<OrderServicePropertiesIssueContext>[] {
    const issues: LintIssue<OrderServicePropertiesIssueContext>[] = [];

    this.handleViolation(document, (serviceName, items, correctOrder) => {
      const orderViolations = findViolationsInOrder(items, correctOrder, (x) => this.getSortedValue(x));
      for (const orderViolation of orderViolations) {
        const propertyName = orderViolation.current.value;
        const misplacedAfter = orderViolation.previous.value;
        const location = document.getNodeLocation(['services', serviceName, propertyName]);
        issues.push(createLintIssue(this, location, { serviceName, propertyName, misplacedAfter }));
      }
    });

    return issues;
  }

  fix(document: YamlComposeDocument): YamlComposeDocument {
    this.handleViolation(document, (serviceName, items, correctOrder) => {
      sortByOrder(items, correctOrder, (x) => this.getSortedValue(x));
    });

    return document;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: OrderServicePropertiesIssueContext): string {
    return `Unexpected order of property "${context.propertyName}" after "${context.misplacedAfter}" in service "${context.serviceName}".`;
  }

  private handleViolation(
    document: YamlComposeDocument,
    callback: (serviceName: string, items: Pair[], correctOrder: string[]) => void,
  ) {
    for (const service of document.getServices()) {
      const serviceProperties = service.value.items;
      const servicePropertiesValues = serviceProperties.map((x) => this.getSortedValue(x));

      const initialOrder = new Set(Object.values(this.options.groups).flat());
      const otherKeys = [...servicePropertiesValues].filter((key) => !initialOrder.has(key));
      sortAlphabetically(otherKeys);

      // TODO: Use concat and initialOrder
      const correctOrder = [...this.options.groupOrder.flatMap((group) => this.options.groups[group]), ...otherKeys];

      // Fail-fast check
      if (!isSortedByOrder(serviceProperties, correctOrder, (x) => this.getSortedValue(x))) {
        callback(service.name, serviceProperties, correctOrder);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getSortedValue(node: Pair): string {
    return String(node.key);
  }
}

export { OrderServicePropertiesRule, type OrderServicePropertiesRuleOptions, type OrderServicePropertiesIssueContext };
