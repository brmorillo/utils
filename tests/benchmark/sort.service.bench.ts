import { SortUtils } from '../../src/services/sort.service';

/**
 * Benchmark tests for the SortUtils class.
 * These tests verify the class performance in high-frequency operations.
 */
describe('SortUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  // Function to generate random arrays
  const generateRandomArray = (size: number, max: number = 1000): number[] => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * max));
  };

  // Function to generate nearly sorted arrays
  const generateNearlySortedArray = (size: number, swaps: number): number[] => {
    const arr = Array.from({ length: size }, (_, i) => i);
    for (let i = 0; i < swaps; i++) {
      const idx1 = Math.floor(Math.random() * size);
      const idx2 = Math.floor(Math.random() * size);
      [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
    }
    return arr;
  };

  // Function to generate reverse-ordered arrays
  const generateReverseSortedArray = (size: number): number[] => {
    return Array.from({ length: size }, (_, i) => size - i - 1);
  };

  describe('Performance with small arrays (100 elements)', () => {
    const size = 100;
    let randomArray: number[];
    let nearlySortedArray: number[];
    let reverseSortedArray: number[];

    beforeEach(() => {
      randomArray = generateRandomArray(size);
      nearlySortedArray = generateNearlySortedArray(size, 10);
      reverseSortedArray = generateReverseSortedArray(size);
    });

    it('should measure bubbleSort performance', () => {
      const randomTime = measureExecutionTime(() => {
        SortUtils.bubbleSort({ array: randomArray });
      });

      const nearlySortedTime = measureExecutionTime(() => {
        SortUtils.bubbleSort({ array: nearlySortedArray });
      });

      const reverseSortedTime = measureExecutionTime(() => {
        SortUtils.bubbleSort({ array: reverseSortedArray });
      });

      console.log(`BubbleSort (${size} elements):`);
      console.log(`  - Random array: ${randomTime.toFixed(2)}ms`);
      console.log(`  - Nearly sorted array: ${nearlySortedTime.toFixed(2)}ms`);
      console.log(
        `  - Reverse-ordered array: ${reverseSortedTime.toFixed(2)}ms`,
      );

      expect(randomTime).toBeLessThan(100);
      expect(nearlySortedTime).toBeLessThan(100);
      expect(reverseSortedTime).toBeLessThan(100);
    });

    it('should measure quickSort performance', () => {
      const randomTime = measureExecutionTime(() => {
        SortUtils.quickSort({ array: randomArray });
      });

      const nearlySortedTime = measureExecutionTime(() => {
        SortUtils.quickSort({ array: nearlySortedArray });
      });

      const reverseSortedTime = measureExecutionTime(() => {
        SortUtils.quickSort({ array: reverseSortedArray });
      });

      console.log(`QuickSort (${size} elements):`);
      console.log(`  - Random array: ${randomTime.toFixed(2)}ms`);
      console.log(`  - Nearly sorted array: ${nearlySortedTime.toFixed(2)}ms`);
      console.log(
        `  - Reverse-ordered array: ${reverseSortedTime.toFixed(2)}ms`,
      );

      expect(randomTime).toBeLessThan(50);
      expect(nearlySortedTime).toBeLessThan(50);
      expect(reverseSortedTime).toBeLessThan(50);
    });

    it('should measure mergeSort performance', () => {
      const randomTime = measureExecutionTime(() => {
        SortUtils.mergeSort({ array: randomArray });
      });

      const nearlySortedTime = measureExecutionTime(() => {
        SortUtils.mergeSort({ array: nearlySortedArray });
      });

      const reverseSortedTime = measureExecutionTime(() => {
        SortUtils.mergeSort({ array: reverseSortedArray });
      });

      console.log(`MergeSort (${size} elements):`);
      console.log(`  - Random array: ${randomTime.toFixed(2)}ms`);
      console.log(`  - Nearly sorted array: ${nearlySortedTime.toFixed(2)}ms`);
      console.log(
        `  - Reverse-ordered array: ${reverseSortedTime.toFixed(2)}ms`,
      );

      expect(randomTime).toBeLessThan(50);
      expect(nearlySortedTime).toBeLessThan(50);
      expect(reverseSortedTime).toBeLessThan(50);
    });

    it('should measure heapSort performance', () => {
      const randomTime = measureExecutionTime(() => {
        SortUtils.heapSort({ array: randomArray });
      });

      const nearlySortedTime = measureExecutionTime(() => {
        SortUtils.heapSort({ array: nearlySortedArray });
      });

      const reverseSortedTime = measureExecutionTime(() => {
        SortUtils.heapSort({ array: reverseSortedArray });
      });

      console.log(`HeapSort (${size} elements):`);
      console.log(`  - Random array: ${randomTime.toFixed(2)}ms`);
      console.log(`  - Nearly sorted array: ${nearlySortedTime.toFixed(2)}ms`);
      console.log(
        `  - Reverse-ordered array: ${reverseSortedTime.toFixed(2)}ms`,
      );

      expect(randomTime).toBeLessThan(50);
      expect(nearlySortedTime).toBeLessThan(50);
      expect(reverseSortedTime).toBeLessThan(50);
    });
  });

  describe('Performance with medium arrays (1,000 elements)', () => {
    const size = 1000;
    let randomArray: number[];

    beforeEach(() => {
      randomArray = generateRandomArray(size);
    });

    it('should measure the performance of efficient algorithms', () => {
      const quickSortTime = measureExecutionTime(() => {
        SortUtils.quickSort({ array: randomArray });
      });

      const mergeSortTime = measureExecutionTime(() => {
        SortUtils.mergeSort({ array: randomArray });
      });

      const heapSortTime = measureExecutionTime(() => {
        SortUtils.heapSort({ array: randomArray });
      });

      const timSortTime = measureExecutionTime(() => {
        SortUtils.timSort({ array: randomArray });
      });

      console.log(`Efficient algorithms (${size} elements):`);
      console.log(`  - QuickSort: ${quickSortTime.toFixed(2)}ms`);
      console.log(`  - MergeSort: ${mergeSortTime.toFixed(2)}ms`);
      console.log(`  - HeapSort: ${heapSortTime.toFixed(2)}ms`);
      console.log(`  - TimSort: ${timSortTime.toFixed(2)}ms`);

      expect(quickSortTime).toBeLessThan(100);
      expect(mergeSortTime).toBeLessThan(100);
      expect(heapSortTime).toBeLessThan(100);
      expect(timSortTime).toBeLessThan(100);
    });

    it('should measure the performance of O(n²) algorithms', () => {
      // We use a smaller array for O(n²) algorithms
      const smallerArray = generateRandomArray(200);

      const insertionSortTime = measureExecutionTime(() => {
        SortUtils.insertionSort({ array: smallerArray });
      });

      const selectionSortTime = measureExecutionTime(() => {
        SortUtils.selectionSort({ array: smallerArray });
      });

      const bubbleSortTime = measureExecutionTime(() => {
        SortUtils.bubbleSort({ array: smallerArray });
      });

      console.log(`O(n²) algorithms (200 elements):`);
      console.log(`  - InsertionSort: ${insertionSortTime.toFixed(2)}ms`);
      console.log(`  - SelectionSort: ${selectionSortTime.toFixed(2)}ms`);
      console.log(`  - BubbleSort: ${bubbleSortTime.toFixed(2)}ms`);

      expect(insertionSortTime).toBeLessThan(100);
      expect(selectionSortTime).toBeLessThan(100);
      expect(bubbleSortTime).toBeLessThan(100);
    });

    it('should measure the performance of non-comparative algorithms', () => {
      // Generate an array of non-negative integers for counting and radix sort
      const positiveArray = generateRandomArray(size, 1000);

      const countingSortTime = measureExecutionTime(() => {
        SortUtils.countingSort({ array: positiveArray, maxValue: 1000 });
      });

      const radixSortTime = measureExecutionTime(() => {
        SortUtils.radixSort({ array: positiveArray });
      });

      // Generate an array of numbers between 0 and 1 for bucket sort
      const floatArray = Array.from({ length: size }, () => Math.random());

      const bucketSortTime = measureExecutionTime(() => {
        SortUtils.bucketSort({ array: floatArray });
      });

      console.log(`Non-comparative algorithms (${size} elements):`);
      console.log(`  - CountingSort: ${countingSortTime.toFixed(2)}ms`);
      console.log(`  - RadixSort: ${radixSortTime.toFixed(2)}ms`);
      console.log(`  - BucketSort: ${bucketSortTime.toFixed(2)}ms`);

      expect(countingSortTime).toBeLessThan(100);
      expect(radixSortTime).toBeLessThan(100);
      expect(bucketSortTime).toBeLessThan(100);
    });
  });

  describe('Performance with large arrays (10,000 elements)', () => {
    const size = 10000;
    let randomArray: number[];

    beforeEach(() => {
      randomArray = generateRandomArray(size);
    });

    it('should measure the performance of efficient algorithms with large arrays', () => {
      const quickSortTime = measureExecutionTime(() => {
        SortUtils.quickSort({ array: randomArray });
      });

      const mergeSortTime = measureExecutionTime(() => {
        SortUtils.mergeSort({ array: randomArray });
      });

      const heapSortTime = measureExecutionTime(() => {
        SortUtils.heapSort({ array: randomArray });
      });

      console.log(`Efficient algorithms (${size} elements):`);
      console.log(`  - QuickSort: ${quickSortTime.toFixed(2)}ms`);
      console.log(`  - MergeSort: ${mergeSortTime.toFixed(2)}ms`);
      console.log(`  - HeapSort: ${heapSortTime.toFixed(2)}ms`);

      expect(quickSortTime).toBeLessThan(1000);
      expect(mergeSortTime).toBeLessThan(1000);
      expect(heapSortTime).toBeLessThan(1000);
    });

    it('should measure the performance of non-comparative algorithms with large arrays', () => {
      // Generate an array of non-negative integers for counting and radix sort
      const positiveArray = generateRandomArray(size, 1000);

      const countingSortTime = measureExecutionTime(() => {
        SortUtils.countingSort({ array: positiveArray, maxValue: 1000 });
      });

      const radixSortTime = measureExecutionTime(() => {
        SortUtils.radixSort({ array: positiveArray });
      });

      console.log(`Non-comparative algorithms (${size} elements):`);
      console.log(`  - CountingSort: ${countingSortTime.toFixed(2)}ms`);
      console.log(`  - RadixSort: ${radixSortTime.toFixed(2)}ms`);

      expect(countingSortTime).toBeLessThan(1000);
      expect(radixSortTime).toBeLessThan(1000);
    });
  });

  describe('Performance comparison in different scenarios', () => {
    it('should compare algorithms on nearly sorted arrays', () => {
      const size = 1000;
      const swaps = 50; // 5% of elements out of order
      const nearlySortedArray = generateNearlySortedArray(size, swaps);

      const insertionSortTime = measureExecutionTime(() => {
        SortUtils.insertionSort({ array: nearlySortedArray });
      });

      const quickSortTime = measureExecutionTime(() => {
        SortUtils.quickSort({ array: nearlySortedArray });
      });

      const mergeSortTime = measureExecutionTime(() => {
        SortUtils.mergeSort({ array: nearlySortedArray });
      });

      console.log(
        `Nearly sorted arrays (${size} elements, ${swaps} swaps):`,
      );
      console.log(`  - InsertionSort: ${insertionSortTime.toFixed(2)}ms`);
      console.log(`  - QuickSort: ${quickSortTime.toFixed(2)}ms`);
      console.log(`  - MergeSort: ${mergeSortTime.toFixed(2)}ms`);

      // InsertionSort should be efficient for nearly sorted arrays
      expect(insertionSortTime).toBeLessThan(100);
    });

    it('should compare algorithms on arrays with many duplicate elements', () => {
      const size = 1000;
      // Generate an array with only 10 different values
      const duplicatesArray = Array.from({ length: size }, () =>
        Math.floor(Math.random() * 10),
      );

      const quickSortTime = measureExecutionTime(() => {
        SortUtils.quickSort({ array: duplicatesArray });
      });

      const countingSortTime = measureExecutionTime(() => {
        SortUtils.countingSort({ array: duplicatesArray, maxValue: 9 });
      });

      console.log(`Arrays with many duplicates (${size} elements):`);
      console.log(`  - QuickSort: ${quickSortTime.toFixed(2)}ms`);
      console.log(`  - CountingSort: ${countingSortTime.toFixed(2)}ms`);

      // CountingSort should be very efficient for arrays with few distinct values
      expect(countingSortTime).toBeLessThan(quickSortTime * 2);
    });
  });
});
