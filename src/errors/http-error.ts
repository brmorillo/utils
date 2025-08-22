import { BaseError } from './base-error';

/**
 * Error class for HTTP-related errors
 */
export class HttpError extends BaseError {
  /**
   * Creates a new HttpError
   * @param message Error message
   * @param statusCode HTTP status code
   * @param code Error code
   * @param details Additional error details
   */
  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'HTTP_ERROR',
    details?: Record<string, any>
  ) {
    super(message, code, statusCode, details);
  }

  /**
   * Creates a Bad Request (400) error
   * @param message Error message
   * @param details Additional error details
   */
  public static badRequest(message: string = 'Bad Request', details?: Record<string, any>): HttpError {
    return new HttpError(message, 400, 'BAD_REQUEST', details);
  }

  /**
   * Creates an Unauthorized (401) error
   * @param message Error message
   * @param details Additional error details
   */
  public static unauthorized(message: string = 'Unauthorized', details?: Record<string, any>): HttpError {
    return new HttpError(message, 401, 'UNAUTHORIZED', details);
  }

  /**
   * Creates a Forbidden (403) error
   * @param message Error message
   * @param details Additional error details
   */
  public static forbidden(message: string = 'Forbidden', details?: Record<string, any>): HttpError {
    return new HttpError(message, 403, 'FORBIDDEN', details);
  }

  /**
   * Creates a Not Found (404) error
   * @param message Error message
   * @param details Additional error details
   */
  public static notFound(message: string = 'Not Found', details?: Record<string, any>): HttpError {
    return new HttpError(message, 404, 'NOT_FOUND', details);
  }

  /**
   * Creates a Timeout (408) error
   * @param message Error message
   * @param details Additional error details
   */
  public static timeout(message: string = 'Request Timeout', details?: Record<string, any>): HttpError {
    return new HttpError(message, 408, 'REQUEST_TIMEOUT', details);
  }

  /**
   * Creates a Server Error (500) error
   * @param message Error message
   * @param details Additional error details
   */
  public static serverError(message: string = 'Internal Server Error', details?: Record<string, any>): HttpError {
    return new HttpError(message, 500, 'SERVER_ERROR', details);
  }
}