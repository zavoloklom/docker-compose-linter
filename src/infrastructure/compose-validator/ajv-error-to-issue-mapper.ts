import { RuleCategory, RuleSeverity, RuleType } from '../../domain/models/rule';

import type { ComposeDocument } from '../../domain/models/compose-document';
import type { LintIssue } from '../../domain/models/lint-issue';
import type { ErrorObject } from 'ajv';

interface InvalidSchemaIssueContext {
  source: string;
  instancePath: string;
  params: object;
  keyword: string;
  schemaPath: string;
}

const ajvErrorToIssueMapper = (document: ComposeDocument, error: ErrorObject): LintIssue<InvalidSchemaIssueContext> => {
  const pathArray = error.instancePath.split('/');
  const location = document.getNodeLocation(pathArray);

  return {
    ruleId: 'invalid-schema',
    type: RuleType.ERROR,
    category: RuleCategory.SYNTAX,
    severity: RuleSeverity.CRITICAL,
    message: `YAML content violates specified JSON schema: instancePath="${error.instancePath}", schemaPath="${error.schemaPath}", message="${error.message}".`,
    meta: {
      description: 'An error encountered while validating against Compose Schema.',
      url: 'https://github.com/compose-spec/compose-spec/blob/main/schema/compose-spec.json',
    },
    line: location?.line || 1,
    column: location?.column || 1,
    endLine: location?.endLine || 1,
    endColumn: location?.endColumn || 1,
    fixable: false,
    context: {
      source: 'ajv',
      instancePath: error.instancePath,
      params: error.params,
      keyword: error.keyword,
      schemaPath: error.schemaPath,
    },
  };
};

export { ajvErrorToIssueMapper };
