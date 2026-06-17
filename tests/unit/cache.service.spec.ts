import { CacheUtils } from '../../src/services/cache.service';
import { ValidationError } from '../../src/errors';

/**
 * Unit tests for the CacheUtils class.
 * These tests verify the behavior of each cache implementation individually.
 */
describe('CacheUtils', () => {
  // Tests for createCache (LRU eviction)
  describe('createCache', () => {
    it('should set and get a value', () => {
      // Arrange
      const cache = CacheUtils.createCache();

      // Act
      const setResult = cache.set('key1', 'value1');

      // Assert
      expect(setResult).toBe(true);
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for a missing key', () => {
      // Arrange
      const cache = CacheUtils.createCache();

      // Act & Assert
      expect(cache.get('missing')).toBeUndefined();
    });

    it('should check existence with has', () => {
      // Arrange
      const cache = CacheUtils.createCache();
      cache.set('key1', 'value1');

      // Act & Assert
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('missing')).toBe(false);
    });

    it('should delete a key', () => {
      // Arrange
      const cache = CacheUtils.createCache();
      cache.set('key1', 'value1');

      // Act
      const result = cache.delete('key1');

      // Assert
      expect(result).toBe(true);
      expect(cache.has('key1')).toBe(false);
    });

    it('should return false when deleting a missing key', () => {
      // Arrange
      const cache = CacheUtils.createCache();

      // Act & Assert
      expect(cache.delete('missing')).toBe(false);
    });

    it('should clear all items', () => {
      // Arrange
      const cache = CacheUtils.createCache();
      cache.set('a', 1);
      cache.set('b', 2);

      // Act
      cache.clear();

      // Assert
      expect(cache.size()).toBe(0);
      expect(cache.keys()).toEqual([]);
    });

    it('should return all keys', () => {
      // Arrange
      const cache = CacheUtils.createCache();
      cache.set('a', 1);
      cache.set('b', 2);

      // Act
      const keys = cache.keys();

      // Assert
      expect(keys).toContain('a');
      expect(keys).toContain('b');
      expect(keys).toHaveLength(2);
    });

    it('should report the correct size', () => {
      // Arrange
      const cache = CacheUtils.createCache();

      // Act & Assert
      expect(cache.size()).toBe(0);
      cache.set('a', 1);
      expect(cache.size()).toBe(1);
      cache.set('b', 2);
      expect(cache.size()).toBe(2);
    });

    it('should expire items after their TTL', () => {
      // Arrange
      const cache = CacheUtils.createCache({ ttl: 1000 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');

        // Act - advance time beyond the TTL
        mockTime = 2500;

        // Assert
        expect(cache.get('key1')).toBeUndefined();
        expect(cache.has('key1')).toBe(false);
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('should support a per-item TTL override', () => {
      // Arrange
      const cache = CacheUtils.createCache();
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('key1', 'value1', 500);

        // Act - advance time beyond the item TTL
        mockTime = 1600;

        // Assert
        expect(cache.get('key1')).toBeUndefined();
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('should evict the least recently used item when maxSize is reached', () => {
      // Arrange
      const cache = CacheUtils.createCache({ maxSize: 2 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('a', 1);
        mockTime = 1001;
        cache.set('b', 2);

        // Access 'a' to make it more recently used than 'b'
        mockTime = 1002;
        cache.get('a');

        // Act - adding a third item should evict 'b' (the LRU)
        mockTime = 1003;
        cache.set('c', 3);

        // Assert
        expect(cache.has('a')).toBe(true);
        expect(cache.has('b')).toBe(false);
        expect(cache.has('c')).toBe(true);
        expect(cache.size()).toBe(2);
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('should prune expired items and return the count removed', () => {
      // Arrange
      const cache = CacheUtils.createCache({ ttl: 1000 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('a', 1);
        cache.set('b', 2);

        // Act - advance time beyond the TTL and prune
        mockTime = 2500;
        const removed = cache.prune();

        // Assert
        expect(removed).toBe(2);
        expect(cache.size()).toBe(0);
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('should overwrite an existing key without evicting', () => {
      // Arrange
      const cache = CacheUtils.createCache({ maxSize: 2 });
      cache.set('a', 1);
      cache.set('b', 2);

      // Act
      cache.set('a', 99);

      // Assert
      expect(cache.get('a')).toBe(99);
      expect(cache.size()).toBe(2);
    });
  });

  // Tests for createLFUCache (LFU eviction)
  describe('createLFUCache', () => {
    it('should set and get a value', () => {
      // Arrange
      const cache = CacheUtils.createLFUCache();

      // Act
      cache.set('key1', 'value1');

      // Assert
      expect(cache.get('key1')).toBe('value1');
    });

    it('should track frequency on access', () => {
      // Arrange
      const cache = CacheUtils.createLFUCache();
      cache.set('key1', 'value1');

      // Act
      cache.get('key1');
      cache.get('key1');

      // Assert
      expect(cache.getFrequency('key1')).toBe(2);
    });

    it('should return 0 frequency for a missing key', () => {
      // Arrange
      const cache = CacheUtils.createLFUCache();

      // Act & Assert
      expect(cache.getFrequency('missing')).toBe(0);
    });

    it('should evict the least frequently used item when maxSize is reached', () => {
      // Arrange
      const cache = CacheUtils.createLFUCache({ maxSize: 2 });
      cache.set('a', 1);
      cache.set('b', 2);

      // Access 'a' multiple times to raise its frequency
      cache.get('a');
      cache.get('a');

      // Act - adding 'c' should evict 'b' (lowest frequency)
      cache.set('c', 3);

      // Assert
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('c')).toBe(true);
    });

    it('should preserve frequency when overwriting an existing key', () => {
      // Arrange
      const cache = CacheUtils.createLFUCache();
      cache.set('key1', 'value1');
      cache.get('key1');

      // Act
      cache.set('key1', 'updated');

      // Assert
      expect(cache.get('key1')).toBe('updated');
      expect(cache.getFrequency('key1')).toBe(2);
    });

    it('should expire items after their TTL', () => {
      // Arrange
      const cache = CacheUtils.createLFUCache({ ttl: 1000 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('key1', 'value1');

        // Act - advance time beyond the TTL
        mockTime = 2500;

        // Assert
        expect(cache.get('key1')).toBeUndefined();
        expect(cache.has('key1')).toBe(false);
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('should delete, clear, list keys and report size', () => {
      // Arrange
      const cache = CacheUtils.createLFUCache();
      cache.set('a', 1);
      cache.set('b', 2);

      // Act & Assert
      expect(cache.size()).toBe(2);
      expect(cache.keys()).toEqual(expect.arrayContaining(['a', 'b']));
      expect(cache.delete('a')).toBe(true);
      expect(cache.size()).toBe(1);
      cache.clear();
      expect(cache.size()).toBe(0);
    });

    it('should prune expired items and return the count removed', () => {
      // Arrange
      const cache = CacheUtils.createLFUCache({ ttl: 1000 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('a', 1);

        // Act
        mockTime = 2500;
        const removed = cache.prune();

        // Assert
        expect(removed).toBe(1);
        expect(cache.size()).toBe(0);
      } finally {
        Date.now = originalDateNow;
      }
    });
  });

  // Tests for createFIFOCache (FIFO eviction)
  describe('createFIFOCache', () => {
    it('should set and get a value', () => {
      // Arrange
      const cache = CacheUtils.createFIFOCache();

      // Act
      cache.set('key1', 'value1');

      // Assert
      expect(cache.get('key1')).toBe('value1');
    });

    it('should evict the oldest item first when maxSize is reached', () => {
      // Arrange
      const cache = CacheUtils.createFIFOCache({ maxSize: 2 });
      cache.set('a', 1);
      cache.set('b', 2);

      // Even accessing 'a' should not protect it (FIFO ignores access order)
      cache.get('a');

      // Act - adding 'c' should evict 'a' (the oldest inserted)
      cache.set('c', 3);

      // Assert
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
    });

    it('should return keys in insertion order', () => {
      // Arrange
      const cache = CacheUtils.createFIFOCache();

      // Act
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);

      // Assert
      expect(cache.keys()).toEqual(['a', 'b', 'c']);
    });

    it('should keep an updated key in its original insertion order (true FIFO)', () => {
      // Arrange
      const cache = CacheUtils.createFIFOCache();
      cache.set('a', 1);
      cache.set('b', 2);

      // Act - updating an existing key must NOT reset its position
      cache.set('a', 99);

      // Assert
      expect(cache.keys()).toEqual(['a', 'b']);
      expect(cache.get('a')).toBe(99);
    });

    it('should evict the original-oldest key even after it was updated', () => {
      // Arrange
      const cache = CacheUtils.createFIFOCache({ maxSize: 2 });
      cache.set('a', 1);
      cache.set('b', 2);

      // Updating 'a' keeps it first in line for eviction.
      cache.set('a', 99);

      // Act - adding 'c' should evict 'a' (the oldest inserted)
      cache.set('c', 3);

      // Assert
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
    });

    it('should expire items after their TTL', () => {
      // Arrange
      const cache = CacheUtils.createFIFOCache({ ttl: 1000 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('key1', 'value1');

        // Act - advance time beyond the TTL
        mockTime = 2500;

        // Assert
        expect(cache.get('key1')).toBeUndefined();
        expect(cache.has('key1')).toBe(false);
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('should delete, clear and report size', () => {
      // Arrange
      const cache = CacheUtils.createFIFOCache();
      cache.set('a', 1);
      cache.set('b', 2);

      // Act & Assert
      expect(cache.size()).toBe(2);
      expect(cache.delete('a')).toBe(true);
      expect(cache.keys()).toEqual(['b']);
      cache.clear();
      expect(cache.size()).toBe(0);
      expect(cache.keys()).toEqual([]);
    });

    it('should prune expired items and return the count removed', () => {
      // Arrange
      const cache = CacheUtils.createFIFOCache({ ttl: 1000 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('a', 1);
        cache.set('b', 2);

        // Act
        mockTime = 2500;
        const removed = cache.prune();

        // Assert
        expect(removed).toBe(2);
        expect(cache.size()).toBe(0);
      } finally {
        Date.now = originalDateNow;
      }
    });
  });

  // Targeted edge-branch coverage for the lazy-expiry path inside has().
  // These call has() directly on an expired item that is still stored, so the
  // delete-and-return-false branch (not reachable via a prior get()) executes.
  describe('lazy expiry via has()', () => {
    it('LRU has() should delete an expired item and return false', () => {
      // Arrange
      const cache = CacheUtils.createCache({ ttl: 1000 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('key1', 'value1');

        // Act - advance past the TTL and check has() first (no get()).
        mockTime = 2500;

        // Assert
        expect(cache.has('key1')).toBe(false);
        expect(cache.keys()).not.toContain('key1');
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('LFU has() should delete an expired item and return false', () => {
      // Arrange
      const cache = CacheUtils.createLFUCache({ ttl: 1000 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('key1', 'value1');

        // Act
        mockTime = 2500;

        // Assert
        expect(cache.has('key1')).toBe(false);
        expect(cache.keys()).not.toContain('key1');
      } finally {
        Date.now = originalDateNow;
      }
    });

    it('FIFO has() should delete an expired item and prune insertion order', () => {
      // Arrange
      const cache = CacheUtils.createFIFOCache({ ttl: 1000 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        cache.set('key1', 'value1');

        // Act
        mockTime = 2500;

        // Assert
        expect(cache.has('key1')).toBe(false);
        expect(cache.keys()).toEqual([]);
      } finally {
        Date.now = originalDateNow;
      }
    });
  });

  // Validation guards for invalid ttl / maxSize across all factories.
  describe('option validation', () => {
    it.each([
      ['createCache', (o: any) => CacheUtils.createCache(o)],
      ['createLFUCache', (o: any) => CacheUtils.createLFUCache(o)],
      ['createFIFOCache', (o: any) => CacheUtils.createFIFOCache(o)],
    ])('%s should reject a negative ttl', (_name, factory) => {
      expect(() => factory({ ttl: -1 })).toThrow(ValidationError);
    });

    it.each([
      ['createCache', (o: any) => CacheUtils.createCache(o)],
      ['createLFUCache', (o: any) => CacheUtils.createLFUCache(o)],
      ['createFIFOCache', (o: any) => CacheUtils.createFIFOCache(o)],
    ])('%s should reject a negative maxSize', (_name, factory) => {
      expect(() => factory({ maxSize: -5 })).toThrow(ValidationError);
    });

    it.each([
      ['createCache', (o: any) => CacheUtils.createCache(o)],
      ['createLFUCache', (o: any) => CacheUtils.createLFUCache(o)],
      ['createFIFOCache', (o: any) => CacheUtils.createFIFOCache(o)],
    ])('%s should reject a NaN ttl', (_name, factory) => {
      expect(() => factory({ ttl: NaN })).toThrow(ValidationError);
    });
  });

  // A TTL of 0 means "no expiry" consistently across factories.
  describe('ttl of 0 means no expiry', () => {
    it('createCache should not expire items when ttl is 0', () => {
      const cache = CacheUtils.createCache({ ttl: 0 });
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);
      try {
        cache.set('key1', 'value1');
        mockTime = 10_000_000;
        expect(cache.get('key1')).toBe('value1');
      } finally {
        Date.now = originalDateNow;
      }
    });
  });
});
