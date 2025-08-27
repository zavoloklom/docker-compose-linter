import test from 'ava';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import {
  type OrderTopLevelPropertiesIssueContext,
  OrderTopLevelPropertiesRule,
  type OrderTopLevelPropertiesRuleOptions,
  TopLevelKeys,
} from '../../../src/plugins/rules/order-top-level-properties-rule';
import { type ExpectedIssue, runRuleTest } from '../../test-utils';

const correctYaml = `
x-aa: bar
x-zz: foo
version: "3.9"
name: sample
include:
  - compose.partial.yml
services:
  web:
    image: nginx
networks:
  default: {}
volumes:
  data: {}
secrets:
  token: {}
configs:
  cfg: {}
`;

const invalidYaml = `
x-zz: foo
x-aa: bar
version: "3.9"
name: sample
services:    
  web:
    image: nginx
include:
  - compose.partial.yml
networks:
  default: {}
configs:
  cfg: {}
volumes:
  data: {}
secrets:
  token: {}
`;

const correctYamlAlphabetical = `
configs:
  cfg: {}
include:
  - compose.partial.yml
name: sample
networks:
  default: {}
secrets:
  token: {}
services:
  web:
    image: nginx
version: "3.9"
volumes:
  data: {}
x-aa: bar
x-zz: foo
`;

const filePath = '/docker-compose.yml';

test('getMessage(): should provide exact message via getMessage(context)', (t) => {
  const rule = new OrderTopLevelPropertiesRule();
  const contextObject: OrderTopLevelPropertiesIssueContext = {
    propertyName: 'services',
    misplacedAfter: 'include',
  };

  const expectedMessage = rule.getMessage(contextObject);
  t.is(
    expectedMessage,
    `Unexpected order of top-level property "${contextObject.propertyName}" after "${contextObject.misplacedAfter}".`,
  );
});

