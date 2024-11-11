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

interface NoBuildAndImageRuleOptions {
  checkPullPolicy?: boolean;
}

export default class NoBuildAndImageRule implements LintRule {
  public name = 'no-build-and-image';

  public type: LintMessageType = 'error';

  public category: LintRuleCategory = 'best-practice';

  public severity: LintRuleSeverity = 'major';

  public meta: RuleMeta = {
    description:
      'Ensure that each service uses either "build" or "image", but not both, to prevent ambiguity in Docker Compose configurations.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-build-and-image-rule.md',
  };

  public fixable: boolean = false;

  private readonly checkPullPolicy: boolean;

  constructor(options?: NoBuildAndImageRuleOptions) {
    this.checkPullPolicy = options?.checkPullPolicy ?? true;
  }

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName }: { serviceName: string }): string {
    return `Service "${serviceName}" is using both "build" and "image". Use either "build" or "image" but not both.`;
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

      if (!isMap(service)) return;

      const hasBuild = service.has('build');
      const hasImage = service.has('image');
      const hasPullPolicy = service.has('pull_policy');

      if (hasBuild && hasImage && (!this.checkPullPolicy || !hasPullPolicy)) {
        const line = findLineNumberForService(parsedDocument, context.sourceCode, serviceName, 'build');
        errors.push({
          rule: this.name,
          type: this.type,
          category: this.category,
          severity: this.severity,
          message: this.getMessage({ serviceName }),
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
