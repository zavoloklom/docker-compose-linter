import { Ajv2019 } from 'ajv/dist/2019.js';
import { ErrorObject } from 'ajv';
import { ComposeValidationError } from '../errors/compose-validation-error.js';
import { loadSchema } from './load-schema.js';

type Schema = Record<string, unknown>;

function updateSchema(schema: Schema): Schema {
    if (typeof schema !== 'object') return schema;

    if ('id' in schema) {
        // eslint-disable-next-line no-param-reassign
        delete schema.id;
    }

    Object.entries(schema).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            // eslint-disable-next-line no-param-reassign
            schema[key] = updateSchema(value as Schema);
        }
    });

    return schema;
}

function validationComposeSchema(content: object) {
    const ajv = new Ajv2019({
        allErrors: true,
        strict: false,
        strictSchema: false,
        allowUnionTypes: true,
        logger: false,
    });

    const composeSchema = loadSchema('compose');
    const validate = ajv.compile(updateSchema(composeSchema));
    const valid = validate(content);

    if (!valid && Array.isArray(validate.errors)) {
        validate.errors.forEach((error: ErrorObject) => {
            throw new ComposeValidationError(error);
        });
    }
}

export { validationComposeSchema };
