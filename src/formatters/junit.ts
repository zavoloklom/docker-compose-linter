import type { LintResult } from '../linter/linter.types';

const escapeXml = (unsafe: string): string => {
  return unsafe.replaceAll(/[<>&'"]/gu, (character) => {
    switch (character) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return character;
    }
  });
};

const junitFormatter = (results: LintResult[]): string => {
  const testSuites = results
    .map((result) => {
      const testCases = result.messages
        .map((error) => {
          return `
                <testcase name="${escapeXml(error.rule)}" classname="${escapeXml(result.filePath)}" time="0">
                    <failure message="${escapeXml(error.message)}">${escapeXml(result.filePath)}:${error.line}:${error.column}</failure>
                </testcase>
            `;
        })
        .join('');

      return `
            <testsuite name="${escapeXml(result.filePath)}" errors="${result.messages.length}" tests="${result.messages.length}">
                ${testCases}
            </testsuite>
        `;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
    ${testSuites}
</testsuites>`;
};

export default junitFormatter;
