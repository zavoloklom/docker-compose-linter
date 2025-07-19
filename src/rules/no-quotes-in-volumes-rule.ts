import { ParsedNode, Scalar, isMap, isScalar, isSeq } from 'yaml';

import { findLineNumberByValue } from '../util/line-finder';
import { parseYAML, stringifyDocument } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

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

    const services = document.get('services');
    if (!isMap(services)) return;

    for (const serviceItem of services.items) {
      if (!isMap(serviceItem.value)) continue;
      const volumes = serviceItem.value.get('volumes');
      if (!volumes || !isSeq(volumes)) continue;
      for (const volume of volumes.items) {
        // TODO: Handle non-scalar volumes
        if (isScalar(volume)) {
          callback(volume);
        }
      }
    }
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const parsedDocument = parseYAML(context.sourceCode);

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
    const parsedDocument = parseYAML(content);

    NoQuotesInVolumesRule.extractVolumes(parsedDocument.contents, (volume) => {
      if (volume.type !== 'PLAIN') {
        volume.type = 'PLAIN';
      }
    });

    return stringifyDocument(parsedDocument);
  }
}
