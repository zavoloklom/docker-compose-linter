import test from 'ava';

import { findLineNumberByKey, findLineNumberByValue } from '../../src/util/line-finder';

test('findLineNumberByKey: should return the correct line number when the key exists', (t) => {
  const yamlContent = `
version: '3'
services:
  web:
    image: nginx
  db:
    image: postgres
`;

  const EXPECTED_LINE = 5;
  const line = findLineNumberByKey(yamlContent, 'image');

  t.is(line, EXPECTED_LINE, 'Should return the correct line number for the key "image"');
});

test('findLineNumberByKey: should return 1 when the key does not exist', (t) => {
  const yamlContent = `
version: '3'
services:
  web:
    image: nginx
  db:
    image: postgres
`;

  const EXPECTED_LINE = 1;
  const line = findLineNumberByKey(yamlContent, 'nonexistentKey');

  t.is(line, EXPECTED_LINE, `Should return ${EXPECTED_LINE} when the key does not exist`);
});

test('findLineNumberByKey: should work for nested keys', (t) => {
  const yamlContent = `
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
  db:
    image: postgres
`;

  const EXPECTED_LINE = 6;
  const line = findLineNumberByKey(yamlContent, 'ports');

  t.is(line, EXPECTED_LINE, 'Should return the correct line number for the nested key "ports"');
});

test('findLineNumberByValue: should return the correct line number when the value exists', (t) => {
  const yamlContent = `
version: '3'
services:
  web:
    image: nginx
  db:
    image: postgres
`;

  const EXPECTED_LINE = 5;
  const line = findLineNumberByValue(yamlContent, 'nginx');

  t.is(line, EXPECTED_LINE, 'Should return the correct line number for the value "nginx"');
});

test('findLineNumberByValue: should return 0 when the value does not exist', (t) => {
  const yamlContent = `
version: '3'
services:
  web:
    image: nginx
  db:
    image: postgres
`;

  const EXPECTED_LINE = 1;
  const line = findLineNumberByValue(yamlContent, 'nonexistentValue');

  t.is(line, EXPECTED_LINE, `Should return ${EXPECTED_LINE} when the value does not exist`);
});

test('findLineNumberByValue: should return the correct line number for a value inside an array', (t) => {
  const yamlContent = `
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
`;

  const EXPECTED_LINE = 7;
  const line = findLineNumberByValue(yamlContent, '80:80');

  t.is(line, EXPECTED_LINE, 'Should return the correct line number for the value "80:80"');
});
