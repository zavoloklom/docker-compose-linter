import type { Document } from 'yaml';
import { isMap, isSeq, Node, isScalar } from 'yaml';

/**
 * Finds the line number where the key is located in the content.
 * @param content The parsed YAML content as a string.
 * @param key The key to search for in the content.
 * @returns number The line number where the key is found, or 1 if not found.
 */
function findLineNumberByKey(content: string, key: string): number {
  const lines = content.split('\n');
  const regex = new RegExp(`^\\s*${key}:`, 'i');

  let lineNumber = 1; // Lines start from 1, not 0
  for (const line of lines) {
    if (regex.test(line)) {
      return lineNumber;
    }
    lineNumber += 1;
  }
  return 1; // Default to 1 if the key is not found
}

/**
 * Finds the line number where the value is located in the content.
 * @param content The parsed YAML content as a string.
 * @param value The value to search for in the content.
 * @returns number The line number where the key is found, or 1 if not found.
 */
function findLineNumberByValue(content: string, value: string): number {
  const lineIndex = content.split('\n').findIndex((line) => line.includes(value));
  return lineIndex === -1 ? 1 : lineIndex + 1;
}

/**
 * Finds the line number where the key is located in the YAML content for a specific service.
 * Searches only within the service block, ensuring boundaries are respected.
 *
 * @param document The YAML content parsed with lib yaml.
 * @param content The parsed YAML content as a string.
 * @param serviceName The name of the service in which to search for the key.
 * @param key The key to search for in the content.
 * @returns number The line number where the key is found, or -1 if not found.
 */
function findLineNumberByKeyForService(document: Document, content: string, serviceName: string, key: string): number {
  const services = document.get('services') as Node;

  if (!isMap(services)) {
    return 1;
  }

  const service = services.get(serviceName) as Node;

  if (!isMap(service)) {
    return 1;
  }

  let lineNumber = 1;
  service.items.forEach((item) => {
    const keyNode = item.key;

    if (isScalar(keyNode) && keyNode.value === key && keyNode.range) {
      const [start] = keyNode.range;
      lineNumber = content.slice(0, start).split('\n').length;
    }
  });

  return lineNumber;
}

/**
 * Refactored helper to get service block line number
 */
function getServiceStartLine(service: Node, content: string): number {
  if (service.range) {
    const [start] = service.range;
    return content.slice(0, start).split('\n').length - 1;
  }
  return 1;
}

/**
 * Refactored helper to get key line number
 */
function getKeyLine(keyNode: Node, content: string): number {
  if (keyNode.range) {
    const [start] = keyNode.range;
    const line = content.slice(0, start).split('\n').length;
    return isScalar(keyNode) ? line : line - 1;
  }
  return 1;
}

/**
 * Finds the line number where the service, key, or value is located in the YAML content.
 * If the key is not provided, it returns the line number for the service block.
 * If the key is provided without a value, it returns the line number for the key.
 * If both key and value are provided, it searches for the specific key-value pair within the service.
 *
 * @param document
 * @param content The parsed YAML content as a string.
 * @param serviceName The name of the service to search for.
 * @param key The optional key to search for in the service.
 * @param value The optional value to search for within the key's content.
 * @returns number The line number where the service, key, or value is found, or 1 if not found.
 */
function findLineNumberForService(
  document: Document,
  content: string,
  serviceName: string,
  key?: string,
  value?: string,
): number {
  const services = document.get('services') as Node;
  if (!isMap(services)) {
    return 1;
  }

  // Locate Service
  const service = services.get(serviceName) as Node;
  if (!isMap(service)) {
    return 1;
  }

  // If the key is not provided, it returns the line number for the service block
  if (!key) {
    return getServiceStartLine(service, content);
  }

  // Locate Key in Service
  const keyNode = service.get(key, true) as Node;
  if (!keyNode) {
    return 1;
  }

  // If value is not provided, return the line number of the key
  if (!value) {
    return getKeyLine(keyNode, content);
  }

  if (isSeq(keyNode)) {
    keyNode.items.forEach((item) => {
      if (isScalar(item) && item.value === value && item.range) {
        const [start] = item.range;
        return content.slice(0, start).split('\n').length;
      }

      return 1;
    });
  }

  if (isMap(keyNode)) {
    keyNode.items.forEach((item) => {
      const keyItem = item.key;
      const valueItem = item.value;

      if (isScalar(keyItem) && isScalar(valueItem) && valueItem.value === value && valueItem.range) {
        const [start] = valueItem.range;
        return content.slice(0, start).split('\n').length;
      }

      return 1;
    });
  }

  return 1; // Default to 1 if the key or value is not found
}

export { findLineNumberByKey, findLineNumberByValue, findLineNumberByKeyForService, findLineNumberForService };
