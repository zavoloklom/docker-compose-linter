import { YAMLMap, isMap, isScalar } from 'yaml';

import { findLineNumberForService } from '../util/line-finder';
import { parseYAML, stringifyDocument } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

export interface ServiceKeysOrderRuleInputOptions {
  groupOrder?: GroupOrderEnum[];
  groups?: Partial<Record<GroupOrderEnum, string[]>>;
}

interface ServiceKeysOrderRuleOptions {
  groupOrder: GroupOrderEnum[];
  groups: Record<GroupOrderEnum, string[]>;
}

export enum GroupOrderEnum {
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

export default class ServiceKeysOrderRule implements Rule {
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
        [GroupOrderEnum.CoreDefinitions]: ['image', 'build', 'container_name'],
        [GroupOrderEnum.ServiceDependencies]: ['depends_on'],
        [GroupOrderEnum.DataManagementAndConfiguration]: ['volumes', 'volumes_from', 'configs', 'secrets'],
        [GroupOrderEnum.EnvironmentConfiguration]: ['environment', 'env_file'],
        [GroupOrderEnum.Networking]: ['ports', 'networks', 'network_mode', 'extra_hosts'],
        [GroupOrderEnum.RuntimeBehavior]: ['command', 'entrypoint', 'working_dir', 'restart', 'healthcheck'],
        [GroupOrderEnum.OperationalMetadata]: ['logging', 'labels'],
        [GroupOrderEnum.SecurityAndExecutionContext]: ['user', 'isolation'],
        [GroupOrderEnum.Other]: [],
      },
      groupOrder: [
        GroupOrderEnum.CoreDefinitions,
        GroupOrderEnum.ServiceDependencies,
        GroupOrderEnum.DataManagementAndConfiguration,
        GroupOrderEnum.EnvironmentConfiguration,
        GroupOrderEnum.Networking,
        GroupOrderEnum.RuntimeBehavior,
        GroupOrderEnum.OperationalMetadata,
        GroupOrderEnum.SecurityAndExecutionContext,
        GroupOrderEnum.Other,
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
            data: {
              serviceName,
              key,
              correctOrder,
            },
          });
        }

        lastSeenIndex = expectedIndex;
      });
    });

    return errors;
  }

  public fix(content: string): string {
    const parsedDocument = parseYAML(content);
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

    return stringifyDocument(parsedDocument);
  }
}
