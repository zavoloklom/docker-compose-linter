import { type Scalar, type YAMLMap, isScalar } from 'yaml';

import { normalizeServicePort } from '../../domain/compose/normalize-service-port';

import type { ServicePortDefinition } from '../../domain/models/compose-definitions/service-port';

const definitionToLongSyntax: Record<keyof ServicePortDefinition, string> = {
  hostIP: 'host_ip',
  host: 'published',
  container: 'target',
  protocol: 'protocol',
};

class YamlComposeServicePort {
  readonly node: YAMLMap | Scalar;
  readonly definition: ServicePortDefinition;
  readonly isShortSyntax: boolean;

  constructor(node: YAMLMap | Scalar) {
    this.node = node;

    if (isScalar(node)) {
      this.definition = normalizeServicePort(String(node.value));
      this.isShortSyntax = true;
    } else {
      this.definition = {
        hostIP: node.get('host_ip')?.toString() || null,
        host: node.get('published')?.toString() || null,
        container: node.get('target')?.toString() || null,
        protocol: node.get('protocol')?.toString() || null,
      };
      this.isShortSyntax = false;
    }
  }

  /**
   * Sets a normalized `definition` field and syncs the underlying YAML node.
   *
   * Behavior:
   * - Updates `this.definition[key]` to the provided `value`.
   * - If `node` is a Scalar (short syntax), re-renders the scalar string via `toShortSyntax()`.
   * - If `node` is a YAMLMap (long syntax), writes the value to the mapped long-syntax key.
   *
   * Notes:
   * - `value` may be `string | null`. Passing `null` will set a null value in the YAML map (if long syntax).
   *   If you prefer to *remove* the key when `null`, handle that explicitly before/after this call.
   *
   * @param key   One of the normalized `PortDefinition` keys: 'hostIP' | 'host' | 'container' | 'protocol'.
   * @param value New value to assign (string or null).
   */
  set(key: keyof ServicePortDefinition, value: string | null) {
    this.definition[key] = value;

    if (isScalar(this.node)) {
      this.node.value = this.toShortSyntax();
    } else {
      const longSyntaxKey = definitionToLongSyntax[key];
      this.node.set(longSyntaxKey, value);
    }
  }

  /**
   * Retrieves a normalized value from the `definition`.
   * The return type respects any prior narrowing of `this.definition` (e.g. after `has(key)`).
   *
   * @param key One of the normalized `ServicePortDefinition` keys: 'hostIP' | 'host' | 'container' | 'protocol'.
   * @returns The stored value (`string` if set, otherwise `null`).
   */
  get<K extends keyof ServicePortDefinition>(key: K): this['definition'][K] {
    return this.definition[key];
  }

  /**
   * User-defined type guard.
   *
   * Checks whether the given key in `definition` has a non-empty value.
   * If true, narrows the type of `definition[key]` from `string | null` to `string`.
   *
   * @param key One of the normalized `ServicePortDefinition` keys: 'hostIP' | 'host' | 'container' | 'protocol'.
   */
  has<K extends keyof ServicePortDefinition>(
    key: K,
  ): this is this & {
    definition: { [P in keyof ServicePortDefinition]: P extends K ? string : ServicePortDefinition[P] };
  } {
    return this.definition[key] !== null && this.definition[key] !== '';
  }

  toShortSyntax(): string {
    if (!this.definition) return '';
    const { hostIP, host, container, protocol } = this.definition;

    let result = [hostIP, host, container].filter(Boolean).join(':');
    if (protocol) result += `/${protocol}`;

    return result;
  }
}

export { YamlComposeServicePort };
