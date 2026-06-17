import { Cache } from '../../src/utils/cache';

/**
 * Unit tests for the Cache class.
 * These tests verify basic storage operations, TTL expiration,
 * pruning and the getOrCompute helper.
 */
describe('Cache', () => {
  beforeEach(() => {
    // Arrange: use fake timers so TTL expiration is deterministic
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('set / get', () => {
    it('should store and retrieve a value', () => {
      // Arrange
      const cache = new Cache<number>();

      // Act
      cache.set('a', 1);
      const result = cache.get('a');

      // Assert
      expect(result).toBe(1);
    });

    it('should return undefined for a missing key', () => {
      // Arrange
      const cache = new Cache<number>();

      // Act
      const result = cache.get('missing');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should expire a value after the default TTL', () => {
      // Arrange
      const cache = new Cache<number>(1000);
      cache.set('a', 1);

      // Act
      jest.advanceTimersByTime(1001);
      const result = cache.get('a');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should keep a value within the default TTL window', () => {
      // Arrange
      const cache = new Cache<number>(1000);
      cache.set('a', 1);

      // Act
      jest.advanceTimersByTime(500);
      const result = cache.get('a');

      // Assert
      expect(result).toBe(1);
    });

    it('should never expire a value when ttl is null', () => {
      // Arrange
      const cache = new Cache<number>(1000);
      cache.set('a', 1, null);

      // Act
      jest.advanceTimersByTime(10_000_000);
      const result = cache.get('a');

      // Assert
      expect(result).toBe(1);
    });

    it('should never expire when default ttl is null and no per-key ttl is given', () => {
      // Arrange - defaultTTL null + omitted per-call ttl must mean NO expiry,
      // not an immediate expiry at Date.now() + 0.
      const cache = new Cache<number>(null);
      cache.set('a', 1);

      // Act
      jest.advanceTimersByTime(10_000_000);
      const result = cache.get('a');

      // Assert
      expect(result).toBe(1);
    });

    it('should never expire when both the default and per-key ttl are null', () => {
      // Arrange
      const cache = new Cache<number>(null);
      cache.set('a', 1, null);

      // Act
      jest.advanceTimersByTime(10_000_000);
      const result = cache.get('a');

      // Assert
      expect(result).toBe(1);
    });

    it('should honor a per-key ttl overriding the default', () => {
      // Arrange
      const cache = new Cache<number>(60000);
      cache.set('a', 1, 1000);

      // Act
      jest.advanceTimersByTime(1001);
      const result = cache.get('a');

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true for an existing non-expired key', () => {
      // Arrange
      const cache = new Cache<number>();
      cache.set('a', 1);

      // Act & Assert
      expect(cache.has('a')).toBe(true);
    });

    it('should return false for a missing key', () => {
      // Arrange
      const cache = new Cache<number>();

      // Act & Assert
      expect(cache.has('missing')).toBe(false);
    });

    it('should return false for an expired key', () => {
      // Arrange
      const cache = new Cache<number>(1000);
      cache.set('a', 1);

      // Act
      jest.advanceTimersByTime(1001);

      // Assert
      expect(cache.has('a')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete an existing key and return true', () => {
      // Arrange
      const cache = new Cache<number>();
      cache.set('a', 1);

      // Act
      const result = cache.delete('a');

      // Assert
      expect(result).toBe(true);
      expect(cache.get('a')).toBeUndefined();
    });

    it('should return false when deleting a missing key', () => {
      // Arrange
      const cache = new Cache<number>();

      // Act & Assert
      expect(cache.delete('missing')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      // Arrange
      const cache = new Cache<number>();
      cache.set('a', 1);
      cache.set('b', 2);

      // Act
      cache.clear();

      // Assert
      expect(cache.size).toBe(0);
      expect(cache.get('a')).toBeUndefined();
    });
  });

  describe('prune', () => {
    it('should remove only expired items and return the count', () => {
      // Arrange
      const cache = new Cache<number>(1000);
      cache.set('expired', 1, 1000);
      cache.set('alive', 2, null);

      // Act
      jest.advanceTimersByTime(1001);
      const removed = cache.prune();

      // Assert
      expect(removed).toBe(1);
      expect(cache.size).toBe(1);
      expect(cache.get('alive')).toBe(2);
    });

    it('should return zero when nothing is expired', () => {
      // Arrange
      const cache = new Cache<number>(1000);
      cache.set('a', 1);

      // Act
      const removed = cache.prune();

      // Assert
      expect(removed).toBe(0);
    });
  });

  describe('size', () => {
    it('should reflect the number of stored items', () => {
      // Arrange
      const cache = new Cache<number>();

      // Act
      cache.set('a', 1);
      cache.set('b', 2);

      // Assert
      expect(cache.size).toBe(2);
    });
  });

  describe('getOrCompute', () => {
    it('should compute and cache the value when missing', async () => {
      // Arrange
      const cache = new Cache<number>();
      const factory = jest.fn().mockResolvedValue(42);

      // Act
      const result = await cache.getOrCompute('a', factory);

      // Assert
      expect(result).toBe(42);
      expect(factory).toHaveBeenCalledTimes(1);
      expect(cache.get('a')).toBe(42);
    });

    it('should return the cached value without recomputing', async () => {
      // Arrange
      const cache = new Cache<number>();
      const factory = jest.fn().mockResolvedValue(42);
      await cache.getOrCompute('a', factory);

      // Act
      const result = await cache.getOrCompute('a', factory);

      // Assert
      expect(result).toBe(42);
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('should recompute the value after it expires', async () => {
      // Arrange
      const cache = new Cache<number>(1000);
      const factory = jest
        .fn()
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(2);
      await cache.getOrCompute('a', factory, 1000);

      // Act
      jest.advanceTimersByTime(1001);
      const result = await cache.getOrCompute('a', factory, 1000);

      // Assert
      expect(result).toBe(2);
      expect(factory).toHaveBeenCalledTimes(2);
    });
  });
});
