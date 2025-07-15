import type { Rule, RuleDefinition } from '../src/rules/rules.types';

const getRuleDefinition = (rule: Rule): RuleDefinition => {
  return {
    name: rule.name,
    type: rule.type,
    category: rule.category,
    severity: rule.severity,
    fixable: rule.fixable,
    meta: rule.meta,
    hasFixFunction: 'fix' in rule,
    hasOptions: 'options' in rule,
  };
};

export { getRuleDefinition };
