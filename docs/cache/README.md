# CacheUtils

The CacheUtils class provides factory methods for creating in-memory caches with different eviction policies (LRU, LFU, FIFO) and optional TTL support.

## Basic Usage

```javascript
import { CacheUtils } from '@brmorillo/utils';

// Create a simple cache with a 60-second TTL and max 100 items
const cache = CacheUtils.createCache({ ttl: 60000, maxSize: 100 });

cache.set('key1', 'value1');
console.log(cache.get('key1')); // 'value1'
console.log(cache.has('key1')); // true

cache.delete('key1');
console.log(cache.has('key1')); // false
```

## Methods

### createCache({ ttl, maxSize })

Creates a simple in-memory cache with optional TTL and LRU (least-recently-used) eviction when `maxSize` is reached. Both `ttl` and `maxSize` default to `0` (no expiration / unlimited).

```javascript
const cache = CacheUtils.createCache({ ttl: 60000, maxSize: 100 });

cache.set('user:1', { name: 'Alice' });
cache.set('user:2', { name: 'Bob' }, 5000); // per-item TTL of 5s

console.log(cache.get('user:1')); // { name: 'Alice' }
console.log(cache.has('user:2')); // true
console.log(cache.keys());        // ['user:1', 'user:2']
console.log(cache.size());        // 2

cache.prune();   // removes expired items, returns the count removed
cache.delete('user:1');
cache.clear();
```

The returned cache instance exposes:

- `get(key)` - returns the cached value, or `undefined` if missing/expired.
- `set(key, value, itemTtl?)` - stores a value with an optional per-item TTL; returns `true`.
- `has(key)` - returns `true` if the key exists and is not expired.
- `delete(key)` - removes a key; returns `true` if it existed.
- `clear()` - removes all items.
- `keys()` - returns an array of all keys.
- `size()` - returns the number of items.
- `prune()` - removes all expired items and returns the count removed.

### createLFUCache({ ttl, maxSize })

Creates a cache with an LFU (least-frequently-used) eviction policy. When `maxSize` is reached, the least frequently accessed item is evicted. Both `ttl` and `maxSize` default to `0`.

```javascript
const cache = CacheUtils.createLFUCache({ maxSize: 100 });

cache.set('key1', 'value1');
cache.get('key1'); // increases usage frequency
cache.get('key1'); // increases usage frequency again

console.log(cache.getFrequency('key1')); // 2
```

The returned cache instance exposes the same methods as `createCache` (`get`, `set`, `has`, `delete`, `clear`, `keys`, `size`, `prune`) plus:

- `getFrequency(key)` - returns the access frequency count for a key, or `0` if missing.

### createFIFOCache({ ttl, maxSize })

Creates a cache with a FIFO (first-in-first-out) eviction policy. When `maxSize` is reached, the oldest inserted item is evicted first. Both `ttl` and `maxSize` default to `0`.

```javascript
const cache = CacheUtils.createFIFOCache({ maxSize: 2 });

cache.set('key1', 'value1');
cache.set('key2', 'value2');
cache.set('key3', 'value3'); // evicts 'key1' (oldest)

console.log(cache.has('key1')); // false
console.log(cache.keys());      // ['key2', 'key3'] (insertion order)
```

The returned cache instance exposes the same methods as `createCache` (`get`, `set`, `has`, `delete`, `clear`, `keys`, `size`, `prune`). Note that `keys()` returns keys in insertion order.
