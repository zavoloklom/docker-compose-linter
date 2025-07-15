import { Ajv } from 'ajv';
import { cosmiconfigSync } from 'cosmiconfig';
import { existsSync } from 'node:fs';

import { ConfigValidationError } from '../errors/config-validation-error';
import { FileNotFoundError } from '../errors/file-not-found-error';
import rules from '../rules/index';
import { LOG_SOURCE, Logger } from '../util/logger';
import { schemaLoader } from '../util/schema-loader';

import type { Config } from './config.types';
import type { CLIConfig } from '../cli/cli.types';

const DEFAULT_CONFIG: Config = {
  debug: false,
  exclude: [],
  rules: {},
  quiet: false,
};

class ConfigLoader {
  private config!: Config;

  private logger: Logger;

  private constructor(debug?: boolean) {
    this.logger = Logger.init(debug);
  }

  static init(debug?: boolean): ConfigLoader {
    return new ConfigLoader(debug);
  }

  load(path?: string): this {
    const explorer = cosmiconfigSync('dclint');

    if (path && !existsSync(path)) {
      this.logger.debug(LOG_SOURCE.CONFIG, `Configuration file not found at custom path: ${path}`);
      throw new FileNotFoundError(path);
    }

    const result = path ? explorer.load(path) : explorer.search();

    if (result && result.config) {
      this.logger.debug(LOG_SOURCE.CONFIG, `Configuration load from ${result.filepath}.`);
      this.config = result.config as unknown as Config;
      return this;
    }

    this.logger.debug(LOG_SOURCE.CONFIG, 'Configuration file not found. Using default.');
    this.config = DEFAULT_CONFIG;

    return this;
  }

  validate(): this {
    this.logger.debug(LOG_SOURCE.CONFIG, 'Starting config validation');

    const ajv = new Ajv();
    const schema = schemaLoader('linter-config');
    const validate = ajv.compile(schema);

    if (!validate(this.config)) {
      throw new ConfigValidationError(validate.errors);
    }

    // Validate rules names
    const allowedRuleNames = new Set(Object.values(rules).map((ruleClass) => ruleClass.name));

    for (const ruleName of Object.keys(this.config.rules)) {
      // @ts-expect-error
      if (!allowedRuleNames.has(ruleName)) {
        throw new ConfigValidationError([
          {
            instancePath: `/rules/${ruleName}`,
            message: `Unknown rule name "${ruleName}"`,
            schemaPath: '#/rules',
            keyword: 'custom',
            params: {},
          },
        ]);
      }
    }

    this.logger.debug(LOG_SOURCE.CONFIG, 'Validation complete');
    return this;
  }

  mergeCli(cli: CLIConfig): this {
    if (cli.quiet) this.config.quiet = true;
    if (cli.debug) this.config.debug = true;
    if (cli.exclude.length > 0) this.config.exclude = cli.exclude;

    if (cli.disableRule.length > 0) {
      this.config.rules = this.config.rules || {};
      for (const ruleName of cli.disableRule) {
        this.config.rules[ruleName] = 0;
      }
    }

    return this;
  }

  withDefaults(): this {
    this.config = {
      ...structuredClone(DEFAULT_CONFIG),
      ...this.config,
    };
    return this;
  }

  get(): Config {
    return this.config;
  }
}

export { ConfigLoader };
