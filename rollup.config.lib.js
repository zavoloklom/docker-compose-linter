import baseConfig from './rollup.base.config.js';
import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const dependencies = Object.keys(packageJson.dependencies || {});

export default {
  ...baseConfig('dist', true, true),
  input: 'src/index.ts',
  output: [
    { dir: 'dist', format: 'cjs', entryFileNames: '[name].cjs', exports: 'auto' },
    { dir: 'dist', format: 'esm', entryFileNames: '[name].esm.js', inlineDynamicImports: true },
  ],
  external: dependencies,
};
