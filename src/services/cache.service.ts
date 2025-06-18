/**
 * Utility class for in-memory caching with various features like TTL, capacity limits, and LRU eviction.
 */
export class CacheUtils {
  /**
   * Creates a simple in-memory cache with optional TTL.
   * @returns {SimpleCache} A new simple cache instance.
   * @example
   * const cache = CacheUtils.createSimpleCache();
   * 
   * // Set a value with default TTL
   * cache.set('user:123', { name: 'John', role: 'admin' });
   * 
   * // Set a value with custom TTL (5 minutes)
   * cache.set('session:abc', { token: 'xyz' }, 5 * 60 * 1000);
   * 
   * // Get a value
   * const user = cache.get('user:123');
   * 
   * // Check if a key exists
   * if (cache.has('session:abc')) {
   *   console.log('Session exists');
   * }
   * 
   * // Remove a value
   * cache.delete('user:123');
   * 
   * // Clear the entire cache
   * cache.clear();
   */
  public static createSimpleCache(): SimpleCache {
    return new SimpleCache();
  }

  /**
   * Creates an LRU (Least Recently Used) cache with a maximum capacity.
   * @param {object} [params] - The parameters for the method.
   * @param {number} [params.capacity=100] - Maximum number of items to store in the cache.
   * @returns {LRUCache} A new LRU cache instance.
   * @example
   * // Create an LRU cache with default capacity (100)
   * const cache = CacheUtils.createLRUCache();
   * 
   * // Create an LRU cache with custom capacity
   * const smallCache = CacheUtils.createLRUCache({ capacity: 10 });
   * 
   * // Use the cache
   * smallCache.set('key1', 'value1');
   * const value = smallCache.get('key1'); // 'value1'
   */
  public static createLRUCache({ capacity = 100 }: { capacity?: number } = {}): LRUCache {
    return new LRUCache(capacity);
  }

  /**
   * Creates a memoization wrapper for a function.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The function to memoize.
   * @param {Function} [params.keyGenerator] - Optional function to generate cache keys from arguments.
   * @param {number} [params.ttl] - Optional TTL in milliseconds for cached results.
   * @returns {Function} A memoized version of the input function.
   * @example
   * // Memoize a function that calculates fibonacci numbers
   * const fibonacci = CacheUtils.memoize({
   *   fn: (n) => n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2),
   *   ttl: 60000 // Cache results for 1 minute
   * });
   * 
   * // The first call will compute the result
   * console.log(fibonacci(40)); // Slow computation
   * 
   * // Subsequent calls with the same argument will use the cached result
   * console.log(fibonacci(40)); // Instant result from cache
   */
  public static memoize<T extends (...args: any[]) => any>({
    fn,
    keyGenerator,
    ttl,
  }: {
    fn: T;
    keyGenerator?: (...args: Parameters<T>) => string;
    ttl?: number;
  }): T {
    const cache = CacheUtils.createSimpleCache();

    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = keyGenerator 
        ? keyGenerator(...args) 
        : JSON.stringify(args);

      if (cache.has(key)) {
        return cache.get(key) as ReturnType<T>;
      }

      const result = fn(...args);

      // Handle promises
      if (result instanceof Promise) {
        return result
          .then(value => {
            cache.set(key, value, ttl);
            return value;
          })
          .catch(error => {
            throw error;
          }) as ReturnType<T>;
      }

      cache.set(key, result, ttl);
      return result;
    }) as T;
  }
}

/**
 * Interface for cache entries with optional expiration.
 */
interface CacheEntry<T> {
  value: T;
  expiry?: number;
}

/**
 * A simple in-memory cache implementation with optional TTL.
 */
