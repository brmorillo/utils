# Queue, Stack, and Data Structures Service

This service provides generic implementations for various queue-related data structures. These structures can be used both with local variables and adapted for use with external systems such as Redis.

## Available Structures

### Queue

A queue is a data structure that follows the FIFO (First-In-First-Out) principle, where the first element added is the first to be removed.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Create an empty queue
const queue = QueueUtils.createQueue<number>();

// Create a queue with initial values
const initialQueue = QueueUtils.createQueue<string>({ initialItems: ['a', 'b', 'c'] });

// Create a queue with a maximum size
const boundedQueue = QueueUtils.createQueue<number>({ maxSize: 5 });

// Add elements
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

// Check the first element without removing it
const first = queue.peek(); // 1

// Remove and get the first element
const removed = queue.dequeue(); // 1

// Check the size
const size = queue.size(); // 2

// Check whether it is empty
const isEmpty = queue.isEmpty(); // false

// Check whether it is full (only for queues with a maximum size)
const isFull = boundedQueue.isFull(); // false

// Get all elements as an array
const allItems = queue.toArray(); // [2, 3]

// Clear the queue
queue.clear();
```

### Stack

A stack is a data structure that follows the LIFO (Last-In-First-Out) principle, where the last element added is the first to be removed.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Create an empty stack
const stack = QueueUtils.createStack<number>();

// Create a stack with initial values
const initialStack = QueueUtils.createStack<string>({ initialItems: ['a', 'b', 'c'] });

// Create a stack with a maximum size
const boundedStack = QueueUtils.createStack<number>({ maxSize: 10 });

// Add elements
stack.push(1);
stack.push(2);
stack.push(3);

// Check the top element without removing it
const top = stack.peek(); // 3

// Remove and get the top element
const popped = stack.pop(); // 3

// Check the size
const size = stack.size(); // 2

// Check whether it is empty
const isEmpty = stack.isEmpty(); // false

// Check whether it is full (only for stacks with a maximum size)
const isFull = boundedStack.isFull(); // false

// Get all elements as an array
const allItems = stack.toArray(); // [1, 2]

// Clear the stack
stack.clear();
```

### MultiQueue

A multi-output queue allows enqueuing elements in different channels or priorities and processing them separately.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Create an empty multi queue
const multiQueue = QueueUtils.createMultiQueue<number>();

// Create a multi queue with initial values
const initialMultiQueue = QueueUtils.createMultiQueue<string>({
  initialItems: {
    high: ['urgent1', 'urgent2'],
    low: ['normal1', 'normal2']
  }
});

// Create a multi queue with maximum sizes per channel
const boundedMultiQueue = QueueUtils.createMultiQueue<number>({
  channelMaxSizes: {
    high: 10,
    medium: 20,
    low: 50
  },
  defaultMaxSize: 30 // Default size for channels without a specific limit
});

// Add elements to different channels
multiQueue.enqueue(1, 'high');
multiQueue.enqueue(2, 'medium');
multiQueue.enqueue(3, 'low');

// Check the first element of a channel without removing it
const firstHigh = multiQueue.peek('high'); // 1

// Remove and get the first element of a channel
const removedHigh = multiQueue.dequeue('high'); // 1

// Check the size of a channel
const sizeHigh = multiQueue.size('high'); // 0
const sizeLow = multiQueue.size('low'); // 1

// Check whether a channel is empty
const isHighEmpty = multiQueue.isEmpty('high'); // true

// Check whether a channel is full (only for queues with a maximum size)
const isLowFull = boundedMultiQueue.isFull('low'); // false

// Get all available channels
const channels = multiQueue.channels(); // ['medium', 'low']

// Get all elements of a channel as an array
const lowItems = multiQueue.toArray('low'); // [3]

// Get all elements of all channels
const allItems = multiQueue.toFullArray(); // { medium: [2], low: [3] }

// Clear a specific channel
multiQueue.clearChannel('medium');

