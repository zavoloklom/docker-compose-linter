import { resolve } from 'node:path';

import { Logger } from './logger';
import * as Formatters from '../formatters/index';

import type { FormatterFunction } from '../formatters/formatter.types';

const importFormatter = async (modulePath: string): Promise<FormatterFunction> => {
  try {
    const module = (await import(modulePath)) as { default?: unknown; [k: string]: unknown };
    return (module.default ?? Object.values(module)[0]) as FormatterFunction;
  } catch {
    throw new Error(`Module at ${modulePath} does not export a formatter.`);
  }
};

const loadFormatter = async (formatterName: string): Promise<FormatterFunction> => {
  const logger = Logger.init();

  if (formatterName.startsWith('.')) {
    const fullPath = resolve(formatterName);
    const formatterModule = await importFormatter(fullPath);
    logger.debug('UTIL', `Using formatter: ${fullPath}`);
    return formatterModule;
  }

  if (formatterName.includes('dclint-formatter-')) {
    const formatterModule = await importFormatter(formatterName);
    logger.debug('UTIL', `Using formatter: ${formatterName}`);
    return formatterModule;
  }

  const key = `${formatterName}Formatter` as keyof typeof Formatters;
  if (key in Formatters) {
    logger.debug('UTIL', `Using built-in formatter: ${formatterName}`);
    // eslint-disable-next-line import/namespace
    return Formatters[key];
  }

  logger.debug('UTIL', `Unknown formatter: ${formatterName}. Using default - stylish.`);
  return Formatters.stylishFormatter;
};

export { loadFormatter };
