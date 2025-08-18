// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';

import packageJson from '../package.json' with { type: 'json' };
import { RuleCategory, RuleSeverity, RuleType } from '../src/domain/models/rule';

import type { NodePlopAPI } from 'plop';

const nextMajorVersion = () => {
  const version = packageJson.version;
  const versionRegexp = /^(?<major>\d+)\.\d+\.\d+\)?$/u.exec(version);
  const major = versionRegexp?.groups?.major;
  return major ? `${Number(major) + 1}.0.0` : '1.0.0';
};

// eslint-disable-next-line import/no-default-export
export default function createRule(plop: NodePlopAPI) {
  plop.setHelper('and', (a, b): boolean => a && b);
  plop.setHelper('not', (a): boolean => !a);

  plop.setHelper('pascalCase', (text: string) => changeCase.pascalCase(text));
  plop.setHelper('kebabCase', (text: string) => changeCase.kebabCase(text));
  plop.setHelper('capitalCase', (text: string) => changeCase.capitalCase(text));

  plop.setHelper('nextMajorVersion', () => nextMajorVersion());

  plop.setHelper('ruleGenerics', (hasContext, hasOptions, id: string) => {
    const rulePascalCase = changeCase.pascalCase(id);
    if (!hasContext && !hasOptions) return '';
    if (hasContext && hasOptions) return `<${rulePascalCase}IssueContext, ${rulePascalCase}RuleOptions>`;
    if (hasContext) return `<${rulePascalCase}IssueContext>`;
    return `<EmptyContext, ${rulePascalCase}RuleOptions>`;
  });

  const typeChoices = Object.entries(RuleType).map(([key, value]) => ({
    name: value,
    value: key,
  }));

  const severityChoices = Object.entries(RuleSeverity).map(([key, value]) => ({
    name: value,
    value: key,
  }));

  const categoryChoices = Object.entries(RuleCategory).map(([key, value]) => ({
    name: value,
    value: key,
  }));

  plop.setGenerator('rule', {
    description: 'Create new rule with tests and docs',
    prompts: [
      {
        type: 'input',
        name: 'id',
        message: 'Rule ID (kebab-case, without "-rule", e.g. "no-version-field"):',
        validate: (value: string): true | string => {
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value)) {
            return 'Must be kebab-case, e.g. my-component';
          }
          if (value.endsWith('-rule')) {
            return 'Name must not end with "-rule"';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'category',
        message: 'Category:',
        choices: categoryChoices,
      },
      {
        type: 'list',
        name: 'type',
        message: 'Type:',
        choices: typeChoices,
      },
      {
        type: 'list',
        name: 'severity',
        message: 'Severity:',
        choices: severityChoices,
      },
      {
        type: 'confirm',
        name: 'fixable',
        message: 'Does rule have auto-fix function?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'hasOptions',
        message: 'Does rule have configurable options?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'hasContext',
        message: 'Does rule have additional context for LintIssue (e.g. service name)?',
        default: true,
      },
    ],
    actions: (answers) => {
      const fileName = '{{kebabCase id}}-rule';
      return [
        {
          type: 'add',
          path: `../src/plugins/rules/${fileName}.ts`,
          templateFile: `plop-templates/rule.class.hbs`,
        },
        {
          type: 'append',
          path: '../src/plugins/rules/index.ts',
          pattern: /$/u,
          templateFile: `plop-templates/index.append.hbs`,
          separator: '',
          unique: true,
        },
        {
          type: 'add',
          path: `../tests/plugins/rules/${fileName}.spec.ts`,
          templateFile: `plop-templates/rule.test.hbs`,
        },
        {
          type: 'add',
          path: `../documentation/docs/rules/${fileName}.md`,
          templateFile: `plop-templates/rule.doc.hbs`,
        },
      ];
    },
  });
}
