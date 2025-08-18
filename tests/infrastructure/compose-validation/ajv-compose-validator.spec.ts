import test from 'ava';

import { AjvComposeValidator } from '../../../src/infrastructure/compose-validator/ajv-compose-validator';
import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';

const FILE_PATH = '/docker-compose.yml';

test('validate(): for invalid YAML returns syntax errors', (t) => {
  const invalidYamlContent = `}`;

  const document = new YamlComposeDocument(FILE_PATH, invalidYamlContent);
  t.is(document.getSyntaxIssues().length, 1);

  const issues = new AjvComposeValidator().validate(document);
  t.is(issues.length, 1);
  // @ts-expect-error TS2339: Property source does not exist on type object
  t.not(issues[0].context.source, 'ajv');
  t.true(issues[0].message.includes('UNEXPECTED_TOKEN'));
  t.false(new AjvComposeValidator().isValid(document));
});

test('validate(): for valid YAML returns schema errors', (t) => {
  const invalidSchemaContent = `
services:
  app:
    property: node:18 # must NOT have additional properties
  db:
    image: 3 # must be string
  `;

  const document = new YamlComposeDocument(FILE_PATH, invalidSchemaContent);
  t.is(document.getSyntaxIssues().length, 0);

  const issues = new AjvComposeValidator().validate(document);
  t.is(issues.length, 2);
  // @ts-expect-error TS2339: Property source does not exist on type object
  t.is(issues[0].context.source, 'ajv');
  t.true(issues[0].message.includes('must NOT have additional properties'));
  t.true(issues[1].message.includes('must be string'));
  t.false(new AjvComposeValidator().isValid(document));
});

test('validate(): returns no errors for valid Compose file', (t) => {
  const yamlContent = `
x-shared-links: &shared-links
  links:
    - "foo:foo.example.svc.cluster.local"
    - "bar:bar.example.svc.cluster.local"
services:
  app:
    image: node:18
    <<: *shared-links
  `;

  const document = new YamlComposeDocument(FILE_PATH, yamlContent);

  const issues = new AjvComposeValidator().validate(document);
  t.is(issues.length, 0);
  t.true(new AjvComposeValidator().isValid(document));
});
