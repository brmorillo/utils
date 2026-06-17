import { ILogger } from '../interfaces/logger.interface';

/**
 * Winston logger implementation
 */
export class WinstonLogger implements ILogger {
  private logger: any;

  /**
   * Creates a winston-backed logger. Falls back to a console logger when
   * winston is not installed.
   * @param options Logger options.
   * @param options.level Minimum level to emit (default 'info').
   * @param options.prettyPrint When true, uses a colorized, human-readable format.
   */
  constructor(options: { level?: string; prettyPrint?: boolean } = {}) {
    try {
      // Dynamic import to avoid requiring winston as a direct dependency
      const winston = require('winston');

      const format = options.prettyPrint
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(
              (info: {
                level: string;
                message: string;
                timestamp: string;
                [key: string]: any;
              }) => {
                const { level, message, timestamp, ...meta } = info;
                return `${timestamp} ${level}: ${message} ${
                  Object.keys(meta).length ? JSON.stringify(meta) : ''
                }`;
              },
            ),
          )
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          );

      this.logger = winston.createLogger({
        level: options.level || 'info',
        format,
        transports: [new winston.transports.Console()],
      });
    } catch (error) {
      // Fallback to console if winston is not available
      this.logger = {
        info: (message: string, ...meta: any[]) =>
          console.info(`[INFO] ${message}`, ...meta),
        warn: (message: string, ...meta: any[]) =>
          console.warn(`[WARN] ${message}`, ...meta),
        error: (message: string, ...meta: any[]) =>
          console.error(`[ERROR] ${message}`, ...meta),
        debug: (message: string, ...meta: any[]) =>
          console.debug(`[DEBUG] ${message}`, ...meta),
      };
    }
  }

  /**
   * Logs an info-level message.
   * @param message The message to log.
   * @param meta Additional metadata.
   */
  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  /**
   * Logs a warning-level message.
   * @param message The message to log.
   * @param meta Additional metadata.
   */
  warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  /**
   * Logs an error-level message.
   * @param message The message to log.
   * @param meta Additional metadata.
   */
  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  /**
   * Logs a debug-level message.
   * @param message The message to log.
   * @param meta Additional metadata.
   */
  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }
}
