export class ArrayUtils {
  /**
   * Removes duplicate values from an array.
   * @param array Array of values
   * @param keyFn Optional function to determine uniqueness based on a key
   * @returns Array with unique values
   * @example
   * ArrayUtils.removeDuplicates({ array: [1, 2, 2, 3] }) // [1, 2, 3]
   * ArrayUtils.removeDuplicates({
   *   array: [{ id: 1 }, { id: 2 }, { id: 1 }],
   *   keyFn: (item) => item.id,
   * }) // [{ id: 1 }, { id: 2 }]
   */
  public static removeDuplicates<T>({
    array,
    keyFn,
  }: {
    array: T[];
    keyFn?: (item: T) => string | number;
  }): T[] {
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
   * @param array1 First array
   * @param array2 Second array
   * @returns Array containing values present in both arrays
   * @example
   * ArrayUtils.intersect({ array1: [1, 2, 3], array2: [2, 3, 4] }) // [2, 3]
   */
  public static intersect<T>({
    array1,
    array2,
  }: {
    array1: T[];
    array2: T[];
  }): T[] {
    const set2 = new Set(array2);
    return array1.filter((value) => set2.delete(value));
  }

  /**
   * Flattens a multi-dimensional array into a single-dimensional array.
   * @param array Multi-dimensional array
   * @returns Flattened array
   * @example
   * ArrayUtils.flatten({ array: [1, [2, [3, 4]], 5] }) // [1, 2, 3, 4, 5]
   */
  public static flatten<T>({ array }: { array: (T | T[])[] }): T[] {
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
   * @param array Array of values
   * @param keyFn Function to determine the group key
   * @returns An object with keys as group identifiers and values as arrays of grouped elements
   * @example
   * ArrayUtils.groupBy({
   *   array: [
   *     { type: 'fruit', name: 'apple' },
   *     { type: 'fruit', name: 'banana' },
   *     { type: 'vegetable', name: 'carrot' },
   *   ],
   *   keyFn: (item) => item.type,
   * })
   * // {
   * //   fruit: [
   * //     { type: 'fruit', name: 'apple' },
   * //     { type: 'fruit', name: 'banana' },
   * //   ],
   * //   vegetable: [{ type: 'vegetable', name: 'carrot' }],
   * // }
   */
  public static groupBy<T>({
    array,
    keyFn,
  }: {
    array: T[];
    keyFn: (item: T) => string | number;
  }): Record<string | number, T[]> {
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
   * @param array Array to be shuffled
   * @returns New array with shuffled elements
   * @example
   * ArrayUtils.shuffle({ array: [1, 2, 3, 4] }) // e.g., [3, 1, 4, 2]
   */
  public static shuffle<T>({ array }: { array: T[] }): T[] {
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
   * Finds the first object in an array where the subset matches the superset.
   * @template T The type of objects in the array, which must extend Record<string, any>.
   * @param array Array of objects to search.
   * @param subset Object containing key-value pairs to match against objects in the array.
   * @returns The first object from the array that contains the subset, or `null` if no match is found.
   * @example
   * ArrayUtils.findSubset({
   *   array: [
   *     { id: '1', name: 'John', age: 30 },
   *     { id: '2', name: 'Jane', age: 25 },
   *   ],
   *   subset: { name: 'John' },
   * });
   * // Returns: { id: '1', name: 'John', age: 30 }
   *
   * ArrayUtils.findSubset({
   *   array: [
   *     { id: '1', name: 'John', age: 30 },
   *     { id: '2', name: 'Jane', age: 25 },
   *   ],
   *   subset: { age: 40 },
   * });
   * // Returns: null
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
          if (value === undefined) return true; // Ignora campos não definidos
          if (Array.isArray(value)) {
            // Verifica arrays (e.g., economicGroups)
            return (
              Array.isArray(item[key]) &&
              value.every((val) => (item[key] as any[]).includes(val))
            );
          }
          // Verifica outros tipos de valores
          return item[key] === value;
        }),
      ) || null
    );
  }

  /**
   * Checks if a subset object is fully contained within a superset object.
   * @template T The type of the objects being compared, which must extend Record<string, any>.
   * @param superset The object to check against.
   * @param subset The object containing the key-value pairs to match.
   * @returns `true` if the superset contains all key-value pairs in the subset, otherwise `false`.
   * @example
   * ArrayUtils.isSubset({
   *   superset: { id: '1', name: 'John', age: 30 },
   *   subset: { name: 'John' },
   * });
   * // Returns: true
   *
   * ArrayUtils.isSubset({
   *   superset: { id: '1', name: 'John', age: 30 },
   *   subset: { name: 'Jane' },
   * });
   * // Returns: false
   *
   * ArrayUtils.isSubset({
   *   superset: { id: '1', name: 'John', tags: ['admin', 'user'] },
   *   subset: { tags: ['admin'] },
   * });
   * // Returns: true
   */
  public static isSubset<T extends Record<string, any>>({
    superset,
    subset,
  }: {
    superset: T;
    subset: Partial<T>;
  }): boolean {
    return Object.entries(subset).every(([key, value]) => {
      if (value === undefined) return true; // Ignore undefined fields
      if (Array.isArray(value)) {
        return (
          Array.isArray(superset[key]) &&
          value.every((val) => (superset[key] as any[]).includes(val))
        );
      }
      // Check other types of values
      return superset[key] === value;
    });
  }
}
