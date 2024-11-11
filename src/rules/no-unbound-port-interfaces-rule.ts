import { parseDocument, isMap, isSeq, isScalar } from 'yaml';
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
import { extractPublishedPortInterfaceValue } from '../util/service-ports-parser';

export default class NoUnboundPortInterfacesRule implements LintRule {
  public name = 'no-unbound-port-interfaces';

  public type: LintMessageType = 'error';

  public category: LintRuleCategory = 'security';

  public severity: LintRuleSeverity = 'major';

  public meta: RuleMeta = {
    description:
      'Ensure that exported ports in Docker Compose are bound to specific Interfaces to prevent unintentional exposing services to the network.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-unbound-port-interfaces-rule.md',
  };

  public fixable = false;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName, port }: { serviceName: string; port: string }): string {
    return `Service "${serviceName}" is exporting port "${port}" without specifying the interface to listen on.`;
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

      if (!isMap(service) || !service.has('ports')) return;

      const ports = service.get('ports');
      if (!isSeq(ports)) return;

      ports.items.forEach((portItem) => {
        const publishedInterface = extractPublishedPortInterfaceValue(portItem);

        if (publishedInterface === '') {
          const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName, 'ports');
          errors.push({
            rule: this.name,
            type: this.type,
            category: this.category,
            severity: this.severity,
            message: this.getMessage({
              serviceName,
              port: isSeq(portItem) ? portItem.toString() : String(portItem),
            }),
            line,
            column: 1,
            meta: this.meta,
            fixable: this.fixable,
          });
        }
      });
    });
    return errors;
  }
}
