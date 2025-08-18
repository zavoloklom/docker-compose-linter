import type { LintIssue } from './lint-issue';
import type { SuppressionIndex } from '../supressions/supression-index';

interface NodeLocation {
  line: number; // The line number where the node starts
  column: number; // The column number where the node starts
  endLine?: number; // The line number where the node ends (optional)
  endColumn?: number; // The column number where the node ends (optional)
}

/**
 * Domain-level model of a Docker Compose document.
 * Provides structured access to top-level sections and helps implement custom rules.
 */
interface ComposeDocument {
  /** Path or URI of the original compose file. */
  readonly filePath: string;

  /** Index of rule suppressions extracted from a document. */
  readonly suppressions: SuppressionIndex;

  /**
   * Get a list of all top-level section names in document order.
   * e.g. ['version', 'services', 'networks']
   */
  // getSections(): string[];

  /**
   * Retrieve the raw data of a top-level section.
   * @param name The section key, e.g. 'services'.
   * @returns The section value (object, array, or primitive) or undefined.
   */
  // getSection<T = never>(name: string): T | undefined;

  /**
   * Replace or insert a top-level section.
   * @param name The section key.
   * @param value New section value (object, array, or primitive).
   */
  // setSection<T = never>(name: string, value: T): void;

  /**
   * Get location by path.
   * @param path Array of strings or numbers to locate node.
   */
  getNodeLocation(path: (string | number)[]): NodeLocation;

  /**
   * Get parsing issues
   */
  getSyntaxIssues(): LintIssue[];

  /**
   * Serialize the current state back to YAML or JSON.
   */
  toString(): string;

  /**
   * Serialize the current state to JS Object.
   */
  toJS(): Record<string, unknown>;
}

/**
 * Represents a named service block in a Docker Compose document.
 * Offers generic access to service properties.
 */
interface ComposeService {
  /** Service key, e.g. 'web', 'db'. */
  readonly name: string;

  /**
   * Get an ordered list of property names under this service.
   */
  getProperties(): string[];

  /**
   * Retrieve a property value by key.
   * @param key The property name, e.g. 'image', 'ports'.
   * @returns The property value or undefined.
   */
  getProperty<T = never>(key: string): T | undefined;

  /**
   * Replace or insert a property under this service.
   * @param key The property name.
   * @param value New property value.
   */
  setProperty<T = never>(key: string, value: T): void;
}

export { ComposeDocument, ComposeService, NodeLocation };
