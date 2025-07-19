import { isMap, isScalar, isSeq } from 'yaml';

import { findLineNumberForService } from '../util/line-finder';
import { extractPublishedPortValueWithProtocol, parsePortsRange } from '../util/service-ports-parser';
import { parseYAML } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

export default class NoDuplicateExportedPortsRule implements Rule {
  static readonly name = 'no-duplicate-exported-ports';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return NoDuplicateExportedPortsRule.name;
  }

  public type: RuleType = 'error';

  public category: RuleCategory = 'security';

  public severity: RuleSeverity = 'critical';

  public meta: RuleMeta = {
    description: 'Exported ports must be unique to avoid conflicts.',
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

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const parsedDocument = parseYAML(context.sourceCode);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return [];

    const exportedPortsMap: Map<string, string> = new Map();

    for (const serviceItem of services.items) {
      if (!isScalar(serviceItem.key)) continue;

      const serviceName = String(serviceItem.key.value);
      const service = serviceItem.value;

      if (!isMap(service) || !service.has('ports')) continue;

      const ports = service.get('ports');
      if (!isSeq(ports)) continue;

      for (const portItem of ports.items) {
        const { port, protocol } = extractPublishedPortValueWithProtocol(portItem);
        const currentPortRange = parsePortsRange(port);

        currentPortRange.some((rangePort) => {
          const rangeKey = `${rangePort}/${protocol}`;
          if (exportedPortsMap.has(rangeKey)) {
            const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName, 'ports');
            errors.push({
              rule: this.name,
              type: this.type,
              category: this.category,
              severity: this.severity,
              message: this.getMessage({
                serviceName,
                publishedPort: port,
                anotherService: String(exportedPortsMap.get(rangeKey)),
              }),
              line,
              column: 1,
              meta: this.meta,
              fixable: this.fixable,
              data: {
                serviceName,
                publishedPort: port,
                exportedPortsMap,
              },
            });
            return true;
          }
          return false;
        });

        // Map ports to the service
        for (const rangePort of currentPortRange) {
          const rangeKey = `${rangePort}/${protocol}`;
          if (!exportedPortsMap.has(rangeKey)) {
            exportedPortsMap.set(rangeKey, serviceName);
          }
        }
      }
    }

    return errors;
  }
}
