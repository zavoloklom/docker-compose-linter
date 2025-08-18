import { type Scalar, isScalar } from 'yaml';

import { normalizeServiceImage } from '../../domain/compose/normalize-service-image';

import type { ServiceImageDefinition } from '../../domain/models/compose-definitions/service-image';

class YamlComposeServiceImage {
  readonly node: Scalar;
  readonly definition: ServiceImageDefinition;

  constructor(node: unknown) {
    if (!isScalar(node)) {
      throw new Error('Image must be a scalar YAML node');
    }
    this.node = node;
    this.definition = normalizeServiceImage(String(node.value));
  }

  set(key: keyof ServiceImageDefinition, value: string & string[]) {
    this.definition[key] = value;
    this.node.value = this.toString();
  }

  get<K extends keyof ServiceImageDefinition>(key: K): this['definition'][K] {
    return this.definition[key];
  }

  has<K extends keyof ServiceImageDefinition>(
    key: K,
  ): this is this & {
    definition: { [P in keyof ServiceImageDefinition]: P extends K ? string : ServiceImageDefinition[P] };
  } {
    return Boolean(this.definition[key]);
  }

  // [registry/][path.../]image — without :tag и @digest
  getFullName(): string {
    const { registry, path, image } = this.definition;

    const segments: string[] = [];
    if (registry) segments.push(registry);
    if (path.length > 0) segments.push(...path);
    segments.push(image);

    return segments.join('/');
  }

  // [:tag][@digest]
  getTagDigest(): string | null {
    const { tag, digest } = this.definition;
    if (!tag && !digest) return null;

    let out = '';
    if (tag) out += `${tag}`;
    if (digest) out += `@${digest}`;
    return out;
  }

  toString(): string {
    const delimiter = this.definition.tag ? ':' : '';
    return `${this.getFullName()}${delimiter}${this.getTagDigest()}`;
  }
}

export { YamlComposeServiceImage };
