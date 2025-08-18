import { cosmiconfigSync } from 'cosmiconfig';
import { existsSync } from 'node:fs';

import { mergeWithCliOptions } from '../../application/config/merge-with-cli-options';
import { mergeWithDefaults } from '../../application/config/merge-with-defaults';
import { LogSource, type Logger } from '../../application/ports/logger';

import type { CliOptions } from '../../application/dto/cli-options';
import type { Config } from '../../application/dto/config';
import type { ConfigLoader } from '../../application/ports/config-loader';
import type { ConfigValidator } from '../../application/ports/config-validator';

class CosmicConfigLoader implements ConfigLoader {
  private config!: Config;

  private validator: ConfigValidator;
  private logger: Logger;

  constructor(validator: ConfigValidator, logger: Logger) {
    this.logger = logger;
    this.validator = validator;
  }

  static init(validator: ConfigValidator, logger: Logger): CosmicConfigLoader {
    return new CosmicConfigLoader(validator, logger);
  }

  load(path?: string): this {
    const explorer = cosmiconfigSync('dclint');

    if (path && !existsSync(path)) {
      this.logger.debug(LogSource.CONFIG, `Configuration file not found at custom path: ${path}`);
      throw new Error(`File or directory not found: ${path}`);
    }

    const result = path ? explorer.load(path) : explorer.search();

    if (result && result.config) {
      this.logger.debug(LogSource.CONFIG, `Configuration load from ${result.filepath}`);
      this.config = result.config as unknown as Config;
      return this;
    }

    this.logger.debug(LogSource.CONFIG, 'Configuration file not found');

    return this;
  }

  withDefaults(): this {
    this.logger.debug(LogSource.CONFIG, 'Merging with defaults');
    this.config = mergeWithDefaults(this.config);
    return this;
  }

  mergeCliOptions(options: CliOptions): this {
    this.logger.debug(LogSource.CONFIG, 'Merging with CLI options');
    this.config = mergeWithCliOptions(this.config, options);
    return this;
  }

  validate(): this {
    this.logger.debug(LogSource.CONFIG, 'Starting config validation');

    const errors = this.validator.validate(this.config);

    if (errors.length > 0) {
      for (const error of errors) {
        this.logger.debug(LogSource.CONFIG, `Validation error: ${error.message}`);
      }
      throw new Error('Config validation failed');
    }

    this.logger.debug(LogSource.CONFIG, 'Validation complete');
    return this;
  }

  get(): Config {
    return this.config;
  }
}

export { CosmicConfigLoader };
