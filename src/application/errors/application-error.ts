import { isErrnoException, isError } from '../../shared/errors-guards';

enum ApplicationErrorCode {
  'E_UNEXPECTED' = 'E_UNEXPECTED',
  'E_FILE_DISCOVER' = 'E_FILE_DISCOVER',
  'E_FILE_READ' = 'E_FILE_READ',
  'E_FILE_WRITE' = 'E_FILE_WRITE',
  'E_YAML_PARSE' = 'E_YAML_PARSE',
  'E_CONFIG_LOAD' = 'E_CONFIG_LOAD',
  'E_CONFIG_VALIDATION' = 'E_CONFIG_VALIDATION',
  'E_MODULE_RESOLVE' = 'E_MODULE_RESOLVE',
  'E_RULE_LOAD' = 'E_RULE_LOAD',
  'E_FORMATTER_LOAD' = 'E_FORMATTER_LOAD',
}

type ApplicationErrorDetails = Record<string, unknown>;

class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;
  readonly details?: ApplicationErrorDetails;

  constructor(message: string, code: ApplicationErrorCode, cause?: unknown, details: ApplicationErrorDetails = {}) {
    super(message, cause ? { cause } : {});
    this.name = 'ApplicationError';
    this.code = code;

    const base: ApplicationErrorDetails = {};
    if (isError(cause)) {
      base.msg = cause.message;
    }
    if (isErrnoException(cause)) {
      base.target = cause.path;
    }
    this.details = { ...base, ...details };
  }

  toJSON() {
    return { name: this.name, code: this.code, message: this.message, details: this.details };
  }
}

export { ApplicationError, ApplicationErrorCode };
