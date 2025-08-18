import test from 'ava';

import { ajvErrorToValidationIssueMapper } from '../../../src/infrastructure/config/ajv-error-to-validation-issue-mapper';

import type { ErrorObject } from 'ajv';

test('maps required error correctly', (t) => {
  const error: ErrorObject = {
    instancePath: '/user',
    schemaPath: '#/required',
    keyword: 'required',
    params: { missingProperty: 'name' },
    message: 'must have required property',
  };
  const result = ajvErrorToValidationIssueMapper(error);

  t.is(result.code, 'required');
  t.is(result.property, 'name');
  t.is(result.path, '/user');
  t.is(result.message, '/user is missing required property "name"');
});

test('maps additionalProperties error correctly', (t) => {
  const error: ErrorObject = {
    instancePath: '/config',
    schemaPath: '#/additionalProperties',
    keyword: 'additionalProperties',
    params: { additionalProperty: 'debug' },
    message: 'must NOT have additional properties',
  };
  const result = ajvErrorToValidationIssueMapper(error);

  t.is(result.code, 'additionalProperties');
  t.is(result.property, 'debug');
  t.is(result.path, '/config');
  t.is(result.message, '/config has an unknown property "debug"');
});

test('maps enum error correctly', (t) => {
  const error: ErrorObject = {
    instancePath: '/mode',
    schemaPath: '#/enum',
    keyword: 'enum',
    params: { allowedValues: ['dev', 'prod'] },
    message: 'must be equal to one of the allowed values',
  };
  const result = ajvErrorToValidationIssueMapper(error);

  t.is(result.code, 'enum');
  t.is(result.property, 'mode');
  t.is(result.path, '/mode');
  t.is(result.message, '/mode must be one of: dev, prod');
});

test('maps type error correctly', (t) => {
  const error: ErrorObject = {
    instancePath: '/age',
    schemaPath: '#/type',
    keyword: 'type',
    params: { type: 'number' },
    message: 'must be number',
  };
  const result = ajvErrorToValidationIssueMapper(error);

  t.is(result.code, 'type');
  t.is(result.property, 'age');
  t.is(result.path, '/age');
  t.is(result.message, '/age has invalid type; expected number');
});

test('handles unknown keyword gracefully', (t) => {
  const error: ErrorObject = {
    instancePath: '/something',
    schemaPath: '#/unknown',
    keyword: 'foobar',
    params: {},
    message: 'is invalid',
  };
  const result = ajvErrorToValidationIssueMapper(error);

  t.is(result.code, 'foobar');
  t.is(result.property, 'something');
  t.is(result.path, '/something');
  t.is(result.message, '/something is invalid');
});
