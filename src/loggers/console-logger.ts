import { ILogger } from '../interfaces/logger.interface';

/**
 * Console logger implementation
 */
export class ConsoleLogger implements ILogger {
  /**
   * Creates a console logger.
   * @param level Minimum level to emit ('error' | 'warn' | 'info' | 'debug'). Defaults to 'info'.
   */
  constructor(private level: string = 'info') {}

  /**
   * Logs an info-level message (when the configured level allows it).
   * @param message The message to log.
   * @param meta Additional metadata to append.
   */
  info(message: string, ...meta: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...meta);
    }
  }

  /**
   * Logs a warning-level message (when the configured level allows it).
   * @param message The message to log.
   * @param meta Additional metadata to append.
   */
  warn(message: string, ...meta: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...meta);
    }
  }

  /**
   * Logs an error-level message (when the configured level allows it).
   * @param message The message to log.
   * @param meta Additional metadata to append.
   */
  error(message: string, ...meta: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...meta);
    }
  }

  /**
   * Logs a debug-level message (when the configured level allows it).
   * @param message The message to log.
   * @param meta Additional metadata to append.
   */
  debug(message: string, ...meta: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...meta);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    return (
      levels[level as keyof typeof levels] <=
        levels[this.level as keyof typeof levels] || false
    );
  }
}
