/* eslint-disable no-magic-numbers */
import test from 'ava';
import { Pair, Scalar, YAMLMap } from 'yaml';

import { YamlComposeDocument } from '../../../src/infrastructure/yaml/yaml-compose-document';
import { YamlComposeService } from '../../../src/infrastructure/yaml/yaml-compose-service';

const FILE_PATH = '/docker-compose.yml';

test('YamlComposeService implements all methods correctly', (t) => {
  const yamlContent = `
services:
  app:
    container_name: test-one
    image: node:18
    ports: 
      - 8081
      - 8000
      - target: 1000
        published: 8081
        protocol: tcp
        mode: host
  db:
    image: postgres:15
  `;

  const document = new YamlComposeDocument(FILE_PATH, yamlContent);
  // @ts-expect-error Unsafe argument of type error typed assigned
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const serviceItem = document.parsedDocument.get('services').items[0] as Pair<Scalar, YAMLMap>;
  const service = new YamlComposeService(serviceItem);

  t.is(service.get('container_name')?.toString(), 'test-one');
  t.true(service.has('image'));
  t.is(service.getPorts().length, 3);
  t.deepEqual(service.getPorts()[1].definition, { protocol: null, host: null, container: '8000', hostIP: null });
  t.deepEqual(service.value, serviceItem.value);
});
