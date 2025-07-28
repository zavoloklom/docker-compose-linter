import config from '@zavoloklom/eslint-config';
import { defineConfig } from 'eslint/config';
import ava from 'eslint-plugin-ava';

// eslint-disable-next-line import/no-default-export
export default defineConfig([
  ...config,
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
