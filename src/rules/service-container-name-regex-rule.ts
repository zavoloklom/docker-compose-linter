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

export default class ServiceContainerNameRegexRule implements LintRule {
  public name = 'service-container-name-regex';

  public type: LintMessageType = 'error';

  public category: LintRuleCategory = 'security';

  public severity: LintRuleSeverity = 'critical';

  // see https://docs.docker.com/reference/compose-file/services/#container_name
  private static readonly containerNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/;

  public meta: RuleMeta = {
    description: `Container names must match the pattern \`${ServiceContainerNameRegexRule.containerNameRegex}\` to comply with Docker naming conventions.`,
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/service-container-name-regex-rule.md',
  };

  public fixable: boolean = false;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName, containerName }: { serviceName: string; containerName: string }): string {
    return `Service "${serviceName}" has an invalid container name "${containerName}". It must match the regex pattern ${ServiceContainerNameRegexRule.containerNameRegex}.`;
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

      if (!isMap(service) || !service.has('container_name')) return;

      const containerName = String(service.get('container_name'));

      if (!ServiceContainerNameRegexRule.containerNameRegex.test(containerName)) {
        const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName, 'container_name');
        errors.push({
          rule: this.name,
          type: this.type,
          category: this.category,
          severity: this.severity,
          message: this.getMessage({ serviceName, containerName }),
          line,
          column: 1,
          meta: this.meta,
          fixable: this.fixable,
        });
      }
    });

    return errors;
  }
}
