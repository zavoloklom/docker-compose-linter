import test from 'ava';
import NoQuotesInVolumesRule from '../../src/rules/no-quotes-in-volumes-rule.js';
import type { LintContext } from '../../src/linter/linter.types.js';

// Sample YAML for tests
const correctYAML = `
services:
  web:
    volumes:
      - data
`;

const incorrectYAML = `
services:
  web:
    volumes:
      - "data"
`;

test('NoQuotesInVolumesRule: should not return errors for YAML without quotes in volumes', (t) => {
    const rule = new NoQuotesInVolumesRule();
    const context: LintContext = {
        path: '/docker-compose.yml',
        content: {}, // You can mock content if necessary for your logic
        sourceCode: correctYAML,
    };

    const errors = rule.check(context);
    t.deepEqual(errors.length, 0, 'There should be no errors for correct YAML.');
});

test('NoQuotesInVolumesRule: should return errors for YAML with quotes in volumes', (t) => {
    const rule = new NoQuotesInVolumesRule();
    const context: LintContext = {
        path: '/docker-compose.yml',
        content: {}, // Mock content as needed
        sourceCode: incorrectYAML,
    };

    const errors = rule.check(context);
    t.is(errors.length, 1, 'There should be one error for YAML with quoted volume name.');
    t.is(errors[0].message, 'Quotes should not be used in volume names.');
    t.is(errors[0].rule, 'no-quotes-in-volumes');
    t.is(errors[0].severity, 'info');
});

test('NoQuotesInVolumesRule: should fix YAML with quotes in volumes', (t) => {
    const rule = new NoQuotesInVolumesRule();
    const fixedYAML = rule.fix(incorrectYAML);

    t.true(fixedYAML.includes('- data'), 'The quotes around volume name should be removed.');
    t.false(fixedYAML.includes('"data"'), 'The volume name should no longer have quotes.');
});

test('NoQuotesInVolumesRule: should not modify YAML without quotes in volumes', (t) => {
    const rule = new NoQuotesInVolumesRule();
    const fixedYAML = rule.fix(correctYAML);

    t.is(fixedYAML.trim(), correctYAML.trim(), 'YAML without quotes should remain unchanged.');
});
