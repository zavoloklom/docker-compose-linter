import { isIP } from 'node:net';
import { isMap, isScalar } from 'yaml';

const extractPublishedPortValueWithProtocol = (yamlNode: unknown): { port: string; protocol: string } => {
  if (isScalar(yamlNode)) {
    const value = String(yamlNode.value);

    // Extract protocol (e.g., '8080/tcp')
    const [portPart, protocol] = value.split('/');

    // Extract the actual port, ignoring host/ip
    // eslint-disable-next-line sonarjs/slow-regex,require-unicode-regexp
    const parts = portPart.split(/:(?![^[]*])/);

    if (parts[0].startsWith('[') && parts[0].endsWith(']')) {
      parts[0] = parts[0].slice(1, -1);
    }

    if (isIP(parts[0])) {
      return { port: String(parts[1]), protocol: protocol || 'tcp' };
    }

    return { port: parts[0], protocol: protocol || 'tcp' };
  }

  if (isMap(yamlNode)) {
    return {
      port: yamlNode.get('published')?.toString() || '',
      protocol: yamlNode.get('protocol')?.toString() || 'tcp',
    };
  }

  return { port: '', protocol: 'tcp' };
};

const extractPublishedPortInterfaceValue = (yamlNode: unknown): string => {
  if (isScalar(yamlNode)) {
    const value = String(yamlNode.value);

    // Split on single colon
    // eslint-disable-next-line sonarjs/slow-regex,require-unicode-regexp
    const parts = value.split(/:(?![^[]*])/);

    if (parts[0].startsWith('[') && parts[0].endsWith(']')) {
      parts[0] = parts[0].slice(1, -1);
    }

    if (isIP(parts[0])) {
      return String(parts[0]);
    }

    return '';
  }

  if (isMap(yamlNode)) {
    return yamlNode.get('host_ip')?.toString() || '';
  }

  return '';
};

const parsePortsRange = (port: string): string[] => {
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
  for (let i = start; i <= end; i++) {
    ports.push(i.toString());
  }
  return ports;
};

export { extractPublishedPortValueWithProtocol, extractPublishedPortInterfaceValue, parsePortsRange };
