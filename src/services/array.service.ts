export class ArrayUtils {
  /**
   * Removes duplicate values from an array.
   * @param {object} params - The parameters for the method.
   * @param {T[]} params.array - Array of values.
   * @param {Function} [params.keyFn] - Optional function to determine uniqueness based on a key.
   * @returns {T[]} Array with unique values.
   * @example
   * ArrayUtils.removeDuplicates({ 
   *   array: [1, 2, 2, 3] 
   * }); // [1, 2, 3]
   * 
   * ArrayUtils.removeDuplicates({
   *   array: [{ id: 1 }, { id: 2 }, { id: 1 }],
   *   keyFn: (item) => item.id
   * }); // [{ id: 1 }, { id: 2 }]
   */
  public static removeDuplicates<T>({
    array,
    keyFn,
  }: {
    array: T[];
    keyFn?: (item: T) => string | number;
  }): T[] {
    if (!Array.isArray(array)) {
      throw new Error('Input must be an array');
    }

    const seen = new Set();
    return keyFn
      ? array.filter((item) => {
          const key = keyFn(item);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
      : [...new Set(array)];
  }

  /**
   * Finds the intersection of two arrays.
   * @param {object} params - The parameters for the method.
   * @param {T[]} params.array1 - First array.
   * @param {T[]} params.array2 - Second array.
   * @returns {T[]} Array containing values present in both arrays.
   * @example
   * ArrayUtils.intersect({ 
   *   array1: [1, 2, 3], 
   *   array2: [2, 3, 4] 
   * }); // [2, 3]
   */
  public static intersect<T>({
    array1,
    array2,
  }: {
    array1: T[];
    array2: T[];
  }): T[] {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
      throw new Error('Both inputs must be arrays');
    }

    const set2 = new Set(array2);
    return array1.filter((value) => set2.has(value));
  }

  /**
   * Flattens a multi-dimensional array into a single-dimensional array.
   * @param {object} params - The parameters for the method.
   * @param {(T | T[])[]} params.array - Multi-dimensional array.
   * @returns {T[]} Flattened array.
   * @example
   * ArrayUtils.flatten({ 
   *   array: [1, [2, [3, 4]], 5] 
   * }); // [1, 2, 3, 4, 5]
   */
  public static flatten<T>({
    array,
  }: {
    array: (T | T[])[];
  }): T[] {
    if (!Array.isArray(array)) {
      throw new Error('Input must be an array');
    }

    const result: T[] = [];
    const stack = [...array];

    while (stack.length) {
      const value = stack.pop();
      if (Array.isArray(value)) {
        stack.push(...value);
      } else {
        result.unshift(value as T);
      }
    }

    return result;
  }

  /**
   * Groups elements of an array based on a grouping function.
   * @param {object} params - The parameters for the method.
   * @param {T[]} params.array - Array of values.
   * @param {Function} params.keyFn - Function to determine the group key.
   * @returns {Record<string | number, T[]>} An object with keys as group identifiers and values as arrays of grouped elements.
   * @example
   * ArrayUtils.groupBy({
   *   array: [
   *     { type: 'fruit', name: 'apple' }, 
   *     { type: 'vegetable', name: 'carrot' }
   *   ],
   *   keyFn: (item) => item.type
   * }); // { fruit: [...], vegetable: [...] }
   */
  public static groupBy<T>({
    array,
    keyFn,
  }: {
    array: T[];
    keyFn: (item: T) => string | number;
  }): Record<string | number, T[]> {
    if (!Array.isArray(array)) {
      throw new Error('Input must be an array');
    }

    return array.reduce(
      (acc, item) => {
        const key = keyFn(item);
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string | number, T[]>,
    );
  }

  /**
   * Shuffles the elements of an array randomly.
   * @param {object} params - The parameters for the method.
   * @param {T[]} params.array - Array to be shuffled.
   * @returns {T[]} New array with shuffled elements.
   * @example
   * ArrayUtils.shuffle({ 
   *   array: [1, 2, 3, 4] 
   * }); // [3, 1, 4, 2]
   */
  public static shuffle<T>({
    array,
  }: {
    array: T[];
  }): T[] {
    if (!Array.isArray(array)) {
      throw new Error('Input must be an array');
    }

    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Sorts an array based on the specified order and key(s).
   * @param {object} params - The parameters for the method.
   * @param {T[]} params.array - The array to be sorted.
   * @param {'asc' | 'desc' | Record<string, 'asc' | 'desc'>} params.orderBy - Sorting criteria.
   * @returns {T[]} A new array sorted based on the specified criteria.
   * @example
   * ArrayUtils.sort({ 
   *   array: ['c', 'a', 'b'], 
   *   orderBy: 'asc' 
   * }); // ['a', 'b', 'c']
   * 
   * ArrayUtils.sort({
   *   array: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }],
   *   orderBy: { age: 'asc' }
   * }); // [{ name: 'Jane', age: 25 }, { name: 'John', age: 30 }]
   */
  public static sort<T>({
    array,
    orderBy,
  }: {
    array: T[];
    orderBy: 'asc' | 'desc' | Record<string, 'asc' | 'desc'>;
  }): T[] {
    if (!Array.isArray(array) || array.length === 0) {
      throw new Error('Input must be a non-empty array');
    }

    const isPrimitive = typeof array[0] !== 'object';

    if (isPrimitive && (orderBy === 'asc' || orderBy === 'desc')) {
      return [...array].sort((a, b) =>
        orderBy === 'asc' ? (a > b ? 1 : -1) : a < b ? 1 : -1,
      );
    }

    if (typeof orderBy === 'object') {
      const keys = Object.keys(orderBy);

      return [...array].sort((a, b) => {
        for (const key of keys) {
          const direction = orderBy[key];
          const valueA = (a as Record<string, any>)[key];
          const valueB = (b as Record<string, any>)[key];

          if (valueA > valueB) return direction === 'asc' ? 1 : -1;
          if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        }
        return 0;
      });
    }

    throw new Error(
      "Invalid 'orderBy' format. Use 'asc', 'desc', or an object specifying keys and orders.",
    );
  }

  /**
   * Finds the first object in an array where the subset matches the superset.
   * @param {object} params - The parameters for the method.
   * @param {T[]} params.array - Array of objects to search.
   * @param {Partial<T>} params.subset - Object containing key-value pairs to match.
   * @returns {T | null} The first object matching the subset, or `null` if not found.
   * @example
   * ArrayUtils.findSubset({
   *   array: [
   *     { id: 1, name: 'John' },
   *     { id: 2, name: 'Jane' },
   *   ],
   *   subset: { name: 'John' },
   * }); // { id: 1, name: 'John' }
   */
  public static findSubset<T extends Record<string, any>>({
    array,
    subset,
  }: {
    array: T[];
    subset: Partial<T>;
  }): T | null {
    return (
      array.find((item) =>
        Object.entries(subset).every(([key, value]) => {
          if (value === undefined) return true;
          if (Array.isArray(value)) {
            return (
              Array.isArray(item[key]) &&
              value.every((val) => (item[key] as any[]).includes(val))
            );
          }
          return item[key] === value;
        }),
      ) || null
    );
  }

  /**
   * Checks if a subset is fully contained within a superset.
   * @param {object} params - The parameters for the method.
   * @param {T} params.superset - The object to check against.
   * @param {Partial<T>} params.subset - The subset to validate.
   * @returns {boolean} `true` if the superset contains the subset, otherwise `false`.
   * @example
   * ArrayUtils.isSubset({
   *   superset: { id: 1, name: 'John' },
   *   subset: { name: 'John' },
   * }); // true
   */
  public static isSubset<T extends Record<string, any>>({
    superset,
    subset,
  }: {
    superset: T;
    subset: Partial<T>;
  }): boolean {
    return Object.entries(subset).every(([key, value]) => {
      if (value === undefined) return true;
      if (Array.isArray(value)) {
        return (
          Array.isArray(superset[key]) &&
          value.every((val) => (superset[key] as any[]).includes(val))
        );
      }
      return superset[key] === value;
    });
  }
}
