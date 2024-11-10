import { parseDocument, isMap, isSeq, isScalar, Scalar, ParsedNode } from 'yaml';
import type {
  LintContext,
  LintMessage,
  LintMessageType,
  LintRule,
  LintRuleCategory,
  LintRuleSeverity,
  RuleMeta,
} from '../linter/linter.types.js';
import { findLineNumberByValue } from '../util/line-finder.js';

interface RequireQuotesInPortsRuleOptions {
  quoteType: 'single' | 'double';
}

export default class RequireQuotesInPortsRule implements LintRule {
  public name = 'require-quotes-in-ports';

  public type: LintMessageType = 'warning';

  public category: LintRuleCategory = 'best-practice';

  public severity: LintRuleSeverity = 'minor';

  public meta: RuleMeta = {
    description: 'Ensure that ports are enclosed in quotes in Docker Compose files.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/require-quotes-in-ports-rule.md',
  };

  public fixable: boolean = true;

  // eslint-disable-next-line class-methods-use-this
  public getMessage(): string {
    return 'Ports should be enclosed in quotes in Docker Compose files.';
  }

  private readonly quoteType: 'single' | 'double';

  constructor(options?: RequireQuotesInPortsRuleOptions) {
    this.quoteType = options?.quoteType || 'single';
  }

  private getQuoteType(): Scalar.Type {
    return this.quoteType === 'single' ? 'QUOTE_SINGLE' : 'QUOTE_DOUBLE';
  }

  // Static method to extract and process ports
  private static extractPorts(document: ParsedNode | null, callback: (port: Scalar) => void) {
    if (!document || !isMap(document)) return;

    document.items.forEach((item) => {
      if (!isMap(item.value)) return;

      const serviceMap = item.value;
      serviceMap.items.forEach((service) => {
        if (!isMap(service.value)) return;

        const ports = service.value.items.find((node) => isScalar(node.key) && node.key.value === 'ports');
        if (!ports || !isSeq(ports.value)) return;

        ports.value.items.forEach((port) => {
          if (isScalar(port)) {
            callback(port);
          }
        });
      });
    });
  }

  public check(context: LintContext): LintMessage[] {
    const errors: LintMessage[] = [];
    const parsedDocument = parseDocument(context.sourceCode);

    RequireQuotesInPortsRule.extractPorts(parsedDocument.contents, (port) => {
      if (port.type !== this.getQuoteType()) {
        errors.push({
          rule: this.name,
          type: this.type,
          category: this.category,
          severity: this.severity,
          message: this.getMessage(),
          line: findLineNumberByValue(context.sourceCode, String(port.value)),
          column: 1,
          meta: this.meta,
          fixable: this.fixable,
        });
      }
    });

    return errors;
  }

  public fix(content: string): string {
    const parsedDocument = parseDocument(content);

    RequireQuotesInPortsRule.extractPorts(parsedDocument.contents, (port) => {
      if (port.type !== this.getQuoteType()) {
        // eslint-disable-next-line no-param-reassign
        port.type = this.getQuoteType();
      }
    });

    return parsedDocument.toString();
  }
}
