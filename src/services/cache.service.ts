import { ValidationError } from '../errors';

/**
 * Validates ttl / maxSize cache options.
 * @param ttl Default time-to-live in milliseconds (0 = no expiration).
 * @param maxSize Maximum number of items (0 = unlimited).
 * @throws {ValidationError} If ttl or maxSize is negative, NaN or non-numeric.
 */
function validateCacheOptions(ttl: number, maxSize: number): void {
  if (typeof ttl !== 'number' || Number.isNaN(ttl) || ttl < 0) {
    throw new ValidationError(
      'ttl must be a non-negative number',
      'ttl',
      'non-negative number',
      ttl,
    );
  }
  if (typeof maxSize !== 'number' || Number.isNaN(maxSize) || maxSize < 0) {
    throw new ValidationError(
      'maxSize must be a non-negative number',
      'maxSize',
      'non-negative number',
      maxSize,
    );
  }
}

export class CacheUtils {
  /**
   * Creates a simple in-memory cache with optional TTL.
   * @param {object} [options] - Cache configuration options.
   * @param {number} [options.ttl=0] - Default time-to-live in milliseconds (0 = no expiration).
   * @param {number} [options.maxSize=0] - Maximum number of items in the cache (0 = unlimited).
   * @returns {object} A cache instance with get, set, has, delete, and clear methods.
   * @example
   * const cache = CacheUtils.createCache({ ttl: 60000, maxSize: 100 });
   * cache.set('key1', 'value1');
   * console.log(cache.get('key1')); // 'value1'
   * cache.delete('key1');
   * console.log(cache.has('key1')); // false
   */
  public static createCache({
    ttl = 0,
    maxSize = 0,
  }: {
    ttl?: number;
    maxSize?: number;
  } = {}) {
    validateCacheOptions(ttl, maxSize);

    // The Map's own insertion order is the source of truth for recency: the
    // first key is the least-recently-used and the last key is the most
    // recent. On get() we delete+set to move the entry to the tail (O(1)),
    // and we evict from the head via keys().next().value.
    const cache = new Map<string, { value: any; expiry: number | null }>();

    return {
      /**
       * Gets a value from the cache.
       * @param {string} key - The key to retrieve.
       * @returns {any} The cached value, or undefined if not found or expired.
       */
      get(key: string): any {
        const item = cache.get(key);
        if (!item) return undefined;

        const now = Date.now();
        if (item.expiry !== null && now > item.expiry) {
          cache.delete(key);
          return undefined;
        }

        // Move to the tail to mark it as most-recently-used (O(1)).
        cache.delete(key);
        cache.set(key, item);
        return item.value;
      },

      /**
       * Sets a value in the cache.
       * @param {string} key - The key to set.
       * @param {any} value - The value to cache.
       * @param {number} [itemTtl] - Optional TTL for this specific item (0 = no expiry).
       * @returns {boolean} True if the item was set successfully.
       */
      set(key: string, value: any, itemTtl?: number): boolean {
        const now = Date.now();
        const effectiveTtl = itemTtl ?? ttl;
        const expiry = effectiveTtl ? now + effectiveTtl : null;

        // If maxSize is reached, remove least recently used item (the head).
        if (maxSize > 0 && cache.size >= maxSize && !cache.has(key)) {
          const lruKey = cache.keys().next().value;
          if (lruKey !== undefined) {
            cache.delete(lruKey);
          }
        }

        // Delete first so re-insertion moves the key to the tail (most recent).
        cache.delete(key);
        cache.set(key, { value, expiry });

        return true;
      },

      /**
       * Checks if a key exists in the cache and is not expired.
       * @param {string} key - The key to check.
       * @returns {boolean} True if the key exists and is not expired.
       */
      has(key: string): boolean {
        const item = cache.get(key);
        if (!item) return false;

        const now = Date.now();
        if (item.expiry !== null && now > item.expiry) {
          cache.delete(key);
          return false;
        }

        return true;
      },

      /**
       * Deletes a key from the cache.
       * @param {string} key - The key to delete.
       * @returns {boolean} True if the key was deleted, false if it didn't exist.
       */
      delete(key: string): boolean {
        return cache.delete(key);
      },

      /**
       * Clears all items from the cache.
       */
      clear(): void {
        cache.clear();
      },

      /**
       * Gets all keys in the cache.
       * @returns {string[]} Array of keys.
       */
      keys(): string[] {
        return Array.from(cache.keys());
      },

      /**
       * Gets the number of items in the cache.
       * @returns {number} The number of items.
       */
      size(): number {
        return cache.size;
      },

      /**
       * Removes all expired items from the cache.
       * @returns {number} The number of items removed.
       */
      prune(): number {
        const now = Date.now();
        let count = 0;

        for (const [key, item] of cache.entries()) {
          if (item.expiry !== null && now > item.expiry) {
            cache.delete(key);
            count++;
          }
        }

        return count;
      },
    };
  }

