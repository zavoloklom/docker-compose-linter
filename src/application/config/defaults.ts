import type { Config } from '../dto/config';

const DEFAULT_CONFIG: Config = {
  rules: {},
  quiet: false,
  debug: false,
  recursive: false,
  stats: false,
  exclude: [],
  plugins: [],
};

export { DEFAULT_CONFIG };
