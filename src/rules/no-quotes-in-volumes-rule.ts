import { parseDocument, isMap, isSeq, isScalar, Scalar, ParsedNode } from 'yaml';
import { findLineNumberByValue } from '../util/line-finder';
import type { LintContext } from '../linter/linter.types';
import type { Rule, RuleCategory, RuleSeverity, RuleType, RuleMeta, RuleMessage } from './rules.types';

export default class NoQuotesInVolumesRule implements Rule {
  static readonly name = 'no-quotes-in-volumes';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return NoQuotesInVolumesRule.name;
  }

  public type: RuleType = 'warning';

  public category: RuleCategory = 'style';

  public severity: RuleSeverity = 'info';

  public meta: RuleMeta = {
    description: 'Values in the `volumes` section should not be enclosed in quotes.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/no-quotes-in-volumes-rule.md',
  };

  public fixable: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  public getMessage(): string {
    return 'Quotes should not be used in volume names.';
  }

  private static extractVolumes(document: ParsedNode | null, callback: (volume: Scalar) => void) {
    if (!document || !isMap(document)) return;

    document.items.forEach((item) => {
      if (!isMap(item.value)) return;

      const serviceMap = item.value;
      serviceMap.items.forEach((service) => {
        if (!isMap(service.value)) return;

        const volumes = service.value.items.find((node) => isScalar(node.key) && node.key.value === 'volumes');
        if (!volumes || !isSeq(volumes.value)) return;

        volumes.value.items.forEach((volume) => {
          if (isScalar(volume)) {
            callback(volume);
          }
        });
      });
    });
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const parsedDocument = parseDocument(context.sourceCode);

    NoQuotesInVolumesRule.extractVolumes(parsedDocument.contents, (volume) => {
      if (volume.type !== 'PLAIN') {
        errors.push({
          rule: this.name,
          type: this.type,
          category: this.category,
          severity: this.severity,
          message: this.getMessage(),
          line: findLineNumberByValue(context.sourceCode, String(volume.value)),
          column: 1,
          meta: this.meta,
          fixable: this.fixable,
          data: {
            volume,
          },
        });
      }
    });

    return errors;
  }

  // eslint-disable-next-line class-methods-use-this
  public fix(content: string): string {
    const parsedDocument = parseDocument(content);

    NoQuotesInVolumesRule.extractVolumes(parsedDocument.contents, (volume) => {
      if (volume.type !== 'PLAIN') {
        // eslint-disable-next-line no-param-reassign
        volume.type = 'PLAIN';
      }
    });

    return parsedDocument.toString();
  }
}
