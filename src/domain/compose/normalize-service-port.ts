import { isIP } from 'node:net';

import type { ServicePortDefinition } from '../models/compose-definitions/service-port';

const normalizeServicePort = (value: string): ServicePortDefinition => {
  const trimmed = value.trim();

  // Handle protocol suffix
  const slashIndex = trimmed.lastIndexOf('/');
  let protocol = null;
  let main = trimmed;
  if (slashIndex !== -1) {
    protocol = trimmed.slice(slashIndex + 1).toLowerCase();
    main = trimmed.slice(0, slashIndex);
  }

  // IPv6 in []
  if (main.startsWith('[')) {
    const close = main.indexOf(']');
    if (close === -1) throw new Error('Unmatched "[" in IPv6 literal');
    const ipLiteral = main.slice(0, close + 1);
    const ip = ipLiteral.startsWith('[') && ipLiteral.endsWith(']') ? ipLiteral.slice(1, -1) : ipLiteral;
    const rest = main.slice(close + 1); // ":6001:6001"
    const tokens = rest.split(':').filter(Boolean);
    if (tokens.length === 1) {
      return { hostIP: ip, host: null, container: tokens[0], protocol };
    }
    if (tokens.length === 2) {
      return { hostIP: ip, host: tokens[0], container: tokens[1], protocol };
    }
    throw new Error(`Too many segments after IPv6: "${main}"`);
  }

  // Split by colon
  const parts = main.split(':');
  if (parts.length === 1) {
    return { hostIP: null, host: null, container: parts[0], protocol };
  }
  if (parts.length === 2) {
    // For cases like 127.0.0.1:8080
    if (isIP(parts[0]) !== 0) {
      return { hostIP: parts[0], host: null, container: parts[1], protocol };
    }
    return { hostIP: null, host: parts[0], container: parts[1], protocol };
  }

  const CONTAINER_INDEX = -1;
  const HOST_INDEX = -2;
  const container = parts.at(CONTAINER_INDEX) as string;
  const host = parts.at(HOST_INDEX) ?? null;
  const ipCandidate = parts.slice(0, HOST_INDEX).join(':');

  return { hostIP: ipCandidate, host, container, protocol };
};

export { normalizeServicePort };
