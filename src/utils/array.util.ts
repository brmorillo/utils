/**
 * Removes duplicate values from an array.
 * @param array Array of values
 * @returns Array with unique values
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Finds the intersection of two arrays.
 * @param array1 First array
 * @param array2 Second array
 * @returns Array containing values present in both arrays
 */
export function intersectArrays<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(value => array2.includes(value));
}

/**
 * Flattens a multi-dimensional array into a single-dimensional array.
 * @param array Multi-dimensional array
 * @returns Flattened array
 */
export function flattenArray<T>(array: any[]): T[] {
  return array.reduce<T[]>((acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val) : val), []);
}

/**
 * Groups elements of an array based on a grouping function.
 * @param array Array of values
 * @param keyFn Function to determine the group key
 * @returns An object with keys as group identifiers and values as arrays of grouped elements
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string | number): Record<string | number, T[]> {
  return array.reduce<Record<string | number, T[]>>((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

/**
 * Shuffles the elements of an array randomly.
 * @param array Array to be shuffled
 * @returns New array with shuffled elements
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
