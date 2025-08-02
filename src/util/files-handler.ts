import { realpathSync } from 'node:fs';
import { normalize, resolve, sep } from 'node:path';

/**
 * Error thrown when path validation fails (traversal, missing, out-of-bounds, etc).
 */
class PathValidationError extends Error {}

/**
 * Resolve and validate a user-supplied path, ensuring:
 *  - normalization (collapse ../)
 *  - symlink resolution
 *  - containment inside allowed root
 * Throws PathValidationError on violation.
 */
const safeResolveFile = (file: string, allowedRoot: string = process.cwd()): string => {
  // Normalize input to remove redundant segments like "../"
  const normalized = normalize(file);

  // Build candidate path: if `file` is absolute, resolve returns it as-is; otherwise it is anchored under allowedRoot
  const candidate = resolve(allowedRoot, normalized);

  // Resolve real paths to handle symlinks
  let realRoot: string;
  let realCandidate: string;
  try {
    realRoot = realpathSync(allowedRoot);
  } catch (error) {
    throw new PathValidationError(`Unable to resolve allowed root: ${(error as Error).message}`);
  }

  try {
    realCandidate = realpathSync(candidate);
  } catch (error) {
    throw new PathValidationError(`File not found or inaccessible: ${(error as Error).message}`);
  }

  // Enforce containment: realCandidate must be the root or inside it
  if (realCandidate !== realRoot && !realCandidate.startsWith(realRoot + sep)) {
    throw new PathValidationError(`Path escapes allowed root: ${file}`);
  }

  return realCandidate;
};

export { safeResolveFile };
