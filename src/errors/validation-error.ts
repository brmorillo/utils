import { BaseError } from './base-error';

/**
 * Error class for validation-related errors
 */
export class ValidationError extends BaseError {
  /**
   * Field that failed validation
   */
  public field?: string;

  /**
   * Expected value or pattern
   */
  public expected?: any;

  /**
   * Actual value that failed validation
   */
  public actual?: any;

  /**
   * Creates a new ValidationError
   * @param message Error message
   * @param field Field that failed validation
   * @param expected Expected value or pattern
   * @param actual Actual value that failed validation
   * @param details Additional error details
   */
  constructor(
    message: string,
    field?: string,
    expected?: any,
    actual?: any,
    details?: Record<string, any>,
  ) {
    super(message, 'VALIDATION_ERROR', 400, {
      field,
      expected,
      actual,
      ...details,
    });

    this.field = field;
    this.expected = expected;
    this.actual = actual;
  }

  /**
   * Creates a Required Field error
   * @param field Field name
   * @param details Additional error details
   */
  public static required(
    field: string,
    details?: Record<string, any>,
  ): ValidationError {
    return new ValidationError(
      `Field '${field}' is required`,
      field,
      'non-empty value',
      undefined,
      details,
    );
  }

  /**
   * Creates an Invalid Type error
   * @param field Field name
   * @param expected Expected type
   * @param actual Actual value
   * @param details Additional error details
   */
  public static invalidType(
    field: string,
    expected: string,
    actual: any,
    details?: Record<string, any>,
  ): ValidationError {
    const actualType = typeof actual;
    return new ValidationError(
      `Field '${field}' must be of type '${expected}', but got '${actualType}'`,
      field,
      expected,
      actual,
      details,
    );
  }

  /**
   * Creates an Invalid Format error
   * @param field Field name
   * @param format Format description (e.g., "email", "date", "URL")
   * @param actual Actual value
   * @param details Additional error details
   */
  public static invalidFormat(
    field: string,
    format: string,
    actual: any,
    details?: Record<string, any>,
  ): ValidationError {
    return new ValidationError(
      `Field '${field}' must be a valid ${format}`,
      field,
      `valid ${format}`,
      actual,
      details,
    );
  }

  /**
   * Creates an Out of Range error
   * @param field Field name
   * @param min Minimum value
   * @param max Maximum value
   * @param actual Actual value
   * @param details Additional error details
   */
  public static outOfRange(
    field: string,
    min: number,
    max: number,
    actual: number,
    details?: Record<string, any>,
  ): ValidationError {
    return new ValidationError(
      `Field '${field}' must be between ${min} and ${max}`,
      field,
      `value between ${min} and ${max}`,
      actual,
      details,
    );
  }
}
