import path from 'node:path';
import type { LintResult } from '../linter/linter.types.js';
import { Logger } from './logger.js';

type FormatterFunction = (results: LintResult[]) => string;

async function importFormatter(modulePath: string): Promise<FormatterFunction> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const Formatter = (await import(modulePath)).default;
        return Formatter as FormatterFunction;
    } catch (error) {
        throw new Error(`Module at ${modulePath} does not export a default formatter.`);
    }
}

export async function loadFormatter(formatterName: string): Promise<FormatterFunction> {
    const logger = Logger.getInstance();

    if (formatterName.startsWith('.')) {
        const fullPath = path.resolve(formatterName);
        const formatterModule = await importFormatter(fullPath);
        logger.debug('UTIL', `Using formatter: ${fullPath}`);
        return formatterModule;
    }

    if (formatterName.includes('dclint-formatter-')) {
        const formatterModule = await importFormatter(formatterName);
        logger.debug('UTIL', `Using formatter: ${formatterName}`);
        return formatterModule;
    }

    const builtinFormatters: Record<string, () => Promise<FormatterFunction>> = {
        json: async () => (await import('../formatters/json.js')).default as FormatterFunction,
        compact: async () => (await import('../formatters/compact.js')).default as FormatterFunction,
        stylish: async () => (await import('../formatters/stylish.js')).default as FormatterFunction,
        junit: async () => (await import('../formatters/junit.js')).default as FormatterFunction,
        codeclimate: async () => (await import('../formatters/codeclimate.js')).default as FormatterFunction,
    };

    let formatterLoader = builtinFormatters[formatterName];
    if (!formatterLoader) {
        logger.warn(`Unknown formatter: ${formatterName}. Using default - stylish.`);
        formatterLoader = builtinFormatters.stylish;
    }

    logger.debug('UTIL', `Load formatter: ${formatterName}`);

    return formatterLoader();
}
