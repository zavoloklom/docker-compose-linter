import baseConfig from './rollup.config.base.js';

// eslint-disable-next-line import/no-default-export
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
