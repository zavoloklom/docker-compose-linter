module.exports = {
  'root': true,
  'env': {
    'node': true,
    'es2024': true,
  },
  'globals': {
    'process': true,
    'import': true,
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': './tsconfig.eslint.json',
    'sourceType': 'module',
    'ecmaVersion': 'latest',
  },
  'extends': [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:sonarjs/recommended-legacy',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/typescript',
    'plugin:ava/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
  ],
  'plugins': [
    '@typescript-eslint',
    'sonarjs',
    'import',
    '@stylistic',
    'prettier',
  ],
  'settings': {
    'import/resolver': {
      'typescript': {
        'alwaysTryTypes': true,
        'project': './tsconfig.eslint.json',
        'extensions': ['.ts', '.tsx', '.d.ts'],
      },
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
  },
  'rules': {
    'no-unused-vars': 0,
    'no-console': 0,
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        'args': 'none',
      },
    ],
    'prettier/prettier': 2,
    '@stylistic/indent': ['error', 2],
    '@stylistic/indent-binary-ops': ['error', 2],
    'arrow-body-style': 0,
    'prefer-arrow-callback': 0,
    'prefer-rest-params': 0,
    'sonarjs/cognitive-complexity': 1,
    '@typescript-eslint/triple-slash-reference': [
      2,
      {
        'path': 'never',
        'types': 'always',
        'lib': 'always',
      },
    ],
    '@typescript-eslint/ban-ts-comment': 0,
    'import/prefer-default-export': 0,
    'import/no-default-export': 0,
    'import/no-unresolved': [2, { 'commonjs': true }],
    'import/extensions': 0,
    'import/order': [
      2,
      {
        'groups': [
          'builtin',
          'external',
          'internal',
        ],
      },
    ],
    'no-restricted-syntax': 0,
    'unicorn/no-array-for-each': 0,
    'unicorn/consistent-function-scoping': 0,
    'unicorn/no-null': 0,
    'unicorn/no-await-expression-member': 0,
    'unicorn/switch-case-braces': [2, 'avoid'],
    'unicorn/import-style': [2, {"styles": {"node:path": {"named": true, "default": false}}}]
  },
  'ignorePatterns': ['node_modules', 'dist', '.tsimp', 'coverage', 'bin', 'rollup*config*js'],
};
