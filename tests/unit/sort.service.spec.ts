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
      expect(SortUtils.bubbleSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.bubbleSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bubbleSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.bubbleSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.bubbleSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.bubbleSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.bubbleSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.bubbleSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('mergeSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.mergeSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.mergeSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.mergeSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.mergeSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.mergeSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.mergeSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.mergeSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.mergeSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('quickSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.quickSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.quickSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.quickSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.quickSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.quickSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.quickSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.quickSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.quickSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('heapSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.heapSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.heapSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.heapSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.heapSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.heapSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.heapSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.heapSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.heapSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('selectionSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.selectionSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.selectionSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.selectionSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.selectionSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.selectionSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.selectionSort({ array: negativeArray })).toEqual(
        sortedNegativeArray,
      );
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.selectionSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.selectionSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('insertionSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.insertionSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.insertionSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.insertionSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.insertionSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.insertionSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.insertionSort({ array: negativeArray })).toEqual(
        sortedNegativeArray,
      );
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.insertionSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.insertionSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('shellSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.shellSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.shellSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.shellSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.shellSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.shellSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.shellSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.shellSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.shellSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('countingSort', () => {
    it('should sort an array of non-negative numbers', () => {
      const unsortedPositive = [5, 3, 8, 4, 2];
      const sortedPositive = [2, 3, 4, 5, 8];
      expect(SortUtils.countingSort({ array: unsortedPositive, maxValue: 8 })).toEqual(
        sortedPositive,
      );
    });

    it('should handle an empty array', () => {
      expect(SortUtils.countingSort({ array: [], maxValue: 0 })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.countingSort({ array: [42], maxValue: 42 })).toEqual([42]);
    });

    it('should sort an array with duplicate elements', () => {
      const unsortedDuplicates = [3, 1, 4, 1, 5, 9, 2, 6, 5];
      const sortedDuplicates = [1, 1, 2, 3, 4, 5, 5, 6, 9];
      expect(SortUtils.countingSort({ array: unsortedDuplicates, maxValue: 9 })).toEqual(
        sortedDuplicates,
      );
    });

    it('should throw an error for an array with negative numbers', () => {
      expect(() => {
        SortUtils.countingSort({ array: [-5, 3, 8], maxValue: 8 });
      }).toThrow('Counting Sort only supports non-negative integers');
    });

    it('should throw an error for a negative maxValue', () => {
      expect(() => {
        SortUtils.countingSort({ array: [5, 3, 8], maxValue: -1 });
      }).toThrow('Maximum value must be a non-negative integer');
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.countingSort({ array: 123, maxValue: 10 });
      }).toThrow('Input must be an array');
    });
  });

  describe('radixSort', () => {
    it('should sort an array of non-negative numbers', () => {
      const unsortedPositive = [170, 45, 75, 90, 802, 24, 2, 66];
      const sortedPositive = [2, 24, 45, 66, 75, 90, 170, 802];
      expect(SortUtils.radixSort({ array: unsortedPositive })).toEqual(sortedPositive);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.radixSort({ array: [] })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.radixSort({ array: [42] })).toEqual([42]);
    });

    it('should sort an array with duplicate elements', () => {
      const unsortedDuplicates = [53, 11, 44, 11, 55, 99, 22, 66, 55];
      const sortedDuplicates = [11, 11, 22, 44, 53, 55, 55, 66, 99];
      expect(SortUtils.radixSort({ array: unsortedDuplicates })).toEqual(sortedDuplicates);
    });

    it('should throw an error for an array with negative numbers', () => {
      expect(() => {
        SortUtils.radixSort({ array: [-5, 3, 8] });
      }).toThrow('Radix Sort only supports non-negative integers');
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.radixSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('bucketSort', () => {
    it('should sort an array of numbers', () => {
      const unsorted = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];
      const sorted = [0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52];
      expect(SortUtils.bucketSort({ array: unsorted })).toEqual(sorted);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bucketSort({ array: [] })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.bucketSort({ array: [42] })).toEqual([42]);
    });

    it('should sort an array with duplicate elements', () => {
      const unsortedDuplicates = [0.5, 0.3, 0.4, 0.3, 0.5];
      const sortedDuplicates = [0.3, 0.3, 0.4, 0.5, 0.5];
      expect(SortUtils.bucketSort({ array: unsortedDuplicates })).toEqual(
        sortedDuplicates,
      );
    });

    it('should sort with a custom bucket size', () => {
      const unsorted = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];
      const sorted = [0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52];
      expect(SortUtils.bucketSort({ array: unsorted, bucketSize: 3 })).toEqual(sorted);
    });
  });

  describe('timSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.timSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.timSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.timSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.timSort({ array: singleElementArray })).toEqual(singleElementArray);
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.timSort({ array: duplicatesArray })).toEqual(sortedDuplicatesArray);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.timSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.timSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });
  });

  // Tests for less common algorithms
  describe('gnomeSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.gnomeSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.gnomeSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('combSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.combSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.combSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('cocktailShakerSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.cocktailShakerSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.cocktailShakerSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('pancakeSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.pancakeSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.pancakeSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('bitonicSort', () => {
    it('should sort an unsorted array', () => {
      // Bitonic sort works best with arrays of size 2^n
      const unsortedBitonic = [5, 3, 8, 4, 2, 9, 1, 7];
      const sortedBitonic = [1, 2, 3, 4, 5, 7, 8, 9];
      expect(SortUtils.bitonicSort({ array: unsortedBitonic })).toEqual(sortedBitonic);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.bitonicSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  // Additional edge-case coverage for radixSort
  describe('radixSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.radixSort({ array: [1, 2, 3, 4, 5] })).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.radixSort({ array: [5, 4, 3, 2, 1] })).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle numbers with a varying number of digits', () => {
      expect(SortUtils.radixSort({ array: [1, 1000, 10, 100] })).toEqual([
        1, 10, 100, 1000,
      ]);
    });
  });

  // Additional edge-case coverage for bucketSort
  describe('bucketSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      const sorted = [0.1, 0.2, 0.3, 0.4, 0.5];
      expect(SortUtils.bucketSort({ array: sorted })).toEqual(sorted);
    });

    it('should sort a reverse sorted array', () => {
      const reverse = [0.5, 0.4, 0.3, 0.2, 0.1];
      const sorted = [0.1, 0.2, 0.3, 0.4, 0.5];
      expect(SortUtils.bucketSort({ array: reverse })).toEqual(sorted);
    });

    it('should sort integers using a default bucket size', () => {
      expect(SortUtils.bucketSort({ array: [29, 25, 3, 49, 9, 37, 21, 43] })).toEqual([
        3, 9, 21, 25, 29, 37, 43, 49,
      ]);
    });
  });

  // Additional edge-case coverage for the less common comparison sorts
  describe('gnomeSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.gnomeSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.gnomeSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.gnomeSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.gnomeSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.gnomeSort({ array: [5, 4, 3, 2, 1] })).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.gnomeSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.gnomeSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });
  });

  describe('combSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.combSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.combSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.combSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.combSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.combSort({ array: [5, 4, 3, 2, 1] })).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.combSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.combSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });
  });

  describe('cocktailShakerSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.cocktailShakerSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.cocktailShakerSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.cocktailShakerSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.cocktailShakerSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.cocktailShakerSort({ array: [5, 4, 3, 2, 1] })).toEqual([
        1, 2, 3, 4, 5,
      ]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.cocktailShakerSort({ array: negativeArray })).toEqual(
        sortedNegativeArray,
      );
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.cocktailShakerSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });
  });

  describe('pancakeSort - additional cases', () => {
    it('should keep an already sorted array', () => {
      expect(SortUtils.pancakeSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.pancakeSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.pancakeSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.pancakeSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.pancakeSort({ array: [5, 4, 3, 2, 1] })).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.pancakeSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.pancakeSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });
  });

  describe('bitonicSort - additional cases', () => {
    // Bitonic sort requires a power-of-two length to fully sort the array.
    const unsortedPow2 = [5, 3, 8, 4, 2, 9, 1, 7];
    const sortedPow2 = [1, 2, 3, 4, 5, 7, 8, 9];

    it('should keep an already sorted power-of-two array', () => {
      expect(SortUtils.bitonicSort({ array: sortedPow2 })).toEqual(sortedPow2);
    });

    it('should sort a reverse sorted power-of-two array', () => {
      expect(SortUtils.bitonicSort({ array: [8, 7, 6, 5, 4, 3, 2, 1] })).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8,
      ]);
    });

    it('should sort a power-of-two array with duplicate elements', () => {
      expect(SortUtils.bitonicSort({ array: [4, 2, 4, 1, 3, 2, 1, 3] })).toEqual([
        1, 1, 2, 2, 3, 3, 4, 4,
      ]);
    });

    it('should sort a power-of-two array with negative numbers', () => {
      expect(SortUtils.bitonicSort({ array: [-1, -8, -3, -5, -2, -7, -4, -6] })).toEqual([
        -8, -7, -6, -5, -4, -3, -2, -1,
      ]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bitonicSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.bitonicSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort a two-element array', () => {
      expect(SortUtils.bitonicSort({ array: unsortedPow2.slice(0, 2) })).toEqual([3, 5]);
    });
  });

  describe('stoogeSort', () => {
    it('should sort an unsorted array', () => {
      expect(SortUtils.stoogeSort({ array: unsortedArray })).toEqual(sortedArray);
    });

    it('should keep an already sorted array', () => {
      expect(SortUtils.stoogeSort({ array: sortedArray })).toEqual(sortedArray);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.stoogeSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.stoogeSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should sort an array with duplicate elements', () => {
      expect(SortUtils.stoogeSort({ array: duplicatesArray })).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('should sort a reverse sorted array', () => {
      expect(SortUtils.stoogeSort({ array: [5, 4, 3, 2, 1] })).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort an array with negative numbers', () => {
      expect(SortUtils.stoogeSort({ array: negativeArray })).toEqual(sortedNegativeArray);
    });

    it('should sort an array with mixed numbers', () => {
      expect(SortUtils.stoogeSort({ array: mixedArray })).toEqual(sortedMixedArray);
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.stoogeSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });

  describe('bogoSort', () => {
    // Use only tiny arrays to avoid the factorial-time worst case.
    it('should sort a tiny unsorted array', () => {
      expect(SortUtils.bogoSort({ array: [2, 1] })).toEqual([1, 2]);
    });

    it('should keep an already sorted tiny array', () => {
      expect(SortUtils.bogoSort({ array: [1, 2] })).toEqual([1, 2]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bogoSort({ array: emptyArray })).toEqual([]);
    });

    it('should handle a single-element array', () => {
      expect(SortUtils.bogoSort({ array: singleElementArray })).toEqual(
        singleElementArray,
      );
    });

    it('should throw an error for non-array input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        SortUtils.bogoSort({ array: 123 });
      }).toThrow('Input must be an array');
    });
  });
});
