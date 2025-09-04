import { Config } from '../dto/config';

type LoadedConfig = { config: Config; filepath: string };

interface ConfigLoader {
  /**
   * Returns Config and it's location
   *
   * @param path Path to config file
   */
  load(path?: string): LoadedConfig | null;
}

export { ConfigLoader, LoadedConfig };