  /**
   * Creates a cache with least-frequently-used (LFU) eviction policy.
   * @param {object} [options] - Cache configuration options.
   * @param {number} [options.ttl=0] - Default time-to-live in milliseconds (0 = no expiration).
   * @param {number} [options.maxSize=0] - Maximum number of items in the cache (0 = unlimited).
   * @returns {object} A cache instance with LFU eviction policy.
   * @example
   * const cache = CacheUtils.createLFUCache({ maxSize: 100 });
   * cache.set('key1', 'value1');
   * cache.get('key1'); // Increases usage count
   * cache.get('key1'); // Increases usage count again
   */
  public static createLFUCache({
    ttl = 0,
    maxSize = 0,
  }: {
    ttl?: number;
    maxSize?: number;
  } = {}) {
    validateCacheOptions(ttl, maxSize);

    const cache = new Map<
      string,
      { value: any; expiry: number | null; frequency: number }
    >();

    return {
      /**
       * Gets a value from the cache.
       * @param {string} key - The key to retrieve.
       * @returns {any} The cached value, or undefined if not found or expired.
       */
      get(key: string): any {
        const item = cache.get(key);
        if (!item) return undefined;

        const now = Date.now();
        if (item.expiry !== null && now > item.expiry) {
          cache.delete(key);
          return undefined;
        }

        // Increase frequency counter
        item.frequency++;
        return item.value;
      },

      /**
       * Sets a value in the cache.
       * @param {string} key - The key to set.
       * @param {any} value - The value to cache.
       * @param {number} [itemTtl] - Optional TTL for this specific item.
       * @returns {boolean} True if the item was set successfully.
       */
      set(key: string, value: any, itemTtl?: number): boolean {
        const now = Date.now();
        const effectiveTtl = itemTtl ?? ttl;
        const expiry = effectiveTtl ? now + effectiveTtl : null;

        // If maxSize is reached, remove least frequently used item
        if (maxSize > 0 && cache.size >= maxSize && !cache.has(key)) {
          let lfuKey: string | undefined;
          let minFrequency = Infinity;

          for (const [k, item] of cache.entries()) {
            if (item.frequency < minFrequency) {
              lfuKey = k;
              minFrequency = item.frequency;
            }
          }

          if (lfuKey) {
            cache.delete(lfuKey);
          }
        }

        // Get existing frequency or start at 0
        const existingItem = cache.get(key);
        const frequency = existingItem ? existingItem.frequency : 0;

        cache.set(key, { value, expiry, frequency });
        return true;
      },

      /**
       * Checks if a key exists in the cache and is not expired.
       * @param {string} key - The key to check.
       * @returns {boolean} True if the key exists and is not expired.
       */
      has(key: string): boolean {
        const item = cache.get(key);
        if (!item) return false;

        const now = Date.now();
        if (item.expiry !== null && now > item.expiry) {
          cache.delete(key);
          return false;
        }

        return true;
      },

      /**
       * Deletes a key from the cache.
       * @param {string} key - The key to delete.
       * @returns {boolean} True if the key was deleted, false if it didn't exist.
       */
      delete(key: string): boolean {
        return cache.delete(key);
      },

      /**
       * Clears all items from the cache.
       */
      clear(): void {
        cache.clear();
      },

      /**
       * Gets all keys in the cache.
       * @returns {string[]} Array of keys.
       */
      keys(): string[] {
        return Array.from(cache.keys());
      },

      /**
       * Gets the number of items in the cache.
       * @returns {number} The number of items.
       */
      size(): number {
        return cache.size;
      },

      /**
       * Removes all expired items from the cache.
       * @returns {number} The number of items removed.
       */
      prune(): number {
        const now = Date.now();
        let count = 0;

        for (const [key, item] of cache.entries()) {
          if (item.expiry !== null && now > item.expiry) {
            cache.delete(key);
            count++;
          }
        }

        return count;
      },

      /**
       * Gets the frequency count for a key.
       * @param {string} key - The key to check.
       * @returns {number} The frequency count, or 0 if the key doesn't exist.
       */
      getFrequency(key: string): number {
        const item = cache.get(key);
        return item ? item.frequency : 0;
      },
    };
  }

