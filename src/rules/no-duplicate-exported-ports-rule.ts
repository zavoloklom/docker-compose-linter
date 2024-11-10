import { parseDocument, isMap, isSeq, isScalar } from 'yaml';
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
import { extractPublishedPortValue, parsePortsRange } from '../util/service-ports-parser.js';

export default class NoDuplicateExportedPortsRule implements LintRule {
  public name = 'no-duplicate-exported-ports';

  public type: LintMessageType = 'error';

  public category: LintRuleCategory = 'security';

  public severity: LintRuleSeverity = 'critical';

  public meta: RuleMeta = {
    description:
      'Ensure that exported ports in Docker Compose are unique to prevent port conflicts and ensure proper network behavior.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-duplicate-exported-ports-rule.md',
  };

  public fixable: boolean = false;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({
    serviceName,
    publishedPort,
    anotherService,
  }: {
    serviceName: string;
    publishedPort: string;
    anotherService: string;
  }): string {
    return `Service "${serviceName}" is exporting port "${publishedPort}" which is already used by service "${anotherService}".`;
  }

  public check(context: LintContext): LintMessage[] {
    const errors: LintMessage[] = [];
    const doc = parseDocument(context.sourceCode);
    const services = doc.get('services');

    if (!isMap(services)) return [];

    const exportedPortsMap: Map<string, string> = new Map();

    services.items.forEach((serviceItem) => {
      if (!isScalar(serviceItem.key)) return;

      const serviceName = String(serviceItem.key.value);
      const service = serviceItem.value;

      if (!isMap(service) || !service.has('ports')) return;

      const ports = service.get('ports');
      if (!isSeq(ports)) return;

      ports.items.forEach((portItem) => {
        const publishedPort = extractPublishedPortValue(portItem);
        const currentPortRange = parsePortsRange(publishedPort);

        currentPortRange.some((port) => {
          if (exportedPortsMap.has(port)) {
            const line = findLineNumberForService(doc, context.sourceCode, serviceName, 'ports');
            errors.push({
              rule: this.name,
              type: this.type,
              category: this.category,
              severity: this.severity,
              message: this.getMessage({
                serviceName,
                publishedPort,
                anotherService: String(exportedPortsMap.get(port)),
              }),
              line,
              column: 1,
              meta: this.meta,
              fixable: this.fixable,
            });
            return true;
          }
          return false;
        });

        // Map ports to the service
        currentPortRange.forEach((port) => !exportedPortsMap.has(port) && exportedPortsMap.set(port, serviceName));
      });
    });

    return errors;
  }
}
