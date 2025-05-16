import { ErrorObject } from 'ajv';

class ConfigValidationError extends Error {
  public readonly errors: ErrorObject[];

  constructor(validationErrors?: ErrorObject[] | null) {
    super();

    this.name = 'ConfigValidationError';
    this.errors = validationErrors || [];

    const formatted = this.errors.map((error) => {
      const path = error.instancePath || '/';
      const message = error.message || 'unknown error';
      return `${path} ${message}`;
    });

    this.message = `Invalid configuration: ${formatted.join('\n  ')}`;
  }
}

export { ConfigValidationError };