// Clear all channels
multiQueue.clearAll();
```

### CircularBuffer

A circular buffer (also known as a ring buffer) is a fixed-size data structure that works as if its ends were connected. When the buffer is full, adding a new element overwrites the oldest element.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Create a circular buffer with a specific capacity
const buffer = QueueUtils.createCircularBuffer<number>({ capacity: 5 });

// Add elements (returns false if the buffer is full)
buffer.add(1); // true
buffer.add(2); // true
buffer.add(3); // true

// Add an element with overwrite (returns the overwritten element)
buffer.add(4); // true
buffer.add(5); // true
const overwritten = buffer.addOverwrite(6); // 1 (overwrites the oldest element)

// Check the oldest element without removing it
const oldest = buffer.peek(); // 2

// Remove and get the oldest element
const removed = buffer.remove(); // 2

// Check the current size and the capacity
const size = buffer.getSize(); // 4
const capacity = buffer.getCapacity(); // 5

// Check whether it is empty or full
const isEmpty = buffer.isEmpty(); // false
const isFull = buffer.isFull(); // false

// Get all elements as an array (in order from oldest to newest)
const allItems = buffer.toArray(); // [3, 4, 5, 6]

// Clear the buffer
buffer.clear();
```

### PriorityQueue

A priority queue is a data structure where each element has an associated priority. Elements with higher priority (lower numeric value) are processed before elements with lower priority.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Create an empty priority queue
const priorityQueue = QueueUtils.createPriorityQueue<string>();

// Create a priority queue with a maximum size
const boundedPriorityQueue = QueueUtils.createPriorityQueue<string>({ maxSize: 10 });

// Add elements with different priorities (lower number = higher priority)
priorityQueue.enqueue('urgent task', 1);
priorityQueue.enqueue('medium task', 5);
priorityQueue.enqueue('low task', 10);

// Check the highest priority element without removing it
const highest = priorityQueue.peek(); // 'urgent task'

// Remove and get the highest priority element
const removed = priorityQueue.dequeue(); // 'urgent task'

// Check the size
const size = priorityQueue.size(); // 2

// Check whether it is empty
const isEmpty = priorityQueue.isEmpty(); // false

// Check whether it is full (only for queues with a maximum size)
const isFull = boundedPriorityQueue.isFull(); // false

// Get all elements as an array (sorted by priority)
const allItems = priorityQueue.toArray(); // ['medium task', 'low task']

// Clear the queue
priorityQueue.clear();
```

### DelayQueue

A delay queue is a data structure where elements only become available after a specific time. Useful for implementing scheduled tasks or delayed operations.

```typescript
import { QueueUtils } from '../src/services/queue.service';

// Create an empty delay queue
const delayQueue = QueueUtils.createDelayQueue<string>();

// Create a delay queue with a maximum size
const boundedDelayQueue = QueueUtils.createDelayQueue<string>({ maxSize: 10 });

// Add elements with different delays (in milliseconds)
delayQueue.enqueue('process in 1 second', 1000);
delayQueue.enqueue('process in 500ms', 500);
delayQueue.enqueue('process in 2 seconds', 2000);

// Check the next element to become available without removing it
const next = delayQueue.peek(); // 'process in 500ms'

// Check how much time is left until the next element becomes available
const timeLeft = delayQueue.timeUntilNext(); // time in ms

// Remove and get all elements that are already available
const readyItems = delayQueue.dequeueReady(); // ready elements

// Check the size
const size = delayQueue.size(); // number of remaining elements

// Check whether it is empty
const isEmpty = delayQueue.isEmpty(); // false

// Check whether it is full (only for queues with a maximum size)
const isFull = boundedDelayQueue.isFull(); // false

// Get all elements as an array (sorted by availability time)
const allItems = delayQueue.toArray(); // all elements in the queue

