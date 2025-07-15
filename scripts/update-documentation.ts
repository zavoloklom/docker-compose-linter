/* eslint-disable import/no-extraneous-dependencies */
import * as changeCase from 'change-case';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';

import { getRuleDefinition } from './utils';
import { loadLintRules } from '../src/util/rules-utils';

import type { RuleDefinition } from '../src/rules/rules.types';

const documentationDirectory = join(dirname(fileURLToPath(import.meta.url)), '../docs');

function generateRulesTable(ruleDefinitionList: RuleDefinition[]) {
  const tableHeader = `
| Name | Description |   |
|------|-------------|---|`;
  const tableRows = ruleDefinitionList.map((ruleDefinition) => {
    const nameLink = `[${changeCase.capitalCase(ruleDefinition.name)}](./rules/${ruleDefinition.name}-rule.md)`;
    const severityIcon = ruleDefinition.type === 'error' ? '🔴' : '🟡';
    const fixableIcon = ruleDefinition.fixable ? '🔧' : '';
    const optionsIcon = ruleDefinition.hasOptions ? '⚙️' : '';
    return `| ${nameLink} | ${ruleDefinition.meta.description} | ${severityIcon} ${fixableIcon} ${optionsIcon} |`;
  });

  return `${tableHeader}\n${tableRows.join('\n')}\n`;
}

async function updateRulesReference(ruleDefinitionList: RuleDefinition[]) {
  const rulesFilePath = join(documentationDirectory, './rules.md');

  try {
    console.log(`Reading file from: ${rulesFilePath}`);
    const existingContent = await readFile(rulesFilePath, 'utf8');

    const categoryRegex =
      // eslint-disable-next-line sonarjs/slow-regex
      /(## (Style|Security|Best Practice|Performance))([\s\S]*?)(\n\|.*?\|[\s\S]*?\n\|.*?\|[\s\S]*?)(?=\n##|$)/g;

    const updatedContent = existingContent.replaceAll(
      categoryRegex,
      (match, header: string, category: string, description: string) => {
        console.log(`Updating category: ${category}`);

        const categoryRules = ruleDefinitionList.filter(
          (ruleDefinition) => ruleDefinition.category === changeCase.kebabCase(category),
        );
        console.log(`Found ${categoryRules.length} rules for category: ${category}`);

        if (categoryRules.length === 0) {
          return match;
        }

        const newTable = generateRulesTable(categoryRules);
        const cleanDescription = description.trim();

        return `${header}\n\n${cleanDescription}\n\n${newTable}`;
      },
    );

    console.log(`Writing updated content to: ${rulesFilePath}`);
    const formattedContent = await format(updatedContent, {
      filepath: rulesFilePath,
    });
    await writeFile(rulesFilePath, formattedContent, 'utf8');
    console.log(`Updated rules reference in ${rulesFilePath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error updating Rules Reference: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${JSON.stringify(error)}`);
    }
  }
}

async function updateDocumentation(ruleDefinition: RuleDefinition) {
  const documentFilePath = join(documentationDirectory, `./rules/${ruleDefinition.name}-rule.md`);

  try {
    let updatedContent = await readFile(documentFilePath, 'utf8');

    const metaRegex =
      /- \*\*Rule Name:\*\* .*?\n- \*\*Type:\*\* .*?\n- \*\*Category:\*\* .*?\n- \*\*Severity:\*\* .*?\n- \*\*Fixable:\*\* .*?\n/;
    const metaSection = `- **Rule Name:** ${ruleDefinition.name}\n- **Type:** ${ruleDefinition.type}\n- **Category:** ${ruleDefinition.category}\n- **Severity:** ${ruleDefinition.severity}\n- **Fixable:** ${ruleDefinition.fixable}\n`;
    updatedContent = updatedContent.replace(metaRegex, metaSection);

    await writeFile(documentFilePath, updatedContent, 'utf8');
    console.log(`Updated rule documentation: ${documentFilePath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error updating ${documentFilePath}: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${JSON.stringify(error)}`);
    }
  }
}

async function main() {
  const rules = loadLintRules({ rules: {}, quiet: false, debug: false, exclude: [] });
  const ruleDefinitionList = [];
  const promises = [];

  for (const rule of rules) {
    const ruleDefinition = getRuleDefinition(rule);
    ruleDefinitionList.push(ruleDefinition);
    promises.push(updateDocumentation(ruleDefinition));
  }

  // Update documentation
  await Promise.all(promises);

  // Update rules reference
  await updateRulesReference(ruleDefinitionList);
}

await main();
