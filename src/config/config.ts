import { cosmiconfig } from 'cosmiconfig';
import { Ajv } from 'ajv';
import type { Config } from './config.types';
import { Logger, LOG_SOURCE } from '../util/logger';
import { schemaLoader } from '../util/schema-loader';
import { ConfigValidationError } from '../errors/config-validation-error';

function getDefaultConfig(): Config {
  return {
    rules: {},
    quiet: false,
    debug: false,
    exclude: [],
  };
}

async function validateConfig(config: Config): Promise<Config> {
  const logger = Logger.init();
  logger.debug(LOG_SOURCE.CONFIG, 'Starting config validation');

  const ajv = new Ajv();
  const schema = schemaLoader('linter-config');
  const validate = ajv.compile(schema);

  if (!validate(config)) {
    logger.error('Invalid configuration:', validate.errors);
    throw new ConfigValidationError(validate.errors);
  }
  logger.debug(LOG_SOURCE.CONFIG, 'Validation complete');
  return config;
}

async function loadConfig(configPath?: string): Promise<Config> {
  const logger = Logger.init();
  const explorer = cosmiconfig('dclint');

  const result = configPath ? await explorer.load(configPath) : await explorer.search();

  if (result && result.config) {
    logger.debug(LOG_SOURCE.CONFIG, `Configuration load from ${result.filepath}.`);
    const config = result.config as unknown as Config;
    return validateConfig(config);
  }
  logger.debug(LOG_SOURCE.CONFIG, 'Configuration file not found. Using default');
  return getDefaultConfig();
}

export { loadConfig };
