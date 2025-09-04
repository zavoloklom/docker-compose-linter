/* eslint-disable no-console */
import pc from 'picocolors';

import { LogLevel, LogSource, type Logger } from '../../application/ports/logger';

// ---- colors
const COLOR: Record<LogLevel, (s: string) => string> = {
  [LogLevel.DEBUG]: pc.blue,
  [LogLevel.INFO]: pc.green,
  [LogLevel.WARN]: pc.yellow,
  [LogLevel.ERROR]: pc.red,
};

// ---- LEVEL prefix: calculate length from raw "[LEVEL]" and pad with spaces after closing bracket
const RAW_LEVELS: LogLevel[] = Object.values(LogLevel);
const MAX_LEVEL_PREFIX_LENGTH = Math.max(...RAW_LEVELS.map((level) => `[${level}]`.length)) + 1;

const LEVEL_PREFIX: Record<LogLevel, string> = {} as Record<LogLevel, string>;
for (const level of RAW_LEVELS) {
  const raw = `[${level}]`;
  const pad = ' '.repeat(MAX_LEVEL_PREFIX_LENGTH - raw.length);
  LEVEL_PREFIX[level] = COLOR[level](raw) + pad; // Color only the raw part, keep spaces plain
}

// ---- SOURCE prefix: calculate length from raw "[SOURCE]" and pad with spaces after closing bracket
const RAW_SOURCES: LogSource[] = Object.values(LogSource);
const MAX_SOURCE_PREFIX_LENGTH = 6;

const SOURCE_PREFIX: Record<LogSource, string> = {} as Record<LogSource, string>;
for (const source of RAW_SOURCES) {
  const raw = `[${source}]`;
  SOURCE_PREFIX[source] = raw.padEnd(MAX_SOURCE_PREFIX_LENGTH, ' ');
}

class ConsoleLogger implements Logger {
  private static INSTANCE: ConsoleLogger;

  private readonly debugMode: boolean = false;

  private constructor(debug?: boolean) {
    this.debugMode = debug ?? false;
  }

  public static init(debug?: boolean): ConsoleLogger {
    if (!ConsoleLogger.INSTANCE) {
      ConsoleLogger.INSTANCE = new ConsoleLogger(debug);
    }
    return ConsoleLogger.INSTANCE;
  }

  private static messagePrefix(level: string, source: LogSource): string {
    const levelNormalized =
      (LEVEL_PREFIX as Record<string, string>)[level] ?? `[${level}]`.padEnd(MAX_LEVEL_PREFIX_LENGTH, ' ');

    const sourceNormalized =
      (SOURCE_PREFIX as Record<string, string>)[source] ?? `[${source}]`.padEnd(MAX_SOURCE_PREFIX_LENGTH, ' ');

    return `${levelNormalized}${sourceNormalized}`;
  }

  public static prepareMessage(
    level: LogLevel,
    source: LogSource,
    message: string,
    details: Record<string, unknown> = {},
  ) {
    const prefix = ConsoleLogger.messagePrefix(level, source);
    const detailsString = Object.entries(details)
      .map(([key, value]) => {
        const snakeCaseKey = key.replaceAll(/(?<lower>[a-z0-9])(?<upper>[A-Z])/gu, '$<lower>_$<upper>').toLowerCase();
        const stringifyValue = JSON.stringify(value);
        return `${snakeCaseKey}=${stringifyValue}`;
      })
      .join(' ');

    // TODO: consider msg for main message and if it is in details -> rename
    return [new Date().toISOString(), prefix, `${message}${detailsString.length > 0 ? ';' : ''}`, detailsString];
  }

  // eslint-disable-next-line class-methods-use-this
  private log(level: LogLevel, source: LogSource, message: string, details: Record<string, unknown>): void {
    const messageArray = ConsoleLogger.prepareMessage(level, source, message, details);
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(...messageArray);
        break;
      case LogLevel.INFO:
        console.info(...messageArray);
        break;
      case LogLevel.WARN:
        console.warn(...messageArray);
        break;
      case LogLevel.ERROR:
        console.error(...messageArray);
        break;
      default:
    }
  }

  public debug(source: LogSource, message: string, details: Record<string, unknown> = {}): void {
    if (this.debugMode) {
      this.log(LogLevel.DEBUG, source, message, details);
    }
  }

  public info(source: LogSource, message: string, details: Record<string, unknown> = {}): void {
    this.log(LogLevel.INFO, source, message, details);
  }

  public warn(source: LogSource, message: string, details: Record<string, unknown> = {}): void {
    this.log(LogLevel.WARN, source, message, details);
  }

  public error(source: LogSource, message: string, details: Record<string, unknown> = {}): void {
    this.log(LogLevel.ERROR, source, message, details);
  }
}

export { ConsoleLogger };
