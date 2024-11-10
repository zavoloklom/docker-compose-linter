import net from 'node:net';
import { isMap, isScalar } from 'yaml';

function extractPublishedPortValue(yamlNode: unknown): string {
  if (isScalar(yamlNode)) {
    const value = String(yamlNode.value);

    // Check for host before ports
    const parts = value.split(/:(?![^[]*])/);

    if (parts[0].startsWith('[') && parts[0].endsWith(']')) {
      parts[0] = parts[0].slice(1, -1);
    }

    if (net.isIP(parts[0])) {
      return String(parts[1]);
    }

    return parts[0];
  }

  if (isMap(yamlNode)) {
    return yamlNode.get('published')?.toString() || '';
  }

  return '';
}

function extractPublishedPortInterfaceValue(yamlNode: unknown): string {
  if (isScalar(yamlNode)) {
    const value = String(yamlNode.value);

    // Split on single colon
    const parts = value.split(/:(?![^[]*])/);

    if (parts[0].startsWith('[') && parts[0].endsWith(']')) {
      parts[0] = parts[0].slice(1, -1);
    }

    if (net.isIP(parts[0])) {
      return String(parts[0]);
    }

    return '';
  }

  if (isMap(yamlNode)) {
    return yamlNode.get('host_ip')?.toString() || '';
  }

  return '';
}

function parsePortsRange(port: string): string[] {
  const [start, end] = port.split('-').map(Number);

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return [];
  }

  if (!end) {
    return [start.toString()];
  }

  if (start > end) {
    // Invalid port range: start port is greater than end port
    return [];
  }

  const ports: string[] = [];
  // eslint-disable-next-line no-plusplus,unicorn/prevent-abbreviations
  for (let i = start; i <= end; i++) {
    ports.push(i.toString());
  }
  return ports;
}

export { extractPublishedPortValue, extractPublishedPortInterfaceValue, parsePortsRange };
