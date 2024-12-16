import { parseDocument, isMap, isScalar } from 'yaml';
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

export default class NoDuplicateContainerNamesRule implements LintRule {
  public name = 'no-duplicate-container-names';

  public type: LintMessageType = 'error';

  public category: LintRuleCategory = 'security';

  public severity: LintRuleSeverity = 'critical';

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

  public check(context: LintContext): LintMessage[] {
    const errors: LintMessage[] = [];
    const parsedDocument = parseDocument(context.sourceCode);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return [];

    const containerNames: Map<string, string> = new Map();

    services.items.forEach((serviceItem) => {
      if (!isScalar(serviceItem.key)) return;

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
    });

    return errors;
  }
}
