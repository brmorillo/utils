import { ObjectUtils } from '../../src/services/object.service';
import { ValidationError } from '../../src/errors';

describe('ObjectUtils', () => {
  describe('findValue', () => {
    it('should find a value in an object by path', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(ObjectUtils.findValue({ obj, path: 'a.b.c' })).toBe(42);
    });

    it('should return undefined for non-existent paths', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(ObjectUtils.findValue({ obj, path: 'a.b.d' })).toBeUndefined();
    });

    it('should work with arrays', () => {
      const obj = { a: { b: [1, 2, { c: 42 }] } };
      expect(ObjectUtils.findValue({ obj, path: 'a.b.2.c' })).toBe(42);
    });

    it('should respect the custom delimiter', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(
        ObjectUtils.findValue({ obj, path: 'a/b/c', delimiter: '/' }),
      ).toBe(42);
    });

    it('should return undefined when traversal hits a nullish value mid-path', () => {
      // `a.b` is null, so `current` becomes null before the final key, hitting
      // the `current === null` guard inside the loop.
      const obj = { a: { b: null } };
      expect(ObjectUtils.findValue({ obj, path: 'a.b.c.d' })).toBeUndefined();
    });
  });

  describe('deepClone', () => {
    it('should clone simple objects', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
    });

    it('should clone nested objects', () => {
      const obj = { a: { b: { c: 42 } } };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone).toEqual(obj);
      expect(clone.a).not.toBe(obj.a);
      expect(clone.a.b).not.toBe(obj.a.b);
    });

    it('should clone arrays', () => {
      const obj = { a: [1, 2, 3] };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone).toEqual(obj);
      expect(clone.a).not.toBe(obj.a);
    });

    it('should clone dates', () => {
      const date = new Date();
      const obj = { a: date };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone.a).toEqual(date);
      expect(clone.a).not.toBe(date);
    });

    it('should clone regular expressions', () => {
      const regex = /test/g;
      const obj = { a: regex };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone.a).toEqual(regex);
      expect(clone.a).not.toBe(regex);
    });

    it('should clone Map', () => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      const obj = { a: map };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone.a instanceof Map).toBe(true);
      expect(clone.a).not.toBe(map);
      expect(clone.a.get('a')).toBe(1);
      expect(clone.a.get('b')).toBe(2);
    });

    it('should clone Set', () => {
      const set = new Set([1, 2, 3]);
      const obj = { a: set };
      const clone = ObjectUtils.deepClone({ obj });
      expect(clone.a instanceof Set).toBe(true);
      expect(clone.a).not.toBe(set);
      expect(clone.a.has(1)).toBe(true);
      expect(clone.a.has(2)).toBe(true);
      expect(clone.a.has(3)).toBe(true);
    });

    it('should handle primitive values', () => {
      expect(ObjectUtils.deepClone({ obj: 42 })).toBe(42);
      expect(ObjectUtils.deepClone({ obj: 'test' })).toBe('test');
      expect(ObjectUtils.deepClone({ obj: true })).toBe(true);
      expect(ObjectUtils.deepClone({ obj: null })).toBe(null);
      expect(ObjectUtils.deepClone({ obj: undefined })).toBe(undefined);
    });
  });

  describe('deepMerge', () => {
    it('should merge simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested objects', () => {
      const target = { a: { b: 1, c: 2 } };
      const source = { a: { c: 3, d: 4 } };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: { b: 1, c: 3, d: 4 } });
    });

    it('should replace arrays', () => {
      const target = { a: [1, 2] };
      const source = { a: [3, 4] };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: [3, 4] });
    });

    it('should add new properties', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle empty objects', () => {
      const target = {};
      const source = { a: 1 };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: 1 });
    });

    it('should preserve the original object', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(target).toEqual({ a: 1 });
      expect(source).toEqual({ b: 2 });
    });

    it('should keep the source object when the target value is a primitive', () => {
      const target = { a: 1 };
      const source = { a: { b: 2 } };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: { b: 2 } });
    });

    it('should keep the source object when the key is absent from the target', () => {
      const target = { a: 1 };
      const source = { nested: { b: { c: 3 } } };
      const result = ObjectUtils.deepMerge({ target, source });
      expect(result).toEqual({ a: 1, nested: { b: { c: 3 } } });
    });

    it('should deep-clone nested source objects instead of sharing references', () => {
      const target = {};
      const source = { a: { b: { c: 1 } } };
      const result = ObjectUtils.deepMerge({ target, source }) as any;

      // Mutating the source must not affect the merged result.
      source.a.b.c = 999;
      expect(result.a.b.c).toBe(1);
      expect(result.a).not.toBe(source.a);
      expect(result.a.b).not.toBe(source.a.b);
    });

    it('should not pollute Object.prototype via dangerous keys', () => {
      const malicious = JSON.parse('{"__proto__": {"polluted": "yes"}}');
      ObjectUtils.deepMerge({ target: {}, source: malicious });
      expect(({} as any).polluted).toBeUndefined();
      expect((Object.prototype as any).polluted).toBeUndefined();
    });
  });

  describe('pick', () => {
    it('should pick specific properties', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = ObjectUtils.pick({ obj, keys: ['a', 'c'] });
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should ignore non-existent properties', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.pick({ obj, keys: ['a', 'c'] as any });
      expect(result).toEqual({ a: 1 });
    });

    it('should return an empty object if no property is found', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.pick({ obj, keys: ['c', 'd'] as any });
      expect(result).toEqual({});
    });
  });

  describe('omit', () => {
    it('should omit specific properties', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = ObjectUtils.omit({ obj, keys: ['b', 'd'] });
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should ignore non-existent properties', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.omit({ obj, keys: ['b', 'c'] as any });
      expect(result).toEqual({ a: 1 });
    });

    it('should return a copy of the object if no property is omitted', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.omit({ obj, keys: ['c', 'd'] as any });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('flattenObject', () => {
    it('should flatten a nested object', () => {
      const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
      const result = ObjectUtils.flattenObject({ obj });
      expect(result).toEqual({
        a: 1,
        'b.c': 2,
        'b.d.e': 3,
      });
    });

    it('should use the provided prefix', () => {
      const obj = { a: 1, b: { c: 2 } };
      const result = ObjectUtils.flattenObject({ obj, prefix: 'prefix' });
      expect(result).toEqual({
        'prefix.a': 1,
        'prefix.b.c': 2,
      });
    });

    it('should use the provided delimiter', () => {
      const obj = { a: 1, b: { c: 2 } };
      const result = ObjectUtils.flattenObject({ obj, delimiter: '/' });
      expect(result).toEqual({
        a: 1,
        'b/c': 2,
      });
    });

    it('should preserve arrays', () => {
      const obj = { a: [1, 2, 3] };
      const result = ObjectUtils.flattenObject({ obj });
      expect(result).toEqual({ a: [1, 2, 3] });
    });

    it('should throw a ValidationError for null/undefined input', () => {
      expect(() =>
        ObjectUtils.flattenObject({ obj: null as any }),
      ).toThrow(ValidationError);
    });

    it('should preserve empty objects', () => {
      const obj = { a: {}, b: 1 };
      const result = ObjectUtils.flattenObject({ obj });
      expect(result).toEqual({ a: {}, b: 1 });
    });
  });

  describe('unflattenObject', () => {
    it('should set a value at a delimited path', () => {
      const result = ObjectUtils.unflattenObject({
        obj: {},
        path: 'a.b.c',
        value: 42,
      });
      expect(result).toEqual({ a: { b: { c: 42 } } });
    });

    it('should NOT mutate the input object by default', () => {
      const obj = {};
      const result = ObjectUtils.unflattenObject({ obj, path: 'a.b', value: 1 });
      expect(obj).toEqual({});
      expect(result).toEqual({ a: { b: 1 } });
      expect(result).not.toBe(obj);
    });

    it('should mutate the input when inPlace is true', () => {
      const obj: Record<string, any> = {};
      const result = ObjectUtils.unflattenObject({
        obj,
        path: 'a.b',
        value: 1,
        inPlace: true,
      });
      expect(obj).toEqual({ a: { b: 1 } });
      expect(result).toBe(obj);
    });

    it('should use the provided delimiter', () => {
      const result = ObjectUtils.unflattenObject({
        obj: {},
        path: 'a/b/c',
        value: 42,
        delimiter: '/',
      });
      expect(result).toEqual({ a: { b: { c: 42 } } });
    });

    it('should overwrite existing values', () => {
      const result = ObjectUtils.unflattenObject({
        obj: { a: { b: { c: 1 } } },
        path: 'a.b.c',
        value: 42,
      });
      expect(result).toEqual({ a: { b: { c: 42 } } });
    });

    it('should create intermediate objects', () => {
      const result = ObjectUtils.unflattenObject({
        obj: { a: { d: 1 } },
        path: 'a.b.c',
        value: 42,
      });
      expect(result).toEqual({ a: { d: 1, b: { c: 42 } } });
    });

    it('should NOT pollute Object.prototype via a __proto__ path', () => {
      ObjectUtils.unflattenObject({
        obj: {},
        path: '__proto__.polluted',
        value: 'x',
      });
      expect(({} as any).polluted).toBeUndefined();
      expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('should skip writes that include other dangerous keys', () => {
      const result = ObjectUtils.unflattenObject({
        obj: {},
        path: 'constructor.prototype.polluted',
        value: 'x',
      });
      expect((Object.prototype as any).polluted).toBeUndefined();
      expect(result).toEqual({});
    });
  });

  describe('invert', () => {
    it('should invert keys and values', () => {
      const obj = { a: '1', b: '2', c: '3' };
      const result = ObjectUtils.invert({ obj });
      expect(result).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
    });

    it('should handle duplicate values', () => {
      const obj = { a: '1', b: '1', c: '2' };
      const result = ObjectUtils.invert({ obj });
      // The last value overwrites the previous ones
      expect(result).toEqual({ '1': 'b', '2': 'c' });
    });

    it('should convert non-string values to string', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = ObjectUtils.invert({ obj });
      expect(result).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
    });

    it('should throw a ValidationError for null/undefined input', () => {
      expect(() =>
        ObjectUtils.invert({ obj: null as any }),
      ).toThrow(ValidationError);
    });
  });

  describe('deepFreeze', () => {
    it('should freeze an object', () => {
      const obj = { a: 1, b: 2 };
      const frozen = ObjectUtils.deepFreeze({ obj });
      expect(Object.isFrozen(frozen)).toBe(true);
    });

    it('should freeze nested objects', () => {
      const obj = { a: { b: { c: 42 } } };
      const frozen = ObjectUtils.deepFreeze({ obj });
      expect(Object.isFrozen(frozen.a)).toBe(true);
      expect(Object.isFrozen(frozen.a.b)).toBe(true);
    });

    it('should handle primitive values', () => {
      expect(ObjectUtils.deepFreeze({ obj: 42 })).toBe(42);
      expect(ObjectUtils.deepFreeze({ obj: 'test' })).toBe('test');
      expect(ObjectUtils.deepFreeze({ obj: null })).toBe(null);
    });
  });

  describe('isEmpty', () => {
    it('should identify empty objects', () => {
      expect(ObjectUtils.isEmpty({ obj: {} })).toBe(true);
    });

    it('should identify non-empty objects', () => {
      expect(ObjectUtils.isEmpty({ obj: { a: 1 } })).toBe(false);
    });

    it('should throw a ValidationError for null/undefined input', () => {
      expect(() =>
        ObjectUtils.isEmpty({ obj: null as any }),
      ).toThrow(ValidationError);
      expect(() =>
        ObjectUtils.isEmpty({ obj: undefined as any }),
      ).toThrow(ValidationError);
    });
  });

  describe('compare', () => {
    it('should compare simple objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 1 };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(true);

      const obj3 = { a: 1 };
      const obj4 = { a: 2 };
      expect(ObjectUtils.compare({ obj1: obj3, obj2: obj4 })).toBe(false);
    });

    it('should compare nested objects', () => {
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: { b: 1 } };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(true);

      const obj3 = { a: { b: 1 } };
      const obj4 = { a: { b: 2 } };
      expect(ObjectUtils.compare({ obj1: obj3, obj2: obj4 })).toBe(false);
    });

    it('should compare arrays', () => {
      const obj1 = { a: [1, 2, 3] };
      const obj2 = { a: [1, 2, 3] };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(true);

      const obj3 = { a: [1, 2, 3] };
      const obj4 = { a: [1, 2, 4] };
      expect(ObjectUtils.compare({ obj1: obj3, obj2: obj4 })).toBe(false);
    });

    it('should return false when objects have a different number of keys', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1 };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(false);
    });

    it('should return false when a key is missing from the second object', () => {
      // Same key count, but the keys differ so obj2 lacks a key from obj1.
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, c: 2 };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(false);
    });
  });

  describe('hasCircularReference', () => {
    it('should detect circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      expect(ObjectUtils.hasCircularReference({ obj })).toBe(true);
    });

    it('should detect nested circular references', () => {
      const obj: any = { a: { b: { c: {} } } };
      obj.a.b.c.d = obj;
      expect(ObjectUtils.hasCircularReference({ obj })).toBe(true);
    });

    it('should not detect non-circular references', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(ObjectUtils.hasCircularReference({ obj })).toBe(false);
    });

    it('should return false when given a non-object value', () => {
      // Exercises the early `typeof obj !== 'object'` guard inside detect().
      expect(
        ObjectUtils.hasCircularReference({ obj: 42 as any }),
      ).toBe(false);
      expect(
        ObjectUtils.hasCircularReference({ obj: null as any }),
      ).toBe(false);
    });
  });

  describe('removeUndefined', () => {
    it('should remove undefined properties', () => {
      const obj = { a: 1, b: undefined, c: 3 };
      const result = ObjectUtils.removeUndefined({ obj });
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should preserve null values', () => {
      const obj = { a: 1, b: null, c: 3 };
      const result = ObjectUtils.removeUndefined({ obj });
      expect(result).toEqual({ a: 1, b: null, c: 3 });
    });

    it('should throw a ValidationError for null/undefined input', () => {
      expect(() =>
        ObjectUtils.removeUndefined({ obj: null as any }),
      ).toThrow(ValidationError);
    });
  });

  describe('removeNull', () => {
    it('should remove null properties', () => {
      const obj = { a: 1, b: null, c: 3 };
      const result = ObjectUtils.removeNull({ obj });
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should preserve undefined values', () => {
      const obj = { a: 1, b: undefined, c: 3 };
      const result = ObjectUtils.removeNull({ obj });
      expect(result).toEqual({ a: 1, b: undefined, c: 3 });
    });

    it('should throw a ValidationError for null/undefined input', () => {
      expect(() =>
        ObjectUtils.removeNull({ obj: null as any }),
      ).toThrow(ValidationError);
    });
  });

  describe('diff', () => {
    it('should find differences between objects', () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { a: 1, b: 3, c: 4 };
      const result = ObjectUtils.diff({ obj1, obj2 });
      expect(result).toEqual({
        b: { obj1: 2, obj2: 3 },
        c: { obj1: 3, obj2: 4 },
      });
    });

    it('should find differences in nested objects', () => {
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: { b: 2 } };
      const result = ObjectUtils.diff({ obj1, obj2 });
      expect(result).toEqual({
        a: { obj1: { b: 1 }, obj2: { b: 2 } },
      });
    });

    it('should throw a ValidationError for null/undefined input', () => {
      expect(() =>
        ObjectUtils.diff({ obj1: null as any, obj2: {} }),
      ).toThrow(ValidationError);
      expect(() =>
        ObjectUtils.diff({ obj1: {}, obj2: undefined as any }),
      ).toThrow(ValidationError);
    });
  });

  describe('groupBy', () => {
    it('should group values by key', () => {
      const obj = {
        user1: { id: 'user1', role: 'admin' },
        user2: { id: 'user2', role: 'user' },
        user3: { id: 'user3', role: 'admin' },
      };
      const result = ObjectUtils.groupBy({
        obj,
        callback: user => user.role,
      });
      expect(result).toEqual({
        admin: ['user1', 'user3'],
        user: ['user2'],
      });
    });
  });

  describe('compressObject e decompressObject', () => {
    it('should compress and decompress an object', () => {
      const obj = { a: 1, b: 2, c: { d: 3 } };
      const compressed = ObjectUtils.compressObject({ json: obj });
      const decompressed = ObjectUtils.decompressObject({
        jsonString: compressed,
      });
      expect(decompressed).toEqual(obj);
    });
  });

  describe('compressObjectToBase64 e decompressBase64ToObject', () => {
    it('should compress and decompress an object to base64', () => {
      const obj = { a: 1, b: 2, c: { d: 3 } };
      const compressed = ObjectUtils.compressObjectToBase64({ json: obj });
      const decompressed = ObjectUtils.decompressBase64ToObject({
        base64String: compressed,
      });
      expect(decompressed).toEqual(obj);
    });

    it('should compress and decompress an object to URL-safe base64', () => {
      const obj = { a: 1, b: 2, c: { d: 3 } };
      const compressed = ObjectUtils.compressObjectToBase64({
        json: obj,
        urlSafe: true,
      });
      const decompressed = ObjectUtils.decompressBase64ToObject({
        base64String: compressed,
        urlSafe: true,
      });
      expect(decompressed).toEqual(obj);
    });

    it('should re-add stripped padding when decompressing URL-safe base64', () => {
      // Try several payloads so at least one yields a URL-safe string whose
      // length is not a multiple of 4, forcing the padding loop to run.
      for (let i = 0; i < 8; i++) {
        const obj = { index: i, name: `item-${i}`, tags: ['a', 'b', 'c'] };
        const compressed = ObjectUtils.compressObjectToBase64({
          json: obj,
          urlSafe: true,
        });
        const decompressed = ObjectUtils.decompressBase64ToObject({
          base64String: compressed,
          urlSafe: true,
        });
        expect(decompressed).toEqual(obj);
      }
    });
  });

  describe('findSubsetObjects', () => {
    it('should find objects that match a subset', () => {
      const array = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
        { id: 3, name: 'John', age: 40 },
      ];
      const result = ObjectUtils.findSubsetObjects({
        array,
        subset: { name: 'John' },
      });
      expect(result).toEqual([
        { id: 1, name: 'John', age: 30 },
        { id: 3, name: 'John', age: 40 },
      ]);
    });

    it('should return an empty array if no object matches', () => {
      const array = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
      ];
      const result = ObjectUtils.findSubsetObjects({
        array,
        subset: { name: 'Bob' },
      });
      expect(result).toEqual([]);
    });
  });

  describe('isSubsetObject', () => {
    it('should check whether an object is a subset of another', () => {
      const superset = { a: 1, b: 2, c: { d: 3, e: 4 } };
      const subset = { a: 1, c: { d: 3, e: 4 } };
      expect(ObjectUtils.isSubsetObject({ superset, subset })).toBe(true);
    });

    it('should return false if the object is not a subset', () => {
      const superset = { a: 1, b: 2, c: { d: 3, e: 4 } };
      const subset = { a: 1, c: { d: 4, e: 4 } };
      expect(ObjectUtils.isSubsetObject({ superset, subset })).toBe(false);
    });

    it('should return false if a property does not exist in the superset', () => {
      const superset = { a: 1, b: 2 };
      const subset = { a: 1, c: 3 };
      expect(ObjectUtils.isSubsetObject({ superset, subset })).toBe(false);
    });
  });
});
