/**
 * Simple in-memory cache implementation
 */
export class Cache<T> {
  private cache: Map<string, { value: T; expires: number | null }>;
  private defaultTTL: number | null;

  /**
   * Creates a new Cache instance
   * @param defaultTTL Default time-to-live in milliseconds (null for no expiration)
   */
  constructor(defaultTTL: number | null = 60000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Sets a value in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time-to-live in milliseconds (null for no expiration, undefined for default)
   */
  set(key: string, value: T, ttl?: number | null): void {
    const expires =
      ttl === null ? null : Date.now() + (ttl ?? this.defaultTTL ?? 0);
    this.cache.set(key, { value, expires });
  }

  /**
   * Gets a value from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) {
      return undefined;
    }

    // Check if expired
    if (item.expires !== null && item.expires < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Gets a value from the cache or computes it if not found
   * @param key Cache key
   * @param factory Function to compute the value if not in cache
   * @param ttl Time-to-live in milliseconds (null for no expiration, undefined for default)
   * @returns The cached or computed value
   */
  async getOrCompute(
    key: string,
    factory: () => Promise<T>,
    ttl?: number | null,
  ): Promise<T> {
    const cachedValue = this.get(key);

    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Checks if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Deletes a value from the cache
   * @param key Cache key
   * @returns True if the key was found and deleted
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all values from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Removes all expired items from the cache
   * @returns Number of items removed
   */
  prune(): number {
    let count = 0;
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.expires !== null && item.expires < now) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Gets the number of items in the cache
   */
  get size(): number {
    return this.cache.size;
  }
}
