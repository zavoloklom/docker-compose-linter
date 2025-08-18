import { RuleCategory, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { LintIssue } from '../../domain/models/lint-issue';
import type { YAMLError } from 'yaml';

interface InvalidYamlIssueContext {
  source: string;
  code: string;
}

const yamlErrorToIssueMapper = (error: YAMLError): LintIssue<InvalidYamlIssueContext> => {
  const startPos: { line: number; col: number } | undefined = Array.isArray(error.linePos)
    ? error.linePos[0]
    : error.linePos;

  return {
    ruleId: 'invalid-yaml',
    type: RuleType.ERROR,
    category: RuleCategory.SYNTAX,
    severity: RuleSeverity.CRITICAL,
    message: `${error.code}. Invalid YAML format. ${error.message}`,
    meta: {
      description: 'An error encountered while parsing a source as YAML.',
      url: 'https://eemeli.org/yaml/#errors',
    },
    line: startPos?.line || 1,
    column: startPos?.col || 1,
    fixable: false,
    context: {
      source: 'yaml',
      code: error.code,
    },
  };
};

export { yamlErrorToIssueMapper };
