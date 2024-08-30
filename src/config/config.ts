import { cosmiconfig } from 'cosmiconfig';
import { Ajv } from 'ajv';
import type { Config } from './config.types.js';
import { Logger, LOG_SOURCE } from '../util/logger.js';
import { loadSchema } from '../util/load-schema.js';

function getDefaultConfig(): Config {
    return {
        rules: {},
        quiet: false,
        debug: false,
        exclude: [],
    };
}

async function validateConfig(config: Config): Promise<Config> {
    const logger = Logger.getInstance();
    logger.debug(LOG_SOURCE.CONFIG, 'Starting config validation');

    const ajv = new Ajv();
    const schema = loadSchema('cli-config');
    const validate = ajv.compile(schema);

    if (!validate(config)) {
        logger.error('Invalid configuration:', validate.errors);
        process.exit(1);
    }
    logger.debug(LOG_SOURCE.CONFIG, 'Validation complete');
    return config;
}

async function loadConfig(configPath?: string): Promise<Config> {
    const logger = Logger.getInstance();
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
