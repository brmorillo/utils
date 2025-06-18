import { BenchmarkUtils } from '../../src/services/benchmark.service';

/**
 * Unit tests for the BenchmarkUtils class.
 */
describe('BenchmarkUtils', () => {
  describe('measureExecutionTime', () => {
    it('should measure the execution time of a function', () => {
      const executionTime = BenchmarkUtils.measureExecutionTime({
        fn: () => {
          // Simple operation that takes some time
          for (let i = 0; i < 1000000; i++) {
            Math.sqrt(i);
          }
        },
      });

      // We can't assert exact timing, but we can check it's a positive number
      expect(executionTime).toBeGreaterThan(0);
      expect(typeof executionTime).toBe('number');
    });

    it('should return near-zero for empty functions', () => {
      const executionTime = BenchmarkUtils.measureExecutionTime({
        fn: () => {
          // Empty function
        },
      });

      // Should be very small, but still a positive number
      expect(executionTime).toBeGreaterThanOrEqual(0);
      expect(executionTime).toBeLessThan(10); // Should be less than 10ms
    });
  });

  describe('benchmark', () => {
    it('should run a benchmark and return statistics', () => {
      const results = BenchmarkUtils.benchmark({
        fn: () => {
          // Simple operation
          Math.random();
        },
        iterations: 100,
      });

      expect(results).toHaveProperty('totalTime');
      expect(results).toHaveProperty('averageTime');
      expect(results).toHaveProperty('opsPerSecond');
      expect(results).toHaveProperty('iterations', 100);

      expect(results.totalTime).toBeGreaterThan(0);
      expect(results.averageTime).toBeGreaterThan(0);
      expect(results.opsPerSecond).toBeGreaterThan(0);
    });

    it('should use default iterations when not specified', () => {
      const results = BenchmarkUtils.benchmark({
        fn: () => {
          // Simple operation
          Math.random();
        },
      });

      expect(results.iterations).toBe(1000);
    });

    it('should skip warmup when specified', () => {
      const mockFn = jest.fn();
      
      BenchmarkUtils.benchmark({
        fn: mockFn,
        iterations: 10,
        warmup: false,
      });

      // Without warmup, the function should be called exactly 'iterations' times
      expect(mockFn).toHaveBeenCalledTimes(10);
    });
  });

  describe('compare', () => {
    it('should compare multiple functions and return results for each', () => {
      const results = BenchmarkUtils.compare({
        fns: {
          'Math.random': () => {
            Math.random();
          },
          'Date.now': () => {
            Date.now();
          },
        },
        iterations: 100,
      });

      expect(results).toHaveProperty('Math.random');
      expect(results).toHaveProperty('Date.now');

      expect(results['Math.random']).toHaveProperty('totalTime');
      expect(results['Math.random']).toHaveProperty('averageTime');
      expect(results['Math.random']).toHaveProperty('opsPerSecond');
      expect(results['Math.random']).toHaveProperty('iterations', 100);

      expect(results['Date.now']).toHaveProperty('totalTime');
      expect(results['Date.now']).toHaveProperty('averageTime');
      expect(results['Date.now']).toHaveProperty('opsPerSecond');
      expect(results['Date.now']).toHaveProperty('iterations', 100);
    });
  });

  describe('progressiveBenchmark', () => {
    it('should benchmark functions with different sizes', () => {
      const results = BenchmarkUtils.progressiveBenchmark({
        fnFactory: (size) => () => {
          // Create and fill an array of the specified size
          const arr = new Array(size).fill(0);
        },
        sizes: [10, 100],
        iterationsPerSize: 10,
      });

      expect(results).toHaveProperty('10');
      expect(results).toHaveProperty('100');

      expect(results[10]).toHaveProperty('totalTime');
      expect(results[10]).toHaveProperty('averageTime');
      expect(results[10]).toHaveProperty('opsPerSecond');
      expect(results[10]).toHaveProperty('iterations', 10);

      expect(results[100]).toHaveProperty('totalTime');
      expect(results[100]).toHaveProperty('averageTime');
      expect(results[100]).toHaveProperty('opsPerSecond');
      expect(results[100]).toHaveProperty('iterations', 10);

      // Larger sizes should generally take more time
      // But this isn't guaranteed due to JIT optimizations, so we don't assert it
    });
  });

  describe('measureMemoryUsage', () => {
    it('should measure memory usage before and after function execution', () => {
      const memoryUsage = BenchmarkUtils.measureMemoryUsage({
        fn: () => {
          // Allocate some memory
          const arr = new Array(100000).fill(0);
        },
      });

      expect(memoryUsage).toHaveProperty('before');
      expect(memoryUsage).toHaveProperty('after');
      expect(memoryUsage).toHaveProperty('difference');

      expect(typeof memoryUsage.before).toBe('number');
      expect(typeof memoryUsage.after).toBe('number');
      expect(typeof memoryUsage.difference).toBe('number');
    });
  });
});