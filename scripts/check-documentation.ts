/* eslint-disable sonarjs/cognitive-complexity, no-console */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { type RuleDefinition, getRuleDefinition } from './utils';
import { DCLinter } from '../src/sdk/dclinter';

const documentationDirectory = join(dirname(fileURLToPath(import.meta.url)), '../docs');

let hasValidationErrors = false;

const validateDocumentation = async (ruleDefinition: RuleDefinition) => {
  const documentFilePath = join(documentationDirectory, `rules/${ruleDefinition.name}-rule.md`);

  try {
    const content = await readFile(documentFilePath, 'utf8');

    const isRuleNameMatch = /- \*\*Rule Name:\*\* \S+/u.test(content);
    if (!isRuleNameMatch) {
      console.warn(`Rule Name is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const isTypeMatch = /- \*\*Type:\*\* \S+/u.test(content);
    if (!isTypeMatch) {
      console.warn(`Type is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const isCategoryMatch = /- \*\*Category:\*\* \S+/u.test(content);
    if (!isCategoryMatch) {
      console.warn(`Category is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const isSeverityMatch = /- \*\*Severity:\*\* \S+/u.test(content);
    if (!isSeverityMatch) {
      console.warn(`Severity is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    const isFixableMatch = /- \*\*Fixable:\*\* \S+/u.test(content);
    if (!isFixableMatch) {
      console.warn(`Fixable is missing or empty in metadata block of ${documentFilePath}`);
      hasValidationErrors = true;
    }

    // Minimal required length to be considered meaningful
    const MIN_EXAMPLE_LENGTH = 20;
    const MIN_DETAILS_LENGTH = 200;

    const problematicExampleMatch = /## Problematic Code Example[^\n]*\n+```yaml\n(?<example>[\s\S]*?)```/iu.exec(
      content,
    );
    const correctExampleMatch = /## Correct Code Example[^\n]*\n+```yaml\n(?<example>[\s\S]*?)```/iu.exec(content);

    const hasProblematicExample =
      problematicExampleMatch?.groups && problematicExampleMatch.groups.example.trim().length >= MIN_EXAMPLE_LENGTH;
    const hasCorrectExample =
      correctExampleMatch?.groups && correctExampleMatch.groups.example.trim().length >= MIN_EXAMPLE_LENGTH;

    const detailsMatch = /## Rule Details and Rationale\n\n(?<details>[^#]+)/u.exec(content);
    const hasDetails = detailsMatch?.groups && detailsMatch.groups.details.trim().length >= MIN_DETAILS_LENGTH;

    const hasVersion = /## Version\n\n.*?\[v\d+\.\d+\.\d+\]\(.*?\)/u.test(content);
    const hasReferences = /## References\n\n- \[.*?\]\(.*?\)/u.test(content);

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
};

const main = async () => {
  const linter = new DCLinter();
  const rules = await linter.getRules();
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
};

await main();
