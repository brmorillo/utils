import { RetryUtils } from '../../src/services/retry.service';

/**
 * Unit tests for the RetryUtils class.
 * These tests use a very small delay to avoid long real waits.
 */
describe('RetryUtils', () => {
  describe('retry', () => {
    it('should return the result when the function succeeds on the first attempt', async () => {
      // Arrange
      const fn = jest.fn().mockResolvedValue('success');

      // Act
      const result = await RetryUtils.retry({ fn, delay: 1 });

      // Assert
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry until the function eventually succeeds', async () => {
      // Arrange
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      // Act
      const result = await RetryUtils.retry({ fn, maxAttempts: 3, delay: 1 });

      // Assert
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw the last error after exhausting all attempts', async () => {
      // Arrange
      const fn = jest.fn().mockRejectedValue(new Error('always fails'));

      // Act & Assert
      await expect(
        RetryUtils.retry({ fn, maxAttempts: 3, delay: 1 }),
      ).rejects.toThrow('always fails');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should respect the maxAttempts option', async () => {
      // Arrange
      const fn = jest.fn().mockRejectedValue(new Error('fail'));

      // Act & Assert
      await expect(
        RetryUtils.retry({ fn, maxAttempts: 5, delay: 1 }),
      ).rejects.toThrow('fail');
      expect(fn).toHaveBeenCalledTimes(5);
    });

    it('should wrap a thrown string into an Error', async () => {
      // Arrange
      const fn = jest.fn().mockRejectedValue('string error');

      // Act & Assert
      await expect(
        RetryUtils.retry({ fn, maxAttempts: 1, delay: 1 }),
      ).rejects.toThrow('string error');
    });

    it('should use a longer delay when exponential backoff is enabled', async () => {
      // Arrange
      jest.useFakeTimers();
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockResolvedValue('success');

      // Act
      const promise = RetryUtils.retry({
        fn,
        maxAttempts: 2,
        delay: 100,
        exponentialBackoff: true,
      });

      // Let the first (failing) attempt run
      await Promise.resolve();
      // The delay for the first retry should be 100 * 2^0 = 100ms
      await jest.advanceTimersByTimeAsync(100);
      const result = await promise;

      // Assert
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);

      jest.useRealTimers();
    });
  });

  describe('retryWithStrategy', () => {
    it('should return the result when the function succeeds', async () => {
      // Arrange
      const fn = jest.fn().mockResolvedValue('ok');

      // Act
      const result = await RetryUtils.retryWithStrategy({
        fn,
        shouldRetry: () => true,
        getDelay: () => 1,
      });

      // Assert
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry when shouldRetry returns true', async () => {
      // Arrange
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('retryable'))
        .mockResolvedValue('ok');

      // Act
      const result = await RetryUtils.retryWithStrategy({
        fn,
        shouldRetry: () => true,
        getDelay: () => 1,
        maxAttempts: 3,
      });

      // Assert
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should stop immediately when shouldRetry returns false', async () => {
      // Arrange
      const fn = jest.fn().mockRejectedValue(new Error('do not retry'));
      const shouldRetry = jest.fn().mockReturnValue(false);

      // Act & Assert
      await expect(
        RetryUtils.retryWithStrategy({
          fn,
          shouldRetry,
          getDelay: () => 1,
          maxAttempts: 5,
        }),
      ).rejects.toThrow('do not retry');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass the attempt number to getDelay', async () => {
      // Arrange
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('ok');
      const getDelay = jest.fn().mockReturnValue(1);

      // Act
      await RetryUtils.retryWithStrategy({
        fn,
        shouldRetry: () => true,
        getDelay,
        maxAttempts: 3,
      });

      // Assert
      expect(getDelay).toHaveBeenNthCalledWith(1, 1);
      expect(getDelay).toHaveBeenNthCalledWith(2, 2);
    });

    it('should throw the last error after exhausting all attempts', async () => {
      // Arrange
      const fn = jest.fn().mockRejectedValue(new Error('persistent'));

      // Act & Assert
      await expect(
        RetryUtils.retryWithStrategy({
          fn,
          shouldRetry: () => true,
          getDelay: () => 1,
          maxAttempts: 2,
        }),
      ).rejects.toThrow('persistent');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('withRetry', () => {
    it('should wrap a function and forward its arguments', async () => {
      // Arrange
      const original = jest.fn(async (a: number, b: number) => a + b);
      const wrapped = RetryUtils.withRetry({
        fn: original,
        options: { delay: 1 },
      });

      // Act
      const result = await wrapped(2, 3);

      // Assert
      expect(result).toBe(5);
      expect(original).toHaveBeenCalledWith(2, 3);
    });

    it('should retry the wrapped function on failure', async () => {
      // Arrange
      const original = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('recovered');
      const wrapped = RetryUtils.withRetry({
        fn: original,
        options: { maxAttempts: 2, delay: 1 },
      });

      // Act
      const result = await wrapped();

      // Assert
      expect(result).toBe('recovered');
      expect(original).toHaveBeenCalledTimes(2);
    });

    it('should throw the last error after exhausting all attempts', async () => {
      // Arrange
      const original = jest.fn().mockRejectedValue(new Error('still failing'));
      const wrapped = RetryUtils.withRetry({
        fn: original,
        options: { maxAttempts: 3, delay: 1 },
      });

      // Act & Assert
      await expect(wrapped()).rejects.toThrow('still failing');
      expect(original).toHaveBeenCalledTimes(3);
    });

    it('should use default options when none are provided', async () => {
      // Arrange
      const original = jest.fn().mockResolvedValue('default');
      const wrapped = RetryUtils.withRetry({ fn: original });

      // Act
      const result = await wrapped();

      // Assert
      expect(result).toBe('default');
      expect(original).toHaveBeenCalledTimes(1);
    });
  });
});
