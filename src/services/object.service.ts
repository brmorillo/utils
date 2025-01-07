export class ObjectUtils {
  /**
   * Finds a value in an object by a specified key or path.
   * @template T The expected type of the value being retrieved.
   * @param {object} params The parameters for the method.
   * @param {Record<string, any>} params.obj The object to search.
   * @param {string} params.path The key or dot-separated path (e.g., "user.address.city").
   * @returns {T | undefined} The value found at the specified path, or `undefined` if not found.
   * @throws {Error} Throws an error if the path is not a valid string.
   * @example
   * // Example 1: Finding a nested value
   * const obj = { user: { address: { city: 'NY' } } };
   * const value = ObjectUtils.findValue({ obj, path: 'user.address.city' });
   * console.log(value); // Output: 'NY'
   *
   * // Example 2: Handling non-existent path
   * const obj = { user: { address: { city: 'NY' } } };
   * const value = ObjectUtils.findValue({ obj, path: 'user.phone.number' });
   * console.log(value); // Output: undefined
   */
  public static findValue<T>({
    obj,
    path,
  }: {
    obj: Record<string, any>;
    path: string;
  }): T | undefined {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) as T;
  }

  /**
   * Creates a deep clone of an object.
   * @template T The type of the object to be cloned.
   * @param {object} params The parameters for the method.
   * @param {T} params.obj The object to clone. Must be serializable to JSON.
   * @returns {T} A deep clone of the input object.
   * @throws {Error} Throws an error if the object contains circular references or non-serializable values.
   * @example
   * // Example 1: Cloning a nested object
   * const original = { a: { b: 1 } };
   * const clone = ObjectUtils.deepClone({ obj: original });
   * clone.a.b = 2;
   * console.log(original.a.b); // Output: 1
   *
   * // Example 2: Cloning an array
   * const array = [1, 2, { a: 3 }];
   * const cloneArray = ObjectUtils.deepClone({ obj: array });
   * cloneArray[2].a = 4;
   * console.log(array[2].a); // Output: 3
   */
  public static deepClone<T>({ obj }: { obj: T }): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Deeply merges two objects, combining properties from both the target and source objects.
   * If properties in the source object are objects or arrays, they will be deeply merged.
   * If properties in the source object conflict with the target, the source takes precedence.
   * @template T The type of the target object.
   * @template U The type of the source object.
   * @param {object} params The parameters for the method.
   * @param {T} params.target The target object. This object provides the base for the merge.
   * @param {U} params.source The source object. Properties from this object will be merged into the target.
   * @returns {T & U} A new object with merged values from both the target and source objects.
   * @example
   * // Example 1: Merging nested objects
   * const target = { a: { b: 1 } };
   * const source = { a: { c: 2 } };
   * const merged = ObjectUtils.deepMerge({ target, source });
   * console.log(merged); // Output: { a: { b: 1, c: 2 } }
   *
   * // Example 2: Merging arrays
   * const target = { a: [1, 2] };
   * const source = { a: [3, 4] };
   * const merged = ObjectUtils.deepMerge({ target, source });
   * console.log(merged); // Output: { a: [1, 2, 3, 4] }
   *
   * // Example 3: Overwriting primitive values
   * const target = { a: 1 };
   * const source = { a: 2, b: 3 };
   * const merged = ObjectUtils.deepMerge({ target, source });
   * console.log(merged); // Output: { a: 2, b: 3 }
   */
  public static deepMerge<
    T extends Record<string, any>,
    U extends Record<string, any>,
  >({ target, source }: { target: T; source: U }): T & U {
    if (typeof target !== 'object' || target === null) return source as T & U;
    if (typeof source !== 'object' || source === null) return target as T & U;

    const result: Record<string, any> = { ...target };

    for (const key of Object.keys(source)) {
      result[key] =
        Array.isArray(source[key]) && Array.isArray(result[key])
          ? [...result[key], ...source[key]]
          : typeof source[key] === 'object' && !Array.isArray(source[key])
            ? ObjectUtils.deepMerge({
                target: result[key] || {},
                source: source[key],
              })
            : source[key];
    }

    return result as T & U;
  }

  /**
   * Picks specific keys from an object and creates a new object containing only those keys.
   * @template T The type of the object to pick from.
   * @template K The type of keys to pick from the object.
   * @param {object} params The parameters for the method.
   * @param {T} params.obj The object to pick from.
   * @param {K[]} params.keys An array of keys to pick from the object.
   * @returns {Pick<T, K>} A new object containing only the specified keys.
   * @example
   * // Example 1: Picking keys from a flat object
   * const obj = { a: 1, b: 2, c: 3 };
   * const result = ObjectUtils.pick({ obj, keys: ['a', 'c'] });
   * console.log(result); // Output: { a: 1, c: 3 }
   *
   * // Example 2: Picking keys from a nested object
   * const obj = { a: 1, b: { x: 10 }, c: 3 };
   * const result = ObjectUtils.pick({ obj, keys: ['b'] });
   * console.log(result); // Output: { b: { x: 10 } }
   */
  public static pick<T extends object, K extends keyof T>({
    obj,
    keys,
  }: {
    obj: T;
    keys: K[];
  }): Pick<T, K> {
    return keys.reduce(
      (acc, key) => {
        if (key in obj) acc[key] = obj[key];
        return acc;
      },
      {} as Pick<T, K>,
    );
  }

  /**
   * Omits specific keys from an object and returns a new object without those keys.
   * @template T The type of the object.
   * @template K The keys to omit.
   * @param {object} params The parameters for the method.
   * @param {T} params.obj The object to omit keys from.
   * @param {K[]} params.keys An array of keys to omit from the object.
   * @returns {Omit<T, K>} A new object without the omitted keys.
   * @example
   * const obj = { a: 1, b: 2, c: 3 };
   * const result = ObjectUtils.omit({ obj, keys: ['b'] });
   * console.log(result); // { a: 1, c: 3 }
   */
  public static omit<T extends object, K extends keyof T>({
    obj,
    keys,
  }: {
    obj: T;
    keys: K[];
  }): Omit<T, K> {
    const result = {} as Record<string, any>;

    Object.keys(obj).forEach((key) => {
      if (!keys.includes(key as K)) {
        result[key] = obj[key as K];
      }
    });

    return result as Omit<T, K>;
  }

  /**
   * Flattens a nested object into a single level with dot-separated keys.
   * @param {object} params The parameters for the method.
   * @param {Record<string, any>} params.obj The object to flatten.
   * @param {string} [params.prefix=''] The prefix for nested keys (used internally during recursion).
   * @returns {Record<string, any>} A flattened object with dot-separated keys.
   * @example
   * const obj = { a: { b: 1, c: 2 }, d: 3 };
   * const result = ObjectUtils.flattenObject({ obj });
   * console.log(result); // { 'a.b': 1, 'a.c': 2, 'd': 3 }
   */
  public static flattenObject({
    obj,
    prefix = '',
  }: {
    obj: Record<string, any>;
    prefix?: string;
  }): Record<string, any> {
    return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(
          acc,
          ObjectUtils.flattenObject({ obj: obj[key], prefix: path }),
        );
      } else {
        acc[path] = obj[key];
      }
      return acc;
    }, {});
  }

  /**
   * Inverts the keys and values of an object.
   * @param {object} params The parameters for the method.
   * @param {Record<string, any>} params.obj The object to invert.
   * @returns {Record<string, string | number>} A new object with inverted keys and values.
   * @example
   * const obj = { a: 1, b: 2 };
   * const result = ObjectUtils.invert({ obj });
   * console.log(result); // { 1: 'a', 2: 'b' }
   */
  public static invert<T>({
    obj,
  }: {
    obj: Record<string, any>;
  }): Record<string, string | number> {
    return Object.keys(obj).reduce(
      (acc, key) => {
        acc[obj[key]] = key;
        return acc;
      },
      {} as Record<string, string | number>,
    );
  }

  /**
   * Deeply freezes an object, making it immutable.
   * @template T The type of the object.
   * @param {object} params The parameters for the method.
   * @param {T} params.obj The object to freeze.
   * @returns {T} The deeply frozen object.
   * @example
   * const obj = { a: { b: 1 } };
   * ObjectUtils.deepFreeze({ obj });
   * obj.a.b = 2; // Throws an error in strict mode
   */
  public static deepFreeze<T extends object>({ obj }: { obj: T }): T {
    Object.keys(obj).forEach((key) => {
      const value = obj[key as keyof T];
      if (typeof value === 'object' && value !== null) {
        ObjectUtils.deepFreeze({ obj: value });
      }
    });
    return Object.freeze(obj);
  }

  /**
   * Deeply compares two objects for equality.
   * @template T The type of the objects.
   * @param {object} params The parameters for the method.
   * @param {T} params.obj1 The first object.
   * @param {T} params.obj2 The second object.
   * @returns {boolean} `true` if the objects are deeply equal, otherwise `false`.
   * @example
   * const obj1 = { a: 1, b: { c: 2 } };
   * const obj2 = { a: 1, b: { c: 2 } };
   * const result = ObjectUtils.compare({ obj1, obj2 });
   * console.log(result); // true
   */
  public static compare<T extends object>({
    obj1,
    obj2,
  }: {
    obj1: T;
    obj2: T;
  }): boolean {
    if (obj1 === obj2) return true;

    if (
      typeof obj1 !== 'object' ||
      typeof obj2 !== 'object' ||
      obj1 === null ||
      obj2 === null
    ) {
      return false;
    }

    const keys1 = Object.keys(obj1) as (keyof T)[];
    const keys2 = Object.keys(obj2) as (keyof T)[];

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
      const value1 = obj1[key];
      const value2 = obj2[key];

      const areObjects =
        typeof value1 === 'object' &&
        typeof value2 === 'object' &&
        value1 !== null &&
        value2 !== null;

      return areObjects
        ? ObjectUtils.compare({ obj1: value1, obj2: value2 })
        : value1 === value2;
    });
  }

  /**
   * Groups the keys of an object based on a callback function.
   * @template T The type of the object values.
   * @param {object} params The parameters for the method.
   * @param {Record<string, T>} params.obj The object to group.
   * @param {Function} params.callback A callback function that determines the group key for each value.
   * @returns {Record<string | number, string[]>} An object with grouped keys.
   * @example
   * const obj = { a: 1, b: 2, c: 1 };
   * const result = ObjectUtils.groupBy({ obj, callback: (value) => value });
   * console.log(result); // { 1: ['a', 'c'], 2: ['b'] }
   */
  public static groupBy<T>({
    obj,
    callback,
  }: {
    obj: Record<string, T>;
    callback: (value: T, key: string) => string | number;
  }): Record<string | number, string[]> {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const groupKey = callback(obj[key], key);
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(key);
        return acc;
      },
      {} as Record<string | number, string[]>,
    );
  }

  /**
   * Finds the difference between two objects.
   * @template T The type of the objects.
   * @param {object} params The parameters for the method.
   * @param {T} params.obj1 The first object.
   * @param {T} params.obj2 The second object.
   * @returns {Partial<T>} An object containing the properties that differ.
   * @example
   * const obj1 = { a: 1, b: 2 };
   * const obj2 = { a: 1, b: 3 };
   * const result = ObjectUtils.diff({ obj1, obj2 });
   * console.log(result); // { b: 3 }
   */
  public static diff<T extends object>({
    obj1,
    obj2,
  }: {
    obj1: T;
    obj2: T;
  }): Partial<T> {
    return Object.keys(obj2).reduce((acc, key) => {
      if (obj1[key as keyof T] !== obj2[key as keyof T]) {
        acc[key as keyof T] = obj2[key as keyof T];
      }
      return acc;
    }, {} as Partial<T>);
  }

  /**
   * Sets a value in a nested object by a dot-separated path.
   * @template T The type of the value to set.
   * @param {object} params The parameters for the method.
   * @param {Record<string, any>} params.obj The object to modify.
   * @param {string} params.path The dot-separated path to set the value.
   * @param {T} params.value The value to set.
   * @returns {Record<string, any>} The modified object with the new value.
   * @example
   * const obj = { a: { b: 1 } };
   * ObjectUtils.unflattenObject({ obj, path: 'a.c', value: 2 });
   * console.log(obj); // { a: { b: 1, c: 2 } }
   */
  public static unflattenObject<T>({
    obj,
    path,
    value,
  }: {
    obj: Record<string, any>;
    path: string;
    value: T;
  }): Record<string, any> {
    const keys = path.split('.');
    keys.reduce((acc, key, index) => {
      if (index === keys.length - 1) {
        acc[key] = value;
      } else {
        acc[key] = acc[key] || {};
      }
      return acc[key];
    }, obj);
    return obj;
  }
}
