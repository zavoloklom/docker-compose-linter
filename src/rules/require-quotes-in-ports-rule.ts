import { parseDocument, isMap, isSeq, isScalar, Scalar, ParsedNode, Pair } from 'yaml';
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

export interface RequireQuotesInPortsRuleInputOptions {
  quoteType?: 'single' | 'double';
}

interface RequireQuotesInPortsRuleOptions {
  quoteType: 'single' | 'double';
  portsSections: string[];
}

export default class RequireQuotesInPortsRule implements LintRule {
  public name = 'require-quotes-in-ports';

  public type: LintMessageType = 'warning';

  public category: LintRuleCategory = 'best-practice';

  public severity: LintRuleSeverity = 'minor';

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

    document.items.forEach((item) => {
      if (!isMap(item.value)) return;

      const serviceMap = item.value;
      serviceMap.items.forEach((service) => {
        if (!isMap(service.value)) return;

        const nodes = service.value.items.find((node) => isScalar(node.key) && node.key.value === section);
        if (nodes && isSeq(nodes.value)) {
          nodes.value.items.forEach((node) => {
            if (isScalar(node)) {
              callback(service, node);
            }
          });
        }
      });
    });
  }

  public check(context: LintContext): LintMessage[] {
    const errors: LintMessage[] = [];
    const parsedDocument = parseDocument(context.sourceCode);

    this.options.portsSections.forEach((section) => {
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
          });
        }
      });
    });

    return errors;
  }

  public fix(content: string): string {
    const parsedDocument = parseDocument(content);

    this.options.portsSections.forEach((section) => {
      RequireQuotesInPortsRule.extractValues(parsedDocument.contents, section, (service, port) => {
        if (port.type !== this.getQuoteType()) {
          const newPort = new Scalar(String(port.value));
          newPort.type = this.getQuoteType();
          Object.assign(port, newPort);
        }
      });
    });

    return parsedDocument.toString();
  }
}
