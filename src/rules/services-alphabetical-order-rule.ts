import { YAMLMap, isScalar, isMap } from 'yaml';
import { parseYAML, stringifyDocument } from '../util/yaml-utils';
import { findLineNumberForService } from '../util/line-finder';
import type { LintContext } from '../linter/linter.types';
import type { Rule, RuleCategory, RuleSeverity, RuleType, RuleMeta, RuleMessage } from './rules.types';

export default class ServicesAlphabeticalOrderRule implements Rule {
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

    processedServices.forEach((previousService) => {
      if (
        previousService.localeCompare(currentService) > 0 &&
        (!misplacedBefore || previousService.localeCompare(misplacedBefore) < 0)
      ) {
        misplacedBefore = previousService;
      }
    });

    return misplacedBefore;
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const parsedDocument = parseYAML(context.sourceCode);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return [];

    const processedServices: string[] = [];

    services.items.forEach((serviceItem) => {
      if (!isScalar(serviceItem.key)) return;

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
    });

    return errors;
  }

  // eslint-disable-next-line class-methods-use-this
  public fix(content: string): string {
    const parsedDocument = parseYAML(content);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return content;

    const sortedServices = new YAMLMap();
    const sortedItems = services.items.sort((a, b) => {
      if (isScalar(a.key) && isScalar(b.key)) {
        return String(a.key.value).localeCompare(String(b.key.value));
      }
      return 0;
    });

    sortedItems.forEach((item) => {
      sortedServices.add(item);
    });

    parsedDocument.set('services', sortedServices);

    return stringifyDocument(parsedDocument);
  }
}
