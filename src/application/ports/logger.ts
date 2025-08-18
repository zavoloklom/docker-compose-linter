enum LogSource {
  CORE = 'CORE',
  CONFIG = 'CONFIG',
  CLI = 'CLI',
  UTIL = 'UTIL',
  RULE = 'RULE',
}

interface Logger {
  debug(source: LogSource, ...message: string[]): void;
  info(...message: string[]): void;
  warn(...message: string[]): void;
  error(...message: string[]): void;
}

export { type Logger, LogSource };
