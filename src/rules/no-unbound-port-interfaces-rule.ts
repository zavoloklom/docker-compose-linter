import { isMap, isSeq, isScalar } from 'yaml';
import { parseYAML } from '../util/yaml-utils';
import { findLineNumberForService } from '../util/line-finder';
import { extractPublishedPortInterfaceValue } from '../util/service-ports-parser';
import type { LintContext } from '../linter/linter.types';
import type { Rule, RuleCategory, RuleSeverity, RuleType, RuleMeta, RuleMessage } from './rules.types';

export default class NoUnboundPortInterfacesRule implements Rule {
  static readonly name = 'no-unbound-port-interfaces';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return NoUnboundPortInterfacesRule.name;
  }

  public type: RuleType = 'error';

  public category: RuleCategory = 'security';

  public severity: RuleSeverity = 'major';

  public meta: RuleMeta = {
    description: 'Exported ports must be bound to specific interfaces to avoid unintentional exposure.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-unbound-port-interfaces-rule.md',
  };

  public fixable = false;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName, port }: { serviceName: string; port: string }): string {
    return `Service "${serviceName}" is exporting port "${port}" without specifying the interface to listen on.`;
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
            data: {
              serviceName,
              portItem,
            },
          });
        }
      });
    });
    return errors;
  }
}
