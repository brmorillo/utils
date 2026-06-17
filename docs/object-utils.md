# ObjectUtils

The ObjectUtils class provides a collection of utility methods for working with objects, including cloning, merging, picking, flattening, comparing, and compression.

## Basic Usage

```javascript
import { ObjectUtils } from '@brmorillo/utils';

// Deep clone an object
const original = { a: 1, b: { c: 2 } };
const clone = ObjectUtils.deepClone({ obj: original });
console.log(clone); // { a: 1, b: { c: 2 } }

// Pick specific properties
const obj = { a: 1, b: 2, c: 3, d: 4 };
const picked = ObjectUtils.pick({ obj, keys: ['a', 'c'] });
console.log(picked); // { a: 1, c: 3 }
```

## Methods

### deepClone({ obj })

Deeply clones an object (handles Date, RegExp, Map, Set, arrays and nested objects).

```javascript
const original = { a: 1, b: { c: 2 } };
const clone = ObjectUtils.deepClone({ obj: original });
original.b.c = 3;
console.log(clone.b.c); // 2 (not affected by the change to original)
```

### deepMerge({ target, source })

Deeply merges two objects. When a key holds an object on both sides, the objects are merged recursively. When the source holds an object but the target holds a primitive or lacks the key, the source object is deep-cloned into the result, so the merged output never shares references with `source`. Dangerous keys (`__proto__`, `constructor`, `prototype`) are skipped to prevent prototype pollution.

