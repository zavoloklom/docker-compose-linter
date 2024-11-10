import type { ErrorObject } from 'ajv';

class ComposeValidationError extends Error {
  keyword: string;

  instancePath: string;

  schemaPath: string;

  details: ErrorObject;

  constructor(error: ErrorObject) {
    super(`Validation error: ${error?.message}`);
    this.name = 'ComposeValidationError';
    this.keyword = error.keyword;
    this.instancePath = error.instancePath;
    this.schemaPath = error.schemaPath;
    this.details = error;
  }

  toString(): string {
    return `ComposeValidationError: instancePath="${this.instancePath}", schemaPath="${this.schemaPath}", message="${this.message}".`;
  }
}

export { ComposeValidationError };
