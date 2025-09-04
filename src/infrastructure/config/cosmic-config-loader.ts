import { type PublicExplorerSync, cosmiconfigSync } from 'cosmiconfig';
import { existsSync } from 'node:fs';

import type { Config } from '../../application/dto/config';
import type { ConfigLoader, LoadedConfig } from '../../application/ports/config-loader';

class CosmicConfigLoader implements ConfigLoader {
  private explorer: PublicExplorerSync;

  constructor() {
    this.explorer = cosmiconfigSync('dclint');
  }

  load(path?: string): LoadedConfig | null {
    if (path && !existsSync(path)) {
      throw new Error('File or directory not found');
    }

    const result = path ? this.explorer.load(path) : this.explorer.search();

    if (result && result.config) {
      return {
        config: result.config as unknown as Config,
        filepath: result.filepath,
      };
    }

    return null;
  }
}

export { CosmicConfigLoader };
