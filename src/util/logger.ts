import chalk from 'chalk';

// Exported constants for log sources
export const LOG_SOURCE = {
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
    if (debug !== undefined) {
      this.debugMode = debug;
    }
  }

  public static init(debug?: boolean): void {
    if (!Logger.instance) {
      Logger.instance = new Logger(debug);
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      throw new Error('Logger is not initialized. Call Logger.init() first.');
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
        return chalk.blue('[DEBUG]');
      case 'INFO':
        return chalk.green('[INFO]');
      case 'WARN':
        return chalk.yellow('[WARN]');
      case 'ERROR':
        return chalk.red('[ERROR]');
      default:
        return `[${level}]`;
    }
  }

  public debug(source: LogSource, ...args: unknown[]): void {
    if (this.debugMode) {
      const message = Logger.formatMessage('DEBUG', source);
      console.debug(message, ...args);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public info(...args: unknown[]): void {
    const message = Logger.formatMessage('INFO');
    console.info(message, ...args);
  }

  // eslint-disable-next-line class-methods-use-this
  public warn(...args: unknown[]): void {
    const message = Logger.formatMessage('WARN');
    console.warn(message, ...args);
  }

  // eslint-disable-next-line class-methods-use-this
  public error(...args: unknown[]): void {
    const message = Logger.formatMessage('ERROR');
    console.error(message, ...args);
  }
}

export { Logger };
