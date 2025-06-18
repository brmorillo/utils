import { ILogger } from '../interfaces/logger.interface';

/**
 * Console logger implementation
 */
export class ConsoleLogger implements ILogger {
  constructor(private level: string = 'info') {}

  info(message: string, ...meta: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...meta);
    }
  }

  warn(message: string, ...meta: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...meta);
    }
  }

  error(message: string, ...meta: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...meta);
    }
  }

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
