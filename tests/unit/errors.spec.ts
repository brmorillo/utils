import { BaseError } from '../../src/errors/base-error';
import { HttpError } from '../../src/errors/http-error';
import { StorageError } from '../../src/errors/storage-error';
import { ValidationError } from '../../src/errors/validation-error';

/**
 * Unit tests for the custom error classes.
 * These tests verify constructors, default values, factory methods,
 * serialization and prototype chain behavior.
 */
describe('Errors', () => {
  // Tests for the BaseError class
  describe('BaseError', () => {
    it('should use the default code when none is provided', () => {
      // Arrange & Act
      const error = new BaseError('Something went wrong');

      // Assert
      expect(error.message).toBe('Something went wrong');
      expect(error.code).toBe('UNKNOWN_ERROR');
      expect(error.statusCode).toBeUndefined();
      expect(error.details).toBeUndefined();
    });

    it('should set the provided code, statusCode and details', () => {
      // Arrange
      const details = { foo: 'bar' };

      // Act
      const error = new BaseError('Custom message', 'CUSTOM_CODE', 418, details);

      // Assert
      expect(error.message).toBe('Custom message');
      expect(error.code).toBe('CUSTOM_CODE');
      expect(error.statusCode).toBe(418);
      expect(error.details).toEqual(details);
    });

    it('should set the name to the constructor name', () => {
      // Arrange & Act
      const error = new BaseError('Test');

      // Assert
      expect(error.name).toBe('BaseError');
    });

    it('should be an instance of Error and BaseError', () => {
      // Arrange & Act
      const error = new BaseError('Test');

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BaseError);
    });

    it('should serialize to a plain object via toJSON', () => {
      // Arrange
      const error = new BaseError('Serialize me', 'SER_CODE', 500, { a: 1 });

      // Act
      const json = error.toJSON();

      // Assert
      expect(json).toEqual({
        name: 'BaseError',
        message: 'Serialize me',
        code: 'SER_CODE',
        statusCode: 500,
        details: { a: 1 },
        stack: error.stack,
      });
    });
  });

  // Tests for the HttpError class
  describe('HttpError', () => {
    it('should use default statusCode and code when none are provided', () => {
      // Arrange & Act
      const error = new HttpError('HTTP failure');

      // Assert
      expect(error.message).toBe('HTTP failure');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('HTTP_ERROR');
      expect(error).toBeInstanceOf(BaseError);
      expect(error).toBeInstanceOf(HttpError);
    });

    it('should honor explicit statusCode, code and details', () => {
      // Arrange
      const details = { url: '/api' };

      // Act
      const error = new HttpError('Teapot', 418, 'IM_A_TEAPOT', details);

      // Assert
      expect(error.statusCode).toBe(418);
      expect(error.code).toBe('IM_A_TEAPOT');
      expect(error.details).toEqual(details);
    });

    it('should create a Bad Request error via badRequest', () => {
      // Arrange & Act
      const error = HttpError.badRequest();

      // Assert
      expect(error.message).toBe('Bad Request');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('BAD_REQUEST');
    });

    it('should create an Unauthorized error via unauthorized', () => {
      // Arrange & Act
      const error = HttpError.unauthorized('No token');

      // Assert
      expect(error.message).toBe('No token');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('should create a Forbidden error via forbidden', () => {
      // Arrange & Act
      const error = HttpError.forbidden();

      // Assert
      expect(error.message).toBe('Forbidden');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });

    it('should create a Not Found error via notFound', () => {
      // Arrange & Act
      const error = HttpError.notFound();

      // Assert
      expect(error.message).toBe('Not Found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });

    it('should create a Timeout error via timeout', () => {
      // Arrange & Act
      const error = HttpError.timeout();

      // Assert
      expect(error.message).toBe('Request Timeout');
      expect(error.statusCode).toBe(408);
      expect(error.code).toBe('REQUEST_TIMEOUT');
    });

    it('should create a Server Error via serverError', () => {
      // Arrange & Act
      const error = HttpError.serverError();

      // Assert
      expect(error.message).toBe('Internal Server Error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('SERVER_ERROR');
    });

    it('should attach details on a factory error', () => {
      // Arrange
      const details = { field: 'email' };

      // Act
      const error = HttpError.badRequest('Invalid email', details);

      // Assert
      expect(error.details).toEqual(details);
    });
  });

  // Tests for the StorageError class
  describe('StorageError', () => {
    it('should use the default code and undefined statusCode', () => {
      // Arrange & Act
      const error = new StorageError('Storage failure');

      // Assert
      expect(error.message).toBe('Storage failure');
      expect(error.code).toBe('STORAGE_ERROR');
      expect(error.statusCode).toBeUndefined();
      expect(error).toBeInstanceOf(BaseError);
      expect(error).toBeInstanceOf(StorageError);
    });

    it('should create a File Not Found error via fileNotFound', () => {
      // Arrange & Act
      const error = StorageError.fileNotFound('/tmp/file.txt');

      // Assert
      expect(error.message).toBe('File not found: /tmp/file.txt');
      expect(error.code).toBe('FILE_NOT_FOUND');
      expect(error.details).toEqual({ path: '/tmp/file.txt' });
    });

    it('should create a Permission Denied error via permissionDenied', () => {
      // Arrange & Act
      const error = StorageError.permissionDenied('/tmp/file.txt');

      // Assert
      expect(error.message).toBe('Permission denied: /tmp/file.txt');
      expect(error.code).toBe('PERMISSION_DENIED');
      expect(error.details).toEqual({ path: '/tmp/file.txt' });
    });

    it('should create a File Already Exists error via fileAlreadyExists', () => {
      // Arrange & Act
      const error = StorageError.fileAlreadyExists('/tmp/file.txt');

      // Assert
      expect(error.message).toBe('File already exists: /tmp/file.txt');
      expect(error.code).toBe('FILE_ALREADY_EXISTS');
      expect(error.details).toEqual({ path: '/tmp/file.txt' });
    });

    it('should create a Quota Exceeded error via quotaExceeded', () => {
      // Arrange & Act
      const error = StorageError.quotaExceeded({ limit: 100 });

      // Assert
      expect(error.message).toBe('Storage quota exceeded');
      expect(error.code).toBe('QUOTA_EXCEEDED');
      expect(error.details).toEqual({ limit: 100 });
    });

    it('should create an Invalid Path error via invalidPath', () => {
      // Arrange & Act
      const error = StorageError.invalidPath('../bad');

      // Assert
      expect(error.message).toBe('Invalid path: ../bad');
      expect(error.code).toBe('INVALID_PATH');
      expect(error.details).toEqual({ path: '../bad' });
    });

    it('should merge additional details with the path', () => {
      // Arrange & Act
      const error = StorageError.fileNotFound('/x', { attempted: 2 });

      // Assert
      expect(error.details).toEqual({ path: '/x', attempted: 2 });
    });
  });

  // Tests for the ValidationError class
  describe('ValidationError', () => {
    it('should set the validation code, statusCode and field metadata', () => {
      // Arrange & Act
      const error = new ValidationError('Invalid', 'email', 'string', 42);

      // Assert
      expect(error.message).toBe('Invalid');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.field).toBe('email');
      expect(error.expected).toBe('string');
      expect(error.actual).toBe(42);
      expect(error).toBeInstanceOf(BaseError);
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should include field metadata in the details object', () => {
      // Arrange & Act
      const error = new ValidationError('Invalid', 'age', 18, 10, { extra: true });

      // Assert
      expect(error.details).toEqual({
        field: 'age',
        expected: 18,
        actual: 10,
        extra: true,
      });
    });

    it('should create a Required Field error via required', () => {
      // Arrange & Act
      const error = ValidationError.required('username');

      // Assert
      expect(error.message).toBe("Field 'username' is required");
      expect(error.field).toBe('username');
      expect(error.expected).toBe('non-empty value');
      expect(error.actual).toBeUndefined();
    });

    it('should create an Invalid Type error via invalidType', () => {
      // Arrange & Act
      const error = ValidationError.invalidType('age', 'number', 'thirty');

      // Assert
      expect(error.message).toBe(
        "Field 'age' must be of type 'number', but got 'string'",
      );
      expect(error.field).toBe('age');
      expect(error.expected).toBe('number');
      expect(error.actual).toBe('thirty');
    });

    it('should create an Invalid Format error via invalidFormat', () => {
      // Arrange & Act
      const error = ValidationError.invalidFormat('email', 'email', 'not-an-email');

      // Assert
      expect(error.message).toBe("Field 'email' must be a valid email");
      expect(error.field).toBe('email');
      expect(error.expected).toBe('valid email');
      expect(error.actual).toBe('not-an-email');
    });

    it('should create an Out of Range error via outOfRange', () => {
      // Arrange & Act
      const error = ValidationError.outOfRange('age', 0, 120, 200);

      // Assert
      expect(error.message).toBe("Field 'age' must be between 0 and 120");
      expect(error.field).toBe('age');
      expect(error.expected).toBe('value between 0 and 120');
      expect(error.actual).toBe(200);
    });
  });
});
