import { parseDocument, YAMLMap, isScalar, isMap } from 'yaml';
import type {
  LintContext,
  LintMessage,
  LintMessageType,
  LintRule,
  LintRuleCategory,
  LintRuleSeverity,
  RuleMeta,
} from '../linter/linter.types.js';
import { findLineNumberForService } from '../util/line-finder.js';

export default class ServicesAlphabeticalOrderRule implements LintRule {
  public name = 'services-alphabetical-order';

  public type: LintMessageType = 'warning';

  public category: LintRuleCategory = 'style';

  public severity: LintRuleSeverity = 'minor';

  public message = 'Services should be listed in alphabetical order.';

  public meta: RuleMeta = {
    description: 'Ensure that services in the Docker Compose file are listed in alphabetical order.',
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

  public check(context: LintContext): LintMessage[] {
    const errors: LintMessage[] = [];
    const parsedDocument = parseDocument(context.sourceCode);
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
        });
      }

      processedServices.push(serviceName);
    });

    return errors;
  }

  // eslint-disable-next-line class-methods-use-this
  public fix(content: string): string {
    const parsedDocument = parseDocument(content);
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

    return parsedDocument.toString();
  }
}
