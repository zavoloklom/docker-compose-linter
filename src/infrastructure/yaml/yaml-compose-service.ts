import { Pair, ParsedNode, Scalar, YAMLMap, isMap, isScalar, isSeq } from 'yaml';

import { YamlComposeServiceImage } from './yaml-compose-service-image';
import { YamlComposeServicePort } from './yaml-compose-service-port';

class YamlComposeService {
  readonly name: string;
  readonly value: YAMLMap;
  private node: Pair<Scalar, YAMLMap>;

  constructor(node: Pair<Scalar, YAMLMap>) {
    this.node = node;
    this.name = String(node.key.value);
    this.value = node.value as YAMLMap;
  }

  has(key: string): boolean {
    return this.value.has(key);
  }

  get(key: string): ParsedNode | null {
    return this.value.has(key) ? (this.value.get(key, true) as ParsedNode) : null;
  }

  getImage(): YamlComposeServiceImage | null {
    return this.value.has('image') ? new YamlComposeServiceImage(this.value.get('image', true)) : null;
  }

  getPorts(): YamlComposeServicePort[] {
    const ports = this.get('ports');
    if (!isSeq(ports)) return [];

    return ports.items.filter((item) => isScalar(item) || isMap(item)).map((item) => new YamlComposeServicePort(item));
  }
}

export { YamlComposeService };
