/**
 * Utility class for benchmarking code performance.
 */
export class BenchmarkUtils {
  /**
   * Measures the execution time of a function.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The function to measure.
   * @returns {number} The execution time in milliseconds.
   * @example
   * const executionTime = BenchmarkUtils.measureExecutionTime({
   *   fn: () => {
   *     // Code to measure
   *     for (let i = 0; i < 1000; i++) {
   *       Math.sqrt(i);
   *     }
   *   }
   * });
   * console.log(`Execution time: ${executionTime.toFixed(2)}ms`);
   */
  public static measureExecutionTime({ fn }: { fn: () => void }): number {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  }

  /**
   * Runs a benchmark on a function with multiple iterations.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The function to benchmark.
   * @param {number} [params.iterations=1000] - The number of iterations to run.
   * @param {boolean} [params.warmup=true] - Whether to perform a warmup run before benchmarking.
   * @returns {object} An object containing benchmark results.
   * @example
   * const results = BenchmarkUtils.benchmark({
   *   fn: () => {
   *     // Code to benchmark
   *     Math.sqrt(Math.random() * 1000);
   *   },
   *   iterations: 10000
   * });
   *
   * console.log(`Total time: ${results.totalTime.toFixed(2)}ms`);
   * console.log(`Average time per iteration: ${results.averageTime.toFixed(3)}ms`);
   * console.log(`Operations per second: ${results.opsPerSecond.toFixed(0)}`);
   */
  public static benchmark({
    fn,
    iterations = 1000,
    warmup = true,
  }: {
    fn: () => void;
    iterations?: number;
    warmup?: boolean;
  }): {
    totalTime: number;
    averageTime: number;
    opsPerSecond: number;
    iterations: number;
  } {
    // Perform warmup to avoid JIT compilation affecting results
    if (warmup) {
      for (let i = 0; i < Math.min(iterations / 10, 100); i++) {
        fn();
      }
    }

    const totalTime = BenchmarkUtils.measureExecutionTime({
      fn: () => {
        for (let i = 0; i < iterations; i++) {
          fn();
        }
      },
    });

    const averageTime = totalTime / iterations;
    const opsPerSecond = 1000 / averageTime;

    return {
      totalTime,
      averageTime,
      opsPerSecond,
      iterations,
    };
  }

  /**
   * Compares the performance of multiple functions.
   * @param {object} params - The parameters for the method.
   * @param {Record<string, () => void>} params.fns - An object mapping names to functions to benchmark.
   * @param {number} [params.iterations=1000] - The number of iterations to run for each function.
   * @param {boolean} [params.warmup=true] - Whether to perform a warmup run before benchmarking.
   * @returns {Record<string, { totalTime: number, averageTime: number, opsPerSecond: number, iterations: number }>} An object mapping function names to their benchmark results.
   * @example
   * const results = BenchmarkUtils.compare({
   *   fns: {
   *     'Array.push': () => {
   *       const arr = [];
   *       arr.push(1);
   *     },
   *     'Array[length]': () => {
   *       const arr = [];
   *       arr[arr.length] = 1;
   *     }
   *   },
   *   iterations: 100000
   * });
   *
   * console.log('Benchmark results:');
   * Object.entries(results).forEach(([name, result]) => {
   *   console.log(`${name}: ${result.averageTime.toFixed(6)}ms per op (${result.opsPerSecond.toFixed(0)} ops/sec)`);
   * });
   */
  public static compare({
    fns,
    iterations = 1000,
    warmup = true,
  }: {
    fns: Record<string, () => void>;
    iterations?: number;
    warmup?: boolean;
  }): Record<
    string,
    {
      totalTime: number;
      averageTime: number;
      opsPerSecond: number;
      iterations: number;
    }
  > {
    const results: Record<
      string,
      {
        totalTime: number;
        averageTime: number;
        opsPerSecond: number;
        iterations: number;
      }
    > = {};

    for (const [name, fn] of Object.entries(fns)) {
      results[name] = BenchmarkUtils.benchmark({ fn, iterations, warmup });
    }

    return results;
  }

  /**
   * Runs a progressive benchmark with increasing workload sizes.
   * @param {object} params - The parameters for the method.
   * @param {(size: number) => () => void} params.fnFactory - A function that takes a size parameter and returns a function to benchmark.
   * @param {number[]} params.sizes - An array of workload sizes to test.
   * @param {number} [params.iterationsPerSize=100] - The number of iterations to run for each size.
   * @param {boolean} [params.warmup=true] - Whether to perform a warmup run before benchmarking.
   * @returns {Record<number, { totalTime: number, averageTime: number, opsPerSecond: number, iterations: number }>} An object mapping sizes to their benchmark results.
   * @example
   * // Benchmark array operations with different array sizes
   * const results = BenchmarkUtils.progressiveBenchmark({
   *   fnFactory: (size) => () => {
   *     const arr = new Array(size).fill(0);
   *     arr.map(x => x + 1);
   *   },
   *   sizes: [10, 100, 1000, 10000, 100000],
   *   iterationsPerSize: 100
   * });
   *
   * console.log('Progressive benchmark results:');
   * Object.entries(results).forEach(([size, result]) => {
   *   console.log(`Size ${size}: ${result.totalTime.toFixed(2)}ms total, ${result.averageTime.toFixed(6)}ms per op`);
   * });
   */
  public static progressiveBenchmark({
    fnFactory,
    sizes,
    iterationsPerSize = 100,
    warmup = true,
  }: {
    fnFactory: (size: number) => () => void;
    sizes: number[];
    iterationsPerSize?: number;
    warmup?: boolean;
  }): Record<
    number,
    {
      totalTime: number;
      averageTime: number;
      opsPerSecond: number;
      iterations: number;
    }
  > {
    const results: Record<
      number,
      {
        totalTime: number;
        averageTime: number;
        opsPerSecond: number;
        iterations: number;
      }
    > = {};

    for (const size of sizes) {
      const fn = fnFactory(size);
      results[size] = BenchmarkUtils.benchmark({
        fn,
        iterations: iterationsPerSize,
        warmup,
      });
    }

    return results;
  }

  /**
   * Measures memory usage during function execution.
   * @param {object} params - The parameters for the method.
   * @param {Function} params.fn - The function to measure.
   * @returns {object} An object containing memory usage statistics in MB.
   * @example
   * const memoryUsage = BenchmarkUtils.measureMemoryUsage({
   *   fn: () => {
   *     // Memory-intensive operation
   *     const arr = new Array(1000000).fill(0);
   *   }
   * });
   *
   * console.log(`Memory before: ${memoryUsage.before.toFixed(2)}MB`);
   * console.log(`Memory after: ${memoryUsage.after.toFixed(2)}MB`);
   * console.log(`Memory difference: ${memoryUsage.difference.toFixed(2)}MB`);
   */
  public static measureMemoryUsage({ fn }: { fn: () => void }): {
    before: number;
    after: number;
    difference: number;
  } {
    // Force garbage collection if available (requires --expose-gc flag)
    if (global.gc) {
      global.gc();
    }

    const memoryBefore = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    fn();
    const memoryAfter = process.memoryUsage().heapUsed / 1024 / 1024; // MB

    return {
      before: memoryBefore,
      after: memoryAfter,
      difference: memoryAfter - memoryBefore,
    };
  }
}
