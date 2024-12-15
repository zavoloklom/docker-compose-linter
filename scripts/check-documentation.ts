/* eslint-disable sonarjs/cognitive-complexity */

import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLintRules, getRuleDefinition } from '../src/util/rules-utils';
import type { LintRuleDefinition } from '../src/linter/linter.types';

const documentationDirectory = join(dirname(fileURLToPath(import.meta.url)), '../docs');

let hasValidationErrors = false;

async function validateDocumentation(ruleDefinition: LintRuleDefinition) {
  const documentFilePath = join(documentationDirectory, `rules/${ruleDefinition.name}-rule.md`);

  try {
    const content = await fs.readFile(documentFilePath, 'utf8');

    const ruleNameMatch = content.match(/- \*\*Rule Name:\*\* (.+)/);
    if (!ruleNameMatch || !ruleNameMatch[1].trim()) {
      console.warn(`Rule Name is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const typeMatch = content.match(/- \*\*Type:\*\* (.+)/);
    if (!typeMatch || !typeMatch[1].trim()) {
      console.warn(`Type is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const categoryMatch = content.match(/- \*\*Category:\*\* (.+)/);
    if (!categoryMatch || !categoryMatch[1].trim()) {
      console.warn(`Category is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const severityMatch = content.match(/- \*\*Severity:\*\* (.+)/);
    if (!severityMatch || !severityMatch[1].trim()) {
      console.warn(`Severity is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const fixableMatch = content.match(/- \*\*Fixable:\*\* (.+)/);
    if (!fixableMatch || !fixableMatch[1].trim()) {
      console.warn(`Fixable is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const problematicExampleMatch = content.match(/## Problematic Code Example[^\n]*\n+```yaml\n([\s\S]*?)```/i);
    const correctExampleMatch = content.match(/## Correct Code Example[^\n]*\n+```yaml\n([\s\S]*?)```/i);

    const hasProblematicExample = problematicExampleMatch && problematicExampleMatch[1].trim().length >= 20;
    const hasCorrectExample = correctExampleMatch && correctExampleMatch[1].trim().length >= 20;

    const detailsMatch = content.match(/## Rule Details and Rationale\n\n([^#]+)/);
    const detailsContent = detailsMatch ? detailsMatch[1].trim() : '';
    const hasDetails = detailsContent.length >= 200;

    const hasVersion = /## Version\n\n.*?\[v\d+\.\d+\.\d+]\(.*?\)/.test(content);
    const hasReferences = /## References\n\n- \[.*?]\(.*?\)/.test(content);

    if (ruleDefinition.hasOptions) {
      const hasOptionsSection = /## Options\n\n/.test(content);
      if (!hasOptionsSection) {
        console.warn(`Missing Options section for rule with options in ${documentFilePath}`);
        hasValidationErrors = true;
      }
    }

    if (!hasProblematicExample) {
      console.warn(`Missing or incomplete problematic code example in ${documentFilePath}`);
      hasValidationErrors = true;
    }
    if (!hasCorrectExample) {
      console.warn(`Missing or incomplete correct code example in ${documentFilePath}`);
      hasValidationErrors = true;
    }
    if (!hasDetails) {
      console.warn(`Rule details and rationale section is too short in ${documentFilePath}`);
      hasValidationErrors = true;
    }
    if (!hasVersion) {
      console.warn(`Version section is missing or invalid in ${documentFilePath}`);
      hasValidationErrors = true;
    }
    if (!hasReferences) {
      console.warn(`References section is missing or invalid in ${documentFilePath}`);
      hasValidationErrors = true;
    }
    console.log(`Validation completed: ${documentFilePath}`);
  } catch (error) {
    hasValidationErrors = true;
    if (error instanceof Error) {
      console.error(`Error validating ${documentFilePath}: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${JSON.stringify(error)}`);
    }
  }
}

async function main() {
  const rules = await loadLintRules({ rules: {}, quiet: false, debug: false, exclude: [] });
  const promises = [];

  for (const rule of rules) {
    const ruleDefinition = getRuleDefinition(rule);
    promises.push(validateDocumentation(ruleDefinition));
  }

  await Promise.all(promises);

  if (hasValidationErrors) {
    console.error('\nValidation failed with errors.');
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  } else {
    console.log('\nAll validations passed successfully.');
  }
}

await main();
