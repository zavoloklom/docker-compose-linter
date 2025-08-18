import { Ajv, type ValidateFunction } from 'ajv';

import { ajvErrorToIssueMapper } from './ajv-error-to-issue-mapper';
import composeSchema from '../../../schemas/compose.schema.json' with { type: 'json' };

import type { ComposeValidator } from '../../application/ports/compose-validator';
import type { ComposeDocument } from '../../domain/models/compose-document';
import type { LintIssue } from '../../domain/models/lint-issue';

class AjvComposeValidator implements ComposeValidator {
  private readonly validateFn: ValidateFunction;

  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      strict: false,
      strictSchema: false,
      allowUnionTypes: true,
      logger: false,
    });
    this.validateFn = ajv.compile(this.fixSchema(composeSchema));
  }

  isValid(document: ComposeDocument): boolean {
    return document.getSyntaxIssues().length === 0 && this.validateFn(document.toJS());
  }

  validate(document: ComposeDocument): LintIssue[] {
    const syntaxIssues = document.getSyntaxIssues();
    if (syntaxIssues.length > 0) {
      return syntaxIssues;
    }

    const schemaIssues = this.getSchemaIssues(document);
    if (schemaIssues.length > 0) {
      return schemaIssues;
    }

    return [];
  }

  private getSchemaIssues(document: ComposeDocument): LintIssue[] {
    const issues: LintIssue[] = [];
    const isValid = this.validateFn(document.toJS());

    if (!isValid && Array.isArray(this.validateFn.errors)) {
      for (const error of this.validateFn.errors) {
        issues.push(ajvErrorToIssueMapper(document, error));
      }
    }

    return issues;
  }

  private fixSchema(schema: Record<string, unknown>): Record<string, unknown> {
    if (typeof schema !== 'object') return schema;

    // Fix for id in compose.schema file
    if ('id' in schema) {
      delete schema.id;
    }

    for (const [key, value] of Object.entries(schema)) {
      if (typeof value === 'object' && value !== null) {
        schema[key] = this.fixSchema(value as Record<string, unknown>);
      }

      // Fix for $schema in compose.schema file
      if (key === '$schema' && value === 'https://json-schema.org/draft-07/schema') {
        schema[key] = 'http://json-schema.org/draft-07/schema#';
      }
    }

    return schema;
  }
}

export { AjvComposeValidator };
