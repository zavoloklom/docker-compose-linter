import { Pair, ParsedNode, Scalar, isMap, isScalar, isSeq } from 'yaml';

import { findLineNumberForService } from '../util/line-finder';
import { parseYAML, stringifyDocument } from '../util/yaml-utils';

import type { Rule, RuleCategory, RuleMessage, RuleMeta, RuleSeverity, RuleType } from './rules.types';
import type { LintContext } from '../linter/linter.types';

interface RequireQuotesInPortsRuleInputOptions {
  quoteType?: 'single' | 'double';
}

interface RequireQuotesInPortsRuleOptions {
  quoteType: 'single' | 'double';
  portsSections: string[];
}

class RequireQuotesInPortsRule implements Rule {
  static readonly name = 'require-quotes-in-ports';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return RequireQuotesInPortsRule.name;
  }

  public type: RuleType = 'warning';

  public category: RuleCategory = 'best-practice';

  public severity: RuleSeverity = 'minor';

  public meta: RuleMeta = {
    description: 'Ports in `ports` and `expose` sections should be enclosed in quotes.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/require-quotes-in-ports-rule.md',
  };

  public fixable: boolean = true;

  public options: RequireQuotesInPortsRuleOptions;

  constructor(options?: RequireQuotesInPortsRuleInputOptions) {
    const defaultOptions: RequireQuotesInPortsRuleOptions = {
      quoteType: 'single',
      portsSections: ['ports', 'expose'],
    };
    this.options = { ...defaultOptions, ...options };
  }

  // eslint-disable-next-line class-methods-use-this
  public getMessage(): string {
    return 'Ports in `ports` and `expose` sections should be enclosed in quotes.';
  }

  private getQuoteType(): Scalar.Type {
    return this.options.quoteType === 'single' ? 'QUOTE_SINGLE' : 'QUOTE_DOUBLE';
  }

  // Static method to extract and process values
  private static extractValues(
    document: ParsedNode | null,
    section: string,
    callback: (service: Pair, port: Scalar) => void,
  ) {
    if (!document || !isMap(document)) return;

    const services = document.get('services');
    if (!isMap(services)) return;

    for (const serviceItem of services.items) {
      if (!isMap(serviceItem.value)) continue;
      const nodes = serviceItem.value.get(section);
      if (!nodes || !isSeq(nodes)) continue;
      for (const node of nodes.items) {
        if (isScalar(node)) {
          callback(serviceItem, node);
        }
      }
    }
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const parsedDocument = parseYAML(context.sourceCode);

    for (const section of this.options.portsSections) {
      RequireQuotesInPortsRule.extractValues(parsedDocument.contents, section, (service, port) => {
        if (port.type !== this.getQuoteType()) {
          errors.push({
            rule: this.name,
            type: this.type,
            category: this.category,
            severity: this.severity,
            message: this.getMessage(),
            line: findLineNumberForService(
              parsedDocument,
              context.sourceCode,
              String(service.key),
              section,
              String(port.value),
            ),
            column: 1,
            meta: this.meta,
            fixable: this.fixable,
            data: {
              service,
              port,
              section,
            },
          });
        }
      });
    }

    return errors;
  }

  public fix(content: string): string {
    const parsedDocument = parseYAML(content);

    for (const section of this.options.portsSections) {
      RequireQuotesInPortsRule.extractValues(parsedDocument.contents, section, (service, port) => {
        if (port.type !== this.getQuoteType()) {
          const newPort = new Scalar(String(port.value));
          newPort.type = this.getQuoteType();
          Object.assign(port, newPort);
        }
      });
    }

    return stringifyDocument(parsedDocument);
  }
}

export { type RequireQuotesInPortsRuleInputOptions, RequireQuotesInPortsRule };
