import { ErrorObject } from 'ajv';

class ConfigValidationError extends Error {
  constructor(validationErrors?: ErrorObject[] | null | undefined) {
    super();
    this.message = `Invalid configuration: ${
      validationErrors?.map((error) => error.message).join(', ') || 'No details'
    }`;
    this.name = 'ConfigValidationError';
  }
}

export { ConfigValidationError };
