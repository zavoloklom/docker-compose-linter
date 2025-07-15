import fs from 'node:fs';

import baseConfig from './rollup.config.base.js';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const dependencies = Object.keys(packageJson.dependencies || {});

export default {
  ...baseConfig('bin', false, false),
  input: 'src/cli/cli.ts',
  output: {
    file: 'bin/dclint.cjs',
    format: 'cjs',
    inlineDynamicImports: true,
    exports: 'auto',
  },
  context: 'globalThis',
  external: dependencies,
};
