import { isMap, isScalar } from 'yaml';

import { findLineNumberForService } from '../util/line-finder';
import { parseYAML } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

class ServiceContainerNameRegexRule implements Rule {
  static readonly name = 'service-container-name-regex';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return ServiceContainerNameRegexRule.name;
  }

  public type: RuleType = 'error';

  public category: RuleCategory = 'security';

  public severity: RuleSeverity = 'critical';

  // See https://docs.docker.com/reference/compose-file/services/#container_name
  private static readonly containerNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/u;

  public meta: RuleMeta = {
    description: `Container names must match the pattern \`${ServiceContainerNameRegexRule.containerNameRegex}\` to comply with Docker naming conventions.`,
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/service-container-name-regex-rule.md',
  };

  public fixable: boolean = false;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName, containerName }: { serviceName: string; containerName: string }): string {
    return `Service "${serviceName}" has an invalid container name "${containerName}". It must match the regex pattern ${ServiceContainerNameRegexRule.containerNameRegex}.`;
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const parsedDocument = parseYAML(context.sourceCode);
    const services = parsedDocument.get('services');

    if (!isMap(services)) return [];

    for (const serviceItem of services.items) {
      if (!isScalar(serviceItem.key)) continue;

      const serviceName = String(serviceItem.key.value);
      const service = serviceItem.value;

      if (!isMap(service) || !service.has('container_name')) continue;

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
          data: {
            serviceName,
            containerName,
          },
        });
      }
    }

    return errors;
  }
}

export { ServiceContainerNameRegexRule };
