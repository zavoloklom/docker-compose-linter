import { isMap, isScalar } from 'yaml';

import { findLineNumberForService } from '../util/line-finder';
import { parseYAML } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

export interface ServiceImageRequireExplicitTagRuleInputOptions {
  prohibitedTags?: string[];
}

interface ServiceImageRequireExplicitTagRuleOptions {
  prohibitedTags: string[];
}

export default class ServiceImageRequireExplicitTagRule implements Rule {
  static readonly name = 'service-image-require-explicit-tag';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return ServiceImageRequireExplicitTagRule.name;
  }

  public type: RuleType = 'error';

  public category: RuleCategory = 'security';

  public severity: RuleSeverity = 'major';

  public meta: RuleMeta = {
    description: 'Services must use a specific image tag instead of "latest", "stable" or similar or no tag.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/service-image-require-explicit-tag-rule.md',
  };

  public fixable: boolean = false;

  public options: ServiceImageRequireExplicitTagRuleOptions;

  constructor(options?: ServiceImageRequireExplicitTagRuleInputOptions) {
    const defaultOptions: ServiceImageRequireExplicitTagRuleOptions = {
      prohibitedTags: ['latest', 'stable', 'edge', 'test', 'nightly', 'dev', 'beta', 'canary', 'lts'],
    };
    this.options = { ...defaultOptions, ...options };
  }

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName, image }: { serviceName: string; image: string }): string {
    return `Service "${serviceName}" is using the image "${image}", which does not have a concrete version tag. Specify a concrete version tag.`;
  }

  private isImageTagExplicit(image: string): boolean {
    const lastPart = image.split('/').pop();
    if (!lastPart || !lastPart.includes(':')) return false;

    const [, tag] = lastPart.split(':');
    return !this.options.prohibitedTags.includes(tag);
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

      if (!isMap(service) || !service.has('image')) return;

      const image = String(service.get('image'));

      if (!this.isImageTagExplicit(image)) {
        const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName, 'image');
        errors.push({
          rule: this.name,
          type: this.type,
          category: this.category,
          severity: this.severity,
          message: this.getMessage({ serviceName, image }),
          line,
          column: 1,
          meta: this.meta,
          fixable: this.fixable,
          data: {
            image,
            serviceName,
          },
        });
      }
    });

    return errors;
  }
}
