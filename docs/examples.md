# @brmorillo/utils - Examples

This document contains detailed examples for using the utility functions provided by the library.

## Table of Contents

- [ArrayUtils](#arrayutils)
- [BenchmarkUtils](#benchmarkutils)
- [ConvertUtils](#convertutils)
- [CryptUtils](#cryptutils)
- [CuidUtils](#cuidutils)
- [DateUtils](#dateutils)
- [HashUtils](#hashutils)
- [JWTUtils](#jwtutils)
- [MathUtils](#mathutils)
- [NumberUtils](#numberutils)
- [ObjectUtils](#objectutils)
- [QueueUtils](#queueutils)
- [RequestUtils](#requestutils)
- [SnowflakeUtils](#snowflakeutils)
- [SortUtils](#sortutils)
- [StringUtils](#stringutils)
- [UUIDUtils](#uuidutils)
- [ValidationUtils](#validationutils)

## ArrayUtils

### removeDuplicates

```javascript
// Remove duplicates from primitive values
const uniqueArray = ArrayUtils.removeDuplicates({
  array: [1, 2, 2, 3, 4, 4],
});
// Result: [1, 2, 3, 4]

// Remove duplicates from objects based on a property
const uniqueObjects = ArrayUtils.removeDuplicates({
  array: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 1, name: 'John' },
  ],
  keyFn: item => item.id,
});
// Result: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
```

## BenchmarkUtils

### measureExecutionTime

```javascript
// Measure the execution time of a function
const executionTime = BenchmarkUtils.measureExecutionTime({
  fn: () => {
    // Code to benchmark
    for (let i = 0; i < 1000000; i++) {
      Math.sqrt(i);
    }
  }
});
console.log(`Execution time: ${executionTime.toFixed(2)}ms`);
```

### runBenchmark

```javascript
// Run a benchmark multiple times and get statistics
const stats = BenchmarkUtils.runBenchmark({
  fn: () => {
    // Code to benchmark
    const arr = [];
    for (let i = 0; i < 10000; i++) {
      arr.push(i);
    }
  },
  iterations: 100, // Number of times to run the benchmark
  warmup: true     // Whether to perform a warmup run
});

console.log(`Average: ${stats.average.toFixed(3)}ms`);
console.log(`Median: ${stats.median.toFixed(3)}ms`);
console.log(`Min: ${stats.min.toFixed(3)}ms`);
console.log(`Max: ${stats.max.toFixed(3)}ms`);
```

### compareFunctions

```javascript
// Compare the performance of different implementations
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
    }
  },
  iterations: 50
});

// Display the results
for (const [name, stats] of Object.entries(results)) {
  console.log(`${name}: ${stats.average.toFixed(3)}ms`);
}
```

### measureMemoryUsage

```javascript
// Measure memory usage of a function
const memoryUsage = BenchmarkUtils.measureMemoryUsage({
  fn: () => {
    // Code that might use memory
    const largeArray = new Array(1000000).fill(0);
  }
});

console.log(`Memory before: ${memoryUsage.before.heapUsed.toFixed(2)}MB`);
console.log(`Memory after: ${memoryUsage.after.heapUsed.toFixed(2)}MB`);
console.log(`Heap increase: ${memoryUsage.heapIncrease.toFixed(2)}MB`);
```

### intersect

```javascript
const array1 = [1, 2, 3, 4];
const array2 = [3, 4, 5, 6];

const intersection = ArrayUtils.intersect({
  array1,
  array2,
});
// Result: [3, 4]
```

## QueueUtils

### createQueue

```javascript
// Create an empty queue
const queue = QueueUtils.createQueue();

// Create a queue with initial items
const initialQueue = QueueUtils.createQueue({ 
  initialItems: [1, 2, 3] 
});

// Create a bounded queue with maximum size
const boundedQueue = QueueUtils.createQueue({ 
  maxSize: 5 
});

// Basic operations
queue.enqueue(1);
queue.enqueue(2);
const first = queue.peek(); // 1
const removed = queue.dequeue(); // 1
const size = queue.size(); // 1
const isEmpty = queue.isEmpty(); // false
```

### createStack

```javascript
// Create a stack
const stack = QueueUtils.createStack();

// Push and pop operations
stack.push(1);
stack.push(2);
const top = stack.peek(); // 2
const popped = stack.pop(); // 2
```

### createMultiQueue

```javascript
// Create a multi-queue
const multiQueue = QueueUtils.createMultiQueue();

// Add items to different channels
multiQueue.enqueue('high priority item', 'high');
multiQueue.enqueue('low priority item', 'low');

// Process items from specific channels
const highItem = multiQueue.dequeue('high');
const lowItem = multiQueue.dequeue('low');

// Check which channels exist
const channels = multiQueue.channels(); // ['high', 'low']
```

### createCircularBuffer

```javascript
// Create a circular buffer with fixed capacity
const buffer = QueueUtils.createCircularBuffer({ capacity: 3 });

// Add items
buffer.add(1); // true
buffer.add(2); // true
buffer.add(3); // true
buffer.add(4); // false (buffer is full)

// Add with overwrite
const overwritten = buffer.addOverwrite(4); // 1 (returns the overwritten item)

// Get and remove the oldest item
const oldest = buffer.remove(); // 2
```

### createPriorityQueue

```javascript
// Create a priority queue
const priorityQueue = QueueUtils.createPriorityQueue();

// Add items with priorities (lower number = higher priority)
priorityQueue.enqueue('urgent task', 1);
priorityQueue.enqueue('normal task', 5);
priorityQueue.enqueue('low priority task', 10);

// Get highest priority item
const highestPriority = priorityQueue.dequeue(); // 'urgent task'
```

### createDelayQueue

```javascript
// Create a delay queue
const delayQueue = QueueUtils.createDelayQueue();

// Add items with delays (in milliseconds)
delayQueue.enqueue('process soon', 500);
delayQueue.enqueue('process later', 2000);

// Get items that are ready to be processed
setTimeout(() => {
  const readyItems = delayQueue.dequeueReady();
  console.log(readyItems); // ['process soon']
}, 1000);

// Check time until next item is ready
const timeLeft = delayQueue.timeUntilNext(); // time in ms
```