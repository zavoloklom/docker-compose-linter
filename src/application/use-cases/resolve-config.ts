import { mergeWithCliOptions } from '../config/merge-with-cli-options';
import { mergeWithDefaults } from '../config/merge-with-defaults';
import { ApplicationError, ApplicationErrorCode } from '../errors/application-error';
import { LogSource, type Logger } from '../ports/logger';

import type { CliOptions } from '../dto/cli-options';
import type { Config } from '../dto/config';
import type { ConfigLoader, LoadedConfig } from '../ports/config-loader';
import type { ConfigValidator } from '../ports/config-validator';

type ResolveConfigUseCaseDeps = {
  loader: ConfigLoader;
  validator: ConfigValidator;
  logger: Logger;
  // Dependency injection for testability:
  mergeWithDefaultsImpl?: (base: Config) => Config;
  mergeWithCliOptionsImpl?: (base: Config, cli: CliOptions) => Config;
};

type ResolveConfigUseCase = (cliOptions: CliOptions) => Config;

const resolveConfigUseCase = (cliOptions: CliOptions, deps: ResolveConfigUseCaseDeps): Config => {
  const { loader, validator, logger, mergeWithDefaultsImpl, mergeWithCliOptionsImpl } = deps;

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const mergeWithDefaultsFn = mergeWithDefaultsImpl ?? mergeWithDefaults;
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const mergeWithCliOptionsFn = mergeWithCliOptionsImpl ?? mergeWithCliOptions;

  let loaded: LoadedConfig | null;
  try {
    loaded = loader.load(cliOptions.config);
    if (loaded === null) {
      logger.debug(LogSource.CONFIG, 'Configuration file not found');
    } else {
      logger.debug(LogSource.CONFIG, 'Configuration loaded', {
        path: loaded.filepath,
      });
    }
  } catch (error) {
    throw new ApplicationError('Failed to load configuration', ApplicationErrorCode.E_CONFIG_LOAD, error, {
      path: cliOptions?.config,
    });
  }

  const config = loaded ? loaded.config : ({} as Config);
  const withDefaults = mergeWithDefaultsFn(config);
  logger.debug(LogSource.CONFIG, 'Configuration merged with defaults');

  const withCli = mergeWithCliOptionsFn(withDefaults, cliOptions);
  logger.debug(LogSource.CONFIG, 'Configuration merged with CLI options');

  if (!validator.isValid(withCli)) {
    const errors = validator.validate(withCli);
    throw new ApplicationError('Invalid configuration', ApplicationErrorCode.E_CONFIG_VALIDATION, null, {
      path: loaded?.filepath,
      validationErrors: errors,
      validationErrorsCount: errors.length,
    });
  }
  logger.debug(LogSource.CONFIG, 'Configuration is valid');

  return withCli;
};

const makeResolveConfigUseCase = (deps: ResolveConfigUseCaseDeps): ResolveConfigUseCase => {
  return (cliOptions) => resolveConfigUseCase(cliOptions, deps);
};

export { makeResolveConfigUseCase, type ResolveConfigUseCaseDeps, type ResolveConfigUseCase };
