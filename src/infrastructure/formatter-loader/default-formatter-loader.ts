import { resolve } from 'node:path';

import { LogSource, type Logger } from '../../application/ports/logger';
import * as Formatters from '../../plugins/formatters/index';

import type { FormatterLoader } from '../../application/ports/formatter-loader';
import type { FormatterFunction } from '../../domain/models/formatter';

class DefaultFormatterLoader implements FormatterLoader {
  readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async load(nameOrPath: string): Promise<FormatterFunction> {
    if (nameOrPath.startsWith('.')) {
      const fullPath = resolve(nameOrPath);
      const formatterModule = await this.importFormatter(fullPath);

      this.logger.debug(LogSource.UTIL, `Using formatter: ${fullPath}`);

      return formatterModule;
    }

    if (nameOrPath.includes('dclint-formatter-')) {
      const formatterModule = await this.importFormatter(nameOrPath);
      this.logger.debug(LogSource.UTIL, `Using formatter: ${nameOrPath}`);
      return formatterModule;
    }

    const key = `${nameOrPath}Formatter` as keyof typeof Formatters;
    if (key in Formatters) {
      this.logger.debug(LogSource.UTIL, `Using built-in formatter: ${nameOrPath}`);
      // eslint-disable-next-line import/namespace
      return Formatters[key];
    }

    this.logger.debug(LogSource.UTIL, `Unknown formatter: ${nameOrPath}. Using default - stylish.`);
    return Formatters.stylishFormatter;
  }

  // eslint-disable-next-line class-methods-use-this
  private importFormatter = async (modulePath: string): Promise<FormatterFunction> => {
    try {
      const module = (await import(modulePath)) as { default?: unknown; [k: string]: unknown };
      return (module.default ?? Object.values(module)[0]) as FormatterFunction;
    } catch {
      throw new Error(`Module at ${modulePath} does not export a formatter.`);
    }
  };
}

export { DefaultFormatterLoader };