// Clear the queue
delayQueue.clear();
```

## Queues and Stacks with a Maximum Size

The `Queue`, `Stack`, `MultiQueue`, `PriorityQueue`, and `DelayQueue` implementations support defining a maximum size, which is useful for limiting memory consumption and implementing patterns such as a bounded buffer.

```typescript
// Create a queue with a maximum size of 3 elements
const boundedQueue = QueueUtils.createQueue<number>({ maxSize: 3 });

// Add elements up to the limit
boundedQueue.enqueue(1); // returns 1
boundedQueue.enqueue(2); // returns 2
boundedQueue.enqueue(3); // returns 3

// Try to add beyond the limit
const result = boundedQueue.enqueue(4); // returns -1 (failure)

// Check whether the queue is full
const isFull = boundedQueue.isFull(); // true

// Remove an element to free up space
boundedQueue.dequeue(); // 1

// Now it is possible to add one more element
boundedQueue.enqueue(4); // returns 3
```

## Common Use Cases

### Task Management by Priority

```typescript
const taskQueue = QueueUtils.createPriorityQueue<{ id: number; description: string }>();

// Add tasks with different priorities
taskQueue.enqueue({ id: 1, description: "Fix critical bug" }, 1);
taskQueue.enqueue({ id: 2, description: "Implement new feature" }, 5);
taskQueue.enqueue({ id: 3, description: "Update documentation" }, 10);

// Process tasks in priority order
while (!taskQueue.isEmpty()) {
  const task = taskQueue.dequeue();
  console.log(`Processing task: ${task.description}`);
}
```

### Task Scheduling

```typescript
const scheduledTasks = QueueUtils.createDelayQueue<() => void>();

// Schedule tasks for future execution
scheduledTasks.enqueue(() => console.log("Task executed after 1 second"), 1000);
scheduledTasks.enqueue(() => console.log("Task executed after 500ms"), 500);

// In a processing loop
setInterval(() => {
  const readyTasks = scheduledTasks.dequeueReady();
  readyTasks.forEach(task => task());
}, 100);
```

### Bounded History

```typescript
const history = QueueUtils.createCircularBuffer<string>({ capacity: 10 });

// Add events to the history
history.add("User logged in");
history.add("User accessed the home page");
// ... more events

// When the buffer is full, the oldest events are automatically removed
history.add("New event"); // Overwrites the oldest event if the buffer is full

// Get the complete history
const allEvents = history.toArray();
```

## Integration with External Systems

The `IQueue`, `IStack`, `IMultiQueue`, `IPriorityQueue`, and `IDelayQueue` interfaces can be implemented to work with external systems such as Redis, MongoDB, or any other storage system.

### Example with Redis

See the `examples/redis-queue-example.ts` file for an example of how to implement a queue using Redis:

```typescript
import { RedisQueue } from '../examples/redis-queue-example';

// Create a Redis queue
const redisQueue = new RedisQueue<string>('my-queue');

// Use the queue asynchronously
async function processQueue() {
  await redisQueue.enqueue('item1');
  await redisQueue.enqueue('item2');
  
  const item = await redisQueue.dequeue();
  console.log(item); // 'item1'
  
  await redisQueue.clear();
}
```

## Benchmark

The service includes benchmark tests to evaluate the performance of the different data structures in high-frequency operations. These tests can be found in `tests/benchmark/queue.service.bench.ts`.

## Performance Considerations

- The local implementations are optimized for in-memory operations:
  - `Queue`, `Stack`, `MultiQueue`: O(1) for most operations
  - `CircularBuffer`: O(1) for all operations
  - `PriorityQueue`: O(log n) for enqueue/dequeue, O(1) for peek
  - `DelayQueue`: O(log n) for enqueue, O(1) for peek, O(k) for dequeueReady (where k is the number of ready items)
- For use cases with large data volumes or a need for persistence, consider implementing the interfaces with external systems such as Redis or databases.
- Serialization/deserialization of complex objects can affect performance in external implementations.