test('check(): should not return errors for a compliant compose file (default order with x-* expanded alphabetically)', (t) => {
  const rule = new OrderTopLevelPropertiesRule();
  const context = new YamlComposeDocument(filePath, correctYaml);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return one error when a property is out of default order and x-* keys are not alphabetical', (t) => {
  const rule = new OrderTopLevelPropertiesRule();
  const context = new YamlComposeDocument(filePath, invalidYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ propertyName: 'x-aa', misplacedAfter: 'x-zz' }),
      line: 3,
    },
    {
      message: rule.getMessage({ propertyName: 'include', misplacedAfter: 'services' }),
      line: 9,
    },
    {
      message: rule.getMessage({ propertyName: 'volumes', misplacedAfter: 'configs' }),
      line: 15,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('fix(): should reorder top-level properties according to default groups (including sorting x-* alphabetically)', (t) => {
  const rule = new OrderTopLevelPropertiesRule();
  const context = new YamlComposeDocument(filePath, invalidYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  // After fix, "include" must appear before "services"
  const includeIndex = fixedYaml.indexOf('include:');
  const servicesIndex = fixedYaml.indexOf('services:');

  t.true(includeIndex !== -1 && servicesIndex !== -1, 'Both "include" and "services" should be present after fix.');
  t.true(includeIndex < servicesIndex, '"include" should precede "services" after fix.');

  t.is(fixedYaml.trim(), correctYaml.trim());
});

test('fix(): should not modify correct YAML', (t) => {
  const rule = new OrderTopLevelPropertiesRule();
  const context = new YamlComposeDocument(filePath, correctYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  t.is(fixedYaml.trim(), correctYaml.trim());
});

// Alphabetical mode: order: 'alphabetical'
test('check(): should detect non-alphabetical order when option { order: "alphabetical" } is used', (t) => {
  const options: Partial<OrderTopLevelPropertiesRuleOptions> = { order: 'alphabetical' };
  const rule = new OrderTopLevelPropertiesRule(options);
  const context = new YamlComposeDocument(filePath, correctYaml);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ propertyName: 'version', misplacedAfter: 'x-zz' }),
      line: 4,
    },
    {
      message: rule.getMessage({ propertyName: 'name', misplacedAfter: 'version' }),
      line: 5,
    },
    {
      message: rule.getMessage({ propertyName: 'include', misplacedAfter: 'name' }),
      line: 6,
    },
    {
      message: rule.getMessage({ propertyName: 'networks', misplacedAfter: 'services' }),
      line: 11,
    },
    {
      message: rule.getMessage({ propertyName: 'secrets', misplacedAfter: 'volumes' }),
      line: 15,
    },
    {
      message: rule.getMessage({ propertyName: 'configs', misplacedAfter: 'secrets' }),
      line: 17,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('fix(): should alphabetize top-level properties when option { order: "alphabetical" } is used', (t) => {
  const options: Partial<OrderTopLevelPropertiesRuleOptions> = { order: 'alphabetical' };
  const rule = new OrderTopLevelPropertiesRule(options);
  const context = new YamlComposeDocument(filePath, correctYaml);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  // Alphabetical order: include, name, services, version (for the keys present in invalidYamlAlphabetical)
  const includeIndex = fixedYaml.indexOf('include:');
  const nameIndex = fixedYaml.indexOf('name:');
  const servicesIndex = fixedYaml.indexOf('services:');
  const versionIndex = fixedYaml.indexOf('version:');

  t.true(
    includeIndex !== -1 && nameIndex !== -1 && servicesIndex !== -1 && versionIndex !== -1,
    'All keys should exist.',
  );
  t.true(
    includeIndex < nameIndex && nameIndex < servicesIndex && servicesIndex < versionIndex,
    'Keys should be in alphabetical order.',
  );

  t.is(fixedYaml.trim(), correctYamlAlphabetical.trim());
});

// --- Custom order tests (override options.order) ---
const customOptions: Partial<OrderTopLevelPropertiesRuleOptions> = {
  order: [
    TopLevelKeys.NAME,
    TopLevelKeys.VERSION,
    TopLevelKeys.INCLUDE,
    TopLevelKeys.SERVICES,
    TopLevelKeys.NETWORKS,
    TopLevelKeys.VOLUMES,
    TopLevelKeys.SECRETS,
    TopLevelKeys.CONFIGS,
    TopLevelKeys.X_PROPERTIES,
  ],
};

const customOrderYamlValid = `
name: sample
version: "3.9"
include:
  - compose.partial.yml
services:
  web:
    image: nginx
networks:
  default: {}
volumes:
  data: {}
secrets:
  token: {}
configs:
  cfg: {}
x-aa: bar
x-zz: foo
`;

const customOrderYamlInvalid = `
name: sample
version: "3.9"
include:
  - compose.partial.yml
services:
  web:
    image: nginx
x-aa: bar
configs:
  cfg: {}
x-zz: foo
`;

test('check(): should not return errors when custom order is respected', (t) => {
  const rule = new OrderTopLevelPropertiesRule(customOptions);
  const context = new YamlComposeDocument(filePath, customOrderYamlValid);

  const expected: ExpectedIssue[] = [];
  runRuleTest(t, rule, context, expected);
});

test('check(): should return errors according to custom order', (t) => {
  const rule = new OrderTopLevelPropertiesRule(customOptions);
  const context = new YamlComposeDocument(filePath, customOrderYamlInvalid);

  const expected: ExpectedIssue[] = [
    {
      message: rule.getMessage({ propertyName: 'configs', misplacedAfter: 'x-aa' }),
      line: 10,
    },
  ];
  runRuleTest(t, rule, context, expected);
});

test('fix(): should reorder according to custom order (X-properties moved to the end)', (t) => {
  const rule = new OrderTopLevelPropertiesRule(customOptions);
  const context = new YamlComposeDocument(filePath, customOrderYamlInvalid);
  const fixedDocument = rule.fix(context);
  const fixedYaml = fixedDocument.toString();

  const nameIndex = fixedYaml.indexOf('name:');
  const versionIndex = fixedYaml.indexOf('version:');
  const includeIndex = fixedYaml.indexOf('include:');
  const servicesIndex = fixedYaml.indexOf('services:');
  const configsIndex = fixedYaml.indexOf('configs:');
  const xAaIndex = fixedYaml.indexOf('x-aa:');
  const xZzIndex = fixedYaml.indexOf('x-zz:');

  t.true(
    nameIndex !== -1 &&
      versionIndex !== -1 &&
      includeIndex !== -1 &&
      servicesIndex !== -1 &&
      configsIndex !== -1 &&
      xAaIndex !== -1 &&
      xZzIndex !== -1,
    'All keys should exist after fix.',
  );

  t.true(
    nameIndex < versionIndex &&
      versionIndex < includeIndex &&
      includeIndex < servicesIndex &&
      servicesIndex < configsIndex &&
      configsIndex < xAaIndex &&
      xAaIndex < xZzIndex,
    'Keys should follow the custom order after fix.',
  );
});
