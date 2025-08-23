/**
 * Interface for logger implementations
 */
export interface ILogger {
  info(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  error(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
}

/**
 * Available logger types
 */
export type LoggerType = 'pino' | 'winston' | 'console';

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  type?: LoggerType;
  level?: string;
  prettyPrint?: boolean;
}
