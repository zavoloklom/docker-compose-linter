import { parseDocument, YAMLMap, isScalar, isMap } from 'yaml';
import type {
  LintContext,
  LintMessage,
  LintMessageType,
  LintRule,
  LintRuleCategory,
  LintRuleSeverity,
  RuleMeta,
} from '../linter/linter.types';
import { findLineNumberForService } from '../util/line-finder';

interface ServiceKeysOrderRuleOptions {
  groupOrder?: GroupOrderEnum[];
  groups?: Partial<Record<GroupOrderEnum, string[]>>;
}

enum GroupOrderEnum {
  CoreDefinitions = 'Core Definitions',
  ServiceDependencies = 'Service Dependencies',
  DataManagementAndConfiguration = 'Data Management and Configuration',
  EnvironmentConfiguration = 'Environment Configuration',
  Networking = 'Networking',
  RuntimeBehavior = 'Runtime Behavior',
  OperationalMetadata = 'Operational Metadata',
  SecurityAndExecutionContext = 'Security and Execution Context',
  Other = 'Other',
}

// Default group order and groups
const defaultGroupOrder: GroupOrderEnum[] = [
  GroupOrderEnum.CoreDefinitions,
  GroupOrderEnum.ServiceDependencies,
  GroupOrderEnum.DataManagementAndConfiguration,
  GroupOrderEnum.EnvironmentConfiguration,
  GroupOrderEnum.Networking,
  GroupOrderEnum.RuntimeBehavior,
  GroupOrderEnum.OperationalMetadata,
  GroupOrderEnum.SecurityAndExecutionContext,
  GroupOrderEnum.Other,
];

const defaultGroups: Record<GroupOrderEnum, string[]> = {
  [GroupOrderEnum.CoreDefinitions]: ['image', 'build', 'container_name'],
  [GroupOrderEnum.ServiceDependencies]: ['depends_on'],
  [GroupOrderEnum.DataManagementAndConfiguration]: ['volumes', 'volumes_from', 'configs', 'secrets'],
  [GroupOrderEnum.EnvironmentConfiguration]: ['environment', 'env_file'],
  [GroupOrderEnum.Networking]: ['ports', 'networks', 'network_mode', 'extra_hosts'],
  [GroupOrderEnum.RuntimeBehavior]: ['command', 'entrypoint', 'working_dir', 'restart', 'healthcheck'],
  [GroupOrderEnum.OperationalMetadata]: ['logging', 'labels'],
  [GroupOrderEnum.SecurityAndExecutionContext]: ['user', 'isolation'],
  [GroupOrderEnum.Other]: [],
};

export default class ServiceKeysOrderRule implements LintRule {
  public name = 'service-keys-order';

  public type: LintMessageType = 'warning';

  public category: LintRuleCategory = 'style';

  public severity: LintRuleSeverity = 'minor';

  public message = 'Keys within each service should follow the predefined order.';

  public meta: RuleMeta = {
    description: 'Ensure that keys within each service in the Docker Compose file are ordered correctly.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/service-keys-order-rule.md',
  };

  public fixable: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({
    serviceName,
    key,
    correctOrder,
  }: {
    serviceName: string;
    key: string;
    correctOrder: string[];
  }): string {
    return `Key "${key}" in service "${serviceName}" is out of order. Expected order is: ${correctOrder.join(', ')}.`;
  }

  private readonly groupOrder: GroupOrderEnum[];

  private readonly groups: Record<GroupOrderEnum, string[]>;

  constructor(options?: ServiceKeysOrderRuleOptions) {
    this.groupOrder = options?.groupOrder?.length ? options.groupOrder : defaultGroupOrder;

    this.groups = { ...defaultGroups };
    if (options?.groups) {
      Object.keys(options.groups).forEach((group) => {
        const groupKey = group as GroupOrderEnum;
        if (defaultGroups[groupKey] && options.groups) {
          this.groups[groupKey] = options.groups[groupKey]!;
        }
      });
    }
  }

  private getCorrectOrder(keys: string[]): string[] {
    const otherKeys = keys.filter((key) => !Object.values(this.groups).flat().includes(key)).sort();

    return [...this.groupOrder.flatMap((group) => this.groups[group]), ...otherKeys];
  }

  public check(context: LintContext): LintMessage[] {
    const errors: LintMessage[] = [];
    const parsedDocument = parseDocument(context.sourceCode);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return [];

    services.items.forEach((serviceItem) => {
      if (!isScalar(serviceItem.key)) return;

      const serviceName = String(serviceItem.key.value);
      const service = serviceItem.value;

      if (!isMap(service)) return;

      const keys = service.items.map((key) => String(key.key));

      const correctOrder = this.getCorrectOrder(keys);
      let lastSeenIndex = -1;

      keys.forEach((key) => {
        const expectedIndex = correctOrder.indexOf(key);

        if (expectedIndex === -1) return;

        if (expectedIndex < lastSeenIndex) {
          const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName, key);
          errors.push({
            rule: this.name,
            type: this.type,
            category: this.category,
            severity: this.severity,
            message: this.getMessage({ serviceName, key, correctOrder }),
            line,
            column: 1,
            meta: this.meta,
            fixable: this.fixable,
          });
        }

        lastSeenIndex = expectedIndex;
      });
    });

    return errors;
  }

  public fix(content: string): string {
    const parsedDocument = parseDocument(content);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return content;

    services.items.forEach((serviceItem) => {
      if (!isScalar(serviceItem.key)) return;

      const serviceName = String(serviceItem.key.value);
      const service = serviceItem.value;

      if (!isMap(service)) return;

      const keys = service.items.map((item) => (isScalar(item.key) ? String(item.key.value) : '')).filter(Boolean);

      const correctOrder = this.getCorrectOrder(keys);
      const orderedService = new YAMLMap<unknown, unknown>();

      correctOrder.forEach((key) => {
        const item = service.items.find((node) => isScalar(node.key) && node.key.value === key);
        if (item) {
          orderedService.add(item);
        }
      });

      keys.forEach((key) => {
        if (!correctOrder.includes(key)) {
          const item = service.items.find((node) => isScalar(node.key) && node.key.value === key);
          if (item) {
            orderedService.add(item);
          }
        }
      });

      services.set(serviceName, orderedService);
    });

    return parsedDocument.toString();
  }
}
