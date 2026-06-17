import { SortUtils } from '../../src/services/sort.service';

/**
 * Unit tests for the SortUtils class.
 * These tests verify the behavior of each method individually.
 */
describe('SortUtils - Unit Tests', () => {
  // Test arrays
  const unsortedArray = [5, 3, 8, 4, 2];
  const sortedArray = [2, 3, 4, 5, 8];
  const emptyArray: number[] = [];
  const singleElementArray = [42];
  const duplicatesArray = [3, 1, 4, 1, 5, 9, 2, 6, 5];
  const sortedDuplicatesArray = [1, 1, 2, 3, 4, 5, 5, 6, 9];
  const negativeArray = [-5, -3, -8, -4, -2];
  const sortedNegativeArray = [-8, -5, -4, -3, -2];
  const mixedArray = [5, -3, 8, -4, 2, 0];
  const sortedMixedArray = [-4, -3, 0, 2, 5, 8];

  describe('bubbleSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.bubbleSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.bubbleSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bubbleSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.bubbleSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.bubbleSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.bubbleSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.bubbleSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.bubbleSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('mergeSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.mergeSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.mergeSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.mergeSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.mergeSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.mergeSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.mergeSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.mergeSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.mergeSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('quickSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.quickSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.quickSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.quickSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.quickSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.quickSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.quickSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.quickSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.quickSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('heapSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.heapSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.heapSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.heapSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.heapSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.heapSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.heapSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.heapSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.heapSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('selectionSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.selectionSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.selectionSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.selectionSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.selectionSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.selectionSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.selectionSort(negativeArray)).toEqual(
        sortedNegativeArray,
      );
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.selectionSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.selectionSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('insertionSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.insertionSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.insertionSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.insertionSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.insertionSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.insertionSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.insertionSort(negativeArray)).toEqual(
        sortedNegativeArray,
      );
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.insertionSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.insertionSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('shellSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.shellSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.shellSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.shellSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.shellSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.shellSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.shellSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.shellSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.shellSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('countingSort', () => {
    it('should sort an array of non-negative numbers', () => {
      const unsortedPositive = [5, 3, 8, 4, 2];
      const sortedPositive = [2, 3, 4, 5, 8];
      expect(SortUtils.countingSort(unsortedPositive, 8)).toEqual(
        sortedPositive,
      );
    });

    it('should handle an empty array', () => {
      expect(SortUtils.countingSort([], 0)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.countingSort([42], 42)).toEqual([42]);
    });

    it('should sort an array with duplicate elements', () => {
      const unsortedDuplicates = [3, 1, 4, 1, 5, 9, 2, 6, 5];
      const sortedDuplicates = [1, 1, 2, 3, 4, 5, 5, 6, 9];
      expect(SortUtils.countingSort(unsortedDuplicates, 9)).toEqual(
        sortedDuplicates,
      );
    });

    it('should throw an error for an array with negative numbers', () => {
      expect(() => {
        SortUtils.countingSort([-5, 3, 8], 8);
      }).toThrow('Counting Sort only supports non-negative integers');
    });

    it('should throw an error for a negative maxValue', () => {
      expect(() => {
        SortUtils.countingSort([5, 3, 8], -1);
      }).toThrow('Maximum value must be a non-negative integer');
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.countingSort(123, 10);
      }).toThrow('Input must be an array');
    });
  });

  describe('radixSort', () => {
    it('should sort an array of non-negative numbers', () => {
      const unsortedPositive = [170, 45, 75, 90, 802, 24, 2, 66];
      const sortedPositive = [2, 24, 45, 66, 75, 90, 170, 802];
      expect(SortUtils.radixSort(unsortedPositive)).toEqual(sortedPositive);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.radixSort([])).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.radixSort([42])).toEqual([42]);
    });

    it('should sort an array with duplicate elements', () => {
      const unsortedDuplicates = [53, 11, 44, 11, 55, 99, 22, 66, 55];
      const sortedDuplicates = [11, 11, 22, 44, 53, 55, 55, 66, 99];
      expect(SortUtils.radixSort(unsortedDuplicates)).toEqual(sortedDuplicates);
    });

    it('should throw an error for an array with negative numbers', () => {
      expect(() => {
        SortUtils.radixSort([-5, 3, 8]);
      }).toThrow('Radix Sort only supports non-negative integers');
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.radixSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('bucketSort', () => {
    it('should sort an array of numbers', () => {
      const unsorted = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];
      const sorted = [0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52];
      expect(SortUtils.bucketSort(unsorted)).toEqual(sorted);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bucketSort([])).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.bucketSort([42])).toEqual([42]);
    });

    it('should sort an array with duplicate elements', () => {
      const unsortedDuplicates = [0.5, 0.3, 0.4, 0.3, 0.5];
      const sortedDuplicates = [0.3, 0.3, 0.4, 0.5, 0.5];
      expect(SortUtils.bucketSort(unsortedDuplicates)).toEqual(
        sortedDuplicates,
      );
    });

    it('should sort with a custom bucket size', () => {
      const unsorted = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];
      const sorted = [0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52];
      expect(SortUtils.bucketSort(unsorted, 3)).toEqual(sorted);
    });
  });

  describe('timSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.timSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.timSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.timSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.timSort(singleElementArray)).toEqual(singleElementArray);
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.timSort(duplicatesArray)).toEqual(sortedDuplicatesArray);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.timSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.timSort(mixedArray)).toEqual(sortedMixedArray);
    });
  });

  // Tests for less common algorithms
  describe('gnomeSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.gnomeSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.gnomeSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('combSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.combSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.combSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('cocktailShakerSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.cocktailShakerSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.cocktailShakerSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('pancakeSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.pancakeSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.pancakeSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('bitonicSort', () => {
    it('should sort an unsorted array', () => {
      // Bitonic sort works best with arrays of size 2^n
      const unsortedBitonic = [5, 3, 8, 4, 2, 9, 1, 7];
      const sortedBitonic = [1, 2, 3, 4, 5, 7, 8, 9];
      expect(SortUtils.bitonicSort(unsortedBitonic)).toEqual(sortedBitonic);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.bitonicSort(123);
      }).toThrow('Input must be an array');
    });
  });

  // Additional edge-case coverage for radixSort
  describe('radixSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.radixSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.radixSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle numbers with a varying number of digits', () => {
      expect(SortUtils.radixSort([1, 1000, 10, 100])).toEqual([
        1, 10, 100, 1000,
      ]);
    });
  });

  // Additional edge-case coverage for bucketSort
  describe('bucketSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      const sorted = [0.1, 0.2, 0.3, 0.4, 0.5];
      expect(SortUtils.bucketSort(sorted)).toEqual(sorted);
    });

    it('should sort a reverse sorted array', () => {
      const reverse = [0.5, 0.4, 0.3, 0.2, 0.1];
      const sorted = [0.1, 0.2, 0.3, 0.4, 0.5];
      expect(SortUtils.bucketSort(reverse)).toEqual(sorted);
    });

    it('should sort integers using a default bucket size', () => {
      expect(SortUtils.bucketSort([29, 25, 3, 49, 9, 37, 21, 43])).toEqual([
        3, 9, 21, 25, 29, 37, 43, 49,
      ]);
    });
  });

  // Additional edge-case coverage for the less common comparison sorts
  describe('gnomeSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.gnomeSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.gnomeSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.gnomeSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.gnomeSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.gnomeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.gnomeSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.gnomeSort(mixedArray)).toEqual(sortedMixedArray);
    });
  });

  describe('combSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.combSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.combSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.combSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.combSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.combSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.combSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.combSort(mixedArray)).toEqual(sortedMixedArray);
    });
  });

  describe('cocktailShakerSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.cocktailShakerSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.cocktailShakerSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.cocktailShakerSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.cocktailShakerSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.cocktailShakerSort([5, 4, 3, 2, 1])).toEqual([
        1, 2, 3, 4, 5,
      ]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.cocktailShakerSort(negativeArray)).toEqual(
        sortedNegativeArray,
      );
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.cocktailShakerSort(mixedArray)).toEqual(sortedMixedArray);
    });
  });

  describe('pancakeSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.pancakeSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.pancakeSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.pancakeSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.pancakeSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.pancakeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.pancakeSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.pancakeSort(mixedArray)).toEqual(sortedMixedArray);
    });
  });

  describe('bitonicSort - additional cases', () => {
    // Bitonic sort requires a power-of-two length to fully sort the array.
    const unsortedPow2 = [5, 3, 8, 4, 2, 9, 1, 7];
    const sortedPow2 = [1, 2, 3, 4, 5, 7, 8, 9];

    it('should keep an already sorted power-of-two array', () => {
      expect(SortUtils.bitonicSort(sortedPow2)).toEqual(sortedPow2);
    });

    it('should sort a reverse sorted power-of-two array', () => {
      expect(SortUtils.bitonicSort([8, 7, 6, 5, 4, 3, 2, 1])).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8,
      ]);
    });

    it('should sort a power-of-two array with duplicate elements', () => {
      expect(SortUtils.bitonicSort([4, 2, 4, 1, 3, 2, 1, 3])).toEqual([
        1, 1, 2, 2, 3, 3, 4, 4,
      ]);
    });

    it('should sort a power-of-two array with negative numbers', () => {
      expect(SortUtils.bitonicSort([-1, -8, -3, -5, -2, -7, -4, -6])).toEqual([
        -8, -7, -6, -5, -4, -3, -2, -1,
      ]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bitonicSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.bitonicSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort a two-element array', () => {
      expect(SortUtils.bitonicSort(unsortedPow2.slice(0, 2))).toEqual([3, 5]);
    });
  });

  describe('stoogeSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.stoogeSort(unsortedArray)).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.stoogeSort(sortedArray)).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.stoogeSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.stoogeSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.stoogeSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.stoogeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.stoogeSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.stoogeSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.stoogeSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('bogoSort', () => {
    // Use only tiny arrays to avoid the factorial-time worst case.
    it('should sort a tiny unsorted array', () => {
      expect(SortUtils.bogoSort([2, 1])).toEqual([1, 2]);
    });

    it('should keep an already sorted tiny array', () => {
      expect(SortUtils.bogoSort([1, 2])).toEqual([1, 2]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bogoSort(emptyArray)).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.bogoSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.bogoSort(123);
      }).toThrow('Input must be an array');
    });
  });
});
