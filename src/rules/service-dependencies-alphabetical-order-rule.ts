import { isMap, isPair, isScalar, isSeq } from 'yaml';

import { findLineNumberForService } from '../util/line-finder';
import { parseYAML, stringifyDocument } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

export default class ServiceDependenciesAlphabeticalOrderRule implements Rule {
  static readonly name = 'service-dependencies-alphabetical-order';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return ServiceDependenciesAlphabeticalOrderRule.name;
  }

  public type: RuleType = 'warning';

  public category: RuleCategory = 'style';

  public severity: RuleSeverity = 'info';

  public meta: RuleMeta = {
    description: 'Services in the `depends_on` section should be sorted alphabetically.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/service-dependencies-alphabetical-order-rule.md',
  };

  public fixable: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  public getMessage = ({ serviceName }: { serviceName: string }): string => {
    return `Services in "depends_on" for service "${serviceName}" should be in alphabetical order.`;
  };

  private static extractServiceName(yamlNode: unknown): string {
    // Short Syntax
    if (isScalar(yamlNode)) {
      return String(yamlNode.value);
    }
    // Long Syntax
    if (isPair(yamlNode)) {
      return String(yamlNode.key);
    }
    return '';
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

      if (!service || !isMap(service)) return;

      const dependsOn = service.get('depends_on');
      if (!isSeq(dependsOn) && !isMap(dependsOn)) return;

      const extractedDependencies = dependsOn.items.map((item) =>
        ServiceDependenciesAlphabeticalOrderRule.extractServiceName(item),
      );
      const sortedDependencies = [...extractedDependencies].sort((a, b) => a.localeCompare(b));

      if (JSON.stringify(extractedDependencies) !== JSON.stringify(sortedDependencies)) {
        const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName, 'depends_on');
        errors.push({
          rule: this.name,
          type: this.type,
          category: this.category,
          severity: this.severity,
          message: this.getMessage({ serviceName }),
          line,
          column: 1,
          meta: this.meta,
          fixable: this.fixable,
          data: {
            serviceName,
          },
        });
      }
    });

    return errors;
  }

  // eslint-disable-next-line class-methods-use-this
  public fix(content: string): string {
    const parsedDocument = parseYAML(content);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return content;

    services.items.forEach((serviceItem) => {
      const service = serviceItem.value;
      if (!service || !isMap(service)) return;

      const dependsOn = service.get('depends_on');
      if (!isSeq(dependsOn) && !isMap(dependsOn)) return;

      dependsOn.items.sort((a, b) => {
        const valueA = ServiceDependenciesAlphabeticalOrderRule.extractServiceName(a);
        const valueB = ServiceDependenciesAlphabeticalOrderRule.extractServiceName(b);
        return valueA.localeCompare(valueB);
      });
    });

    return stringifyDocument(parsedDocument);
  }
}