export class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Sets a value in the cache with an optional TTL.
   * @param {string} key - The cache key.
   * @param {T} value - The value to store.
   * @param {number} [ttl] - Optional TTL in milliseconds.
   * @example
   * cache.set('user:123', userData);
   * cache.set('session:abc', sessionData, 30 * 60 * 1000); // 30 minutes TTL
   */
  public set<T>(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = { value };
    
    if (ttl !== undefined && ttl > 0) {
      entry.expiry = Date.now() + ttl;
    }

    this.cache.set(key, entry);
  }

  /**
   * Gets a value from the cache.
   * @param {string} key - The cache key.
   * @returns {T | undefined} The cached value, or undefined if not found or expired.
   * @example
   * const userData = cache.get('user:123');
   * if (userData) {
   *   console.log('User found:', userData);
   * }
   */
  public get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }

    // Check if the entry has expired
    if (entry.expiry !== undefined && entry.expiry < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  /**
   * Checks if a key exists in the cache and is not expired.
   * @param {string} key - The cache key.
   * @returns {boolean} `true` if the key exists and is not expired, otherwise `false`.
   * @example
   * if (cache.has('session:abc')) {
   *   console.log('Session is active');
   * }
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if the entry has expired
    if (entry.expiry !== undefined && entry.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Deletes a value from the cache.
   * @param {string} key - The cache key.
   * @returns {boolean} `true` if the key was found and deleted, otherwise `false`.
   * @example
   * cache.delete('user:123');
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all values from the cache.
   * @example
   * cache.clear();
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Returns the number of items in the cache.
   * @returns {number} The number of items in the cache.
   * @example
   * console.log(`Cache contains ${cache.size()} items`);
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Returns an array of all keys in the cache.
   * @returns {string[]} An array of cache keys.
   * @example
   * const keys = cache.keys();
   * console.log('Cached keys:', keys);
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Removes all expired entries from the cache.
   * @returns {number} The number of entries removed.
   * @example
   * const removed = cache.prune();
   * console.log(`Removed ${removed} expired entries`);
   */
  public prune(): number {
    const now = Date.now();
    let count = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry !== undefined && entry.expiry < now) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }
}

/**
 * An LRU (Least Recently Used) cache implementation.
 */
export class LRUCache {
  private cache: Map<string, any> = new Map();
  private capacity: number;

  /**
   * Creates a new LRU cache instance.
   * @param {number} capacity - Maximum number of items to store in the cache.
   */
  constructor(capacity: number) {
    this.capacity = capacity;
  }

  /**
   * Gets a value from the cache and marks it as recently used.
   * @param {string} key - The cache key.
   * @returns {T | undefined} The cached value, or undefined if not found.
   * @example
   * const value = cache.get('key1');
   */
  public get<T>(key: string): T | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Remove and re-add to mark as most recently used
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value as T;
  }

  /**
   * Sets a value in the cache.
   * @param {string} key - The cache key.
   * @param {T} value - The value to store.
   * @example
   * cache.set('key1', 'value1');
   */
  public set<T>(key: string, value: T): void {
    // If key exists, remove it first to update its position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // If at capacity, remove the least recently used item (first item)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  /**
   * Checks if a key exists in the cache.
   * @param {string} key - The cache key.
   * @returns {boolean} `true` if the key exists, otherwise `false`.
   * @example
   * if (cache.has('key1')) {
   *   console.log('Key exists in cache');
   * }
   */
  public has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Deletes a value from the cache.
   * @param {string} key - The cache key.
   * @returns {boolean} `true` if the key was found and deleted, otherwise `false`.
   * @example
   * cache.delete('key1');
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all values from the cache.
   * @example
   * cache.clear();
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Returns the number of items in the cache.
   * @returns {number} The number of items in the cache.
   * @example
   * console.log(`Cache contains ${cache.size()} items`);
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Returns the maximum capacity of the cache.
   * @returns {number} The maximum capacity.
   * @example
   * console.log(`Cache capacity: ${cache.getCapacity()}`);
   */
  public getCapacity(): number {
    return this.capacity;
  }

  /**
   * Sets a new capacity for the cache.
   * If the new capacity is smaller than the current size, the least recently used items are removed.
   * @param {number} newCapacity - The new maximum capacity.
   * @example
   * cache.setCapacity(200); // Increase capacity
   * cache.setCapacity(50);  // Decrease capacity, may remove items
   */
  public setCapacity(newCapacity: number): void {
    if (newCapacity <= 0) {
      throw new Error('Capacity must be greater than zero');
    }

    this.capacity = newCapacity;

    // If we're over capacity, remove least recently used items
    while (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Returns an array of all keys in the cache, ordered from least to most recently used.
   * @returns {string[]} An array of cache keys.
   * @example
   * const keys = cache.keys();
   * console.log('Least recently used key:', keys[0]);
   * console.log('Most recently used key:', keys[keys.length - 1]);
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }
}