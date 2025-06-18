/**
 * Utility class for implementing retry mechanisms with various backoff strategies.
 */
export class RetryUtils {
  /**
   * Executes a function with retry capability using exponential backoff.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The async function to execute.
   * @param {number} [params.maxRetries=3] - Maximum number of retry attempts.
   * @param {number} [params.initialDelay=1000] - Initial delay in milliseconds.
   * @param {number} [params.maxDelay=30000] - Maximum delay in milliseconds.
   * @param {Function} [params.shouldRetry] - Optional function to determine if a retry should be attempted based on the error.
   * @returns {Promise<any>} The result of the function execution.
   * @throws {Error} The last error encountered if all retries fail.
   * @example
   * // Retry a function with default parameters
   * const result = await RetryUtils.withExponentialBackoff({
   *   fn: async () => {
   *     const response = await fetch('https://api.example.com/data');
   *     if (!response.ok) throw new Error('API request failed');
   *     return response.json();
   *   }
   * });
   * 
   * // Retry with custom parameters
   * const result = await RetryUtils.withExponentialBackoff({
   *   fn: fetchData,
   *   maxRetries: 5,
   *   initialDelay: 500,
   *   maxDelay: 10000,
   *   shouldRetry: (error) => error.message.includes('timeout')
   * });
   */
  public static async withExponentialBackoff<T>({
    fn,
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    shouldRetry,
  }: {
    fn: () => Promise<T>;
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: Error) => boolean;
  }): Promise<T> {
    let lastError: Error;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt >= maxRetries) {
          break;
        }

        if (shouldRetry && !shouldRetry(lastError)) {
          break;
        }

        // Calculate delay with exponential backoff
        delay = Math.min(delay * 2, maxDelay);
        
        // Add some jitter to prevent synchronized retries
        const jitter = delay * 0.2 * Math.random();
        const actualDelay = delay + jitter;

        await new Promise(resolve => setTimeout(resolve, actualDelay));
      }
    }

    throw lastError;
  }

  /**
   * Executes a function with retry capability using linear backoff.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The async function to execute.
   * @param {number} [params.maxRetries=3] - Maximum number of retry attempts.
   * @param {number} [params.delay=1000] - Delay in milliseconds between retries.
   * @param {Function} [params.shouldRetry] - Optional function to determine if a retry should be attempted based on the error.
   * @returns {Promise<any>} The result of the function execution.
   * @throws {Error} The last error encountered if all retries fail.
   * @example
   * // Retry a function with linear backoff
   * const result = await RetryUtils.withLinearBackoff({
   *   fn: async () => {
   *     const response = await fetch('https://api.example.com/data');
   *     if (!response.ok) throw new Error('API request failed');
   *     return response.json();
   *   },
   *   delay: 2000
   * });
   */
  public static async withLinearBackoff<T>({
    fn,
    maxRetries = 3,
    delay = 1000,
    shouldRetry,
  }: {
    fn: () => Promise<T>;
    maxRetries?: number;
    delay?: number;
    shouldRetry?: (error: Error) => boolean;
  }): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt >= maxRetries) {
          break;
        }

        if (shouldRetry && !shouldRetry(lastError)) {
          break;
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Executes a function with retry capability using a custom backoff strategy.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The async function to execute.
   * @param {number} [params.maxRetries=3] - Maximum number of retry attempts.
   * @param {Function} params.backoffStrategy - Function that calculates delay based on attempt number.
   * @param {Function} [params.shouldRetry] - Optional function to determine if a retry should be attempted based on the error.
   * @returns {Promise<any>} The result of the function execution.
   * @throws {Error} The last error encountered if all retries fail.
   * @example
   * // Retry with a custom backoff strategy
   * const result = await RetryUtils.withCustomBackoff({
   *   fn: fetchData,
   *   maxRetries: 5,
   *   backoffStrategy: (attempt) => Math.pow(2, attempt) * 1000 + Math.random() * 1000,
   *   shouldRetry: (error) => !error.message.includes('not found')
   * });
   */
  public static async withCustomBackoff<T>({
    fn,
    maxRetries = 3,
    backoffStrategy,
    shouldRetry,
  }: {
    fn: () => Promise<T>;
    maxRetries?: number;
    backoffStrategy: (attempt: number) => number;
    shouldRetry?: (error: Error) => boolean;
  }): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt >= maxRetries) {
          break;
        }

        if (shouldRetry && !shouldRetry(lastError)) {
          break;
        }

        const delay = backoffStrategy(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Decorates a function with retry capability.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The async function to decorate.
   * @param {object} [params.options] - Retry options.
   * @param {number} [params.options.maxRetries=3] - Maximum number of retry attempts.
   * @param {number} [params.options.initialDelay=1000] - Initial delay in milliseconds.
   * @param {number} [params.options.maxDelay=30000] - Maximum delay in milliseconds.
   * @param {Function} [params.options.shouldRetry] - Function to determine if retry should be attempted.
   * @param {'exponential'|'linear'|'custom'} [params.options.strategy='exponential'] - Backoff strategy.
   * @param {Function} [params.options.backoffStrategy] - Custom backoff strategy function.
   * @returns {Function} A decorated function with retry capability.
   * @example
   * // Create a retryable function with exponential backoff
   * const fetchWithRetry = RetryUtils.retryable({
   *   fn: fetchData,
   *   options: {
   *     maxRetries: 5,
   *     initialDelay: 500,
   *     strategy: 'exponential'
   *   }
   * });
   * 
   * // Use the retryable function
   * const data = await fetchWithRetry(url, options);
   */
  public static retryable<T extends (...args: any[]) => Promise<any>>({
    fn,
    options = {},
  }: {
    fn: T;
    options?: {
      maxRetries?: number;
      initialDelay?: number;
      maxDelay?: number;
      delay?: number;
      shouldRetry?: (error: Error) => boolean;
      strategy?: 'exponential' | 'linear' | 'custom';
      backoffStrategy?: (attempt: number) => number;
    };
  }): T {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      delay = 1000,
      shouldRetry,
      strategy = 'exponential',
      backoffStrategy,
    } = options;

    return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      const wrappedFn = () => fn(...args);

      switch (strategy) {
        case 'linear':
          return RetryUtils.withLinearBackoff({
            fn: wrappedFn,
            maxRetries,
            delay,
            shouldRetry,
          }) as ReturnType<T>;

        case 'custom':
          if (!backoffStrategy) {
            throw new Error('Custom backoff strategy function is required when using "custom" strategy');
          }
          return RetryUtils.withCustomBackoff({
            fn: wrappedFn,
            maxRetries,
            backoffStrategy,
            shouldRetry,
          }) as ReturnType<T>;

        case 'exponential':
        default:
          return RetryUtils.withExponentialBackoff({
            fn: wrappedFn,
            maxRetries,
            initialDelay,
            maxDelay,
            shouldRetry,
          }) as ReturnType<T>;
      }
    }) as T;
  }
}