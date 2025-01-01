import { parseDocument, isSeq, isScalar, isMap } from 'yaml';
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
import { extractPublishedPortValueWithProtocol } from '../util/service-ports-parser';

export default class ServicePortsAlphabeticalOrderRule implements LintRule {
  public name = 'service-ports-alphabetical-order';

  public type: LintMessageType = 'warning';

  public category: LintRuleCategory = 'style';

  public severity: LintRuleSeverity = 'info';

  public meta: RuleMeta = {
    description: 'The list of ports in a service should be sorted alphabetically.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/service-ports-alphabetical-order-rule.md',
  };

  public fixable: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName }: { serviceName: string }): string {
    return `Ports in service "${serviceName}" should be in alphabetical order.`;
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

      if (!isMap(service) || !isSeq(service.get('ports'))) return;

      const ports = service.get('ports');
      if (!isSeq(ports)) return;

      const extractedPorts = ports.items.map((port) => extractPublishedPortValueWithProtocol(port).port);
      const sortedPorts = [...extractedPorts].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      if (JSON.stringify(extractedPorts) !== JSON.stringify(sortedPorts)) {
        const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName, 'ports');
        errors.push({
          rule: this.name,
          type: this.type,
          category: this.category,
          severity: this.severity,
          message: `Ports in service "${serviceName}" should be in alphabetical order.`,
          line,
          column: 1,
          meta: this.meta,
          fixable: this.fixable,
        });
      }
    });

    return errors;
  }

  // eslint-disable-next-line class-methods-use-this
  public fix(content: string): string {
    const parsedDocument = parseDocument(content);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return content;

    services.items.forEach((serviceItem) => {
      const service = serviceItem.value;

      if (!isMap(service) || !isSeq(service.get('ports'))) return;

      const ports = service.get('ports');
      if (!isSeq(ports)) return;

      ports.items.sort((a, b) => {
        const valueA = extractPublishedPortValueWithProtocol(a).port;
        const valueB = extractPublishedPortValueWithProtocol(b).port;

        return valueA.localeCompare(valueB, undefined, { numeric: true });
      });
    });

    return parsedDocument.toString();
  }
}
