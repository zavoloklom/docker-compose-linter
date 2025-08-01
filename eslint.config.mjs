import js from '@eslint/js';
import confusingBrowserGlobals from 'confusing-browser-globals';
import { defineConfig } from 'eslint/config';
import ava from 'eslint-plugin-ava';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import sonarjs from 'eslint-plugin-sonarjs';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { configs as TSConfigs } from 'typescript-eslint';

// eslint-disable-next-line import/no-default-export
export default defineConfig([
  [
    {
      name: 'NodeJS Globals',
      languageOptions: {
        globals: globals.node,
      },
    },
    // ESLint All
    {
      name: 'eslint/all',
      rules: js.configs.all.rules,
    },
    // SonarJS
    sonarjs.configs.recommended,
    // Plugin Import
    eslintPluginImport.flatConfigs.recommended,
    eslintPluginImport.flatConfigs.typescript,
    {
      name: 'Typescript import/resolver',
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
    },
    // Unicorn
    eslintPluginUnicorn.configs.recommended,
    // Typescript
    // @ts-expect-error TSConfig is not actual flatConfig
    TSConfigs.recommendedTypeChecked,
    {
      name: 'Typescript languageOptions',
      languageOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        parserOptions: {
          ecmaVersion: 'latest',
          projectService: true,
        },
      },
    },
    // Style
    eslintPluginPrettierRecommended,
    // Rewrite rules (unicorn)
    {
      name: 'Rewrite rules (unicorn)',
      rules: {
        'unicorn/prevent-abbreviations': [
          2,
          {
            allowList: {
              utils: true,
              lib: true,
              pkg: true,
              i: true,
              j: true,
            },
          },
        ],
        'unicorn/no-null': 0,
        'unicorn/switch-case-braces': [2, 'avoid'],
        'unicorn/import-style': [2, { styles: { 'node:path': { named: true, default: false } } }],
        // To allow unicorn/no-array-for-each
        'no-continue': 0,
      },
    },
    {
      name: 'Rewrite rules (sonarjs)',
      rules: {
        'sonarjs/cognitive-complexity': 1,
        'sonarjs/no-duplicate-string': 2,
        'sonarjs/no-collapsible-if': 2,
        'sonarjs/prefer-object-literal': 2,
        // Mark warning comments as warnings
        'sonarjs/todo-tag': 1,
        'no-warning-comments': 0,
        // Prefer sonarjs rules for complexity
        complexity: 0,
        'max-lines-per-function': 0,
        'max-lines': 0,
        'max-params': 0,
        'max-statements': 0,
        'max-depth': 0,
      },
    },
    {
      name: 'Rewrite rules (import)',
      rules: {
        'import/first': 2,
        'import/named': 2,
        'import/newline-after-import': 2,
        'import/no-absolute-path': 2,
        'import/no-amd': 2,
        // Use https://www.npmjs.com/package/madge instead
        'import/no-cycle': 0,
        'import/no-duplicates': 2,
        'import/no-dynamic-require': 2,
        'import/no-extraneous-dependencies': [
          2,
          {
            devDependencies: [
              'test/**',
              'tests/**',
              'spec/**',
              '**/__tests__/**',
              '**/__mocks__/**',
              'test.{js,jsx,ts,tsx}',
              'test-*.{js,jsx,ts,tsx}',
              '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}',
              '**/*.config.{js,mjs,cjs,ts}',
              '**/*.config.*.{js,mjs,cjs,ts}',
              '**/*rc.{js,mjs,cjs,ts}',
            ],
            optionalDependencies: false,
            peerDependencies: false,
          },
        ],
        'import/no-import-module-exports': 2,
        'import/no-mutable-exports': 2,
        'import/no-named-as-default': 2,
        'import/no-named-default': 2,
        'import/no-relative-packages': 2,
        'import/no-self-import': 2,
        'import/no-useless-path-segments': [
          2,
          {
            commonjs: true,
          },
        ],
        'import/order': [
          2,
          {
            groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index', 'object', 'unknown'], 'type'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        // Adjusted for 'import/order' rule
        'sort-imports': [2, { ignoreDeclarationSort: true, allowSeparatedGroups: true }],
        'import/prefer-default-export': 0,
        'import/no-default-export': 2,
        'import/exports-last': 2,
      },
    },
    {
      name: 'Rules Adjustments',
      rules: {
        'one-var': [2, 'never'],
        'id-length': [2, { exceptions: ['a', 'b', 'i', 'j', 't'] }],
        'sort-keys': 0,
        'no-magic-numbers': [
          2,
          {
            ignoreNumericLiteralTypes: true,
            ignoreEnums: true,
            ignoreArrayIndexes: true,
            ignore: [-1, 0, 1, 2],
          },
        ],
        'no-inline-comments': 0,
        'capitalized-comments': [
          2,
          'always',
          {
            ignoreConsecutiveComments: true,
          },
        ],
        'no-ternary': 0,
        // Because it conflicts with no-useless-assignment
        'init-declarations': 0,
        // To improve readability
        'logical-assignment-operators': 0,
        // Add allow block
        'no-empty-function': [
          2,
          {
            allow: ['arrowFunctions', 'methods'],
          },
        ],
        // Add args
        '@typescript-eslint/no-unused-vars': [
          2,
          {
            args: 'none',
          },
        ],
        // Strict equality except when comparing with the null literal
        eqeqeq: [
          2,
          'always',
          {
            null: 'ignore',
          },
        ],
        // Allow ++ for loops
        'no-plusplus': [
          2,
          {
            allowForLoopAfterthoughts: true,
          },
        ],
        // Add confusingBrowserGlobals
        'no-restricted-globals': [
          2,
          ...confusingBrowserGlobals.map((property) => ({
            name: property,
            message: `Use window.${property} instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md`,
          })),
        ],
      },
    },
    {
      name: 'Naming Convention',
      rules: {
        '@typescript-eslint/naming-convention': [
          2,
          // Enforce PascalCase for classes, interfaces, types, enums, and type parameters
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          // Interfaces should not be prefixed with "I"
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Z]',
              match: false,
            },
          },
          // Enum members are UPPER_CASE
          {
            selector: 'enumMember',
            format: ['UPPER_CASE'],
          },
          // Variables, parameters and class properties are camelCase
          {
            selector: ['variable', 'parameter', 'classProperty'],
            format: ['camelCase'],
          },
          // Allow UPPER_CASE for constants
          {
            selector: 'variable',
            modifiers: ['const'],
            format: ['camelCase', 'UPPER_CASE'],
          },
          // Boolean variables must be prefixed is/has/should.
          {
            selector: 'variable',
            types: ['boolean'],
            format: ['camelCase'],
            custom: {
              regex: '^(is|has|should)[A-Z]([a-zA-Z0-9]+)$',
              match: true,
            },
          },
          // Functions and methods are camelCase
          {
            selector: ['function', 'method'],
            format: ['camelCase'],
          },
          // Allow PascalCase for React components (JSX)
          {
            selector: 'variable',
            format: ['PascalCase'],
            modifiers: ['exported'],
            filter: {
              regex: '^[A-Z]',
              match: true,
            },
          },
        ],
      },
    },
    // Disable type checking for JS files
    {
      name: 'typescript-eslint/disable-type-checked',
      files: ['**/*.{js,jsx,cjs,mjs}'],
      rules: TSConfigs.disableTypeChecked.rules,
      languageOptions: {
        parserOptions: {
          program: null,
          project: null,
          projectService: false,
        },
      },
    },
  ],
  // TSCONFIG
  {
    name: 'Typescript import/resolver',
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.eslint.json',
        },
      },
    },
  },
  {
    name: 'Typescript languageOptions',
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: './tsconfig.eslint.json',
      },
    },
  },
  // For AVA tests
  ava.configs['flat/recommended'],
  // Global ignores
  {
    ignores: ['dist/', 'bin/', 'pkg/', 'coverage/', '.tsimp/', '.idea/', '.vscode/', '.codacy/'],
  },
]);
