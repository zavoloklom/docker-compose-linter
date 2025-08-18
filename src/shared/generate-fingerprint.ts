import { createHash } from 'node:crypto';

const generateFingerprint = (data: (string | null)[], hashes: Set<string>): string => {
  // eslint-disable-next-line sonarjs/hashing
  const hash = createHash('md5');

  // Filter out null values and update the hash
  for (const part of data.filter(Boolean)) {
    hash.update(part!.toString());
  }

  // Hash collisions should not happen, but if they do, a random hash will be generated.
  const hashCopy = hash.copy();
  let digest = hash.digest('hex');
  if (hashes.has(digest)) {
    // eslint-disable-next-line sonarjs/pseudo-random
    hashCopy.update(Math.random().toString());
    digest = hashCopy.digest('hex');
  }

  hashes.add(digest);

  return digest;
};

export { generateFingerprint };
