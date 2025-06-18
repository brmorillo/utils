import { LogService } from './services/log.service';
import { LoggerOptions } from './interfaces/logger.interface';

/**
 * Configuration for the utility library
 */
export interface UtilsConfig {
  logger?: LoggerOptions;
}

/**
 * Main class for initializing and configuring the utility library
 */
export class Utils {
  private static instance: Utils;
  private logService: LogService;

  private constructor(config: UtilsConfig = {}) {
    this.logService = LogService.getInstance(config.logger);
  }

  /**
   * Gets the singleton instance of Utils
   * @param config Optional configuration
   * @returns The Utils instance
   */
  public static getInstance(config?: UtilsConfig): Utils {
    if (!Utils.instance) {
      Utils.instance = new Utils(config);
    }
    return Utils.instance;
  }

  /**
   * Reconfigures the utility library
   * @param config New configuration
   */
  public configure(config: UtilsConfig): void {
    if (config.logger) {
      this.logService.configure(config.logger);
    }
  }

  /**
   * Gets the logger instance
   * @returns The LogService instance
   */
  public getLogger(): LogService {
    return this.logService;
  }
}

// Export all utility classes and interfaces
export * from './interfaces/logger.interface';
export * from './services/log.service';
export * from './services/array.service';
export * from './services/benchmark.service';
export * from './services/convert.service';
export * from './services/crypt.service';
export * from './services/cuid.service';
export * from './services/date.service';
export * from './services/hash.service';
export * from './services/jwt.service';
export * from './services/math.service';
export * from './services/number.service';
export * from './services/object.service';
export * from './services/queue.service';
export * from './services/request.service';
export * from './services/snowflake.service';
export * from './services/sort.service';
export * from './services/string.service';
export * from './services/uuid.service';
export * from './services/validation.service';
