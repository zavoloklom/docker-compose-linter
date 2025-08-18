/* eslint-disable no-console */
import pc from 'picocolors';

import { LogSource, type Logger } from '../../application/ports/logger';

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

  private static messagePrefix(level: string, source?: LogSource): string {
    const coloredLevel = ConsoleLogger.getColoredLevel(level);
    return source ? `${coloredLevel} [${source}]` : coloredLevel;
  }

  private static getColoredLevel(level: string): string {
    switch (level) {
      case 'DEBUG':
        return pc.blue('[DEBUG]');
      case 'INFO':
        return pc.green('[INFO]');
      case 'WARN':
        return pc.yellow('[WARN]');
      case 'ERROR':
        return pc.red('[ERROR]');
      default:
        return `[${level}]`;
    }
  }

  public debug(source: LogSource, ...message: string[]): void {
    if (this.debugMode) {
      const prefix = ConsoleLogger.messagePrefix('DEBUG', source);
      console.debug(prefix, ...message);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public info(...message: string[]): void {
    const prefix = ConsoleLogger.messagePrefix('INFO');
    console.info(prefix, ...message);
  }

  // eslint-disable-next-line class-methods-use-this
  public warn(...message: string[]): void {
    const prefix = ConsoleLogger.messagePrefix('WARN');
    console.warn(prefix, ...message);
  }

  // eslint-disable-next-line class-methods-use-this
  public error(...message: string[]): void {
    const prefix = ConsoleLogger.messagePrefix('ERROR');
    console.error(prefix, ...message);
  }
}

export { ConsoleLogger };
