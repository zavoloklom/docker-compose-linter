import { Ajv } from 'ajv';

import { schemaLoader } from './schema-loader';
import { ComposeValidationError } from '../errors/compose-validation-error';

type Schema = Record<string, unknown>;

const updateSchema = (schema: Schema): Schema => {
  if (typeof schema !== 'object') return schema;

  // Fix for id in compose.schema file
  if ('id' in schema) {
    delete schema.id;
  }

  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === 'object' && value !== null) {
      schema[key] = updateSchema(value as Schema);
    }

    // Fix for $schema in compose.schema file
    if (key === '$schema' && value === 'https://json-schema.org/draft-07/schema') {
      schema[key] = 'http://json-schema.org/draft-07/schema#';
    }
  }

  return schema;
};

const validationComposeSchema = (content: object) => {
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
    // TODO: Get all errors
    throw new ComposeValidationError(validate.errors[0]);
  }
};

export { validationComposeSchema };
