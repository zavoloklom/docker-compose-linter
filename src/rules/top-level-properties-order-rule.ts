import { YAMLMap, isScalar, isMap } from 'yaml';
import { parseYAML, stringifyDocument } from '../util/yaml-utils';
import { findLineNumberByKey } from '../util/line-finder';
import type { LintContext } from '../linter/linter.types';
import type { Rule, RuleCategory, RuleSeverity, RuleType, RuleMeta, RuleMessage } from './rules.types';

export interface TopLevelPropertiesOrderRuleInputOptions {
  customOrder?: TopLevelKeys[];
}

interface TopLevelPropertiesOrderRuleOptions {
  customOrder: TopLevelKeys[];
}

export enum TopLevelKeys {
  XProperties = 'x-properties',
  Version = 'version',
  Name = 'name',
  Include = 'include',
  Services = 'services',
  Networks = 'networks',
  Volumes = 'volumes',
  Secrets = 'secrets',
  Configs = 'configs',
}

export default class TopLevelPropertiesOrderRule implements Rule {
  static readonly name = 'top-level-properties-order';

  // eslint-disable-next-line class-methods-use-this
  get name() {
    return TopLevelPropertiesOrderRule.name;
  }

  public type: RuleType = 'warning';

  public category: RuleCategory = 'style';

  public severity: RuleSeverity = 'major';

  public meta: RuleMeta = {
    description: 'Top-level properties should follow a specific order.',
    url: 'https://github.com/zavoloklom/docker-compose-linter/blob/main/docs/rules/top-level-properties-order-rule.md',
  };

  public fixable: boolean = true;

  public options: TopLevelPropertiesOrderRuleOptions;

  constructor(options?: TopLevelPropertiesOrderRuleInputOptions) {
    const defaultOptions: TopLevelPropertiesOrderRuleOptions = {
      customOrder: [
        TopLevelKeys.XProperties,
        TopLevelKeys.Version,
        TopLevelKeys.Name,
        TopLevelKeys.Include,
        TopLevelKeys.Services,
        TopLevelKeys.Networks,
        TopLevelKeys.Volumes,
        TopLevelKeys.Secrets,
        TopLevelKeys.Configs,
      ],
    };
    this.options = { ...defaultOptions, ...options };
  }

  // eslint-disable-next-line class-methods-use-this
  public getMessage({ key, correctOrder }: { key: string; correctOrder: string[] }): string {
    return `Property "${key}" is out of order. Expected order is: ${correctOrder.join(', ')}.`;
  }

  public check(context: LintContext): RuleMessage[] {
    const errors: RuleMessage[] = [];
    const topLevelKeys = Object.keys(context.content);

    // Get and sort all 'x-' prefixed properties alphabetically
    const sortedXProperties = topLevelKeys.filter((key) => key.startsWith('x-')).sort();

    // Replace 'TopLevelKeys.XProperties' in the order with the actual sorted x-prefixed properties
    const correctOrder = this.options.customOrder.flatMap((key) =>
      key === TopLevelKeys.XProperties ? sortedXProperties : [key],
    );

    let lastSeenIndex = -1;

    topLevelKeys.forEach((key) => {
      const expectedIndex = correctOrder.indexOf(key);

      if (expectedIndex === -1 || expectedIndex < lastSeenIndex) {
        const line = findLineNumberByKey(context.sourceCode, key);
        errors.push({
          rule: this.name,
          type: this.type,
          category: this.category,
          severity: this.severity,
          message: this.getMessage({ key, correctOrder }),
          line,
          column: 1,
          meta: this.meta,
          fixable: this.fixable,
          data: {
            key,
            correctOrder,
          },
        });
      } else {
        lastSeenIndex = expectedIndex;
      }
    });

    return errors;
  }

  public fix(content: string): string {
    const parsedDocument = parseYAML(content);
    const { contents } = parsedDocument;

    if (!isMap(contents)) return content;

    const topLevelKeys = contents.items
      .map((item) => (isScalar(item.key) ? String(item.key.value) : ''))
      .filter(Boolean);

    const sortedXProperties = topLevelKeys.filter((key) => key.startsWith('x-')).sort();

    const correctOrder = this.options.customOrder.flatMap((key) =>
      key === TopLevelKeys.XProperties ? sortedXProperties : [key],
    );

    const reorderedMap = new YAMLMap<unknown, unknown>();

    correctOrder.forEach((key) => {
      const item = contents.items.find((node) => isScalar(node.key) && String(node.key.value) === key);
      if (item) {
        reorderedMap.items.push(item);
      }
    });

    parsedDocument.contents = reorderedMap as unknown as typeof parsedDocument.contents;

    return stringifyDocument(parsedDocument);
  }
}
