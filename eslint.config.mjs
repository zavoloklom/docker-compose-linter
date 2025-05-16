import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import sonarjs from 'eslint-plugin-sonarjs';
import ava from 'eslint-plugin-ava';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  // ESLint Recommended and SonarJS
  {
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      js,
      sonarjs,
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
    },
    extends: ['js/recommended'],
  },

  // Plugin Import
  eslintPluginImport.flatConfigs.recommended,
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.eslint.json',
          extensions: ['.ts', '.tsx', '.d.ts'],
        },
        node: {
          extensions: ['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.d.ts'],
        },
      },
    },
  },

  // Unicorn
  eslintPluginUnicorn.configs.recommended,

  // For AVA tests
  ava.configs['flat/recommended'],

  // Style
  eslintPluginPrettierRecommended,

  // Typescript
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  // Rewrite rules
  {
    rules: {
      // NEW
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
      'unicorn/no-instanceof-array': 2,
      'unicorn/no-length-as-slice-end': 2,
      'unicorn/no-array-push-push': 2,
      'unicorn/no-array-for-each': 0,
      'unicorn/consistent-function-scoping': 0,
      'unicorn/no-null': 0,
      'unicorn/no-await-expression-member': 0,
      'unicorn/switch-case-braces': [2, 'avoid'],
      'unicorn/import-style': [2, { styles: { 'node:path': { named: true, default: false } } }],

      'import/first': 2,
      'import/no-named-default': 2,
      'import/no-webpack-loader-syntax': 2,
      'import/no-self-import': 2,
      'import/no-absolute-path': 2,
      'import/no-mutable-exports': 2,
      'import/no-amd': 2,
      'import/no-duplicates': 2,
      'import/no-named-as-default': 2,
      'import/newline-after-import': 2,
      'import/no-useless-path-segments': [
        2,
        {
          commonjs: true,
        },
      ],
      'import/no-import-module-exports': [
        2,
        {
          exceptions: [],
        },
      ],
      'import/no-dynamic-require': 2,
      'import/no-relative-packages': 2,
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
            '**/*rc.{js,mjs,cjs,ts}',
            '**/rollup.config.*.{js,mjs,cjs,ts}',
          ],
          optionalDependencies: false,
        },
      ],
      'import/no-cycle': [
        2,
        {
          maxDepth: '\u221E',
          ignoreExternal: false,
          allowUnsafeDynamicCyclicDependency: false,
          disableScc: false,
        },
      ],
      // 'import/prefer-default-export': 0,
      // 'import/no-default-export': 0,
      'import/no-unresolved': [2, { commonjs: true }],
      // 'import/extensions': 0,
      'import/order': [
        2,
        {
          groups: ['builtin', 'external', 'internal'],
        },
      ],

      'sonarjs/cognitive-complexity': 1,
      'sonarjs/no-duplicate-string': 2,
      'sonarjs/no-collapsible-if': 2,
      'sonarjs/prefer-object-literal': 2,

      '@typescript-eslint/no-var-requires': 2,
      '@typescript-eslint/no-loop-func': 2,
      '@typescript-eslint/no-shadow': 2,
      '@typescript-eslint/no-loss-of-precision': 2,
      '@typescript-eslint/no-use-before-define': [
        2,
        {
          functions: true,
          classes: true,
          variables: true,
        },
      ],
      '@typescript-eslint/no-dupe-class-members': 2,
      '@typescript-eslint/no-useless-constructor': 2,
      '@typescript-eslint/naming-convention': [
        2,
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/no-empty-function': [
        2,
        {
          allow: ['arrowFunctions', 'functions', 'methods'],
        },
      ],
      '@typescript-eslint/default-param-last': 2,
      '@typescript-eslint/no-redeclare': 2,
      // "@typescript-eslint/return-await": [
      //   "error",
      //   "in-try-catch"
      // ],
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          args: 'none',
        },
      ],
      '@typescript-eslint/triple-slash-reference': [
        2,
        {
          path: 'never',
          types: 'always',
          lib: 'always',
        },
      ],

      'no-constructor-return': 2,
      'no-lone-blocks': 2,
      'no-param-reassign': [
        2,
        {
          props: true,
          ignorePropertyModificationsFor: [
            'acc',
            'accumulator',
            'e',
            'ctx',
            'context',
            'req',
            'request',
            'res',
            'response',
            '$scope',
            'staticContext',
          ],
        },
      ],
      'no-caller': 2,
      'no-void': 2,
      'no-extra-bind': 2,
      'prefer-promise-reject-errors': 2,
      'object-shorthand': [
        2,
        'always',
        {
          ignoreConstructors: false,
          avoidQuotes: true,
        },
      ],
      eqeqeq: [
        2,
        'always',
        {
          null: 'ignore',
        },
      ],
      radix: 2,
      yoda: 2,
      'no-extend-native': 2,
      'no-labels': [
        2,
        {
          allowLoop: false,
          allowSwitch: false,
        },
      ],
      'no-buffer-constructor': 2,
      'no-multi-str': 2,
      'no-proto': 2,
      'no-alert': 2,
      'no-undef-init': 2,
      'no-useless-concat': 2,
      'unicode-bom': [2, 'never'],
      'no-restricted-exports': [
        2,
        {
          restrictedNamedExports: ['default', 'then'],
        },
      ],
      'no-new': 2,
      'prefer-template': 2,
      'symbol-description': 2,
      'no-restricted-globals': [
        2,
        {
          name: 'isFinite',
          message: 'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
        },
        {
          name: 'isNaN',
          message: 'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
        },
        'addEventListener',
        'blur',
        'close',
        'closed',
        'confirm',
        'defaultStatus',
        'defaultstatus',
        'event',
        'external',
        'find',
        'focus',
        'frameElement',
        'frames',
        'history',
        'innerHeight',
        'innerWidth',
        'length',
        'location',
        'locationbar',
        'menubar',
        'moveBy',
        'moveTo',
        'name',
        'onblur',
        'onerror',
        'onfocus',
        'onload',
        'onresize',
        'onunload',
        'open',
        'opener',
        'opera',
        'outerHeight',
        'outerWidth',
        'pageXOffset',
        'pageYOffset',
        'parent',
        'print',
        'removeEventListener',
        'resizeBy',
        'resizeTo',
        'screen',
        'screenLeft',
        'screenTop',
        'screenX',
        'screenY',
        'scroll',
        'scrollbars',
        'scrollBy',
        'scrollTo',
        'scrollX',
        'scrollY',
        'self',
        'status',
        'statusbar',
        'stop',
        'toolbar',
        'top',
      ],
      'no-path-concat': 2,
      'consistent-return': 2,
      'no-continue': 2,
      'prefer-numeric-literals': 2,
      'no-useless-return': 2,
      'prefer-object-spread': 2,
      'global-require': 2,
      'no-useless-computed-key': 2,
      'no-await-in-loop': 2,
      'no-inner-declarations': 2,
      'no-plusplus': [
        2,
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'no-lonely-if': 2,
      'no-script-url': 2,
      'no-octal-escape': 2,
      'array-callback-return': [
        2,
        {
          allowImplicit: true,
          checkForEach: false,
          allowVoid: false,
        },
      ],
      'block-scoped-var': 2,
      'prefer-exponentiation-operator': 2,
      'lines-around-directive': [
        2,
        {
          before: 'always',
          after: 'always',
        },
      ],
      'no-new-wrappers': 2,
      'no-unreachable-loop': [
        2,
        {
          ignore: [],
        },
      ],
      'guard-for-in': 2,
      'no-new-object': 2,
      'vars-on-top': 2,
      'no-restricted-properties': [
        2,
        {
          object: 'arguments',
          property: 'callee',
          message: 'arguments.callee is deprecated',
        },
        {
          object: 'global',
          property: 'isFinite',
          // eslint-disable-next-line sonarjs/no-duplicate-string
          message: 'Please use Number.isFinite instead',
        },
        {
          object: 'self',
          property: 'isFinite',
          message: 'Please use Number.isFinite instead',
        },
        {
          object: 'window',
          property: 'isFinite',
          message: 'Please use Number.isFinite instead',
        },
        {
          object: 'global',
          property: 'isNaN',
          // eslint-disable-next-line sonarjs/no-duplicate-string
          message: 'Please use Number.isNaN instead',
        },
        {
          object: 'self',
          property: 'isNaN',
          message: 'Please use Number.isNaN instead',
        },
        {
          object: 'window',
          property: 'isNaN',
          message: 'Please use Number.isNaN instead',
        },
        {
          property: '__defineGetter__',
          message: 'Please use Object.defineProperty instead.',
        },
        {
          property: '__defineSetter__',
          message: 'Please use Object.defineProperty instead.',
        },
        {
          object: 'Math',
          property: 'pow',
          message: 'Use the exponentiation operator (**) instead.',
        },
      ],
      'no-return-assign': [2, 'always'],
      'no-multi-assign': 2,
      'prefer-destructuring': [
        2,
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: true,
            object: false,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'no-underscore-dangle': [
        2,
        {
          allow: [],
          allowAfterThis: false,
          allowAfterSuper: false,
          enforceInMethodNames: true,
          allowAfterThisConstructor: false,
          allowFunctionParams: true,
          enforceInClassFields: false,
          allowInArrayDestructuring: true,
          allowInObjectDestructuring: true,
        },
      ],
      'no-eval': 2,
      'no-promise-executor-return': 2,
      'prefer-regex-literals': [
        2,
        {
          disallowRedundantWrapping: true,
        },
      ],
      'no-else-return': [
        2,
        {
          allowElseIf: false,
        },
      ],
      'no-self-compare': 2,
      'one-var': [2, 'never'],
      'grouped-accessor-pairs': 2,
      'operator-assignment': [2, 'always'],
      'no-useless-rename': [
        2,
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false,
        },
      ],
      strict: [2, 'never'],
      'no-extra-label': 2,
      'no-iterator': 2,
      'no-label-var': 2,
      'no-unneeded-ternary': [
        2,
        {
          defaultAssignment: false,
        },
      ],
      'new-cap': [
        2,
        {
          newIsCap: true,
          newIsCapExceptions: [],
          capIsNew: false,
          capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
          properties: true,
        },
      ],
      'default-case': [
        2,
        {
          commentPattern: '^no default$',
        },
      ],
      'default-case-last': 2,
      'no-bitwise': 2,
      'no-new-require': 2,
      'no-sequences': 2,

      // From old config
      'no-console': 0,
      'no-unused-vars': 0,

      'class-methods-use-this': 2,
      'max-classes-per-file': 2,
      'no-template-curly-in-string': 2,

      'arrow-body-style': 0,
      'prefer-arrow-callback': 0,
      'prefer-rest-params': 0,
    },
  },
  {
    ignores: ['node_modules/', 'dist/', '.tsimp/', 'coverage/', 'bin/', 'pkg/'],
  },
]);
