/**
 * Base error class for all custom errors in the library
 */
export class BaseError extends Error {
  /**
   * Error code for categorizing errors
   */
  public code: string;

  /**
   * HTTP status code (if applicable)
   */
  public statusCode?: number;

  /**
   * Additional error details
   */
  public details?: Record<string, any>;

  /**
   * Creates a new BaseError
   * @param message Error message
   * @param code Error code
   * @param statusCode HTTP status code (if applicable)
   * @param details Additional error details
   */
  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode?: number,
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Converts the error to a plain object for serialization
   */
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack,
    };
  }
}
