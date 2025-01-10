import { SortUtils } from './sort.service';

describe('SortUtils', () => {
  describe('bubbleSort', () => {
    it('should sort an array of numbers in ascending order', () => {
      expect(SortUtils.bubbleSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8]);
    });

    it('should return an empty array when input is empty', () => {
      expect(SortUtils.bubbleSort([])).toEqual([]);
    });

    it('should return the same array if it contains a single element', () => {
      expect(SortUtils.bubbleSort([1])).toEqual([1]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => SortUtils.bubbleSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('mergeSort', () => {
    it('should sort an array of numbers in ascending order', () => {
      expect(SortUtils.mergeSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8]);
    });

    it('should return an empty array when input is empty', () => {
      expect(SortUtils.mergeSort([])).toEqual([]);
    });

    it('should return the same array if it contains a single element', () => {
      expect(SortUtils.mergeSort([1])).toEqual([1]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => SortUtils.mergeSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('quickSort', () => {
    it('should sort an array of numbers in ascending order', () => {
      expect(SortUtils.quickSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8]);
    });

    it('should return an empty array when input is empty', () => {
      expect(SortUtils.quickSort([])).toEqual([]);
    });

    it('should return the same array if it contains a single element', () => {
      expect(SortUtils.quickSort([1])).toEqual([1]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => SortUtils.quickSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('heapSort', () => {
    it('should sort an array of numbers in ascending order', () => {
      expect(SortUtils.heapSort([5, 3, 8, 4, 2])).toEqual([2, 3, 4, 5, 8]);
    });

    it('should return an empty array when input is empty', () => {
      expect(SortUtils.heapSort([])).toEqual([]);
    });

    it('should return the same array if it contains a single element', () => {
      expect(SortUtils.heapSort([1])).toEqual([1]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => SortUtils.heapSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('selectionSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.selectionSort([3, 1, 4, 1, 5, 9])).toEqual([
        1, 1, 3, 4, 5, 9,
      ]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.selectionSort([])).toEqual([]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.selectionSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.selectionSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('insertionSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.insertionSort([3, 1, 4, 1, 5, 9])).toEqual([
        1, 1, 3, 4, 5, 9,
      ]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.insertionSort([])).toEqual([]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.insertionSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.insertionSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('shellSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.shellSort([3, 1, 4, 1, 5, 9])).toEqual([
        1, 1, 3, 4, 5, 9,
      ]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.shellSort([])).toEqual([]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.shellSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.shellSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('countingSort', () => {
    it('should sort an array of non-negative integers', () => {
      expect(SortUtils.countingSort([3, 1, 4, 1, 0, 5], 5)).toEqual([
        0, 1, 1, 3, 4, 5,
      ]);
    });

    it('should handle an array with duplicate values', () => {
      expect(SortUtils.countingSort([1, 3, 2, 3, 0, 2], 3)).toEqual([
        0, 1, 2, 2, 3, 3,
      ]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.countingSort([], 0)).toEqual([]);
    });

    it('should throw an error for negative integers in the array', () => {
      expect(() => SortUtils.countingSort([3, -1, 4, 1], 5)).toThrow(
        'Counting Sort only supports non-negative integers',
      );
    });

    it('should throw an error for a negative maxValue', () => {
      expect(() => SortUtils.countingSort([3, 1, 4], -1)).toThrow(
        'Maximum value must be a non-negative integer',
      );
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.countingSort(null as any, 5)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('radixSort', () => {
    it('should sort an array of non-negative integers', () => {
      expect(SortUtils.radixSort([170, 45, 75, 90, 802, 24, 2, 66])).toEqual([
        2, 24, 45, 66, 75, 90, 170, 802,
      ]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.radixSort([])).toEqual([]);
    });

    it('should throw an error for arrays with negative numbers', () => {
      expect(() => SortUtils.radixSort([1, -5, 3])).toThrow(
        'Radix Sort only supports non-negative integers',
      );
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.radixSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('bucketSort', () => {
    it('should sort an array of floating-point numbers', () => {
      expect(
        SortUtils.bucketSort([
          0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68,
        ]),
      ).toEqual([0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bucketSort([])).toEqual([]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.bucketSort([0.1, 0.2, 0.3, 0.4])).toEqual([
        0.1, 0.2, 0.3, 0.4,
      ]);
    });

    it('should return the same array for a single element', () => {
      expect(SortUtils.bucketSort([0.5])).toEqual([0.5]);
    });
  });

  describe('timSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.timSort([5, 2, 9, 1, 5, 6])).toEqual([1, 2, 5, 5, 6, 9]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.timSort([])).toEqual([]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.timSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return the same array for a single element', () => {
      expect(SortUtils.timSort([10])).toEqual([10]);
    });
  });

  describe('bogoSort', () => {
    it('should sort an array of numbers (educational purposes only)', () => {
      const array = [3, 2, 1];
      const sortedArray = SortUtils.bogoSort(array);
      expect(sortedArray).toEqual([1, 2, 3]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bogoSort([])).toEqual([]);
    });

    it('should handle a single element array', () => {
      expect(SortUtils.bogoSort([42])).toEqual([42]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.bogoSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('gnomeSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.gnomeSort([3, 2, 1])).toEqual([1, 2, 3]);
      expect(SortUtils.gnomeSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.gnomeSort([])).toEqual([]);
    });

    it('should handle a single element array', () => {
      expect(SortUtils.gnomeSort([42])).toEqual([42]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.gnomeSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.gnomeSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('pancakeSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.pancakeSort([3, 2, 1])).toEqual([1, 2, 3]);
      expect(SortUtils.pancakeSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.pancakeSort([])).toEqual([]);
    });

    it('should handle a single element array', () => {
      expect(SortUtils.pancakeSort([42])).toEqual([42]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.pancakeSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.pancakeSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('combSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.combSort([3, 2, 1])).toEqual([1, 2, 3]);
      expect(SortUtils.combSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.combSort([])).toEqual([]);
    });

    it('should handle a single element array', () => {
      expect(SortUtils.combSort([42])).toEqual([42]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.combSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.combSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('bogoSort', () => {
    it('should sort an array of numbers (educational purposes only)', () => {
      const array = [3, 2, 1];
      const sortedArray = SortUtils.bogoSort(array);
      expect(sortedArray).toEqual([1, 2, 3]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.bogoSort([])).toEqual([]);
    });

    it('should handle a single element array', () => {
      expect(SortUtils.bogoSort([42])).toEqual([42]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.bogoSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('gnomeSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.gnomeSort([3, 2, 1])).toEqual([1, 2, 3]);
      expect(SortUtils.gnomeSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.gnomeSort([])).toEqual([]);
    });

    it('should handle a single element array', () => {
      expect(SortUtils.gnomeSort([42])).toEqual([42]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.gnomeSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.gnomeSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('pancakeSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.pancakeSort([3, 2, 1])).toEqual([1, 2, 3]);
      expect(SortUtils.pancakeSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.pancakeSort([])).toEqual([]);
    });

    it('should handle a single element array', () => {
      expect(SortUtils.pancakeSort([42])).toEqual([42]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.pancakeSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.pancakeSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });

  describe('combSort', () => {
    it('should sort an array of numbers', () => {
      expect(SortUtils.combSort([3, 2, 1])).toEqual([1, 2, 3]);
      expect(SortUtils.combSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
    });

    it('should handle an empty array', () => {
      expect(SortUtils.combSort([])).toEqual([]);
    });

    it('should handle a single element array', () => {
      expect(SortUtils.combSort([42])).toEqual([42]);
    });

    it('should handle an already sorted array', () => {
      expect(SortUtils.combSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => SortUtils.combSort(null as any)).toThrow(
        'Input must be an array',
      );
    });
  });
});
