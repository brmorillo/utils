/**
 * Utility class for standardized logging with different log levels and formatting options.
 */
export class LogUtils {
  /**
   * Log levels in order of severity.
   */
  public static readonly LogLevel = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
    NONE: 6,
  } as const;

  /**
   * Type definition for log levels.
   */
  public static readonly LogLevelType = {
    TRACE: 'TRACE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    FATAL: 'FATAL',
    NONE: 'NONE',
  } as const;

  /**
   * Creates a new logger instance.
   * @param {object} [params] - The parameters for the method.
   * @param {keyof typeof LogUtils.LogLevelType} [params.minLevel='INFO'] - Minimum log level to display.
   * @param {boolean} [params.showTimestamp=true] - Whether to include timestamps in log messages.
   * @param {boolean} [params.showLevel=true] - Whether to include log level in log messages.
   * @param {Function} [params.transport] - Custom transport function for log messages.
   * @returns {Logger} A new logger instance.
   * @example
   * // Create a logger with default settings
   * const logger = LogUtils.createLogger();
   * 
   * // Create a logger with custom settings
   * const customLogger = LogUtils.createLogger({
   *   minLevel: 'DEBUG',
   *   showTimestamp: true,
   *   showLevel: true
   * });
   * 
   * // Create a logger with a custom transport
   * const fileLogger = LogUtils.createLogger({
   *   transport: (level, message) => {
   *     // Write to file or send to logging service
   *     fs.appendFileSync('app.log', `${level}: ${message}\n`);
   *   }
   * });
   */
  public static createLogger({
    minLevel = 'INFO',
    showTimestamp = true,
    showLevel = true,
    transport,
  }: {
    minLevel?: keyof typeof LogUtils.LogLevelType;
    showTimestamp?: boolean;
    showLevel?: boolean;
    transport?: (level: keyof typeof LogUtils.LogLevelType, message: string) => void;
  } = {}): Logger {
    return new Logger({
      minLevel,
      showTimestamp,
      showLevel,
      transport,
    });
  }

  /**
   * Formats an object for logging.
   * @param {object} params - The parameters for the method.
   * @param {any} params.obj - The object to format.
   * @param {boolean} [params.colors=false] - Whether to include ANSI color codes.
   * @param {number} [params.depth=2] - Maximum depth for nested objects.
   * @returns {string} A formatted string representation of the object.
   * @example
   * const user = { id: 1, name: 'John', profile: { age: 30 } };
   * const formatted = LogUtils.formatObject({ obj: user });
   * console.log(formatted); // "{ id: 1, name: 'John', profile: { age: 30 } }"
   */
  public static formatObject({
    obj,
    colors = false,
    depth = 2,
  }: {
    obj: any;
    colors?: boolean;
    depth?: number;
  }): string {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (typeof obj !== 'object') return String(obj);

    try {
      return LogUtils.stringifyWithDepth(obj, depth, colors);
    } catch (error) {
      return '[Object]';
    }
  }

  /**
   * Stringifies an object with a maximum depth.
   * @private
   */
  private static stringifyWithDepth(obj: any, maxDepth: number, colors: boolean, currentDepth = 0): string {
    if (currentDepth >= maxDepth) {
      return '[Object]';
    }

    if (Array.isArray(obj)) {
      const items = obj.map(item => {
        if (typeof item === 'object' && item !== null) {
          return LogUtils.stringifyWithDepth(item, maxDepth, colors, currentDepth + 1);
        }
        return LogUtils.formatValue(item, colors);
      });
      return `[${items.join(', ')}]`;
    }

    const entries = Object.entries(obj).map(([key, value]) => {
      const formattedValue = typeof value === 'object' && value !== null
        ? LogUtils.stringifyWithDepth(value, maxDepth, colors, currentDepth + 1)
        : LogUtils.formatValue(value, colors);
      
      return `${colors ? '\x1b[36m' : ''}${key}${colors ? '\x1b[0m' : ''}: ${formattedValue}`;
    });

    return `{ ${entries.join(', ')} }`;
  }

  /**
   * Formats a primitive value for logging.
   * @private
   */
  private static formatValue(value: any, colors: boolean): string {
    if (value === undefined) return colors ? '\x1b[90mundefined\x1b[0m' : 'undefined';
    if (value === null) return colors ? '\x1b[90mnull\x1b[0m' : 'null';
    
    if (typeof value === 'string') {
      return colors ? `\x1b[32m'${value}'\x1b[0m` : `'${value}'`;
    }
    
    if (typeof value === 'number') {
      return colors ? `\x1b[33m${value}\x1b[0m` : String(value);
    }
    
    if (typeof value === 'boolean') {
      return colors ? `\x1b[35m${value}\x1b[0m` : String(value);
    }
    
    return String(value);
  }
}

/**
 * Type for log level values.
 */
export type LogLevel = typeof LogUtils.LogLevel[keyof typeof LogUtils.LogLevel];

