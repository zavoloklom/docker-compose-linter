import type { Rule, RuleCategory, RuleMeta, RuleSeverity, RuleType } from '../src/domain/models/rule';

interface RuleDefinition {
  name: string;
  type: RuleType;
  category: RuleCategory;
  severity: RuleSeverity;
  fixable: boolean;
  meta: RuleMeta;
  hasFixFunction: boolean;
  hasOptions: boolean;
}

const getRuleDefinition = (rule: Rule): RuleDefinition => {
  return {
    name: rule.id,
    type: rule.type,
    category: rule.category,
    severity: rule.severity,
    fixable: rule.fixable,
    meta: rule.meta,
    hasFixFunction: 'fix' in rule,
    hasOptions: 'options' in rule,
  };
};

export { getRuleDefinition, type RuleDefinition };
