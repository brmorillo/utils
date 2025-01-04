import { Injectable } from '@nestjs/common';

@Injectable()
export class ArrayUtils {
  /**
   * Removes duplicate values from an array.
   * @param array Array of values.
   * @param keyFn Optional function to determine uniqueness based on a key.
   * @returns Array with unique values.
   * @example
   * ArrayUtils.removeDuplicates([1, 2, 2, 3]); // [1, 2, 3]
   * ArrayUtils.removeDuplicates(
   *   [{ id: 1 }, { id: 2 }, { id: 1 }],
   *   (item) => item.id
   * ); // [{ id: 1 }, { id: 2 }]
   */
  public static removeDuplicates<T>(
    array: T[],
    keyFn?: (item: T) => string | number,
  ): T[] {
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
   * @param array1 First array.
   * @param array2 Second array.
   * @returns Array containing values present in both arrays.
   * @example
   * ArrayUtils.intersect([1, 2, 3], [2, 3, 4]); // [2, 3]
   */
  public static intersect<T>(array1: T[], array2: T[]): T[] {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
      throw new Error('Both inputs must be arrays');
    }

    const set2 = new Set(array2);
    return array1.filter((value) => set2.delete(value));
  }

  /**
   * Flattens a multi-dimensional array into a single-dimensional array.
   * @param array Multi-dimensional array.
   * @returns Flattened array.
   * @example
   * ArrayUtils.flatten([1, [2, [3, 4]], 5]); // [1, 2, 3, 4, 5]
   */
  public static flatten<T>(array: (T | T[])[]): T[] {
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
   * @param array Array of values.
   * @param keyFn Function to determine the group key.
   * @returns An object with keys as group identifiers and values as arrays of grouped elements.
   * @example
   * ArrayUtils.groupBy(
   *   [{ type: 'fruit', name: 'apple' }, { type: 'vegetable', name: 'carrot' }],
   *   (item) => item.type
   * ); // { fruit: [...], vegetable: [...] }
   */
  public static groupBy<T>(
    array: T[],
    keyFn: (item: T) => string | number,
  ): Record<string | number, T[]> {
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
   * @param array Array to be shuffled.
   * @returns New array with shuffled elements.
   * @example
   * ArrayUtils.shuffle([1, 2, 3, 4]); // [3, 1, 4, 2]
   */
  public static shuffle<T>(array: T[]): T[] {
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
   * @param array The array to be sorted.
   * @param orderBy Sorting criteria.
   * @returns A new array sorted based on the specified criteria.
   * @example
   * ArrayUtils.sort(['c', 'a', 'b'], 'asc'); // ['a', 'b', 'c']
   */
  public static sort<T>(
    array: T[],
    orderBy: 'asc' | 'desc' | Record<string, 'asc' | 'desc'>,
  ): T[] {
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
}
