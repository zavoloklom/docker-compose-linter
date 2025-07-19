import { isMap, isScalar } from 'yaml';

import { findLineNumberForService } from '../util/line-finder';
import { parseYAML } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

export default class NoDuplicateContainerNamesRule implements Rule {
  static readonly name = 'no-duplicate-container-names';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return NoDuplicateContainerNamesRule.name;
  }

  public type: RuleType = 'error';

  public category: RuleCategory = 'security';

  public severity: RuleSeverity = 'critical';

  public meta: RuleMeta = {
    description: 'Container names must be unique to prevent conflicts and ensure proper container management.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-duplicate-container-names-rule.md',
  };

  public fixable: boolean = false;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({
    serviceName,
    containerName,
    anotherService,
  }: {
    serviceName: string;
    containerName: string;
    anotherService: string;
  }): string {
    return `Service "${serviceName}" has a duplicate container name "${containerName}" with service "${anotherService}". Container names MUST BE unique.`;
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const parsedDocument = parseYAML(context.sourceCode);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return [];

    const containerNames: Map<string, string> = new Map();

    for (const serviceItem of services.items) {
      if (!isScalar(serviceItem.key)) continue;

      const serviceName = String(serviceItem.key.value);
      const service = serviceItem.value;

      if (isMap(service) && service.has('container_name')) {
        const containerName = String(service.get('container_name'));

        if (containerNames.has(containerName)) {
          const anotherService = String(containerNames.get(containerName));
          const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName, 'container_name');
          errors.push({
            rule: this.name,
            type: this.type,
            category: this.category,
            severity: this.severity,
            message: this.getMessage({
              serviceName,
              containerName,
              anotherService,
            }),
            line,
            column: 1,
            meta: this.meta,
            fixable: this.fixable,
            data: {
              serviceName,
              containerName,
              anotherService,
            },
          });
        } else {
          containerNames.set(containerName, serviceName);
        }
      }
    }

    return errors;
  }
}
