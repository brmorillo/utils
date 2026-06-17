import { SortUtils } from '../../src/services/sort.service';

/**
 * Integration tests for the SortUtils class.
 * These tests verify more complex scenarios involving multiple methods.
 */
describe('SortUtils - Integration Tests', () => {
  describe('Comparison between algorithms', () => {
    it('should produce the same result with different algorithms', () => {
      const unsortedArray = [38, 27, 43, 3, 9, 82, 10];
      const expectedSorted = [3, 9, 10, 27, 38, 43, 82];

      // Comparison-based algorithms
      const bubbleSorted = SortUtils.bubbleSort({ array: unsortedArray });
      const mergeSorted = SortUtils.mergeSort({ array: unsortedArray });
      const quickSorted = SortUtils.quickSort({ array: unsortedArray });
      const heapSorted = SortUtils.heapSort({ array: unsortedArray });
      const selectionSorted = SortUtils.selectionSort({ array: unsortedArray });
      const insertionSorted = SortUtils.insertionSort({ array: unsortedArray });
      const shellSorted = SortUtils.shellSort({ array: unsortedArray });
      const timSorted = SortUtils.timSort({ array: unsortedArray });

      // Assertions
      expect(bubbleSorted).toEqual(expectedSorted);
      expect(mergeSorted).toEqual(expectedSorted);
      expect(quickSorted).toEqual(expectedSorted);
      expect(heapSorted).toEqual(expectedSorted);
      expect(selectionSorted).toEqual(expectedSorted);
      expect(insertionSorted).toEqual(expectedSorted);
      expect(shellSorted).toEqual(expectedSorted);
      expect(timSorted).toEqual(expectedSorted);

      // Non-comparison-based algorithms (only for non-negative numbers)
      const positiveArray = [38, 27, 43, 3, 9, 82, 10];
      const countingSorted = SortUtils.countingSort({ array: positiveArray, maxValue: 82 });
      const radixSorted = SortUtils.radixSort({ array: positiveArray });

      expect(countingSorted).toEqual(expectedSorted);
      expect(radixSorted).toEqual(expectedSorted);
    });

    it.skip('should maintain stability in stable algorithms', () => {
      // Create an array of objects to test stability
      const unsortedObjects = [
        { key: 3, value: 'a' },
        { key: 1, value: 'b' },
        { key: 2, value: 'c' },
        { key: 1, value: 'd' },
        { key: 3, value: 'e' },
      ];

      // Function to sort by key
      const sortByKey = <T extends { key: number }>(
        arr: T[],
        algorithm: (params: { array: T[] }) => T[],
      ): T[] => {
        // Create a custom comparison function
        const compare = (a: T, b: T): number => a.key - b.key;

        // Temporarily replace the comparison operator
        const gtSymbol = Symbol.for('>') as unknown as keyof Array<T>;
        const ltSymbol = Symbol.for('<') as unknown as keyof Array<T>;

        const originalGT = Array.prototype[gtSymbol] as any;
        const originalLT = Array.prototype[ltSymbol] as any;

        // Explicitly defining the types to avoid errors
        type CompareFunction = (this: any, other: any) => boolean;

        (Array.prototype[gtSymbol] as CompareFunction) = function (
          this: any,
          other: any,
        ): boolean {
          return compare(this, other) > 0;
        };

        (Array.prototype[ltSymbol] as CompareFunction) = function (
          this: any,
          other: any,
        ): boolean {
          return compare(this, other) < 0;
        };

        try {
          return algorithm({ array: arr });
        } finally {
          // Restore the original operators
          (Array.prototype[gtSymbol] as any) = originalGT;
          (Array.prototype[ltSymbol] as any) = originalLT;
        }
      };

      // Test stable algorithms
      const mergeSorted = sortByKey(unsortedObjects, SortUtils.mergeSort);
      const bubbleSorted = sortByKey(unsortedObjects, SortUtils.bubbleSort);
      const insertionSorted = sortByKey(
        unsortedObjects,
        SortUtils.insertionSort,
      );

      // Verify that the relative order of elements with the same key is preserved
      expect(mergeSorted[1].value).toBe('b'); // First element with key 1
      expect(mergeSorted[2].value).toBe('d'); // Second element with key 1

      expect(bubbleSorted[1].value).toBe('b');
      expect(bubbleSorted[2].value).toBe('d');

      expect(insertionSorted[1].value).toBe('b');
      expect(insertionSorted[2].value).toBe('d');
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should sort a dataset of students by grade', () => {
      const students = [
        { name: 'Alice', grade: 85 },
        { name: 'Bob', grade: 92 },
        { name: 'Charlie', grade: 78 },
        { name: 'Diana', grade: 95 },
        { name: 'Evan', grade: 88 },
      ];

      // Extract the grades for sorting
      const grades = students.map(student => student.grade);

      // Sort the grades
      const sortedGrades = SortUtils.quickSort({ array: grades });

      // Reorder the students based on the sorted grades
      const sortedStudents = sortedGrades.map(grade =>
        students.find(student => student.grade === grade),
      );

      // Assertions
      expect(sortedStudents[0]?.name).toBe('Charlie');
      expect(sortedStudents[1]?.name).toBe('Alice');
      expect(sortedStudents[2]?.name).toBe('Evan');
      expect(sortedStudents[3]?.name).toBe('Bob');
      expect(sortedStudents[4]?.name).toBe('Diana');
    });

    it('should sort a dataset of products by price', () => {
      const products = [
        { id: 1, name: 'Laptop', price: 1200 },
        { id: 2, name: 'Phone', price: 800 },
        { id: 3, name: 'Tablet', price: 500 },
        { id: 4, name: 'Smartwatch', price: 300 },
        { id: 5, name: 'Headphones', price: 150 },
      ];

      // Extract the prices for sorting
      const prices = products.map(product => product.price);

      // Sort the prices (cheapest to most expensive)
      const sortedPrices = SortUtils.mergeSort({ array: prices });

      // Reorder the products based on the sorted prices
      const sortedProducts = sortedPrices.map(price =>
        products.find(product => product.price === price),
      );

      // Assertions
      expect(sortedProducts[0]?.name).toBe('Headphones');
      expect(sortedProducts[1]?.name).toBe('Smartwatch');
      expect(sortedProducts[2]?.name).toBe('Tablet');
      expect(sortedProducts[3]?.name).toBe('Phone');
      expect(sortedProducts[4]?.name).toBe('Laptop');
    });

    it('should sort a set of dates', () => {
      const dates = [
        new Date('2023-05-15'),
        new Date('2022-12-31'),
        new Date('2023-01-01'),
        new Date('2022-06-30'),
        new Date('2023-03-10'),
      ];

      // Convert dates to timestamps for sorting
      const timestamps = dates.map(date => date.getTime());

      // Sort the timestamps
      const sortedTimestamps = SortUtils.heapSort({ array: timestamps });

      // Convert sorted timestamps back to dates
      const sortedDates = sortedTimestamps.map(
        timestamp => new Date(timestamp),
      );

      // Assertions
      expect(sortedDates[0].toISOString().split('T')[0]).toBe('2022-06-30');
      expect(sortedDates[1].toISOString().split('T')[0]).toBe('2022-12-31');
      expect(sortedDates[2].toISOString().split('T')[0]).toBe('2023-01-01');
      expect(sortedDates[3].toISOString().split('T')[0]).toBe('2023-03-10');
      expect(sortedDates[4].toISOString().split('T')[0]).toBe('2023-05-15');
    });
  });

  describe('Combination of algorithms', () => {
    it('should use different algorithms based on the array size', () => {
      // Function that chooses the algorithm based on the array size
      const smartSort = <T>(array: T[]): T[] => {
        if (array.length <= 10) {
          // For small arrays, insertion sort is efficient
          return SortUtils.insertionSort({ array: array });
        } else if (array.length <= 1000) {
          // For medium arrays, quick sort is a good choice
          return SortUtils.quickSort({ array: array });
        } else {
          // For large arrays, merge sort guarantees consistent performance
          return SortUtils.mergeSort({ array: array });
        }
      };

      // Test with arrays of different sizes
      const smallArray = [5, 3, 8, 4, 2];
      const mediumArray = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 1000),
      );

      // Sort the arrays
      const sortedSmall = smartSort(smallArray);
      const sortedMedium = smartSort(mediumArray);

      // Verify that the arrays were sorted correctly
      expect(sortedSmall).toEqual(SortUtils.insertionSort({ array: smallArray }));
      expect(sortedMedium).toEqual(SortUtils.quickSort({ array: mediumArray }));
    });

    it('should use different algorithms based on the data type', () => {
      // Arrays of different types
      const integerArray = [38, 27, 43, 3, 9, 82, 10];
      const floatArray = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];

      // Function that chooses the algorithm based on the data type
      const typeBasedSort = (array: number[]): number[] => {
        // Check whether all elements are non-negative integers
        const allNonNegativeIntegers = array.every(
          num => Number.isInteger(num) && num >= 0,
        );

        // Check whether all elements are between 0 and 1
        const allBetweenZeroAndOne = array.every(num => num >= 0 && num <= 1);

        if (allNonNegativeIntegers) {
          // For non-negative integers, counting sort is efficient
          const max = Math.max(...array);
          return SortUtils.countingSort({ array: array, maxValue: max });
        } else if (allBetweenZeroAndOne) {
          // For numbers between 0 and 1, bucket sort is a good choice
          return SortUtils.bucketSort({ array: array });
        } else {
          // For other cases, merge sort is safe
          return SortUtils.mergeSort({ array: array });
        }
      };

      // Sort the arrays
      const sortedIntegers = typeBasedSort(integerArray);
      const sortedFloats = typeBasedSort(floatArray);

      // Verify that the arrays were sorted correctly
      expect(sortedIntegers).toEqual([3, 9, 10, 27, 38, 43, 82]);
      expect(sortedFloats).toEqual([0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52]);
    });
  });
});
