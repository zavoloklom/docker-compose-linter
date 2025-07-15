/* eslint-disable sonarjs/cognitive-complexity */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getRuleDefinition } from './utils';
import { loadLintRules } from '../src/util/rules-utils';

import type { RuleDefinition } from '../src/rules/rules.types';

const documentationDirectory = join(dirname(fileURLToPath(import.meta.url)), '../docs');

let hasValidationErrors = false;

async function validateDocumentation(ruleDefinition: RuleDefinition) {
  const documentFilePath = join(documentationDirectory, `rules/${ruleDefinition.name}-rule.md`);

  try {
    const content = await readFile(documentFilePath, 'utf8');

    const ruleNameMatch = /- \*\*Rule Name:\*\* (.+)/u.exec(content);
    if (!ruleNameMatch?.[1].trim()) {
      console.warn(`Rule Name is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const typeMatch = /- \*\*Type:\*\* (.+)/u.exec(content);
    if (!typeMatch?.[1].trim()) {
      console.warn(`Type is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const categoryMatch = /- \*\*Category:\*\* (.+)/u.exec(content);
    if (!categoryMatch?.[1].trim()) {
      console.warn(`Category is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const severityMatch = /- \*\*Severity:\*\* (.+)/u.exec(content);
    if (!severityMatch?.[1].trim()) {
      console.warn(`Severity is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const fixableMatch = /- \*\*Fixable:\*\* (.+)/u.exec(content);
    if (!fixableMatch?.[1].trim()) {
      console.warn(`Fixable is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    // Minimal required length to be considered meaningful
    const MIN_EXAMPLE_LENGTH = 20;
    const MIN_DETAILS_LENGTH = 200;

    const problematicExampleMatch = /## Problematic Code Example[^\n]*\n+```yaml\n([\s\S]*?)```/iu.exec(content);
    const correctExampleMatch = /## Correct Code Example[^\n]*\n+```yaml\n([\s\S]*?)```/iu.exec(content);

    const hasProblematicExample =
      problematicExampleMatch && problematicExampleMatch[1].trim().length >= MIN_EXAMPLE_LENGTH;
    const hasCorrectExample = correctExampleMatch && correctExampleMatch[1].trim().length >= MIN_EXAMPLE_LENGTH;

    const detailsMatch = /## Rule Details and Rationale\n\n([^#]+)/u.exec(content);
    const detailsContent = detailsMatch ? detailsMatch[1].trim() : '';
    const hasDetails = detailsContent.length >= MIN_DETAILS_LENGTH;

    // eslint-disable-next-line require-unicode-regexp
    const hasVersion = /## Version\n\n.*?\[v\d+\.\d+\.\d+]\(.*?\)/.test(content);
    // eslint-disable-next-line require-unicode-regexp
    const hasReferences = /## References\n\n- \[.*?]\(.*?\)/.test(content);

    if (ruleDefinition.hasOptions) {
      const hasOptionsSection = /## Options\n\n/u.test(content);
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
  const rules = loadLintRules({ rules: {}, quiet: false, debug: false, exclude: [] });
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
