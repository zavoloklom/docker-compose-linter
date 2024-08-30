import test from 'ava';
import { parseDocument } from 'yaml';
import NoDuplicateContainerNamesRule from '../../src/rules/no-duplicate-container-names-rule.js';
import type { LintContext } from '../../src/linter/linter.types.js';

// YAML с дублирующимися именами контейнеров
const yamlWithDuplicateContainerNames = `
services:
  web:
    image: nginx
    container_name: my_container
  db:
    image: postgres
    container_name: my_container
`;

// YAML с уникальными именами контейнеров
const yamlWithUniqueContainerNames = `
services:
  web:
    image: nginx
    container_name: web_container
  db:
    image: postgres
    container_name: db_container
`;

test('NoDuplicateContainerNamesRule: should return an error when duplicate container names are found', (t) => {
    const rule = new NoDuplicateContainerNamesRule();
    const context: LintContext = {
        path: '/docker-compose.yml',
        content: parseDocument(yamlWithDuplicateContainerNames).toJS() as Record<string, unknown>,
        sourceCode: yamlWithDuplicateContainerNames,
    };

    const errors = rule.check(context);
    t.is(errors.length, 1, 'There should be one error when duplicate container names are found.');

    const expectedMessage =
        'Service "db" has a duplicate container name "my_container" with service "web". Container names MUST BE unique.';
    t.true(errors[0].message.includes(expectedMessage));
});

test('NoDuplicateContainerNamesRule: should not return errors when container names are unique', (t) => {
    const rule = new NoDuplicateContainerNamesRule();
    const context: LintContext = {
        path: '/docker-compose.yml',
        content: parseDocument(yamlWithUniqueContainerNames).toJS() as Record<string, unknown>,
        sourceCode: yamlWithUniqueContainerNames,
    };

    const errors = rule.check(context);
    t.is(errors.length, 0, 'There should be no errors when container names are unique.');
});
