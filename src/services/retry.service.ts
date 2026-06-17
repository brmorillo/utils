export class RetryUtils {
  /**
   * Retries a function until it succeeds or the maximum number of attempts is reached.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The function to retry.
   * @param {number} [params.maxAttempts=3] - The maximum number of attempts.
   * @param {number} [params.delay=1000] - The base delay between attempts in milliseconds.
   * @param {boolean} [params.exponentialBackoff=false] - Whether to use exponential backoff for delays.
   * @param {number} [params.maxDelay=30000] - Upper bound (in ms) the computed delay is clamped to.
   * @param {boolean} [params.jitter=false] - When true, randomizes the delay in the range [0, delay] to avoid thundering-herd retries.
   * @returns {Promise<any>} The result of the function.
   * @throws {Error} The last error encountered if all attempts fail.
   * @example
   * const result = await RetryUtils.retry({
   *   fn: async () => {
   *     // Function that might fail
   *     const response = await fetch('https://api.example.com/data');
   *     if (!response.ok) throw new Error('API request failed');
   *     return response.json();
   *   },
   *   maxAttempts: 5,
   *   delay: 1000,
   *   exponentialBackoff: true,
   *   maxDelay: 30000,
   *   jitter: true
   * });
   */
  public static async retry<T>({
    fn,
    maxAttempts = 3,
    delay = 1000,
    exponentialBackoff = false,
    maxDelay = 30000,
    jitter = false,
  }: {
    fn: () => Promise<T>;
    maxAttempts?: number;
    delay?: number;
    exponentialBackoff?: boolean;
    maxDelay?: number;
    jitter?: boolean;
  }): Promise<T> {
    let lastError: Error = new Error('All retry attempts failed');

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (error instanceof Error) {
          lastError = error;
        } else if (typeof error === 'string') {
          lastError = new Error(error);
        } else {
          lastError = new Error('Unknown error occurred during retry');
        }

        if (attempt === maxAttempts) {
          break;
        }

        const waitTime = RetryUtils.computeBackoff({
          delay,
          attempt,
          exponentialBackoff,
          maxDelay,
          jitter,
        });
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }

  /**
   * Computes the wait time for a retry attempt, applying optional exponential
   * backoff, clamping to a maximum delay, and optional jitter.
   * @param {object} params - The parameters for the method.
   * @param {number} params.delay - The base delay in milliseconds.
   * @param {number} params.attempt - The current attempt number (1-based).
   * @param {boolean} params.exponentialBackoff - Whether to grow the delay exponentially.
   * @param {number} params.maxDelay - Upper bound the delay is clamped to.
   * @param {boolean} params.jitter - Whether to randomize the delay in [0, delay].
   * @returns {number} The computed wait time in milliseconds.
   */
  private static computeBackoff({
    delay,
    attempt,
    exponentialBackoff,
    maxDelay,
    jitter,
  }: {
    delay: number;
    attempt: number;
    exponentialBackoff: boolean;
    maxDelay: number;
    jitter: boolean;
  }): number {
    let waitTime = exponentialBackoff
      ? delay * Math.pow(2, attempt - 1)
      : delay;
    // Clamp to the configured maximum backoff.
    waitTime = Math.min(waitTime, maxDelay);
    // Apply full jitter: a random value in [0, waitTime].
    if (jitter) {
      waitTime = Math.random() * waitTime;
    }
    return waitTime;
  }

  /**
   * Retries a function with a custom retry strategy.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The function to retry.
   * @param {Function} params.shouldRetry - Function that determines if another retry should be attempted based on the error.
   * @param {Function} params.getDelay - Function that returns the delay before the next attempt.
   * @param {number} [params.maxAttempts=3] - The maximum number of attempts.
   * @returns {Promise<any>} The result of the function.
   * @throws {Error} The last error encountered if all attempts fail.
   * @example
   * const result = await RetryUtils.retryWithStrategy({
   *   fn: fetchData,
   *   shouldRetry: (error) => error.status === 429, // Only retry on rate limit errors
   *   getDelay: (attempt) => attempt * 1000, // Linear backoff
   *   maxAttempts: 5
   * });
   */
  public static async retryWithStrategy<T>({
    fn,
    shouldRetry,
    getDelay,
    maxAttempts = 3,
  }: {
    fn: () => Promise<T>;
    shouldRetry: (error: any) => boolean;
    getDelay: (attempt: number) => number;
    maxAttempts?: number;
  }): Promise<T> {
    let lastError: Error = new Error('All retry attempts failed');

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (error instanceof Error) {
          lastError = error;
        } else if (typeof error === 'string') {
          lastError = new Error(error);
        } else {
          lastError = new Error('Unknown error occurred during retry');
        }

        if (attempt === maxAttempts || !shouldRetry(error)) {
          break;
        }

        const waitTime = getDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }

  /**
   * Creates a function that will retry the original function with the specified retry strategy.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The function to wrap with retry logic.
   * @param {object} [params.options] - Retry options.
   * @param {number} [params.options.maxAttempts=3] - The maximum number of attempts.
   * @param {number} [params.options.delay=1000] - The base delay between attempts in milliseconds.
   * @param {boolean} [params.options.exponentialBackoff=false] - Whether to use exponential backoff for delays.
   * @param {number} [params.options.maxDelay=30000] - Upper bound (in ms) the computed delay is clamped to.
   * @param {boolean} [params.options.jitter=false] - When true, randomizes the delay in the range [0, delay].
   * @returns {Function} A wrapped function that will retry on failure.
   * @example
   * const fetchWithRetry = RetryUtils.withRetry({
   *   fn: fetch,
   *   options: {
   *     maxAttempts: 5,
   *     delay: 1000,
   *     exponentialBackoff: true
   *   }
   * });
   *
   * // Now use it like the original function
   * const response = await fetchWithRetry('https://api.example.com/data');
   */
  public static withRetry<T extends (...args: any[]) => Promise<any>>({
    fn,
    options = {},
  }: {
    fn: T;
    options?: {
      maxAttempts?: number;
      delay?: number;
      exponentialBackoff?: boolean;
      maxDelay?: number;
      jitter?: boolean;
    };
  }): (...args: Parameters<T>) => ReturnType<T> {
    const {
      maxAttempts = 3,
      delay = 1000,
      exponentialBackoff = false,
      maxDelay = 30000,
      jitter = false,
    } = options;

    const wrapped = async (...args: Parameters<T>): Promise<any> => {
      let lastError: Error = new Error('All retry attempts failed');

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await fn(...args);
        } catch (error) {
          if (error instanceof Error) {
            lastError = error;
          } else if (typeof error === 'string') {
            lastError = new Error(error);
          } else {
            lastError = new Error('Unknown error occurred during retry');
          }

          if (attempt === maxAttempts) {
            break;
          }

          const waitTime = RetryUtils.computeBackoff({
            delay,
            attempt,
            exponentialBackoff,
            maxDelay,
            jitter,
          });
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

      throw lastError;
    };

    return wrapped as (...args: Parameters<T>) => ReturnType<T>;
  }
}
