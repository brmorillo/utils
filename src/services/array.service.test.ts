import { Injectable } from '@nestjs/common';

@Injectable()
export class ArrayUtils {
  /**
   * Finds the first object in an array where the subset matches the superset.
   * @template T Type of the objects in the array.
   * @param array Array of objects to search.
   * @param subset Object containing key-value pairs to match.
   * @returns The first object matching the subset, or `null` if not found.
   * @example
   * ArrayUtils.findSubset(
   *   [
   *     { id: 1, name: 'John' },
   *     { id: 2, name: 'Jane' },
   *   ],
   *   { name: 'John' }
   * ); // { id: 1, name: 'John' }
   */
  public static findSubset<T extends Record<string, any>>(
    array: T[],
    subset: Partial<T>,
  ): T | null {
    if (!Array.isArray(array)) {
      throw new Error('Input must be an array');
    }

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
}
