import { BenchmarkUtils } from '../../src/services/benchmark.service';

/**
 * Benchmark tests for the BenchmarkUtils class itself.
 * This demonstrates how to use the BenchmarkUtils for benchmarking.
 */
describe('BenchmarkUtils - Benchmarking Examples', () => {
  // Helper function to measure execution time (same as in other benchmark tests)
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('Array Operations Benchmark', () => {
    it('should compare different array operations', () => {
      const arraySize = 10000;
      const iterations = 100;
      
      // Define functions to benchmark
      const functions = {
        'Array.push': () => {
          const arr: number[] = [];
          for (let i = 0; i < arraySize; i++) {
            arr.push(i);
          }
        },
        'Array[length]': () => {
          const arr: number[] = [];
          for (let i = 0; i < arraySize; i++) {
            arr[arr.length] = i;
          }
        },
        'Array(size).fill': () => {
          const arr = new Array(arraySize).fill(0).map((_, i) => i);
        },
        'Array.from': () => {
          const arr = Array.from({ length: arraySize }, (_, i) => i);
        }
      };
      
      // Run the benchmark comparison
      const results = BenchmarkUtils.compare({
        fns: functions,
        iterations,
        warmup: true
      });
      
      // Log the results
      console.log('\nArray Operations Benchmark Results:');
      Object.entries(results).forEach(([name, result]) => {
        console.log(
          `${name}: ${result.averageTime.toFixed(6)}ms per operation (${result.opsPerSecond.toFixed(0)} ops/sec)`
        );
      });
      
      // We don't make assertions about which is faster, as that can vary by environment
      // Just verify we got results for each function
      Object.keys(functions).forEach(name => {
        expect(results).toHaveProperty(name);
        expect(results[name].totalTime).toBeGreaterThan(0);
      });
    });
  });
  
  describe('String Operations Benchmark', () => {
    it('should benchmark string concatenation methods', () => {
      const iterations = 10000;
      
      // Define functions to benchmark
      const functions = {
        'String +': () => {
          let result = '';
          for (let i = 0; i < 100; i++) {
            result = result + i;
          }
          return result;
        },
        'String +=': () => {
          let result = '';
          for (let i = 0; i < 100; i++) {
            result += i;
          }
          return result;
        },
        'Array.join': () => {
          const parts = [];
          for (let i = 0; i < 100; i++) {
            parts.push(i);
          }
          return parts.join('');
        }
      };
      
      // Run the benchmark comparison
      const results = BenchmarkUtils.compare({
        fns: functions,
        iterations,
        warmup: true
      });
      
      // Log the results
      console.log('\nString Concatenation Benchmark Results:');
      Object.entries(results).forEach(([name, result]) => {
        console.log(
          `${name}: ${result.averageTime.toFixed(6)}ms per operation (${result.opsPerSecond.toFixed(0)} ops/sec)`
        );
      });
      
      // Verify we got results for each function
      Object.keys(functions).forEach(name => {
        expect(results).toHaveProperty(name);
      });
    });
  });
  
  describe('Progressive Benchmark Example', () => {
    it('should benchmark array sorting with different sizes', () => {
      // Define array sizes to test
      const sizes = [10, 100, 1000, 10000];
      const iterationsPerSize = 10;
      
      // Create a function factory that generates a benchmark function for each size
      const sortFunctionFactory = (size: number) => () => {
        const arr = Array.from({ length: size }, () => Math.random());
        arr.sort((a, b) => a - b);
      };
      
      // Run the progressive benchmark
      const results = BenchmarkUtils.progressiveBenchmark({
        fnFactory: sortFunctionFactory,
        sizes,
        iterationsPerSize,
        warmup: true
      });
      
      // Log the results
      console.log('\nArray Sorting Progressive Benchmark Results:');
      Object.entries(results).forEach(([size, result]) => {
        console.log(
          `Size ${size}: ${result.totalTime.toFixed(2)}ms total, ${result.averageTime.toFixed(6)}ms per operation`
        );
      });
      
      // Verify we got results for each size
      sizes.forEach(size => {
        expect(results).toHaveProperty(size.toString());
        expect(results[size].totalTime).toBeGreaterThan(0);
      });
      
      // Larger arrays should generally take more time to sort
      // This is a reasonable assertion for sorting algorithms
      for (let i = 1; i < sizes.length; i++) {
        const smallerSize = sizes[i-1];
        const largerSize = sizes[i];
        expect(results[largerSize].averageTime).toBeGreaterThan(results[smallerSize].averageTime);
      }
    });
  });
  
  describe('Memory Usage Measurement', () => {
    it('should measure memory usage of array operations', () => {
      // Define array sizes to test
      const sizes = [1000, 10000, 100000];
      
      // Test memory usage for each size
      const memoryResults: Record<number, { before: number, after: number, difference: number }> = {};
      
      sizes.forEach(size => {
        memoryResults[size] = BenchmarkUtils.measureMemoryUsage({
          fn: () => {
            // Allocate an array of the specified size
            const arr = new Array(size).fill(0);
          }
        });
      });
      
      // Log the results
      console.log('\nMemory Usage Measurement Results:');
      Object.entries(memoryResults).forEach(([size, result]) => {
        console.log(
          `Size ${size}: Before: ${result.before.toFixed(2)}MB, After: ${result.after.toFixed(2)}MB, Difference: ${result.difference.toFixed(2)}MB`
        );
      });
      
      // Verify we got results for each size
      sizes.forEach(size => {
        expect(memoryResults).toHaveProperty(size.toString());
      });
      
      // We don't assert on exact memory usage as it can vary significantly between environments
    });
  });
  
  describe('Comparison with Traditional Benchmarking', () => {
    it('should demonstrate both benchmarking approaches', () => {
      const iterations = 1000;
      const fn = () => {
        // Simple operation to benchmark
        Math.sqrt(Math.random() * 1000);
      };
      
      // Traditional approach (used in other benchmark tests)
      const traditionalStart = process.hrtime.bigint();
      for (let i = 0; i < iterations; i++) {
        fn();
      }
      const traditionalEnd = process.hrtime.bigint();
      const traditionalTime = Number(traditionalEnd - traditionalStart) / 1_000_000;
      const traditionalAvg = traditionalTime / iterations;
      
      // BenchmarkUtils approach
      const benchmarkResults = BenchmarkUtils.benchmark({
        fn,
        iterations,
        warmup: false // Disable warmup for fair comparison
      });
      
      // Log the results
      console.log('\nBenchmarking Approach Comparison:');
      console.log(`Traditional: Total ${traditionalTime.toFixed(2)}ms, Avg ${traditionalAvg.toFixed(6)}ms per operation`);
      console.log(`BenchmarkUtils: Total ${benchmarkResults.totalTime.toFixed(2)}ms, Avg ${benchmarkResults.averageTime.toFixed(6)}ms per operation`);
      
      // The results should be similar (within a reasonable margin)
      const timeDifference = Math.abs(traditionalTime - benchmarkResults.totalTime);
      const percentDifference = (timeDifference / traditionalTime) * 100;
      
      console.log(`Difference: ${timeDifference.toFixed(2)}ms (${percentDifference.toFixed(2)}%)`);
      
      // We expect the difference to be relatively small (less than 20%)
      // but we don't assert on it as timing can vary significantly between runs
    });
  });
});