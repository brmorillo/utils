import { ILogger } from '../interfaces/logger.interface';

/**
 * Pino logger implementation
 */
export class PinoLogger implements ILogger {
  private logger: any;

  /**
   * Creates a pino-backed logger. Falls back to a console logger when pino is
   * not installed.
   * @param options Logger options.
   * @param options.level Minimum level to emit (default 'info').
   * @param options.prettyPrint When true, formats output via pino-pretty.
   */
  constructor(options: { level?: string; prettyPrint?: boolean } = {}) {
    try {
      // Dynamic import to avoid requiring pino as a direct dependency
      const pino = require('pino');

      this.logger = pino({
        level: options.level || 'info',
        transport: options.prettyPrint
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
              },
            }
          : undefined,
      });
    } catch (error) {
      // Fallback to console if pino is not available
      this.logger = {
        info: (meta: any, message: string) =>
          console.info(`[INFO] ${message}`, meta),
        warn: (meta: any, message: string) =>
          console.warn(`[WARN] ${message}`, meta),
        error: (meta: any, message: string) =>
          console.error(`[ERROR] ${message}`, meta),
        debug: (meta: any, message: string) =>
          console.debug(`[DEBUG] ${message}`, meta),
      };
    }
  }

  /**
   * Logs an info-level message.
   * @param message The message to log.
   * @param meta Additional metadata, attached under a `meta` field.
   */
  info(message: string, ...meta: any[]): void {
    this.logger.info({ meta }, message);
  }

  /**
   * Logs a warning-level message.
   * @param message The message to log.
   * @param meta Additional metadata, attached under a `meta` field.
   */
  warn(message: string, ...meta: any[]): void {
    this.logger.warn({ meta }, message);
  }

  /**
   * Logs an error-level message.
   * @param message The message to log.
   * @param meta Additional metadata, attached under a `meta` field.
   */
  error(message: string, ...meta: any[]): void {
    this.logger.error({ meta }, message);
  }

  /**
   * Logs a debug-level message.
   * @param message The message to log.
   * @param meta Additional metadata, attached under a `meta` field.
   */
  debug(message: string, ...meta: any[]): void {
    this.logger.debug({ meta }, message);
  }
}
