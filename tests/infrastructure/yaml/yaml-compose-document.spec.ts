import test from 'ava';
import { YAMLMap } from 'yaml';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';

const FILE_PATH = '/docker-compose.yml';

test('getServices(): parses valid YAML and returns services', (t) => {
  const yamlContent = `
services:
  app:
    image: node:18
  db:
    image: postgres:15
  `;

  const document = new YamlComposeDocument(FILE_PATH, yamlContent);
  t.is(document.getSyntaxIssues().length, 0);

  const services = [...document.getServices()];

  t.is(services.length, 2);
  t.deepEqual(
    services.map((service) => service.name),
    ['app', 'db'],
  );
  t.true(services.every((service) => service.value instanceof YAMLMap));
});

test('getServices(): returns empty if services is not a map', (t) => {
  const yamlContent = `
services: "not-a-map"
  `;

  const adapter = new YamlComposeDocument(FILE_PATH, yamlContent);
  const services = [...adapter.getServices()];

  t.deepEqual(services, []);
});

test('getNodeLocation(): returns correct location by path', (t) => {
  const yamlContent = `
services:
  app:
    image: node:18
    build: 
      context: .
    volumes:
      - firstVolume
      - secondVolume  
  db:
    image: postgres:15
    ports:
      - 11052
      - 11051:11051
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
      - 11052
`;
  const adapter = new YamlComposeDocument(FILE_PATH, yamlContent);

  let testLocation;

  testLocation = adapter.getNodeLocation(['', 'services']);
  t.deepEqual(testLocation, { line: 2, column: 1, endLine: 2, endColumn: 9 });

  testLocation = adapter.getNodeLocation(['services']);
  t.deepEqual(testLocation, { line: 2, column: 1, endLine: 2, endColumn: 9 });

  testLocation = adapter.getNodeLocation(['services', 'db']);
  t.deepEqual(testLocation, { line: 10, column: 3, endLine: 10, endColumn: 5 });

  testLocation = adapter.getNodeLocation(['services', 'db', 'image']);
  t.deepEqual(testLocation, { line: 11, column: 5, endLine: 11, endColumn: 23 });

  testLocation = adapter.getNodeLocation(['services', 'app', 'volumes', 'secondVolume']);
  t.deepEqual(testLocation, { line: 9, column: 9, endLine: 9, endColumn: 21 });

  testLocation = adapter.getNodeLocation(['services', 'db', 'ports', 2, 'protocol']);
  t.deepEqual(testLocation, { line: 17, column: 9, endLine: 17, endColumn: 22 });

  testLocation = adapter.getNodeLocation(['services', 'db', 'ports', '11052']);
  t.deepEqual(testLocation, { line: 13, column: 9, endLine: 13, endColumn: 14 });

  testLocation = adapter.getNodeLocation([]);
  t.deepEqual(testLocation, { line: 1, column: 1 });

  testLocation = adapter.getNodeLocation(['unknown-key']);
  t.deepEqual(testLocation, { line: 1, column: 1 });

  testLocation = adapter.getNodeLocation(['services', 'unknown-service']);
  t.deepEqual(testLocation, { line: 1, column: 1 });

  testLocation = adapter.getNodeLocation(['services', 'db', 'ports', 'unknown-port']);
  t.deepEqual(testLocation, { line: 1, column: 1 });

  // Should be the same as testLocation = adapter.getNodeLocation(['services', 'db', 'ports', '11052']);
  testLocation = adapter.getNodeLocation(['services', 'db', 'ports', 0]);
  t.deepEqual(testLocation, { line: 13, column: 9, endLine: 13, endColumn: 14 });

  testLocation = adapter.getNodeLocation(['services', 'db', 'ports', 2]);
  t.deepEqual(testLocation, { line: 15, column: 9, endLine: 19, endColumn: 1 });
});

test('getSyntaxIssues(): get errors for invalid YAML', (t) => {
  const invalidYaml = `}}---something`;

  const document = new YamlComposeDocument(FILE_PATH, invalidYaml);

  t.is(document.getSyntaxIssues().length, 2);

  for (const issue of document.getSyntaxIssues()) {
    // @ts-expect-error Property code does not exist on type object
    t.is(issue.context.code, 'UNEXPECTED_TOKEN');
  }
});

test('toString(): stringify should produce YAML string with configured options', (t) => {
  const yaml = `
services:
  web:
    image: nginx
    healthcheck:
      test: curl --fail --silent http://127.0.0.1:8080/health | grep -q '{"status":"UP"}' || exit 1
`;

  const document = new YamlComposeDocument(FILE_PATH, yaml);
  const result = document.toString();

  t.true(typeof result === 'string');
  t.true(result.includes('nginx'));

  t.true(
    result.includes('test: curl --fail --silent http://127.0.0.1:8080/health | grep -q \'{"status":"UP"}\' || exit 1'),
    'Should not wrap due to lineWidth = 0',
  );
});

test('toString(): stringify should preserve structure after parse -> stringify', (t) => {
  const yaml = `
services:
  web:
    # Comment
    image: nginx
    ports:
      - "80:80"
`;
  const document = new YamlComposeDocument(FILE_PATH, yaml);
  const output = document.toString();
  const reParsed = new YamlComposeDocument(FILE_PATH, output);

  t.deepEqual(reParsed.toJS(), document.toJS(), 'Re-parsed YAML matches original document');
});
