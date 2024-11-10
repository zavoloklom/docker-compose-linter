import { parseDocument, isMap, isScalar } from 'yaml';
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

interface ServiceImageRequireExplicitTagRuleOptions {
  prohibitedTags?: string[];
}

export default class ServiceImageRequireExplicitTagRule implements LintRule {
  public name = 'service-image-require-explicit-tag';

  public type: LintMessageType = 'error';

  public category: LintRuleCategory = 'security';

  public severity: LintRuleSeverity = 'major';

  public meta: RuleMeta = {
    description:
      'Avoid using unspecific image tags like "latest" or "stable" in Docker Compose files to prevent unpredictable behavior. Specify a specific image version.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/service-image-require-explicit-tag-rule.md',
  };

  public fixable: boolean = false;

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName, image }: { serviceName: string; image: string }): string {
    return `Service "${serviceName}" is using the image "${image}", which does not have a concrete version tag. Specify a concrete version tag.`;
  }

  private readonly prohibitedTags: string[];

  constructor(options?: ServiceImageRequireExplicitTagRuleOptions) {
    // Default prohibited tags if not provided
    this.prohibitedTags = options?.prohibitedTags || [
      'latest',
      'stable',
      'edge',
      'test',
      'nightly',
      'dev',
      'beta',
      'canary',
    ];
  }

  private isImageTagExplicit(image: string): boolean {
    const lastPart = image.split('/').pop();
    if (!lastPart || !lastPart.includes(':')) return false;

    const [, tag] = lastPart.split(':');
    return !this.prohibitedTags.includes(tag);
  }

  public check(context: LintContext): LintMessage[] {
    const errors: LintMessage[] = [];
    const doc = parseDocument(context.sourceCode);
    const services = doc.get('services');

    if (!isMap(services)) return [];

    services.items.forEach((serviceItem) => {
      if (!isScalar(serviceItem.key)) return;

      const serviceName = String(serviceItem.key.value);
      const service = serviceItem.value;

      if (!isMap(service) || !service.has('image')) return;

      const image = String(service.get('image'));

      if (!this.isImageTagExplicit(image)) {
        const line = findLineNumberForService(doc, context.sourceCode, serviceName, 'image');
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
        });
      }
    });

    return errors;
  }
}
