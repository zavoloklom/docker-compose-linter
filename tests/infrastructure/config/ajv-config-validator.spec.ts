import test from 'ava';

import { DEFAULT_CONFIG } from '../../../src/application/config/defaults';
import { AjvConfigValidator } from '../../../src/infrastructure/config/ajv-config-validator';

import type { Config } from '../../../src/application/dto/config';

test('validate(): returns empty array and isValid() returns true for valid config', (t) => {
  const validator = new AjvConfigValidator();

  const validConfig: Config = DEFAULT_CONFIG;

  t.true(validator.isValid(validConfig));
  t.deepEqual(validator.validate(validConfig), []);
});

test('validate(): returns required error and isValid() returns false for invalid type', (t) => {
  const validator = new AjvConfigValidator();

  const invalidConfig = {
    debug: 'false',
  } as unknown as Config;

  t.false(validator.isValid(invalidConfig));

  const errors = validator.validate(invalidConfig);

  t.true(errors.length > 0);
  t.is(errors[0].code, 'type');
  t.is(errors[0].property, 'debug');
  t.regex(errors[0].message, /debug has invalid type; expected boolean/u);

  t.false(validator.isValid(invalidConfig));
});

test('validate(): returns additionalProperties error and isValid() returns false for extra field', (t) => {
  const validator = new AjvConfigValidator();

  const configWithExtra = {
    ...DEFAULT_CONFIG,
    extraField: 'unexpected',
  } as Config;

  const errors = validator.validate(configWithExtra);

  t.true(errors.some((error) => error.code === 'additionalProperties'));
  const validationError = errors.find((error) => error.code === 'additionalProperties');
  t.is(validationError?.property, 'extraField');

  t.false(validator.isValid(configWithExtra));
});
