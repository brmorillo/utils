import {
  ILogger,
  LoggerOptions,
  LoggerType,
} from '../interfaces/logger.interface';
import { ConsoleLogger } from '../loggers/console-logger';
import { PinoLogger } from '../loggers/pino-logger';
import { WinstonLogger } from '../loggers/winston-logger';

/**
 * Log service that uses dependency injection to provide logging functionality
 */
export class LogService {
  private static instance: LogService;
  private logger: ILogger;

  private constructor(options: LoggerOptions = {}) {
    const type = options.type || 'pino';
    this.logger = this.createLogger(type, options);
  }

  /**
   * Gets the singleton instance of LogService
   * @param options Optional logger configuration
   * @returns The LogService instance
   */
  public static getInstance(options?: LoggerOptions): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService(options);
    }
    return LogService.instance;
  }

  /**
   * Reconfigures the logger with new options
   * @param options Logger configuration
   */
  public configure(options: LoggerOptions): void {
    const type = options.type || 'pino';
    this.logger = this.createLogger(type, options);
  }

  /**
   * Logs an info message
   * @param message The message to log
   * @param meta Additional metadata
   */
  public info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  /**
   * Logs a warning message
   * @param message The message to log
   * @param meta Additional metadata
   */
  public warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  /**
   * Logs an error message
   * @param message The message to log
   * @param meta Additional metadata
   */
  public error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  /**
   * Logs a debug message
   * @param message The message to log
   * @param meta Additional metadata
   */
  public debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }

  /**
   * Creates a logger instance based on the specified type
   * @param type The logger type
   * @param options Logger configuration
   * @returns An ILogger implementation
   */
  private createLogger(type: LoggerType, options: LoggerOptions): ILogger {
    switch (type) {
      case 'pino':
        return new PinoLogger(options);
      case 'winston':
        return new WinstonLogger(options);
      case 'console':
        return new ConsoleLogger(options.level);
      default:
        return new PinoLogger(options);
    }
  }
}
