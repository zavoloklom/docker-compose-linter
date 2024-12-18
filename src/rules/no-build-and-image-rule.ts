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

export interface NoBuildAndImageRuleInputOptions {
  checkPullPolicy?: boolean;
}

interface NoBuildAndImageRuleOptions {
  checkPullPolicy: boolean;
}

export default class NoBuildAndImageRule implements LintRule {
  public name = 'no-build-and-image';

  public type: LintMessageType = 'error';

  public category: LintRuleCategory = 'best-practice';

  public severity: LintRuleSeverity = 'major';

  public meta: RuleMeta = {
    description: 'Each service must use either `build` or `image`, not both.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-build-and-image-rule.md',
  };

  public fixable: boolean = false;

  public options: NoBuildAndImageRuleOptions;

  constructor(options?: NoBuildAndImageRuleInputOptions) {
    const defaultOptions: NoBuildAndImageRuleOptions = {
      checkPullPolicy: true,
    };
    this.options = { ...defaultOptions, ...options };
  }

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ serviceName }: { serviceName: string }): string {
    return `Service "${serviceName}" is using both "build" and "image". Use one of them, but not both.`;
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

      if (hasBuild && hasImage && (!this.options.checkPullPolicy || !hasPullPolicy)) {
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
          data: {
            serviceName,
          },
        });
      }
    });

    return errors;
  }
}
