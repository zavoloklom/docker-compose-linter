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

interface RequireQuotesInPortsRuleOptions {
  quoteType: 'single' | 'double';
}

export default class RequireQuotesInPortsRule implements LintRule {
  public name = 'require-quotes-in-ports';

  public type: LintMessageType = 'warning';

  public category: LintRuleCategory = 'best-practice';

  public severity: LintRuleSeverity = 'minor';

  public meta: RuleMeta = {
    description: 'Ensure that ports (in `ports` and `expose` sections) are enclosed in quotes in Docker Compose files.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/require-quotes-in-ports-rule.md',
  };

  public fixable: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  public getMessage(): string {
    return 'Ports in `ports` and `expose` sections should be enclosed in quotes.';
  }

  private readonly quoteType: 'single' | 'double';

  private readonly portsSections: string[];

  constructor(options?: RequireQuotesInPortsRuleOptions) {
    this.quoteType = options?.quoteType || 'single';
    this.portsSections = ['ports', 'expose'];
  }

  private getQuoteType(): Scalar.Type {
    return this.quoteType === 'single' ? 'QUOTE_SINGLE' : 'QUOTE_DOUBLE';
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

    this.portsSections.forEach((section) => {
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

    this.portsSections.forEach((section) => {
      RequireQuotesInPortsRule.extractValues(parsedDocument.contents, section, (service, port) => {
        if (port.type !== this.getQuoteType()) {
          // eslint-disable-next-line no-param-reassign
          port.type = this.getQuoteType();
        }
      });
    });

    return parsedDocument.toString();
  }
}
