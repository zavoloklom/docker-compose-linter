import baseConfig from './rollup.base.config.js';

export default {
  ...baseConfig('pkg', false, false),
  input: 'src/cli/cli.ts',
  output: {
    file: 'pkg/dclint.cjs',
    format: 'cjs',
    inlineDynamicImports: true,
    exports: 'auto',
  },
  context: 'globalThis',
};
