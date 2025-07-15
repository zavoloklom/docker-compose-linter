import { Ajv, ErrorObject } from 'ajv';

import { schemaLoader } from './schema-loader';
import { ComposeValidationError } from '../errors/compose-validation-error';

type Schema = Record<string, unknown>;

function updateSchema(schema: Schema): Schema {
  if (typeof schema !== 'object') return schema;

  // Fix for id in compose.schema file
  if ('id' in schema) {
    // eslint-disable-next-line no-param-reassign
    delete schema.id;
  }

  Object.entries(schema).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // eslint-disable-next-line no-param-reassign
      schema[key] = updateSchema(value as Schema);
    }

    // Fix for $schema in compose.schema file
    if (key === '$schema' && value === 'https://json-schema.org/draft-07/schema') {
      // eslint-disable-next-line no-param-reassign
      schema[key] = 'http://json-schema.org/draft-07/schema#';
    }
  });

  return schema;
}

function validationComposeSchema(content: object) {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    strictSchema: false,
    allowUnionTypes: true,
    logger: false,
  });

  const composeSchema = schemaLoader('compose');
  const validate = ajv.compile(updateSchema(composeSchema));
  const valid = validate(content);

  if (!valid && Array.isArray(validate.errors)) {
    validate.errors.forEach((error: ErrorObject) => {
      throw new ComposeValidationError(error);
    });
  }
}

export { validationComposeSchema };
