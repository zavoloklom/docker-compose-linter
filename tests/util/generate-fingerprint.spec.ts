import test from 'ava';
import { createHash } from 'node:crypto';

import { generateFingerprint } from '../../src/util/generate-fingerprint';

/**
 * Helper: compute MD5 hex digest of an array of string parts.
 */
const md5Of = (parts: string[]) => {
  // eslint-disable-next-line sonarjs/hashing
  const hash = createHash('md5');
  for (const part of parts) {
    hash.update(part);
  }
  return hash.digest('hex');
};

test('generateFingerprint returns stable MD5 and records it in the set', (t) => {
  const data = ['path/to/file.js', 'RULE_A', 'An error occurred', '42', '7'];
  const hashes = new Set<string>();

  const fp = generateFingerprint(data, hashes);
  const expected = md5Of(data);

  t.is(fp, expected, 'should be the MD5 of the concatenated parts');
  t.true(hashes.has(expected), 'should add the fingerprint to the hashes set');
});

test.serial('generateFingerprint handles collisions by re‑hashing with Math.random', (t) => {
  const data = ['src/app.ts', 'RULE_B', 'Oops', '1', '2'];
  const original = md5Of(data);
  const hashes = new Set<string>([original]);

  // Stub Math.random to a fixed value
  const realRandom = Math.random;
  // eslint-disable-next-line unicorn/numeric-separators-style
  const pseudoRandom = 0.123456789;
  Math.random = () => pseudoRandom;

  try {
    const fp2 = generateFingerprint(data, hashes);
    t.not(fp2, original, 'should generate a new fingerprint on collision');

    // Manually compute expected second digest
    // eslint-disable-next-line sonarjs/hashing
    const h2 = createHash('md5');
    for (const part of data) h2.update(part);
    h2.update(String(pseudoRandom));
    const expected2 = h2.digest('hex');

    t.is(fp2, expected2, 'should match MD5(data + stubbed random)');
    t.true(hashes.has(expected2), 'should record the new fingerprint');
  } finally {
    Math.random = realRandom;
  }
});
