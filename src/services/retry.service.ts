export class RetryUtils {
  /**
   * Retries a function until it succeeds or the maximum number of attempts is reached.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The function to retry.
   * @param {number} [params.maxAttempts=3] - The maximum number of attempts.
   * @param {number} [params.delay=1000] - The delay between attempts in milliseconds.
   * @param {boolean} [params.exponentialBackoff=false] - Whether to use exponential backoff for delays.
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
   *   exponentialBackoff: true
   * });
   */
  public static async retry<T>({
    fn,
    maxAttempts = 3,
    delay = 1000,
    exponentialBackoff = false,
  }: {
    fn: () => Promise<T>;
    maxAttempts?: number;
    delay?: number;
    exponentialBackoff?: boolean;
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

        const waitTime = exponentialBackoff
          ? delay * Math.pow(2, attempt - 1)
          : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
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
   * @param {number} [params.options.delay=1000] - The delay between attempts in milliseconds.
   * @param {boolean} [params.options.exponentialBackoff=false] - Whether to use exponential backoff for delays.
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
    };
  }): T {
    const {
      maxAttempts = 3,
      delay = 1000,
      exponentialBackoff = false,
    } = options;

    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
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

          const waitTime = exponentialBackoff
            ? delay * Math.pow(2, attempt - 1)
            : delay;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

      throw lastError;
    }) as T;
  }
}
