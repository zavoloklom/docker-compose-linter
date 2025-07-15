import { createHash } from 'node:crypto';

import type { LintResult } from '../linter/linter.types';

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

export default function codeclimateFormatter(results: LintResult[]): string {
  const hashes = new Set<string>();

  const issues = results.flatMap((result) => {
    return result.messages.map((message) => ({
      type: 'issue',
      check_name: message.rule,
      description: message.message,
      content: {
        body: `Error found in ${message.rule}`,
      },
      categories: ['Style'],
      location: {
        path: result.filePath,
        lines: {
          begin: message.line,
          end: message.endLine ?? message.line,
        },
        positions: {
          begin: {
            line: message.line,
            column: message.column,
          },
          end: {
            line: message.endLine ?? message.line,
            column: message.endColumn ?? message.column,
          },
        },
      },
      severity: message.severity,
      fingerprint: generateFingerprint(
        [result.filePath, message.rule, message.message, `${message.line}`, `${message.column}`],
        hashes,
      ),
    }));
  });

  return JSON.stringify(issues);
}
