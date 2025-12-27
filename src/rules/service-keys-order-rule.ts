import { YAMLMap, isMap, isScalar } from 'yaml';

import { findLineNumberForService } from '../util/line-finder';
import { parseYAML, stringifyDocument } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

interface ServiceKeysOrderRuleInputOptions {
  groupOrder?: ServiceKeyGroup[];
  groups?: Partial<Record<ServiceKeyGroup, string[]>>;
}

interface ServiceKeysOrderRuleOptions {
  groupOrder: ServiceKeyGroup[];
  groups: Record<ServiceKeyGroup, string[]>;
}

enum ServiceKeyGroup {
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

class ServiceKeysOrderRule implements Rule {
  static readonly name = 'service-keys-order';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return ServiceKeysOrderRule.name;
  }

  public type: RuleType = 'warning';

  public category: RuleCategory = 'style';

  public severity: RuleSeverity = 'minor';

  public meta: RuleMeta = {
    description: 'Keys within each service should follow a specific order.',
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

  public options: ServiceKeysOrderRuleOptions;

  constructor(options?: ServiceKeysOrderRuleInputOptions) {
    const defaultOptions: ServiceKeysOrderRuleOptions = {
      groups: {
        [ServiceKeyGroup.CORE]: ['image', 'build', 'container_name'],
        [ServiceKeyGroup.DEPENDENCIES]: ['depends_on'],
        [ServiceKeyGroup.DATA_MANAGEMENT]: ['volumes', 'volumes_from', 'configs', 'secrets'],
        [ServiceKeyGroup.ENVIRONMENT]: ['environment', 'env_file'],
        [ServiceKeyGroup.NETWORK]: ['ports', 'networks', 'network_mode', 'extra_hosts'],
        [ServiceKeyGroup.RUNTIME]: ['command', 'entrypoint', 'working_dir', 'restart', 'healthcheck'],
        [ServiceKeyGroup.METADATA]: ['logging', 'labels', 'profiles'],
        [ServiceKeyGroup.SECURITY]: ['user', 'isolation'],
        [ServiceKeyGroup.OTHER]: [],
      },
      groupOrder: [
        ServiceKeyGroup.CORE,
        ServiceKeyGroup.DEPENDENCIES,
        ServiceKeyGroup.DATA_MANAGEMENT,
        ServiceKeyGroup.ENVIRONMENT,
        ServiceKeyGroup.NETWORK,
        ServiceKeyGroup.RUNTIME,
        ServiceKeyGroup.METADATA,
        ServiceKeyGroup.SECURITY,
        ServiceKeyGroup.OTHER,
      ],
    };

    this.options = {
      groups: {
        ...defaultOptions.groups,
        ...options?.groups,
      },
      groupOrder: options?.groupOrder || defaultOptions.groupOrder,
    };
  }

  private getCorrectOrder(keys: string[]): string[] {
    const otherKeys = keys
      .filter((key) => !Object.values(this.options.groups).flat().includes(key))
      .sort((a, b) => a.localeCompare(b));

    return [...this.options.groupOrder.flatMap((group) => this.options.groups[group]), ...otherKeys];
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const parsedDocument = parseYAML(context.sourceCode);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return [];

    for (const serviceItem of services.items) {
      if (!isScalar(serviceItem.key)) continue;

      const serviceName = String(serviceItem.key.value);
      const service = serviceItem.value;

      if (!isMap(service)) continue;

      const keys = service.items.map((key) => String(key.key));

      const correctOrder = this.getCorrectOrder(keys);
      let lastSeenIndex = -1;

      for (const key of keys) {
        const expectedIndex = correctOrder.indexOf(key);

        if (expectedIndex === -1) continue;

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
            data: {
              serviceName,
              key,
              correctOrder,
            },
          });
        }

        lastSeenIndex = expectedIndex;
      }
    }

    return errors;
  }

  public fix(content: string): string {
    const parsedDocument = parseYAML(content);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return content;

    for (const serviceItem of services.items) {
      if (!isScalar(serviceItem.key)) continue;

      const serviceName = String(serviceItem.key.value);
      const service = serviceItem.value;

      if (!isMap(service)) continue;

      const keys = service.items.map((item) => (isScalar(item.key) ? String(item.key.value) : '')).filter(Boolean);

      const correctOrder = this.getCorrectOrder(keys);
      const orderedService = new YAMLMap<unknown, unknown>();

      for (const key of correctOrder) {
        const item = service.items.find((node) => isScalar(node.key) && node.key.value === key);
        if (item) {
          orderedService.add(item);
        }
      }

      for (const key of keys) {
        if (!correctOrder.includes(key)) {
          const item = service.items.find((node) => isScalar(node.key) && node.key.value === key);
          if (item) {
            orderedService.add(item);
          }
        }
      }

      services.set(serviceName, orderedService);
    }

    return stringifyDocument(parsedDocument);
  }
}

export { type ServiceKeysOrderRuleInputOptions, ServiceKeyGroup, ServiceKeysOrderRule };
