import { resolve } from 'node:path';

import { Logger } from './logger';
import Formatters from '../formatters/index';

import type { LintResult } from '../linter/linter.types';

type FormatterFunction = (results: LintResult[]) => string;

async function importFormatter(modulePath: string): Promise<FormatterFunction> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const Formatter = (await import(modulePath)).default;
    return Formatter as FormatterFunction;
  } catch {
    throw new Error(`Module at ${modulePath} does not export a default formatter.`);
  }
}

export async function loadFormatter(formatterName: string): Promise<FormatterFunction> {
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

  const formatterFunction = Formatters[`${formatterName}Formatter` as keyof typeof Formatters];
  if (formatterFunction) {
    logger.debug('UTIL', `Using built-in formatter: ${formatterName}`);
    return formatterFunction as FormatterFunction;
  }

  logger.warn(`Unknown formatter: ${formatterName}. Using default - stylish.`);
  return Formatters.stylishFormatter;
}
