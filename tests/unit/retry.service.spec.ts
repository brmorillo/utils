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

  describe('retry - maxDelay and jitter', () => {
    it('should clamp the exponential backoff delay to maxDelay', async () => {
      // Arrange
      jest.useFakeTimers();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockResolvedValue('ok');

      // Act - base delay 1000 with exponential backoff would be 1000ms on the
      // first retry, but maxDelay caps it to 50ms.
      const promise = RetryUtils.retry({
        fn,
        maxAttempts: 2,
        delay: 1000,
        exponentialBackoff: true,
        maxDelay: 50,
      });

      await Promise.resolve();
      await jest.advanceTimersByTimeAsync(50);
      await expect(promise).resolves.toBe('ok');

      // Assert - the scheduled wait must have been clamped to 50ms.
      const waits = setTimeoutSpy.mock.calls.map(call => call[1]);
      expect(waits).toContain(50);

      setTimeoutSpy.mockRestore();
      jest.useRealTimers();
    });

    it('should apply jitter within [0, computed delay]', async () => {
      // Arrange - force Math.random to a known value.
      const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
      jest.useFakeTimers();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockResolvedValue('ok');

      // Act - delay 100 with jitter and random 0.5 => 50ms.
      const promise = RetryUtils.retry({
        fn,
        maxAttempts: 2,
        delay: 100,
        jitter: true,
      });

      await Promise.resolve();
      await jest.advanceTimersByTimeAsync(50);
      await expect(promise).resolves.toBe('ok');

      // Assert
      const waits = setTimeoutSpy.mock.calls.map(call => call[1]);
      expect(waits).toContain(50);

      setTimeoutSpy.mockRestore();
      randomSpy.mockRestore();
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

  /**
   * Additional edge/error branch coverage.
   * Targets previously uncovered lines:
   * 46 (retry non-Error/non-string throw),
   * 99-102 (retryWithStrategy string + non-Error throw),
   * 165-168 (withRetry string + non-Error throw).
   */
  describe('edge cases and error branches', () => {
    describe('retry - non-Error rejection (line 46)', () => {
      it('should wrap a non-Error, non-string rejection into a generic Error', async () => {
        // Rejecting with a plain object hits the final `else` branch.
        const fn = jest.fn().mockRejectedValue({ code: 500 });

        await expect(
          RetryUtils.retry({ fn, maxAttempts: 2, delay: 1 }),
        ).rejects.toThrow('Unknown error occurred during retry');
        expect(fn).toHaveBeenCalledTimes(2);
      });

      it('should reach the exponential backoff branch and still exhaust attempts', async () => {
        const fn = jest.fn().mockRejectedValue(new Error('boom'));

        await expect(
          RetryUtils.retry({
            fn,
            maxAttempts: 3,
            delay: 1,
            exponentialBackoff: true,
          }),
        ).rejects.toThrow('boom');
        expect(fn).toHaveBeenCalledTimes(3);
      });
    });

    describe('retryWithStrategy - rejection wrapping (lines 99-102)', () => {
      it('should wrap a thrown string into an Error', async () => {
        const fn = jest.fn().mockRejectedValue('string failure');

        await expect(
          RetryUtils.retryWithStrategy({
            fn,
            shouldRetry: () => true,
            getDelay: () => 1,
            maxAttempts: 2,
          }),
        ).rejects.toThrow('string failure');
        expect(fn).toHaveBeenCalledTimes(2);
      });

      it('should wrap a non-Error, non-string rejection into a generic Error', async () => {
        const fn = jest.fn().mockRejectedValue(42);

        await expect(
          RetryUtils.retryWithStrategy({
            fn,
            shouldRetry: () => true,
            getDelay: () => 1,
            maxAttempts: 2,
          }),
        ).rejects.toThrow('Unknown error occurred during retry');
        expect(fn).toHaveBeenCalledTimes(2);
      });

      it('should retry using getDelay and then succeed', async () => {
        const fn = jest
          .fn()
          .mockRejectedValueOnce(new Error('transient'))
          .mockResolvedValue('done');
        const getDelay = jest.fn().mockReturnValue(1);

        const result = await RetryUtils.retryWithStrategy({
          fn,
          shouldRetry: () => true,
          getDelay,
          maxAttempts: 3,
        });

        expect(result).toBe('done');
        expect(getDelay).toHaveBeenCalledWith(1);
      });
    });

    describe('withRetry - rejection wrapping (lines 165-168)', () => {
      it('should wrap a thrown string into an Error', async () => {
        const original = jest.fn().mockRejectedValue('wrapped string');
        const wrapped = RetryUtils.withRetry({
          fn: original,
          options: { maxAttempts: 2, delay: 1 },
        });

        await expect(wrapped()).rejects.toThrow('wrapped string');
        expect(original).toHaveBeenCalledTimes(2);
      });

      it('should wrap a non-Error, non-string rejection into a generic Error', async () => {
        const original = jest.fn().mockRejectedValue({ status: 'bad' });
        const wrapped = RetryUtils.withRetry({
          fn: original,
          options: { maxAttempts: 2, delay: 1 },
        });

        await expect(wrapped()).rejects.toThrow(
          'Unknown error occurred during retry',
        );
        expect(original).toHaveBeenCalledTimes(2);
      });

      it('should retry the wrapped function using exponential backoff', async () => {
        const original = jest
          .fn()
          .mockRejectedValueOnce(new Error('fail once'))
          .mockResolvedValue('ok');
        const wrapped = RetryUtils.withRetry({
          fn: original,
          options: { maxAttempts: 2, delay: 1, exponentialBackoff: true },
        });

        await expect(wrapped()).resolves.toBe('ok');
        expect(original).toHaveBeenCalledTimes(2);
      });
    });
  });
});
