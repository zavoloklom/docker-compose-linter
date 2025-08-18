import type { ServiceImageDefinition } from "../models/compose-definitions/service-image";

/**
 * Parses a Docker image string into its normalized definition per OCI/Docker rules.
 * [<registry>/][<path...>/]<image>[:<tag>][@<digest>]
 * Example inputs:
 *   "redis"
 *   "redis:5"
 *   "redis@sha256:deadbeef..."
 *   "docker.io/library/redis:7"
 *   "my-registry:5000/project/redis@sha256:deadbeef..."
 */
const normalizeServiceImage = (value: string): ServiceImageDefinition => {
  let registry: string | null = null;
  let path: string[] = [];
  let image = '';
  let digest: string | null = null;

  const atIndex = value.indexOf('@');
  const left = atIndex === -1 ? value : value.slice(0, atIndex);
  if (atIndex >= 0) digest = value.slice(atIndex + 1) || null;

  // Tag separator must be the last ':' that appears *after* the last '/'
  const lastSlash = left.lastIndexOf('/');
  const lastColon = left.lastIndexOf(':');
  const hasTag = lastColon > lastSlash;

  const nameNoTag = hasTag ? left.slice(0, lastColon) : left;
  const tag = hasTag ? left.slice(lastColon + 1) : null;

  const parts = nameNoTag.split('/').filter(Boolean);

  if (parts.length === 0) {
    // If empty -> treat as invalid but keep as empty pieces
    return { registry, path, image, tag, digest };
  }

  // Heuristic: if first segment looks like a registry (has '.' or ':' or is 'localhost')
  const first = parts[0];
  const isLooksLikeRegistry = first.includes('.') || first.includes(':') || first === 'localhost';

  if (isLooksLikeRegistry) {
    registry = first;
    if (parts.length === 1) {
      // Just "registry" without repo; unusual but guard anyway
      path = [];
    } else {
      image = parts.at(-1) as string;
      path = parts.slice(1, -1);
    }
  } else {
    image = parts.at(-1) as string;
    path = parts.slice(0, -1);
  }

  return { registry, path, image, tag, digest };
};

export { normalizeServiceImage };
