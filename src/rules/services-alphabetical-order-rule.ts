import { YAMLMap, isMap, isScalar } from 'yaml';

import { findLineNumberForService } from '../util/line-finder';
import { parseYAML, stringifyDocument } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

class ServicesAlphabeticalOrderRule implements Rule {
  static readonly name = 'services-alphabetical-order';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return ServicesAlphabeticalOrderRule.name;
  }

  public type: RuleType = 'warning';

  public category: RuleCategory = 'style';

  public severity: RuleSeverity = 'minor';

  public meta: RuleMeta = {
    description: 'Services should be sorted alphabetically.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/services-alphabetical-order-rule.md',
  };

  public fixable: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName, misplacedBefore }: { serviceName: string; misplacedBefore: string }): string {
    return `Service "${serviceName}" should be before "${misplacedBefore}".`;
  }

  private static findMisplacedService(processedServices: string[], currentService: string): string | null {
    let misplacedBefore = '';

    for (const processedService of processedServices) {
      if (
        processedService.localeCompare(currentService) > 0 &&
        (!misplacedBefore || processedService.localeCompare(misplacedBefore) < 0)
      ) {
        misplacedBefore = processedService;
      }
    }

    return misplacedBefore;
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const parsedDocument = parseYAML(context.sourceCode);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return [];

    const processedServices: string[] = [];

    for (const serviceItem of services.items) {
      if (!isScalar(serviceItem.key)) continue;

      const serviceName = String(serviceItem.key.value);
      const misplacedBefore = ServicesAlphabeticalOrderRule.findMisplacedService(processedServices, serviceName);

      if (misplacedBefore) {
        const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName);

        errors.push({
          rule: this.name,
          type: this.type,
          category: this.category,
          severity: this.severity,
          message: this.getMessage({ serviceName, misplacedBefore }),
          line,
          column: 1,
          meta: this.meta,
          fixable: this.fixable,
          data: {
            serviceName,
            misplacedBefore,
          },
        });
      }

      processedServices.push(serviceName);
    }

    return errors;
  }

  // eslint-disable-next-line class-methods-use-this
  public fix(content: string): string {
    const parsedDocument = parseYAML(content);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return content;

    const sortedServices = new YAMLMap();
    const sortedItems = services.items.toSorted((a, b) => {
      if (isScalar(a.key) && isScalar(b.key)) {
        return String(a.key.value).localeCompare(String(b.key.value));
      }
      return 0;
    });

    for (const item of sortedItems) {
      sortedServices.add(item);
    }

    parsedDocument.set('services', sortedServices);

    return stringifyDocument(parsedDocument);
  }
}

export { ServicesAlphabeticalOrderRule };