  /**
   * Creates a cache with first-in-first-out (FIFO) eviction policy.
   * @param {object} [options] - Cache configuration options.
   * @param {number} [options.ttl=0] - Default time-to-live in milliseconds (0 = no expiration).
   * @param {number} [options.maxSize=0] - Maximum number of items in the cache (0 = unlimited).
   * @returns {object} A cache instance with FIFO eviction policy.
   * @example
   * const cache = CacheUtils.createFIFOCache({ maxSize: 100 });
   * cache.set('key1', 'value1');
   * cache.set('key2', 'value2');
   * // When maxSize is reached, the oldest item ('key1') will be evicted first
   */
  public static createFIFOCache({
    ttl = 0,
    maxSize = 0,
  }: {
    ttl?: number;
    maxSize?: number;
  } = {}) {
    validateCacheOptions(ttl, maxSize);

    const cache = new Map<string, { value: any; expiry: number | null }>();
    const insertionOrder: string[] = [];

    return {
      /**
       * Gets a value from the cache.
       * @param {string} key - The key to retrieve.
       * @returns {any} The cached value, or undefined if not found or expired.
       */
      get(key: string): any {
        const item = cache.get(key);
        if (!item) return undefined;

        const now = Date.now();
        if (item.expiry !== null && now > item.expiry) {
          cache.delete(key);
          const index = insertionOrder.indexOf(key);
          if (index !== -1) {
            insertionOrder.splice(index, 1);
          }
          return undefined;
        }

        return item.value;
      },

      /**
       * Sets a value in the cache.
       * @param {string} key - The key to set.
       * @param {any} value - The value to cache.
       * @param {number} [itemTtl] - Optional TTL for this specific item.
       * @returns {boolean} True if the item was set successfully.
       */
      set(key: string, value: any, itemTtl?: number): boolean {
        const now = Date.now();
        const effectiveTtl = itemTtl ?? ttl;
        const expiry = effectiveTtl ? now + effectiveTtl : null;

        // If maxSize is reached, remove oldest item (FIFO)
        if (maxSize > 0 && cache.size >= maxSize && !cache.has(key)) {
          const firstKey = insertionOrder[0];
          if (firstKey) {
            cache.delete(firstKey);
            insertionOrder.shift();
          }
        }

        // True FIFO: updating an existing key keeps its original insertion
        // position, so only record the order for genuinely new keys.
        const isNew = !cache.has(key);
        cache.set(key, { value, expiry });
        if (isNew) {
          insertionOrder.push(key);
        }
        return true;
      },

      /**
       * Checks if a key exists in the cache and is not expired.
       * @param {string} key - The key to check.
       * @returns {boolean} True if the key exists and is not expired.
       */
      has(key: string): boolean {
        const item = cache.get(key);
        if (!item) return false;

        const now = Date.now();
        if (item.expiry !== null && now > item.expiry) {
          cache.delete(key);
          const index = insertionOrder.indexOf(key);
          if (index !== -1) {
            insertionOrder.splice(index, 1);
          }
          return false;
        }

        return true;
      },

      /**
       * Deletes a key from the cache.
       * @param {string} key - The key to delete.
       * @returns {boolean} True if the key was deleted, false if it didn't exist.
       */
      delete(key: string): boolean {
        const result = cache.delete(key);
        const index = insertionOrder.indexOf(key);
        if (index !== -1) {
          insertionOrder.splice(index, 1);
        }
        return result;
      },

      /**
       * Clears all items from the cache.
       */
      clear(): void {
        cache.clear();
        insertionOrder.length = 0;
      },

      /**
       * Gets all keys in the cache.
       * @returns {string[]} Array of keys in insertion order.
       */
      keys(): string[] {
        return [...insertionOrder];
      },

      /**
       * Gets the number of items in the cache.
       * @returns {number} The number of items.
       */
      size(): number {
        return cache.size;
      },

      /**
       * Removes all expired items from the cache.
       * @returns {number} The number of items removed.
       */
      prune(): number {
        const now = Date.now();
        let count = 0;

        for (const [key, item] of cache.entries()) {
          if (item.expiry !== null && now > item.expiry) {
            cache.delete(key);
            const index = insertionOrder.indexOf(key);
            if (index !== -1) {
              insertionOrder.splice(index, 1);
            }
            count++;
          }
        }

        return count;
      },
    };
  }
}
