import {
  Document,
  ErrorCode,
  LineCounter,
  Pair,
  Scalar,
  ToStringOptions,
  YAMLError,
  YAMLMap,
  isCollection,
  isMap,
  isPair,
  isScalar,
  parseDocument,
} from 'yaml';

import { YamlComposeService } from './yaml-compose-service';
import { yamlErrorToIssueMapper } from './yaml-error-to-issue-mapper';
import { buildSuppressionIndex } from '../../domain/supressions/build-suppression-index';

import type { ComposeDocument, NodeLocation } from '../../domain/models/compose-document';
import type { LintIssue } from '../../domain/models/lint-issue';
import type { SuppressionIndex } from '../../domain/supressions/supression-index';

class YamlComposeDocument implements ComposeDocument {
  readonly filePath: string;
  readonly suppressions: SuppressionIndex;
  readonly parsedDocument: Document.Parsed;
  private readonly lineCounter: LineCounter;

  constructor(filePath: string, yamlContent: string) {
    this.filePath = filePath;
    this.lineCounter = new LineCounter();
    this.parsedDocument = this.parseYaml(yamlContent);
    this.suppressions = buildSuppressionIndex(yamlContent);
  }

  private parseYaml(yamlContent: string) {
    try {
      return parseDocument(yamlContent, {
        keepSourceTokens: true,
        lineCounter: this.lineCounter,
        prettyErrors: true,
        merge: true,
      });
    } catch (error) {
      const parsedDocument = new Document() as Document.Parsed;
      parsedDocument.errors = [
        new YAMLError(
          'YAMLParseError',
          [0, 0],
          'UNKNOWN' as ErrorCode,
          `YAML parse error: ${(error as Error).message}`,
        ),
      ];
      return parsedDocument;
    }
  }

  // TODO: Should it be here?
  has(key: string): boolean {
    return this.parsedDocument.has(key);
  }

  // TODO: Rewrite; Should it be here?
  set(key: string, value: unknown): void {
    if (value === null) {
      this.parsedDocument.delete(key);
      return;
    }
    this.parsedDocument.set(key, value);
  }

  *getServices(): Generator<YamlComposeService> {
    const services = this.parsedDocument.get('services');

    if (!isMap(services)) return;

    for (const item of services.items) {
      const key = item.key;
      const value = item.value;

      if (!isScalar(key) || !isMap(value)) continue;

      yield new YamlComposeService(item as Pair<Scalar, YAMLMap>);
    }
  }

  /**
   * Returns the source location (line and column range) of a YAML node
   * identified by a given path.
   *
   * The path is represented as an array of keys or indexes:
   * - strings are used for object/map keys;
   * - numbers are used for array/sequence indexes.
   *
   * If the node cannot be found or is of an unsupported type,
   * the function falls back to a default location `{ line: 1, column: 1 }`.
   *
   * @param {Array<string | number>} path
   *   The sequence of keys and/or indexes representing the path to the node.
   *   Empty string segments are ignored.
   *
   * @returns {NodeLocation}
   *
   * @example
   * // Access a value by key inside an object (map)
   * document.getLocation(['services', 'db', 'ports', 'scalarValueInPorts']);
   *
   * @example
   * // Access an element by index inside an array (sequence)
   * document.getLocation(['services', 'db', 'ports', 0]);
   *
   * @example
   * // Empty path → returns the default location { line: 1, column: 1 }
   * document.getLocation([]);
   */
  getNodeLocation(path: (string | number)[]): NodeLocation {
    const DEFAULT_LOCATION = {
      line: 1,
      column: 1,
    };

    // Remove empty strings from path
    const filteredPaths = path.filter((value) => !(typeof value === 'string' && value.trim() === ''));

    if (filteredPaths.length === 0) return DEFAULT_LOCATION;

    const parentPath = filteredPaths.slice(0, -1);
    const last = filteredPaths.at(-1);
    const parent = this.parsedDocument.getIn(parentPath, true);

    if (!isCollection(parent)) return DEFAULT_LOCATION;

    // If last member of array is number (index) - get node
    // If last member of array is string - check if this is a value in collection
    const node =
      typeof last === 'number'
        ? parent.get(last, true)
        : (parent.items.find((item) => {
            return (
              (isPair(item) && isScalar(item.key) && item.key.value === last) ||
              (isScalar(item) && String(item.value) === String(last))
            );
          }) as Pair | Scalar | undefined);

    if (!node) return DEFAULT_LOCATION;

    let startLocationOffset = 0;
    let endLocationOffset = 0;

    // Scalar
    if (isScalar(node) && node.range) {
      startLocationOffset = node.range[0];
      endLocationOffset = node.range[1];
    }

    // Pair
    if (isPair(node) && node.key && isScalar(node.key) && node.key.range && node.value) {
      startLocationOffset = node.key.range[0];
      endLocationOffset = isScalar(node.value) && node.value.range ? node?.value.range[1] : node?.key.range[2];
    }

    // Collection
    if (isCollection(node) && node.range) {
      startLocationOffset = node.range[0];
      endLocationOffset = node.range[2];
    }

    const startLocation = this.lineCounter.linePos(startLocationOffset);
    const endLocation = this.lineCounter.linePos(endLocationOffset);

    return {
      line: startLocation.line,
      column: startLocation.col,
      endLine: endLocation.line,
      endColumn: endLocation.col,
    };
  }

  toString(): string {
    const YAML_STRINGIFY_OPTIONS: ToStringOptions = {
      blockQuote: true,
      collectionStyle: 'any',
      defaultKeyType: null,
      defaultStringType: 'PLAIN',
      directives: null,
      doubleQuotedAsJSON: false,
      doubleQuotedMinMultiLineLength: 40,
      falseStr: 'false',
      flowCollectionPadding: true,
      indent: 2,
      indentSeq: true,
      lineWidth: 0, // See issue #136
      minContentWidth: 20,
      nullStr: 'null',
      simpleKeys: false,
      singleQuote: null,
      trueStr: 'true',
      verifyAliasOrder: true,
    };

    return this.parsedDocument.toString(YAML_STRINGIFY_OPTIONS);
  }

  toJS(): Record<string, unknown> {
    return this.parsedDocument.toJS() as Record<string, unknown>;
  }

  getSyntaxIssues(): LintIssue[] {
    return (this.parsedDocument.errors ?? []).map((error) => yamlErrorToIssueMapper(error));
  }
}

export { YamlComposeDocument };
