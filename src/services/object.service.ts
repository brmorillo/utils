import * as zlib from 'zlib';

export class ObjectUtils {
  /**
   * Deeply clones an object.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to clone.
   * @returns {object} A deep clone of the object.
   * @example
   * const original = { a: 1, b: { c: 2 } };
   * const clone = ObjectUtils.deepClone({ obj: original });
   * original.b.c = 3;
   * console.log(clone.b.c); // 2 (not affected by the change to original)
   */
  public static deepClone<T>({ obj }: { obj: T }): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof RegExp) {
      return new RegExp(obj.source, obj.flags) as unknown as T;
    }

    if (obj instanceof Map) {
      const clone = new Map();
      obj.forEach((value, key) => {
        clone.set(key, ObjectUtils.deepClone({ obj: value }));
      });
      return clone as unknown as T;
    }

    if (obj instanceof Set) {
      const clone = new Set();
      obj.forEach(value => {
        clone.add(ObjectUtils.deepClone({ obj: value }));
      });
      return clone as unknown as T;
    }

    if (Array.isArray(obj)) {
      return obj.map(item =>
        ObjectUtils.deepClone({ obj: item }),
      ) as unknown as T;
    }

    const clone = {} as Record<string, any>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = ObjectUtils.deepClone({
          obj: (obj as Record<string, any>)[key],
        });
      }
    }

    return clone as T;
  }

  /**
   * Deeply merges objects.
   * @param {object} params - The parameters for the method.
   * @param {object} params.target - The target object.
   * @param {object} params.source - The source object.
   * @returns {object} The merged object.
   * @example
   * const target = { a: 1, b: { c: 2 } };
   * const source = { b: { d: 3 }, e: 4 };
   * const merged = ObjectUtils.deepMerge({ target, source });
   * console.log(merged); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
   */
  public static deepMerge<
    T extends Record<string, any>,
    U extends Record<string, any>,
  >({ target, source }: { target: T; source: U }): T & U {
    const output = { ...target } as Record<string, any>;

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = ObjectUtils.deepMerge({
              target: target[key],
              source: source[key],
            });
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output as T & U;
  }

  /**
   * Selects specific properties from an object.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to pick properties from.
   * @param {string[]} params.keys - The keys to pick.
   * @returns {object} A new object with only the specified properties.
   * @example
   * const obj = { a: 1, b: 2, c: 3, d: 4 };
   * const picked = ObjectUtils.pick({ obj, keys: ['a', 'c'] });
   * console.log(picked); // { a: 1, c: 3 }
   */
  public static pick<T extends Record<string, any>, K extends keyof T>({
    obj,
    keys,
  }: {
    obj: T;
    keys: K[];
  }): Pick<T, K> {
    return keys.reduce(
      (result, key) => {
        if (key in obj) {
          result[key] = obj[key];
        }
        return result;
      },
      {} as Pick<T, K>,
    );
  }

  /**
   * Omits specific properties from an object.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to omit properties from.
   * @param {string[]} params.keys - The keys to omit.
   * @returns {object} A new object without the specified properties.
   * @example
   * const obj = { a: 1, b: 2, c: 3, d: 4 };
   * const omitted = ObjectUtils.omit({ obj, keys: ['b', 'd'] });
   * console.log(omitted); // { a: 1, c: 3 }
   */
  public static omit<T extends Record<string, any>, K extends keyof T>({
    obj,
    keys,
  }: {
    obj: T;
    keys: K[];
  }): Omit<T, K> {
    return Object.keys(obj).reduce(
      (result, key) => {
        if (!keys.includes(key as K)) {
          result[key] = obj[key];
        }
        return result;
      },
      {} as Record<string, any>,
    ) as Omit<T, K>;
  }

  /**
   * Flattens a nested object.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to flatten.
   * @param {string} [params.prefix=''] - The prefix to use for flattened keys.
   * @param {string} [params.delimiter='.'] - The delimiter to use between key parts.
   * @returns {object} A flattened object.
   * @example
   * const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
   * const flattened = ObjectUtils.flattenObject({ obj });
   * console.log(flattened); // { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
   */
  public static flattenObject({
    obj,
    prefix = '',
    delimiter = '.',
  }: {
    obj: Record<string, any>;
    prefix?: string;
    delimiter?: string;
  }): Record<string, any> {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const prefixedKey = prefix ? `${prefix}${delimiter}${key}` : key;

        if (
          typeof obj[key] === 'object' &&
          obj[key] !== null &&
          !Array.isArray(obj[key]) &&
          Object.keys(obj[key]).length > 0
        ) {
          Object.assign(
            acc,
            ObjectUtils.flattenObject({
              obj: obj[key],
              prefix: prefixedKey,
              delimiter,
            }),
          );
        } else {
          acc[prefixedKey] = obj[key];
        }

        return acc;
      },
      {} as Record<string, any>,
    );
  }

  /**
   * Unflattens an object with delimited keys.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to modify.
   * @param {string} params.path - The path to set.
   * @param {any} params.value - The value to set at the path.
   * @param {string} [params.delimiter='.'] - The delimiter used in the path.
   * @returns {object} The modified object.
   * @example
   * const obj = {};
   * ObjectUtils.unflattenObject({ obj, path: 'a.b.c', value: 42 });
   * console.log(obj); // { a: { b: { c: 42 } } }
   */
  public static unflattenObject({
    obj,
    path,
    value,
    delimiter = '.',
  }: {
    obj: Record<string, any>;
    path: string;
    value: any;
    delimiter?: string;
  }): Record<string, any> {
    const keys = path.split(delimiter);
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return obj;
  }

  /**
   * Checks if an object is empty.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to check.
   * @returns {boolean} `true` if the object is empty, otherwise `false`.
   * @example
   * ObjectUtils.isEmpty({ obj: {} }); // true
   * ObjectUtils.isEmpty({ obj: { a: 1 } }); // false
   */
  public static isEmpty({ obj }: { obj: Record<string, any> }): boolean {
    return Object.keys(obj).length === 0;
  }

  /**
   * Checks if two objects are equal.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj1 - The first object.
   * @param {object} params.obj2 - The second object.
   * @returns {boolean} `true` if the objects are equal, otherwise `false`.
   * @example
   * ObjectUtils.compare({ obj1: { a: 1, b: 2 }, obj2: { a: 1, b: 2 } }); // true
   * ObjectUtils.compare({ obj1: { a: 1, b: 2 }, obj2: { a: 1, b: 3 } }); // false
   */
  public static compare({
    obj1,
    obj2,
  }: {
    obj1: Record<string, any>;
    obj2: Record<string, any>;
  }): boolean {
    if (obj1 === obj2) {
      return true;
    }

    if (
      typeof obj1 !== 'object' ||
      typeof obj2 !== 'object' ||
      obj1 === null ||
      obj2 === null
    ) {
      return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every(key => {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        return false;
      }

      if (
        typeof obj1[key] === 'object' &&
        typeof obj2[key] === 'object' &&
        obj1[key] !== null &&
        obj2[key] !== null
      ) {
        return ObjectUtils.compare({ obj1: obj1[key], obj2: obj2[key] });
      }

      return obj1[key] === obj2[key];
    });
  }

  /**
   * Checks if an object has circular references.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to check.
   * @returns {boolean} `true` if the object has circular references, otherwise `false`.
   * @example
   * const obj = { a: 1 };
   * obj.self = obj;
   * ObjectUtils.hasCircularReference({ obj }); // true
   */
  public static hasCircularReference({
    obj,
  }: {
    obj: Record<string, any>;
  }): boolean {
    const seen = new WeakSet();

    const detect = (obj: Record<string, any>): boolean => {
      if (typeof obj !== 'object' || obj === null) {
        return false;
      }

      if (seen.has(obj)) {
        return true;
      }

      seen.add(obj);

      return Object.keys(obj).some(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          return detect(obj[key]);
        }
        return false;
      });
    };

    return detect(obj);
  }

  /**
   * Removes undefined properties from an object.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to clean.
   * @returns {object} A new object without undefined properties.
   * @example
   * const obj = { a: 1, b: undefined, c: 3 };
   * const cleaned = ObjectUtils.removeUndefined({ obj });
   * console.log(cleaned); // { a: 1, c: 3 }
   */
  public static removeUndefined({
    obj,
  }: {
    obj: Record<string, any>;
  }): Record<string, any> {
    return Object.keys(obj).reduce(
      (result, key) => {
        if (obj[key] !== undefined) {
          result[key] = obj[key];
        }
        return result;
      },
      {} as Record<string, any>,
    );
  }

  /**
   * Removes null properties from an object.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to clean.
   * @returns {object} A new object without null properties.
   * @example
   * const obj = { a: 1, b: null, c: 3 };
   * const cleaned = ObjectUtils.removeNull({ obj });
   * console.log(cleaned); // { a: 1, c: 3 }
   */
  public static removeNull({
    obj,
  }: {
    obj: Record<string, any>;
  }): Record<string, any> {
    return Object.keys(obj).reduce(
      (result, key) => {
        if (obj[key] !== null) {
          result[key] = obj[key];
        }
        return result;
      },
      {} as Record<string, any>,
    );
  }

  /**
   * Finds the differences between two objects.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj1 - The first object.
   * @param {object} params.obj2 - The second object.
   * @returns {object} An object containing the differences.
   * @example
   * const obj1 = { a: 1, b: 2, c: 3 };
   * const obj2 = { a: 1, b: 3, d: 4 };
   * const diff = ObjectUtils.diff({ obj1, obj2 });
   * console.log(diff); // { b: { obj1: 2, obj2: 3 }, c: { obj1: 3, obj2: undefined }, d: { obj1: undefined, obj2: 4 } }
   */
  public static diff<T extends Record<string, any>>({
    obj1,
    obj2,
  }: {
    obj1: T;
    obj2: T;
  }): Record<string, { obj1: any; obj2: any }> {
    const result: Record<string, { obj1: any; obj2: any }> = {};
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    allKeys.forEach(key => {
      if (!ObjectUtils.compare({ obj1: obj1[key], obj2: obj2[key] })) {
        result[key] = {
          obj1: obj1[key],
          obj2: obj2[key],
        };
      }
    });

    return result;
  }

  /**
   * Groups an object's values by a key returned by the callback function.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to group.
   * @param {Function} params.callback - The function that returns the grouping key.
   * @returns {object} An object with values grouped by keys.
   * @example
   * const users = {
   *   user1: { id: 'user1', role: 'admin' },
   *   user2: { id: 'user2', role: 'user' },
   *   user3: { id: 'user3', role: 'admin' }
   * };
   * const grouped = ObjectUtils.groupBy({
   *   obj: users,
   *   callback: user => user.role
   * });
   * console.log(grouped);
   * // {
   * //   admin: ['user1', 'user3'],
   * //   user: ['user2']
   * // }
   */
  public static groupBy<T>({
    obj,
    callback,
  }: {
    obj: Record<string, T>;
    callback: (value: T) => string;
  }): Record<string, string[]> {
    return Object.keys(obj).reduce(
      (result, key) => {
        const group = callback(obj[key]);
        if (!result[group]) {
          result[group] = [];
        }
        result[group].push(key);
        return result;
      },
      {} as Record<string, string[]>,
    );
  }

  /**
   * Compresses an object to a JSON string.
   * @param {object} params - The parameters for the method.
   * @param {object} params.json - The object to compress.
   * @returns {string} The compressed JSON string.
   * @example
   * const obj = { a: 1, b: 2, c: { d: 3, e: 4 } };
   * const compressed = ObjectUtils.compressObject({ json: obj });
   * console.log(compressed); // Compressed string
   */
  public static compressObject({
    json,
  }: {
    json: Record<string, any>;
  }): string {
    const jsonString = JSON.stringify(json);
    const compressed = zlib.deflateSync(jsonString).toString('base64');
    return compressed;
  }

  /**
   * Decompresses a JSON string to an object.
   * @param {object} params - The parameters for the method.
   * @param {string} params.jsonString - The compressed JSON string.
   * @returns {object} The decompressed object.
   * @example
   * const compressed = '...'; // Compressed string from compressObject
   * const decompressed = ObjectUtils.decompressObject({ jsonString: compressed });
   * console.log(decompressed); // { a: 1, b: 2, c: { d: 3, e: 4 } }
   */
  public static decompressObject({
    jsonString,
  }: {
    jsonString: string;
  }): Record<string, any> {
    const buffer = Buffer.from(jsonString, 'base64');
    const decompressed = zlib.inflateSync(buffer).toString();
    return JSON.parse(decompressed);
  }

  /**
   * Compresses an object to a URL-safe base64 string.
   * @param {object} params - The parameters for the method.
   * @param {object} params.json - The object to compress.
   * @param {boolean} [params.urlSafe=false] - Whether to make the base64 string URL-safe.
   * @returns {string} The compressed JSON string in base64.
   * @example
   * const obj = { a: 1, b: 2, c: { d: 3, e: 4 } };
   * const compressed = ObjectUtils.compressObjectToBase64({ json: obj, urlSafe: true });
   * console.log(compressed); // URL-safe base64 string
   */
  public static compressObjectToBase64({
    json,
    urlSafe = false,
  }: {
    json: Record<string, any>;
    urlSafe?: boolean;
  }): string {
    const jsonString = JSON.stringify(json);
    const compressed = zlib.deflateSync(jsonString).toString('base64');
    return urlSafe
      ? compressed.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      : compressed;
  }

  /**
   * Decompresses a base64 string to an object.
   * @param {object} params - The parameters for the method.
   * @param {string} params.base64String - The compressed base64 string.
   * @param {boolean} [params.urlSafe=false] - Whether the base64 string is URL-safe.
   * @returns {object} The decompressed object.
   * @example
   * const compressed = '...'; // Compressed string from compressObjectToBase64
   * const decompressed = ObjectUtils.decompressBase64ToObject({ base64String: compressed });
   * console.log(decompressed); // { a: 1, b: 2, c: { d: 3, e: 4 } }
   */
  public static decompressBase64ToObject({
    base64String,
    urlSafe = false,
  }: {
    base64String: string;
    urlSafe?: boolean;
  }): Record<string, any> {
    let normalizedBase64 = base64String;
    if (urlSafe) {
      normalizedBase64 = normalizedBase64.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      while (normalizedBase64.length % 4) {
        normalizedBase64 += '=';
      }
    }
    const buffer = Buffer.from(normalizedBase64, 'base64');
    const decompressed = zlib.inflateSync(buffer).toString();
    return JSON.parse(decompressed);
  }

  /**
   * Finds objects in an array that match a subset of properties.
   * @param {object} params - The parameters for the method.
   * @param {Array} params.array - The array to search.
   * @param {object} params.subset - The subset of properties to match.
   * @returns {Array} An array of objects that match the subset.
   * @example
   * const array = [
   *   { id: 1, name: 'John', age: 30 },
   *   { id: 2, name: 'Jane', age: 25 },
   *   { id: 3, name: 'John', age: 40 }
   * ];
   * const result = ObjectUtils.findSubsetObjects({ array, subset: { name: 'John' } });
   * console.log(result); // [{ id: 1, name: 'John', age: 30 }, { id: 3, name: 'John', age: 40 }]
   */
  public static findSubsetObjects<T extends Record<string, any>>({
    array,
    subset,
  }: {
    array: T[];
    subset: Partial<T>;
  }): T[] {
    return array.filter(item =>
      ObjectUtils.isSubsetObject({ superset: item, subset }),
    );
  }

  /**
   * Checks if an object is a subset of another object.
   * @param {object} params - The parameters for the method.
   * @param {object} params.superset - The object to check against.
   * @param {object} params.subset - The potential subset.
   * @returns {boolean} `true` if the subset is contained in the superset, otherwise `false`.
   * @example
   * const superset = { a: 1, b: 2, c: { d: 3, e: 4 } };
   * const subset = { a: 1, c: { d: 3 } };
   * const result = ObjectUtils.isSubsetObject({ superset, subset });
   * console.log(result); // true
   */
  public static isSubsetObject<T extends Record<string, any>>({
    superset,
    subset,
  }: {
    superset: T;
    subset: Partial<T>;
  }): boolean {
    return Object.keys(subset).every(key => {
      if (subset[key] === undefined) return true;
      if (superset[key] === undefined) return false;

      if (
        typeof subset[key] === 'object' &&
        subset[key] !== null &&
        typeof superset[key] === 'object' &&
        superset[key] !== null
      ) {
        return ObjectUtils.isSubsetObject({
          superset: superset[key],
          subset: subset[key],
        });
      }

      return subset[key] === superset[key];
    });
  }

  /**
   * Finds a value in an object by path.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to search in.
   * @param {string} params.path - The path to the value.
   * @param {string} [params.delimiter='.'] - The delimiter used in the path.
   * @returns {any} The value at the path, or undefined if not found.
   * @example
   * const obj = { a: { b: { c: 42 } } };
   * const value = ObjectUtils.findValue({ obj, path: 'a.b.c' });
   * console.log(value); // 42
   */
  public static findValue({
    obj,
    path,
    delimiter = '.',
  }: {
    obj: Record<string, any>;
    path: string;
    delimiter?: string;
  }): any {
    const keys = path.split(delimiter);
    let current = obj;

    for (const key of keys) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * Inverts an object's keys and values.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to invert.
   * @returns {object} A new object with keys and values swapped.
   * @example
   * const obj = { a: 1, b: 2, c: 3 };
   * const inverted = ObjectUtils.invert({ obj });
   * console.log(inverted); // { '1': 'a', '2': 'b', '3': 'c' }
   */
  public static invert({
    obj,
  }: {
    obj: Record<string, string | number>;
  }): Record<string, string> {
    return Object.keys(obj).reduce(
      (result, key) => {
        const value = String(obj[key]);
        result[value] = key;
        return result;
      },
      {} as Record<string, string>,
    );
  }

  /**
   * Deeply freezes an object to make it immutable.
   * @param {object} params - The parameters for the method.
   * @param {object} params.obj - The object to freeze.
   * @returns {object} The frozen object.
   * @example
   * const obj = { a: 1, b: { c: 2 } };
   * const frozen = ObjectUtils.deepFreeze({ obj });
   * // Attempting to modify frozen.b.c will throw an error in strict mode
   */
  public static deepFreeze<T>({ obj }: { obj: T }): Readonly<T> {
    if (obj === null || typeof obj !== 'object' || Object.isFrozen(obj)) {
      return obj;
    }

    const propNames = Object.getOwnPropertyNames(obj);

    for (const name of propNames) {
      const value = (obj as any)[name];
      if (value && typeof value === 'object') {
        (obj as any)[name] = ObjectUtils.deepFreeze({ obj: value });
      }
    }

    return Object.freeze(obj);
  }
}

// Helper function to check if a value is an object
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}
