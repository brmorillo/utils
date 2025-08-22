import { ILogger } from '../interfaces/logger.interface';

/**
 * Pino logger implementation
 */
export class PinoLogger implements ILogger {
  private logger: any;

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

  info(message: string, ...meta: any[]): void {
    this.logger.info({ meta }, message);
  }

  warn(message: string, ...meta: any[]): void {
    this.logger.warn({ meta }, message);
  }

  error(message: string, ...meta: any[]): void {
    this.logger.error({ meta }, message);
  }

  debug(message: string, ...meta: any[]): void {
    this.logger.debug({ meta }, message);
  }
}
