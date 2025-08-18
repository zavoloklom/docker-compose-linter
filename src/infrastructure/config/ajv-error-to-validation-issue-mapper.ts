import type { ConfigValidationIssue } from '../../application/dto/config-validation-issue';
import type { ErrorObject } from 'ajv';

const getPropertyFromError = (error: ErrorObject): string => {
  if (error.keyword === 'required' && 'missingProperty' in error.params) {
    return error.params.missingProperty as string;
  }
  if (error.keyword === 'additionalProperties' && 'additionalProperty' in error.params) {
    return error.params.additionalProperty as string;
  }
  if (error.keyword === 'dependentRequired' && 'missingProperty' in error.params) {
    return error.params.missingProperty as string;
  }
  const parts = error.instancePath.split('/').filter(Boolean);
  return parts.length > 0 ? (parts.at(-1) as string) : '';
};

const ajvErrorToValidationIssueMapper = (error: ErrorObject): ConfigValidationIssue => {
  const path = error.instancePath || '';
  let message;

  switch (error.keyword) {
    case 'required':
      message = `${path} is missing required property "${error.params.missingProperty}"`;
      break;
    case 'additionalProperties':
      message = `${path} has an unknown property "${error.params.additionalProperty}"`;
      break;
    case 'type':
      message = `${path} has invalid type; expected ${error.params.type}`;
      break;
    case 'enum':
      message = `${path} must be one of: ${(error.params.allowedValues as unknown[]).join(', ')}`;
      break;
    case 'const':
      message = `${path} must equal the specified constant value`;
      break;
    case 'minLength':
      message = `${path} is too short (minLength = ${error.params.limit})`;
      break;
    case 'maxLength':
      message = `${path} is too long (maxLength = ${error.params.limit})`;
      break;
    case 'pattern':
      message = `${path} does not match the required pattern`;
      break;
    case 'format':
      message = `${path} has invalid format (${error.params.format})`;
      break;
    case 'minimum':
      message = `${path} is less than the minimum (${error.params.limit})`;
      break;
    case 'maximum':
      message = `${path} is greater than the maximum (${error.params.limit})`;
      break;
    case 'exclusiveMinimum':
      message = `${path} must be > ${error.params.limit}`;
      break;
    case 'exclusiveMaximum':
      message = `${path} must be < ${error.params.limit}`;
      break;
    case 'multipleOf':
      message = `${path} must be a multiple of ${error.params.multipleOf ?? error.params.limit}`;
      break;
    case 'minItems':
      message = `${path} has too few items (minItems = ${error.params.limit})`;
      break;
    case 'maxItems':
      message = `${path} has too many items (maxItems = ${error.params.limit})`;
      break;
    case 'uniqueItems':
      message = `${path} must not contain duplicate items`;
      break;
    case 'minProperties':
      message = `${path} has too few properties (minProperties = ${error.params.limit})`;
      break;
    case 'maxProperties':
      message = `${path} has too many properties (maxProperties = ${error.params.limit})`;
      break;
    case 'dependentRequired':
      message = `${path} requires property "${error.params.missingProperty}" because of "${error.params.property}"`;
      break;
    case 'if':
    case 'then':
    case 'else':
      message = `${path} fails conditional schema (${error.keyword})`;
      break;
    case 'oneOf':
      message = `${path} must match exactly one of the provided schemas`;
      break;
    case 'anyOf':
      message = `${path} must match at least one of the provided schemas`;
      break;
    case 'allOf':
      message = `${path} must satisfy all of the provided schemas`;
      break;
    default:
      message = `${path} ${error.message ?? 'is invalid'}`;
      break;
  }

  return {
    code: error.keyword,
    property: getPropertyFromError(error),
    path,
    message,
  };
};

export { ajvErrorToValidationIssueMapper };
