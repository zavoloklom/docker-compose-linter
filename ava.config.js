// eslint-disable-next-line import/no-default-export
export default {
  files: ['tests/**/*.spec.ts'],
  extensions: {
    ts: 'module',
    mjs: true,
    cjs: true,
    js: true,
  },
  nodeArguments: ['--import=tsimp/import', '--no-warnings'],
  environmentVariables: {
    TSIMP_DIAG: 'ignore',
  },
  timeout: '2m',
  serial: true,
  concurrency: 1,
};
