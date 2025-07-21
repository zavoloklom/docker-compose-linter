/* eslint-disable no-console */
import pc from 'picocolors';

// Exported constants for log sources
const LOG_SOURCE = {
  LINTER: 'LINTER',
  CONFIG: 'CONFIG',
  CLI: 'CLI',
  UTIL: 'UTIL',
  RULE: 'RULE',
} as const;

type LogSource = (typeof LOG_SOURCE)[keyof typeof LOG_SOURCE];

class Logger {
  private static instance: Logger;

  private readonly debugMode: boolean = false;

  private constructor(debug?: boolean) {
    this.debugMode = debug ?? false;
  }

  public static init(debug?: boolean): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(debug);
    }
    return Logger.instance;
  }

  private static formatMessage(level: string, source?: LogSource): string {
    const coloredLevel = Logger.getColoredLevel(level);
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

  public debug(source: LogSource, ...options: unknown[]): void {
    if (this.debugMode) {
      const message = Logger.formatMessage('DEBUG', source);
      console.debug(message, ...options);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public info(...options: unknown[]): void {
    const message = Logger.formatMessage('INFO');
    console.info(message, ...options);
  }

  // eslint-disable-next-line class-methods-use-this
  public warn(...options: unknown[]): void {
    const message = Logger.formatMessage('WARN');
    console.warn(message, ...options);
  }

  // eslint-disable-next-line class-methods-use-this
  public error(...options: unknown[]): void {
    const message = Logger.formatMessage('ERROR');
    console.error(message, ...options);
  }
}

export { LOG_SOURCE, Logger };
