import { escapeXml } from '../../shared/escape-xml';

import type { FormatterFunction } from '../../domain/models/formatter';

const junitFormatter: FormatterFunction = (lintSummary) => {
  const testSuites = lintSummary.reports
    .map((report) => {
      const testCases = report.issues
        .map((issue) => {
          return `
                <testcase name="${escapeXml(issue.ruleId)}" classname="${escapeXml(report.filePath)}" time="0">
                    <failure message="${escapeXml(issue.message)}">${escapeXml(report.filePath)}:${issue.line}:${issue.column}</failure>
                </testcase>
            `;
        })
        .join('');

      return `
            <testsuite name="${escapeXml(report.filePath)}" errors="${report.issues.length}" tests="${report.issues.length}">
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

export { junitFormatter };
