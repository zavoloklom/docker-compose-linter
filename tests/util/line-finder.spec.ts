import test from 'ava';
import { findLineNumberByKey, findLineNumberByValue } from '../../src/util/line-finder.js';

test('findLineNumberByKey: should return the correct line number when the key exists', (t) => {
    const yamlContent = `
version: '3'
services:
  web:
    image: nginx
  db:
    image: postgres
`;

    const line = findLineNumberByKey(yamlContent, 'image');
    t.is(line, 5, 'Should return the correct line number for the key "image"');
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

    const line = findLineNumberByKey(yamlContent, 'nonexistentKey');
    t.is(line, 1, 'Should return 1 when the key does not exist');
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

    const line = findLineNumberByKey(yamlContent, 'ports');
    t.is(line, 6, 'Should return the correct line number for the nested key "ports"');
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

    const line = findLineNumberByValue(yamlContent, 'nginx');
    t.is(line, 5, 'Should return the correct line number for the value "nginx"');
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

    const line = findLineNumberByValue(yamlContent, 'nonexistentValue');
    t.is(line, 1, 'Should return 1 when the value does not exist');
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

    const line = findLineNumberByValue(yamlContent, '80:80');
    t.is(line, 7, 'Should return the correct line number for the value "80:80"');
});