```javascript
const target = { a: 1, b: { c: 2 } };
const source = { b: { d: 3 }, e: 4 };
const merged = ObjectUtils.deepMerge({ target, source });
console.log(merged); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

### pick({ obj, keys })

Selects specific properties from an object.

```javascript
const obj = { a: 1, b: 2, c: 3, d: 4 };
const picked = ObjectUtils.pick({ obj, keys: ['a', 'c'] });
console.log(picked); // { a: 1, c: 3 }
```

### omit({ obj, keys })

Omits specific properties from an object.

```javascript
const obj = { a: 1, b: 2, c: 3, d: 4 };
const omitted = ObjectUtils.omit({ obj, keys: ['b', 'd'] });
console.log(omitted); // { a: 1, c: 3 }
```

### flattenObject({ obj, prefix, delimiter })

Flattens a nested object into a single-level object with delimited keys. `prefix` defaults to `''` and `delimiter` defaults to `'.'`. Throws a `ValidationError` if `obj` is not an object (e.g. `null`/`undefined`).

```javascript
const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
const flattened = ObjectUtils.flattenObject({ obj });
console.log(flattened); // { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
```

### unflattenObject({ obj, path, value, delimiter })

Sets a value at a delimited path on an object, creating intermediate objects as needed. `delimiter` defaults to `'.'`. Paths containing dangerous keys (`__proto__`, `constructor`, `prototype`) are ignored to prevent prototype pollution.

```javascript
const obj = {};
ObjectUtils.unflattenObject({ obj, path: 'a.b.c', value: 42 });
console.log(obj); // { a: { b: { c: 42 } } }
```

### isEmpty({ obj })

Checks if an object has no own enumerable keys. Throws a `ValidationError` if `obj` is not an object.

```javascript
ObjectUtils.isEmpty({ obj: {} }); // true
ObjectUtils.isEmpty({ obj: { a: 1 } }); // false
```

### compare({ obj1, obj2 })

Deeply checks if two objects are equal.

```javascript
ObjectUtils.compare({ obj1: { a: 1, b: 2 }, obj2: { a: 1, b: 2 } }); // true
ObjectUtils.compare({ obj1: { a: 1, b: 2 }, obj2: { a: 1, b: 3 } }); // false
```

### hasCircularReference({ obj })

Checks if an object contains circular references.

```javascript
const obj = { a: 1 };
obj.self = obj;
ObjectUtils.hasCircularReference({ obj }); // true
```

### removeUndefined({ obj })

Returns a new object without properties whose value is `undefined`. Throws a `ValidationError` if `obj` is not an object.

```javascript
const obj = { a: 1, b: undefined, c: 3 };
const cleaned = ObjectUtils.removeUndefined({ obj });
console.log(cleaned); // { a: 1, c: 3 }
```

### removeNull({ obj })

Returns a new object without properties whose value is `null`. Throws a `ValidationError` if `obj` is not an object.

```javascript
const obj = { a: 1, b: null, c: 3 };
const cleaned = ObjectUtils.removeNull({ obj });
console.log(cleaned); // { a: 1, c: 3 }
```

### diff({ obj1, obj2 })

Finds the differences between two objects. Throws a `ValidationError` if either input is not an object.

```javascript
const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { a: 1, b: 3, d: 4 };
const diff = ObjectUtils.diff({ obj1, obj2 });
console.log(diff);
// { b: { obj1: 2, obj2: 3 }, c: { obj1: 3, obj2: undefined }, d: { obj1: undefined, obj2: 4 } }
```

### groupBy({ obj, callback })

Groups an object's keys by the group key returned by the callback for each value.

```javascript
const users = {
  user1: { id: 'user1', role: 'admin' },
  user2: { id: 'user2', role: 'user' },
  user3: { id: 'user3', role: 'admin' }
};
const grouped = ObjectUtils.groupBy({
  obj: users,
  callback: user => user.role
});
console.log(grouped); // { admin: ['user1', 'user3'], user: ['user2'] }
```

### compressObject({ json })

Compresses an object into a base64 string (deflate).

```javascript
const obj = { a: 1, b: 2, c: { d: 3, e: 4 } };
const compressed = ObjectUtils.compressObject({ json: obj });
console.log(compressed); // Compressed base64 string
```

### decompressObject({ jsonString })

Decompresses a base64 string produced by `compressObject` back into an object.

```javascript
const decompressed = ObjectUtils.decompressObject({ jsonString: compressed });
console.log(decompressed); // { a: 1, b: 2, c: { d: 3, e: 4 } }
```

### compressObjectToBase64({ json, urlSafe })

Compresses an object into a base64 string, optionally URL-safe. `urlSafe` defaults to `false`.

```javascript
const obj = { a: 1, b: 2, c: { d: 3, e: 4 } };
const compressed = ObjectUtils.compressObjectToBase64({ json: obj, urlSafe: true });
console.log(compressed); // URL-safe base64 string
```

### decompressBase64ToObject({ base64String, urlSafe })

Decompresses a base64 string produced by `compressObjectToBase64` back into an object. `urlSafe` defaults to `false`.

```javascript
const decompressed = ObjectUtils.decompressBase64ToObject({ base64String: compressed, urlSafe: true });
console.log(decompressed); // { a: 1, b: 2, c: { d: 3, e: 4 } }
```

### findSubsetObjects({ array, subset })

Finds objects in an array that match a subset of properties.

```javascript
const array = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'John', age: 40 }
];
const result = ObjectUtils.findSubsetObjects({ array, subset: { name: 'John' } });
console.log(result); // [{ id: 1, name: 'John', age: 30 }, { id: 3, name: 'John', age: 40 }]
```

### isSubsetObject({ superset, subset })

Checks if an object is a (deep) subset of another object.

```javascript
const superset = { a: 1, b: 2, c: { d: 3, e: 4 } };
const subset = { a: 1, c: { d: 3 } };
const result = ObjectUtils.isSubsetObject({ superset, subset });
console.log(result); // true
```

### findValue({ obj, path, delimiter })

Finds a value in an object by a delimited path. `delimiter` defaults to `'.'`.

```javascript
const obj = { a: { b: { c: 42 } } };
const value = ObjectUtils.findValue({ obj, path: 'a.b.c' });
console.log(value); // 42
```

### invert({ obj })

Inverts an object's keys and values. Throws a `ValidationError` if `obj` is not an object.

```javascript
const obj = { a: 1, b: 2, c: 3 };
const inverted = ObjectUtils.invert({ obj });
console.log(inverted); // { '1': 'a', '2': 'b', '3': 'c' }
```

### deepFreeze({ obj })

Deeply freezes an object to make it immutable.

```javascript
const obj = { a: 1, b: { c: 2 } };
const frozen = ObjectUtils.deepFreeze({ obj });
// Attempting to modify frozen.b.c will throw an error in strict mode
```

## Examples

```javascript
import { ObjectUtils } from '@brmorillo/utils';

// Clean and compare configuration objects
const defaults = { theme: 'light', sidebar: true, debug: undefined };
const cleaned = ObjectUtils.removeUndefined({ obj: defaults });

const userConfig = { theme: 'dark', sidebar: true };
const merged = ObjectUtils.deepMerge({ target: cleaned, source: userConfig });

const differences = ObjectUtils.diff({ obj1: cleaned, obj2: merged });

console.log('Cleaned:', cleaned);
console.log('Merged:', merged);
console.log('Differences:', differences);
```
