import { Scalar, isCollection, isScalar } from 'yaml';

import { createLintIssue } from '../../domain/diagnostics/create-lint-issue';
import { NodeLocation } from '../../domain/models/compose-document';
import { type Rule, RuleCategory, type RuleMeta, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YamlComposeDocument } from '../../infrastructure/yaml/yaml-compose-document';

interface RequireQuotesInPortsRuleOptions {
  quoteType: 'single' | 'double';
}

interface RequireQuotesInPortsIssueContext {
  serviceName: string;
  section: string;
  port: string;
  hasQuotes: boolean;
}

class RequireQuotesInPortsRule implements Rule<RequireQuotesInPortsIssueContext, RequireQuotesInPortsRuleOptions> {
  static readonly ID = 'require-quotes-in-ports';
  static readonly TYPE = RuleType.WARNING;

  readonly id = RequireQuotesInPortsRule.ID;

  readonly type: RuleType = RequireQuotesInPortsRule.TYPE;

  readonly category: RuleCategory = RuleCategory.BEST_PRACTICE;

  readonly severity: RuleSeverity = RuleSeverity.MINOR;

  readonly fixable: boolean = true;

  readonly meta: RuleMeta = {
    description:
      'In service `ports` and `expose` sections port values SHOULD be quoted to avoid conflicts with YAML base-60 float notation.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/require-quotes-in-ports-rule.md',
  };

  readonly options: RequireQuotesInPortsRuleOptions;

  static readonly DEFAULT_OPTIONS: RequireQuotesInPortsRuleOptions = {
    quoteType: 'single',
  };

  constructor(options: Partial<RequireQuotesInPortsRuleOptions> = {}) {
    this.options = { ...RequireQuotesInPortsRule.DEFAULT_OPTIONS, ...options };
  }

  check(document: YamlComposeDocument): LintIssue<RequireQuotesInPortsIssueContext>[] {
    const issues: LintIssue<RequireQuotesInPortsIssueContext>[] = [];
    this.handleViolation(document, (node, location, serviceName, section, hasQuotes) => {
      issues.push(createLintIssue(this, location, { serviceName, section, port: String(node.value), hasQuotes }));
    });
    return issues;
  }

  fix(document: YamlComposeDocument): YamlComposeDocument {
    this.handleViolation(document, (node, location, serviceName, section) => {
      const newPort = new Scalar(String(node.value));
      newPort.type = this.getQuoteType();
      Object.assign(node, newPort);
    });
    return document;
  }

  // eslint-disable-next-line class-methods-use-this
  getMessage(context: RequireQuotesInPortsIssueContext): string {
    if (context.hasQuotes) {
      return `Unexpected quotes type around port "${context.port}" in section "${context.section}" in service "${context.serviceName}".`;
    }

    return `Expected quotes around port "${context.port}" in section "${context.section}" in service "${context.serviceName}".`;
  }

  private handleViolation(
    document: YamlComposeDocument,
    callback: (node: Scalar, location: NodeLocation, serviceName: string, section: string, hasQuotes: boolean) => void,
  ) {
    const sections = ['ports', 'expose'];
    for (const service of document.getServices()) {
      for (const section of sections) {
        const nodes = service.get(section);
        if (!nodes || !isCollection(nodes)) continue;
        for (const [index, node] of nodes.items.entries()) {
          // For short syntax ports
          if (isScalar(node) && node.type !== this.getQuoteType()) {
            const location = document.getNodeLocation(['services', service.name, section, index]);
            const hasQuotes = node.type !== 'PLAIN';
            callback(node, location, service.name, section, hasQuotes);
          }
        }
      }
    }
  }

  private getQuoteType(): Scalar.Type {
    return this.options.quoteType === 'single' ? 'QUOTE_SINGLE' : 'QUOTE_DOUBLE';
  }
}

export { RequireQuotesInPortsRule, type RequireQuotesInPortsRuleOptions, type RequireQuotesInPortsIssueContext };
