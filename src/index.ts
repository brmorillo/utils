import { LogService } from './services/log.service';
import { HttpService, HttpClientType } from './services/http.service';
import { StorageService, StorageServiceOptions } from './services/storage.service';
import { LoggerOptions } from './interfaces/logger.interface';
import { StorageProviderType } from './interfaces/storage.interface';

/**
 * Configuration for the utility library
 */
export interface UtilsConfig {
  logger?: LoggerOptions;
  http?: {
    clientType?: HttpClientType;
    baseUrl?: string;
    defaultHeaders?: Record<string, string>;
    timeout?: number;
  };
  storage?: StorageServiceOptions;
}

/**
 * Main class for initializing and configuring the utility library
 */
export class Utils {
  private static instance: Utils;
  private logService: LogService;
  private httpService: HttpService;
  private storageService: StorageService;

  private constructor(config: UtilsConfig = {}) {
    this.logService = LogService.getInstance(config.logger);
    this.httpService = HttpService.getInstance(config.http);
    this.storageService = StorageService.getInstance(config.storage);
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
    if (config.http) {
      this.httpService.configure(config.http);
    }
    if (config.storage) {
      this.storageService.configure(config.storage);
    }
  }

  /**
   * Gets the logger instance
   * @returns The LogService instance
   */
  public getLogger(): LogService {
    return this.logService;
  }

  /**
   * Gets the HTTP service instance
   * @returns The HttpService instance
   */
  public getHttpService(): HttpService {
    return this.httpService;
  }

  /**
   * Gets the storage service instance
   * @returns The StorageService instance
   */
  public getStorageService(): StorageService {
    return this.storageService;
  }
}

// Export all utility classes and interfaces
export * from './interfaces/logger.interface';
export * from './interfaces/request.interface';
export * from './interfaces/storage.interface';
export * from './services/log.service';
export * from './services/http.service';
export * from './services/request.service';
export * from './services/storage.service';
export * from './services/array.service';
export * from './services/benchmark.service';
export * from './services/cache.service';
export * from './services/convert.service';
export * from './services/crypt.service';
export * from './services/cuid.service';
export * from './services/date.service';
export * from './services/event.service';
export * from './services/file.service';
export * from './services/hash.service';
export * from './services/jwt.service';
export * from './services/math.service';
export * from './services/number.service';
export * from './services/object.service';
export * from './services/queue.service';
export * from './services/retry.service';
export * from './services/snowflake.service';
export * from './services/sort.service';
export * from './services/string.service';
export * from './services/uuid.service';
export * from './services/validation.service';
export * from './errors';
export * from './utils';