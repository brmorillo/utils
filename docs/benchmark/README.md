# BenchmarkUtils

The BenchmarkUtils class provides static methods for measuring code performance, including execution time, memory usage, and comparative/progressive benchmarks.

## Basic Usage

```javascript
import { BenchmarkUtils } from '@brmorillo/utils';

// Measure how long a function takes to run (in milliseconds)
const executionTime = BenchmarkUtils.measureExecutionTime({
  fn: () => {
    for (let i = 0; i < 1000; i++) {
      Math.sqrt(i);
    }
  }
});
console.log(`Execution time: ${executionTime.toFixed(2)}ms`);
```

## Methods

### measureExecutionTime({ fn })

Measures the execution time of a function and returns the elapsed time in milliseconds.

```javascript
const time = BenchmarkUtils.measureExecutionTime({
  fn: () => {
    for (let i = 0; i < 1000; i++) {
      Math.sqrt(i);
    }
  }
});
console.log(`${time.toFixed(2)}ms`);
```

### benchmark({ fn, iterations, warmup })

Runs a function repeatedly and returns aggregate statistics. `iterations` defaults to `1000` and `warmup` defaults to `true`. Returns `{ totalTime, averageTime, opsPerSecond, iterations }`.

```javascript
const results = BenchmarkUtils.benchmark({
  fn: () => {
    Math.sqrt(Math.random() * 1000);
  },
  iterations: 10000
});

console.log(`Total time: ${results.totalTime.toFixed(2)}ms`);
console.log(`Average per iteration: ${results.averageTime.toFixed(3)}ms`);
console.log(`Ops per second: ${results.opsPerSecond.toFixed(0)}`);
```

### compare({ fns, iterations, warmup })

Benchmarks multiple named functions and returns a map of each name to its benchmark result. `fns` is an object mapping names to functions. `iterations` defaults to `1000` and `warmup` defaults to `true`.

```javascript
const results = BenchmarkUtils.compare({
  fns: {
    'Array.push': () => {
      const arr = [];
      arr.push(1);
    },
    'Array[length]': () => {
      const arr = [];
      arr[arr.length] = 1;
    }
  },
  iterations: 100000
});

Object.entries(results).forEach(([name, result]) => {
  console.log(`${name}: ${result.averageTime.toFixed(6)}ms per op`);
});
```

### progressiveBenchmark({ fnFactory, sizes, iterationsPerSize, warmup })

Runs a benchmark across increasing workload sizes. `fnFactory` takes a size and returns the function to benchmark, `sizes` is the array of workload sizes to test. `iterationsPerSize` defaults to `100` and `warmup` defaults to `true`. Returns a map of size to benchmark result.

```javascript
const results = BenchmarkUtils.progressiveBenchmark({
  fnFactory: (size) => () => {
    const arr = new Array(size).fill(0);
    arr.map(x => x + 1);
  },
  sizes: [10, 100, 1000, 10000],
  iterationsPerSize: 100
});

Object.entries(results).forEach(([size, result]) => {
  console.log(`Size ${size}: ${result.totalTime.toFixed(2)}ms total`);
});
```

### measureMemoryUsage({ fn })

Measures heap memory usage (in MB) before and after running a function. Returns `{ before, after, difference }`. For accurate results, run Node with the `--expose-gc` flag so garbage collection can be forced.

```javascript
const memory = BenchmarkUtils.measureMemoryUsage({
  fn: () => {
    const arr = new Array(1000000).fill(0);
  }
});

console.log(`Before: ${memory.before.toFixed(2)}MB`);
console.log(`After: ${memory.after.toFixed(2)}MB`);
console.log(`Difference: ${memory.difference.toFixed(2)}MB`);
```
