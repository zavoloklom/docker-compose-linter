import test from 'ava';

import { parseYAML, stringifyDocument } from '../../src/util/yaml-utils';

test('parse should return a YAML Document object', (t) => {
  const yaml = `
services:
  web:
    image: nginx
`;
  const document = parseYAML(yaml);

  t.truthy(document);
  t.is(typeof document.toString, 'function');
  // @ts-expect-error TS2571 Object is of type unknown
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  t.is(document.get('services').get('web')?.get('image'), 'nginx');
});

test('stringify should produce YAML string with configured options', (t) => {
  const yaml = `
services:
  web:
    image: nginx
    healthcheck:
      test: curl --fail --silent http://127.0.0.1:8080/health | grep -q '{"status":"UP"}' || exit 1
`;

  const document = parseYAML(yaml);
  const result = stringifyDocument(document);

  t.true(typeof result === 'string');
  t.true(result.includes('nginx'));

  t.true(
    result.includes('test: curl --fail --silent http://127.0.0.1:8080/health | grep -q \'{"status":"UP"}\' || exit 1'),
    'Should not wrap due to lineWidth = 0',
  );
});

test('stringify should preserve structure after parse -> stringify', (t) => {
  const yaml = `
services:
  web:
    image: nginx
    ports:
      - "80:80"
`;
  const document = parseYAML(yaml);
  const output = stringifyDocument(document);
  const reParsed = parseYAML(output);

  t.deepEqual(reParsed.toJSON(), document.toJSON(), 'Re-parsed YAML matches original document');
});
