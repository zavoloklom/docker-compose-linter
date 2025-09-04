enum LogSource {
  CORE = 'CORE', // REMOVE
  CONFIG = 'CONFIG',
  CLI = 'CLI',
  UTIL = 'UTIL',
  RULES = 'RULES',
  FS = 'FS',
  COMPOSE = 'COMPOSE',
}

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface Logger {
  debug(source: LogSource, message: string, details?: Record<string, unknown>): void;
  info(source: LogSource, message: string, details?: Record<string, unknown>): void;
  warn(source: LogSource, message: string, details?: Record<string, unknown>): void;
  error(source: LogSource, message: string, details?: Record<string, unknown>): void;
}

export { LogLevel, LogSource, type Logger };