/**
 * Type for log level names.
 */
export type LogLevelName = keyof typeof LogUtils.LogLevelType;

/**
 * Logger class for standardized logging.
 */
export class Logger {
  private minLevel: LogLevel;
  private showTimestamp: boolean;
  private showLevel: boolean;
  private transport?: (level: LogLevelName, message: string) => void;

  /**
   * Creates a new Logger instance.
   * @param {object} params - The parameters for the constructor.
   * @param {LogLevelName} params.minLevel - Minimum log level to display.
   * @param {boolean} params.showTimestamp - Whether to include timestamps in log messages.
   * @param {boolean} params.showLevel - Whether to include log level in log messages.
   * @param {Function} [params.transport] - Custom transport function for log messages.
   */
  constructor({
    minLevel,
    showTimestamp,
    showLevel,
    transport,
  }: {
    minLevel: LogLevelName;
    showTimestamp: boolean;
    showLevel: boolean;
    transport?: (level: LogLevelName, message: string) => void;
  }) {
    this.minLevel = LogUtils.LogLevel[minLevel];
    this.showTimestamp = showTimestamp;
    this.showLevel = showLevel;
    this.transport = transport;
  }

  /**
   * Logs a trace message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   * @example
   * logger.trace('Entering function', { userId: 123 });
   */
  public trace(message: string, ...args: any[]): void {
    this.log('TRACE', message, ...args);
  }

  /**
   * Logs a debug message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   * @example
   * logger.debug('Processing data', { count: 42 });
   */
  public debug(message: string, ...args: any[]): void {
    this.log('DEBUG', message, ...args);
  }

  /**
   * Logs an info message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   * @example
   * logger.info('User logged in', { userId: 123 });
   */
  public info(message: string, ...args: any[]): void {
    this.log('INFO', message, ...args);
  }

  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   * @example
   * logger.warn('Deprecated feature used', { feature: 'oldAPI' });
   */
  public warn(message: string, ...args: any[]): void {
    this.log('WARN', message, ...args);
  }

  /**
   * Logs an error message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   * @example
   * try {
   *   // Some code that might throw
   * } catch (error) {
   *   logger.error('Operation failed', error);
   * }
   */
  public error(message: string, ...args: any[]): void {
    this.log('ERROR', message, ...args);
  }

  /**
   * Logs a fatal error message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   * @example
   * logger.fatal('Application crash', { reason: 'Out of memory' });
   */
  public fatal(message: string, ...args: any[]): void {
    this.log('FATAL', message, ...args);
  }

  /**
   * Sets the minimum log level.
   * @param {LogLevelName} level - The new minimum log level.
   * @example
   * // Only show warnings and errors in production
   * if (process.env.NODE_ENV === 'production') {
   *   logger.setLevel('WARN');
   * }
   */
  public setLevel(level: LogLevelName): void {
    this.minLevel = LogUtils.LogLevel[level];
  }

  /**
   * Gets the current minimum log level.
   * @returns {LogLevelName} The current minimum log level.
   * @example
   * const currentLevel = logger.getLevel();
   * console.log(`Current log level: ${currentLevel}`);
   */
  public getLevel(): LogLevelName {
    const levels = Object.entries(LogUtils.LogLevel);
    const entry = levels.find(([_, value]) => value === this.minLevel);
    return entry ? (entry[0] as LogLevelName) : 'INFO';
  }

  /**
   * Internal method to log a message with a specific level.
   * @private
   */
  private log(level: LogLevelName, message: string, ...args: any[]): void {
    if (LogUtils.LogLevel[level] < this.minLevel) {
      return;
    }

    let formattedMessage = message;

    // Add timestamp if enabled
    if (this.showTimestamp) {
      const timestamp = new Date().toISOString();
      formattedMessage = `[${timestamp}] ${formattedMessage}`;
    }

    // Add level if enabled
    if (this.showLevel) {
      formattedMessage = `[${level}] ${formattedMessage}`;
    }

    // Format additional arguments
    if (args.length > 0) {
      const formattedArgs = args.map(arg => {
        if (arg instanceof Error) {
          return `${arg.message}\n${arg.stack}`;
        }
        if (typeof arg === 'object' && arg !== null) {
          return LogUtils.formatObject({ obj: arg });
        }
        return String(arg);
      });
      formattedMessage = `${formattedMessage} ${formattedArgs.join(' ')}`;
    }

    // Use custom transport if provided, otherwise use console
    if (this.transport) {
      this.transport(level, formattedMessage);
    } else {
      switch (level) {
        case 'TRACE':
        case 'DEBUG':
          console.debug(formattedMessage);
          break;
        case 'INFO':
          console.info(formattedMessage);
          break;
        case 'WARN':
          console.warn(formattedMessage);
          break;
        case 'ERROR':
        case 'FATAL':
          console.error(formattedMessage);
          break;
      }
    }
  }
}