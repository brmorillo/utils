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
   * @param options Extra options, e.g. the original error as `cause`
   */
  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode?: number,
    details?: Record<string, any>,
    options?: { cause?: unknown },
  ) {
    super(
      message,
      options?.cause !== undefined ? { cause: options.cause } : undefined,
    );
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Converts the error to a plain object for serialization.
   *
   * @remarks
   * For security reasons the `stack` is NOT included by default: stack traces
   * leak filesystem paths and internal structure when serialized into HTTP
   * responses. Pass `{ includeStack: true }` to opt in (e.g. for internal logs).
   * @param options Optional serialization options.
   * @param options.includeStack When `true`, includes the `stack` property. Defaults to `false`.
   */
  public toJSON({
    includeStack = false,
  }: { includeStack?: boolean } = {}): Record<string, any> {
    const json: Record<string, any> = {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };

    if (includeStack) {
      json.stack = this.stack;
    }

    return json;
  }
}
