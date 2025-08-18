/* eslint-disable import/no-extraneous-dependencies, no-console */
import * as changeCase from 'change-case';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';

import { type RuleDefinition, getRuleDefinition } from './utils';
import { RuleCategory, RuleType } from '../src/domain/models/rule';
import { DCLinter } from '../src/sdk/dclinter';

const documentationDirectory = join(dirname(fileURLToPath(import.meta.url)), '../docs');

const generateRulesTable = (ruleDefinitionList: RuleDefinition[]) => {
  const tableHeader = `
| Name | Description |   |
|------|-------------|---|`;
  const tableRows = ruleDefinitionList.map((ruleDefinition) => {
    const nameLink = `[${changeCase.capitalCase(ruleDefinition.name)}](./rules/${ruleDefinition.name}-rule.md)`;
    const severityIcon = ruleDefinition.type === RuleType.ERROR ? '🔴' : '🟡';
    const fixableIcon = ruleDefinition.fixable ? '🔧' : '';
    const optionsIcon = ruleDefinition.hasOptions ? '⚙️' : '';
    return `| ${nameLink} | ${ruleDefinition.meta.description} | ${severityIcon} ${fixableIcon} ${optionsIcon} |`;
  });

  return `${tableHeader}\n${tableRows.join('\n')}\n`;
};

const updateRulesReference = async (ruleDefinitionList: RuleDefinition[]) => {
  const rulesFilePath = join(documentationDirectory, './rules.md');

  try {
    console.log(`Reading file from: ${rulesFilePath}`);
    const existingContent = await readFile(rulesFilePath, 'utf8');

    const slugs = Object.values(RuleCategory);
    const categoryPattern = slugs.map((category) => changeCase.capitalCase(category)).join('|');

    console.log(categoryPattern);

    const categoryRegex =
      // eslint-disable-next-line sonarjs/slow-regex
      /`(?<header>## (?<category>\$\{categoryPattern\}))(?<description>[\s\S]*?)(?<table>\n\|.*?\|[\s\S]*?\n\|.*?\|[\s\S]*?)(?=\n##|$)`/gu;

    let updatedContent = existingContent;
    for (const match of existingContent.matchAll(categoryRegex)) {
      const { header, category, description } = match.groups ?? {};
      if (!header || !category) continue;
      console.log(`Updating category: ${category}`);

      const rules = ruleDefinitionList.filter((rule) => rule.category === changeCase.kebabCase(category));
      console.log(`Found ${rules.length} rules for category: ${category}`);
      if (rules.length === 0) continue;

      const replacement = [header, '', description.trim(), '', generateRulesTable(rules)].join('\n\n');
      updatedContent = updatedContent.replace(match[0], replacement);
    }

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
};

const updateDocumentation = async (ruleDefinition: RuleDefinition) => {
  const documentFilePath = join(documentationDirectory, `./rules/${ruleDefinition.name}-rule.md`);

  try {
    let updatedContent = await readFile(documentFilePath, 'utf8');

    const metaRegex =
      /- \*\*Rule Name:\*\* .*?\n- \*\*Type:\*\* .*?\n- \*\*Category:\*\* .*?\n- \*\*Severity:\*\* .*?\n- \*\*Fixable:\*\* .*?\n/u;
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
};

const main = async () => {
  const linter = new DCLinter();
  const rules = await linter.getRules();

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
};

await main();
