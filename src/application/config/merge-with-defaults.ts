import { DEFAULT_CONFIG } from './defaults';
import { Config } from '../dto/config';

const mergeWithDefaults = (config: Partial<Config> = {}): Config => {
  return {
    ...structuredClone(DEFAULT_CONFIG),
    ...structuredClone(config),
  };
};

export { mergeWithDefaults };
