import { BenchmarkUtils } from '../src/services/benchmark.service';

// Example 1: Simple execution time measurement
console.log('Example 1: Simple execution time measurement');
const executionTime = BenchmarkUtils.measureExecutionTime({
  fn: () => {
    // Simulate a time-consuming operation
    for (let i = 0; i < 1000000; i++) {
      Math.sqrt(i);
    }
  },
});
console.log(`Execution time: ${executionTime.toFixed(2)}ms\n`);

// Example 2: Running a benchmark multiple times
console.log('Example 2: Running a benchmark multiple times');
const stats = BenchmarkUtils.runBenchmark({
  fn: () => {
    // Simple array operation
    const arr = [];
    for (let i = 0; i < 10000; i++) {
      arr.push(i);
    }
  },
  iterations: 50,
});

console.log(`Average: ${stats.average.toFixed(3)}ms`);
console.log(`Median: ${stats.median.toFixed(3)}ms`);
console.log(`Min: ${stats.min.toFixed(3)}ms`);
console.log(`Max: ${stats.max.toFixed(3)}ms`);
console.log(`Total: ${stats.total.toFixed(2)}ms\n`);

// Example 3: Comparing different implementations
console.log('Example 3: Comparing different implementations');
const results = BenchmarkUtils.compareFunctions({
  fns: {
    'Array.push': () => {
      const arr = [];
      for (let i = 0; i < 10000; i++) {
        arr.push(i);
      }
    },
    'Array with pre-allocated size': () => {
      const arr = new Array(10000);
      for (let i = 0; i < 10000; i++) {
        arr[i] = i;
      }
    },
    'Array.from with mapping': () => {
      Array.from({ length: 10000 }, (_, i) => i);
    },
  },
  iterations: 20,
});

console.log('Performance comparison:');
for (const [name, stats] of Object.entries(results)) {
  console.log(
    `${name}: ${stats.average.toFixed(3)}ms (median: ${stats.median.toFixed(3)}ms)`,
  );
}
console.log();

// Example 4: Measuring memory usage
console.log('Example 4: Measuring memory usage');
const memoryUsage = BenchmarkUtils.measureMemoryUsage({
  fn: () => {
    // Create a large array to consume memory
    const largeArray = new Array(1000000).fill(0);
    // Use the array to prevent optimizations
    console.log(`Array length: ${largeArray.length}`);
  },
});

console.log('Memory usage:');
console.log(`Before - Heap used: ${memoryUsage.before.heapUsed.toFixed(2)}MB`);
console.log(`After - Heap used: ${memoryUsage.after.heapUsed.toFixed(2)}MB`);
console.log(`Heap increase: ${memoryUsage.heapIncrease.toFixed(2)}MB`);

// Example 5: Practical use case - Sorting algorithms comparison
console.log('\nExample 5: Sorting algorithms comparison');

// Create a random array for testing
const generateRandomArray = (size: number) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
};

const size = 5000;
const randomArray = generateRandomArray(size);

const sortingResults = BenchmarkUtils.compareFunctions({
  fns: {
    'Native Array.sort': () => {
      const arr = [...randomArray];
      arr.sort((a, b) => a - b);
    },
    'Bubble Sort': () => {
      const arr = [...randomArray];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          }
        }
      }
    },
    'Quick Sort': () => {
      const arr = [...randomArray];
      const quickSort = (arr: number[], low = 0, high = arr.length - 1) => {
        if (low < high) {
          const pivot = arr[high];
          let i = low - 1;

          for (let j = low; j < high; j++) {
            if (arr[j] <= pivot) {
              i++;
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
          }

          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          const partitionIndex = i + 1;

          quickSort(arr, low, partitionIndex - 1);
          quickSort(arr, partitionIndex + 1, high);
        }
        return arr;
      };

      quickSort(arr);
    },
  },
  iterations: 3, // Fewer iterations for slow algorithms like Bubble Sort
});

console.log(`Sorting algorithms comparison (array with ${size} elements):`);
for (const [name, stats] of Object.entries(sortingResults)) {
  console.log(
    `${name}: ${stats.average.toFixed(2)}ms (min: ${stats.min.toFixed(
      2,
    )}ms, max: ${stats.max.toFixed(2)}ms)`,
  );
}
