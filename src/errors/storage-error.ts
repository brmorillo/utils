import { BaseError } from './base-error';

/**
 * Error class for storage-related errors
 */
export class StorageError extends BaseError {
  /**
   * Creates a new StorageError
   * @param message Error message
   * @param code Error code
   * @param details Additional error details
   */
  constructor(
    message: string,
    code: string = 'STORAGE_ERROR',
    details?: Record<string, any>
  ) {
    super(message, code, undefined, details);
  }

  /**
   * Creates a File Not Found error
   * @param path File path
   * @param details Additional error details
   */
  public static fileNotFound(path: string, details?: Record<string, any>): StorageError {
    return new StorageError(
      `File not found: ${path}`,
      'FILE_NOT_FOUND',
      { path, ...details }
    );
  }

  /**
   * Creates a Permission Denied error
   * @param path File path
   * @param details Additional error details
   */
  public static permissionDenied(path: string, details?: Record<string, any>): StorageError {
    return new StorageError(
      `Permission denied: ${path}`,
      'PERMISSION_DENIED',
      { path, ...details }
    );
  }

  /**
   * Creates a File Already Exists error
   * @param path File path
   * @param details Additional error details
   */
  public static fileAlreadyExists(path: string, details?: Record<string, any>): StorageError {
    return new StorageError(
      `File already exists: ${path}`,
      'FILE_ALREADY_EXISTS',
      { path, ...details }
    );
  }

  /**
   * Creates a Quota Exceeded error
   * @param details Additional error details
   */
  public static quotaExceeded(details?: Record<string, any>): StorageError {
    return new StorageError(
      'Storage quota exceeded',
      'QUOTA_EXCEEDED',
      details
    );
  }

  /**
   * Creates an Invalid Path error
   * @param path File path
   * @param details Additional error details
   */
  public static invalidPath(path: string, details?: Record<string, any>): StorageError {
    return new StorageError(
      `Invalid path: ${path}`,
      'INVALID_PATH',
      { path, ...details }
    );
  }
}