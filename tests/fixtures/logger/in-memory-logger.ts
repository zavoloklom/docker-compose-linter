import type { LogSource, Logger } from '../../../src/application/ports/logger';

type InMemoryLoggerMessage = {
  source?: LogSource;
  message: string[];
  timestamp: number;
};

class InMemoryLogger implements Logger {
  debugMessages: InMemoryLoggerMessage[] = [];
  errorMessages: InMemoryLoggerMessage[] = [];
  warnMessages: InMemoryLoggerMessage[] = [];
  infoMessages: InMemoryLoggerMessage[] = [];

  debug(source: LogSource, ...message: string[]): void {
    this.debugMessages.push({
      source,
      message,
      timestamp: Date.now(),
    });
  }

  error(...message: string[]): void {
    this.errorMessages.push({
      message,
      timestamp: Date.now(),
    });
  }

  warn(...message: string[]): void {
    this.warnMessages.push({
      message,
      timestamp: Date.now(),
    });
  }

  info(...message: string[]): void {
    this.infoMessages.push({
      message,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.debugMessages = [];
    this.errorMessages = [];
    this.warnMessages = [];
    this.infoMessages = [];
  }
}

export { InMemoryLogger, InMemoryLoggerMessage };
