import {
  QueueUtils,
  Queue,
  Stack,
  MultiQueue,
  CircularBuffer,
  DelayQueue,
  PriorityQueue,
} from '../../src/services/queue.service';

describe('Queue Service', () => {
  describe('Queue', () => {
    it('should create an empty queue', () => {
      const queue = new Queue<number>();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
      expect(queue.peek()).toBeUndefined();
    });

    it('should create a queue with initial items', () => {
      const queue = new Queue<number>([1, 2, 3]);
      expect(queue.isEmpty()).toBe(false);
      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(1);
    });

    it('should enqueue and dequeue items correctly', () => {
      const queue = new Queue<string>();

      expect(queue.enqueue('first')).toBe(1);
      expect(queue.enqueue('second')).toBe(2);
      expect(queue.size()).toBe(2);

      expect(queue.dequeue()).toBe('first');
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe('second');

      expect(queue.dequeue()).toBe('second');
      expect(queue.isEmpty()).toBe(true);
      expect(queue.dequeue()).toBeUndefined();
    });

    it('should respect maximum size limit', () => {
      const queue = new Queue<number>([], 3);

      expect(queue.enqueue(1)).toBe(1);
      expect(queue.enqueue(2)).toBe(2);
      expect(queue.enqueue(3)).toBe(3);
      expect(queue.isFull()).toBe(true);
      expect(queue.enqueue(4)).toBe(-1); // Should fail to enqueue
      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(1);
    });

    it('should truncate initial items if they exceed max size', () => {
      const queue = new Queue<number>([1, 2, 3, 4, 5], 3);
      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('should clear the queue', () => {
      const queue = new Queue<number>([1, 2, 3]);
      queue.clear();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('should convert queue to array', () => {
      const queue = new Queue<number>([1, 2, 3]);
      const array = queue.toArray();
      expect(array).toEqual([1, 2, 3]);

      // Ensure the original queue is not modified
      expect(queue.size()).toBe(3);
    });
  });

  describe('Stack', () => {
    it('should create an empty stack', () => {
      const stack = new Stack<number>();
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
      expect(stack.peek()).toBeUndefined();
    });

    it('should create a stack with initial items', () => {
      const stack = new Stack<number>([1, 2, 3]);
      expect(stack.isEmpty()).toBe(false);
      expect(stack.size()).toBe(3);
      expect(stack.peek()).toBe(3);
    });

    it('should push and pop items correctly', () => {
      const stack = new Stack<string>();

      expect(stack.push('first')).toBe(1);
      expect(stack.push('second')).toBe(2);
      expect(stack.size()).toBe(2);

      expect(stack.pop()).toBe('second');
      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe('first');

      expect(stack.pop()).toBe('first');
      expect(stack.isEmpty()).toBe(true);
      expect(stack.pop()).toBeUndefined();
    });

    it('should respect maximum size limit', () => {
      const stack = new Stack<number>([], 3);

      expect(stack.push(1)).toBe(1);
      expect(stack.push(2)).toBe(2);
      expect(stack.push(3)).toBe(3);
      expect(stack.isFull()).toBe(true);
      expect(stack.push(4)).toBe(-1); // Should fail to push
      expect(stack.size()).toBe(3);
      expect(stack.peek()).toBe(3);
    });

    it('should truncate initial items if they exceed max size', () => {
      const stack = new Stack<number>([1, 2, 3, 4, 5], 3);
      expect(stack.size()).toBe(3);
      expect(stack.toArray()).toEqual([1, 2, 3]);
    });

    it('should clear the stack', () => {
      const stack = new Stack<number>([1, 2, 3]);
      stack.clear();
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });

    it('should convert stack to array', () => {
      const stack = new Stack<number>([1, 2, 3]);
      const array = stack.toArray();
      expect(array).toEqual([1, 2, 3]);

      // Ensure the original stack is not modified
      expect(stack.size()).toBe(3);
    });
  });

  describe('MultiQueue', () => {
    it('should create an empty multi-queue', () => {
      const multiQueue = new MultiQueue<number>();
      expect(multiQueue.channels()).toEqual([]);
      expect(multiQueue.isEmpty('any')).toBe(true);
      expect(multiQueue.size('any')).toBe(0);
    });

    it('should create a multi-queue with initial items', () => {
      const multiQueue = new MultiQueue<number>({
        high: [1, 2],
        low: [3, 4],
      });

      expect(multiQueue.channels().length).toBe(2);
      expect(multiQueue.channels()).toContain('high');
      expect(multiQueue.channels()).toContain('low');

      expect(multiQueue.size('high')).toBe(2);
      expect(multiQueue.size('low')).toBe(2);

      expect(multiQueue.peek('high')).toBe(1);
      expect(multiQueue.peek('low')).toBe(3);
    });

    it('should enqueue and dequeue items correctly', () => {
      const multiQueue = new MultiQueue<string>();

      expect(multiQueue.enqueue('high priority', 'high')).toBe(1);
      expect(multiQueue.enqueue('low priority', 'low')).toBe(1);
      expect(multiQueue.enqueue('another high', 'high')).toBe(2);

      expect(multiQueue.size('high')).toBe(2);
      expect(multiQueue.size('low')).toBe(1);

      expect(multiQueue.dequeue('high')).toBe('high priority');
      expect(multiQueue.size('high')).toBe(1);
      expect(multiQueue.peek('high')).toBe('another high');

      expect(multiQueue.dequeue('low')).toBe('low priority');
      expect(multiQueue.isEmpty('low')).toBe(true);
      expect(multiQueue.dequeue('low')).toBeUndefined();
    });

    it('should respect channel-specific maximum size limits', () => {
      const multiQueue = new MultiQueue<number>({}, { high: 2, low: 3 });

      expect(multiQueue.enqueue(1, 'high')).toBe(1);
      expect(multiQueue.enqueue(2, 'high')).toBe(2);
      expect(multiQueue.isFull('high')).toBe(true);
      expect(multiQueue.enqueue(3, 'high')).toBe(-1); // Should fail to enqueue

      expect(multiQueue.enqueue(1, 'low')).toBe(1);
      expect(multiQueue.enqueue(2, 'low')).toBe(2);
      expect(multiQueue.enqueue(3, 'low')).toBe(3);
      expect(multiQueue.isFull('low')).toBe(true);
      expect(multiQueue.enqueue(4, 'low')).toBe(-1); // Should fail to enqueue
    });

    it('should respect default maximum size limit', () => {
      const multiQueue = new MultiQueue<number>({}, undefined, 2);

      expect(multiQueue.enqueue(1, 'any')).toBe(1);
      expect(multiQueue.enqueue(2, 'any')).toBe(2);
      expect(multiQueue.isFull('any')).toBe(true);
      expect(multiQueue.enqueue(3, 'any')).toBe(-1); // Should fail to enqueue
    });

    it('should truncate initial items if they exceed max size', () => {
      const multiQueue = new MultiQueue<number>(
        { high: [1, 2, 3, 4] },
        { high: 2 },
      );
      expect(multiQueue.size('high')).toBe(2);
      expect(multiQueue.toArray('high')).toEqual([1, 2]);
    });

    it('should clear specific channels', () => {
      const multiQueue = new MultiQueue<number>({
        high: [1, 2],
        low: [3, 4],
      });

      multiQueue.clearChannel('high');
      expect(multiQueue.isEmpty('high')).toBe(true);
      expect(multiQueue.isEmpty('low')).toBe(false);
    });

    it('should clear all channels', () => {
      const multiQueue = new MultiQueue<number>({
        high: [1, 2],
        low: [3, 4],
      });

      multiQueue.clearAll();
      expect(multiQueue.channels()).toEqual([]);
      expect(multiQueue.isEmpty('high')).toBe(true);
      expect(multiQueue.isEmpty('low')).toBe(true);
    });

    it('should convert channel to array', () => {
      const multiQueue = new MultiQueue<number>({
        high: [1, 2],
        low: [3, 4],
      });

      const highArray = multiQueue.toArray('high');
      expect(highArray).toEqual([1, 2]);

      // Ensure the original queue is not modified
      expect(multiQueue.size('high')).toBe(2);
    });

    it('should convert all channels to full array', () => {
      const multiQueue = new MultiQueue<number>({
        high: [1, 2],
        low: [3, 4],
      });

      const fullArray = multiQueue.toFullArray();
      expect(fullArray).toEqual({
        high: [1, 2],
        low: [3, 4],
      });

      // Ensure the original queue is not modified
      expect(multiQueue.size('high')).toBe(2);
      expect(multiQueue.size('low')).toBe(2);
    });
  });

  describe('CircularBuffer', () => {
    it('should create an empty circular buffer with specified capacity', () => {
      const buffer = new CircularBuffer<number>(5);
      expect(buffer.isEmpty()).toBe(true);
      expect(buffer.getSize()).toBe(0);
      expect(buffer.getCapacity()).toBe(5);
      expect(buffer.peek()).toBeUndefined();
    });

    it('should add and remove items correctly', () => {
      const buffer = new CircularBuffer<string>(3);

      expect(buffer.add('first')).toBe(true);
      expect(buffer.add('second')).toBe(true);
      expect(buffer.getSize()).toBe(2);

      expect(buffer.peek()).toBe('first');
      expect(buffer.remove()).toBe('first');
      expect(buffer.getSize()).toBe(1);
      expect(buffer.peek()).toBe('second');

      expect(buffer.remove()).toBe('second');
      expect(buffer.isEmpty()).toBe(true);
      expect(buffer.remove()).toBeUndefined();
    });

    it('should respect capacity limit', () => {
      const buffer = new CircularBuffer<number>(3);

      expect(buffer.add(1)).toBe(true);
      expect(buffer.add(2)).toBe(true);
      expect(buffer.add(3)).toBe(true);
      expect(buffer.isFull()).toBe(true);
      expect(buffer.add(4)).toBe(false); // Should fail to add
      expect(buffer.getSize()).toBe(3);
      expect(buffer.peek()).toBe(1);
    });

    it('should overwrite oldest items when using addOverwrite', () => {
      const buffer = new CircularBuffer<number>(3);

      buffer.add(1);
      buffer.add(2);
      buffer.add(3);

      // Buffer is now full with [1, 2, 3]
      expect(buffer.isFull()).toBe(true);

      // Should overwrite the oldest item (1)
      const overwritten = buffer.addOverwrite(4);
      expect(overwritten).toBe(1);

      // Buffer should now contain [2, 3, 4]
      expect(buffer.getSize()).toBe(3);
      expect(buffer.peek()).toBe(2);

      // Remove 2 and check next item
      expect(buffer.remove()).toBe(2);
      expect(buffer.peek()).toBe(3);

      // Remove 3 and check next item
      expect(buffer.remove()).toBe(3);
      expect(buffer.peek()).toBe(4);
    });

    it('should clear the buffer', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.add(1);
      buffer.add(2);

      buffer.clear();
      expect(buffer.isEmpty()).toBe(true);
      expect(buffer.getSize()).toBe(0);
    });

    it('should convert buffer to array in correct order', () => {
      const buffer = new CircularBuffer<number>(5);
      buffer.add(1);
      buffer.add(2);
      buffer.add(3);

      // Remove first item and add more
      buffer.remove(); // Remove 1
      buffer.add(4);
      buffer.add(5);

      // Buffer should now contain [2, 3, 4, 5] in that order
      const array = buffer.toArray();
      expect(array).toEqual([2, 3, 4, 5]);
    });

    it('should throw error when creating buffer with invalid capacity', () => {
      expect(() => new CircularBuffer<number>(0)).toThrow();
      expect(() => new CircularBuffer<number>(-1)).toThrow();
    });
  });

  describe('PriorityQueue', () => {
    it('should create an empty priority queue', () => {
      const priorityQueue = new PriorityQueue<string>();
      expect(priorityQueue.isEmpty()).toBe(true);
      expect(priorityQueue.size()).toBe(0);
      expect(priorityQueue.peek()).toBeUndefined();
    });

    it('should enqueue and dequeue items by priority', () => {
      const priorityQueue = new PriorityQueue<string>();

      priorityQueue.enqueue('medium task', 5);
      priorityQueue.enqueue('urgent task', 1);
      priorityQueue.enqueue('low task', 10);

      expect(priorityQueue.size()).toBe(3);
      expect(priorityQueue.peek()).toBe('urgent task');

      expect(priorityQueue.dequeue()).toBe('urgent task');
      expect(priorityQueue.size()).toBe(2);
      expect(priorityQueue.peek()).toBe('medium task');

      expect(priorityQueue.dequeue()).toBe('medium task');
      expect(priorityQueue.dequeue()).toBe('low task');
      expect(priorityQueue.isEmpty()).toBe(true);
    });

    it('should respect maximum size limit', () => {
      const priorityQueue = new PriorityQueue<string>(2);

      priorityQueue.enqueue('task 1', 5);
      priorityQueue.enqueue('task 2', 3);
      expect(priorityQueue.isFull()).toBe(true);
      expect(priorityQueue.enqueue('task 3', 1)).toBe(-1); // Should fail to enqueue

      expect(priorityQueue.size()).toBe(2);
      expect(priorityQueue.peek()).toBe('task 2'); // Lower priority number = higher priority
    });

    it('should convert priority queue to array in priority order', () => {
      const priorityQueue = new PriorityQueue<string>();

      priorityQueue.enqueue('medium task', 5);
      priorityQueue.enqueue('urgent task', 1);
      priorityQueue.enqueue('low task', 10);

      const array = priorityQueue.toArray();
      expect(array).toEqual(['urgent task', 'medium task', 'low task']);

      // Ensure the original queue is not modified
      expect(priorityQueue.size()).toBe(3);
    });

    it('should clear the priority queue', () => {
      const priorityQueue = new PriorityQueue<string>();

      priorityQueue.enqueue('task 1', 5);
      priorityQueue.enqueue('task 2', 3);

      priorityQueue.clear();
      expect(priorityQueue.isEmpty()).toBe(true);
      expect(priorityQueue.size()).toBe(0);
    });
  });

  describe('DelayQueue', () => {
    // Mock Date.now() for predictable testing
    let originalDateNow: () => number;
    let mockTime: number;

    beforeEach(() => {
      originalDateNow = Date.now;
      mockTime = 1000;
      Date.now = jest.fn(() => mockTime);
    });

    afterEach(() => {
      Date.now = originalDateNow;
    });

    it('should create an empty delay queue', () => {
      const delayQueue = new DelayQueue<string>();
      expect(delayQueue.isEmpty()).toBe(true);
      expect(delayQueue.size()).toBe(0);
      expect(delayQueue.peek()).toBeUndefined();
    });

    it('should enqueue items with delay', () => {
      const delayQueue = new DelayQueue<string>();

      delayQueue.enqueue('task 1', 1000); // Ready at 2000
      delayQueue.enqueue('task 2', 500); // Ready at 1500
      delayQueue.enqueue('task 3', 1500); // Ready at 2500

      expect(delayQueue.size()).toBe(3);
      expect(delayQueue.peek()).toBe('task 2'); // Earliest ready time first
      expect(delayQueue.timeUntilNext()).toBe(500); // 1500 - 1000
    });

    it('should dequeue ready items', () => {
      const delayQueue = new DelayQueue<string>();

      delayQueue.enqueue('task 1', 1000); // Ready at 2000
      delayQueue.enqueue('task 2', 500); // Ready at 1500
      delayQueue.enqueue('task 3', 1500); // Ready at 2500

      // Advance time to 1600
      mockTime = 1600;

      // Only task 2 should be ready
      const readyItems = delayQueue.dequeueReady();
      expect(readyItems).toEqual(['task 2']);
      expect(delayQueue.size()).toBe(2);

      // Advance time to 2100
      mockTime = 2100;

      // Now task 1 should be ready
      const moreReadyItems = delayQueue.dequeueReady();
      expect(moreReadyItems).toEqual(['task 1']);
      expect(delayQueue.size()).toBe(1);

      // task 3 is still not ready
      expect(delayQueue.peek()).toBe('task 3');
      expect(delayQueue.timeUntilNext()).toBe(400); // 2500 - 2100
    });

    it('should respect maximum size limit', () => {
      const delayQueue = new DelayQueue<string>(2);

      delayQueue.enqueue('task 1', 1000);
      delayQueue.enqueue('task 2', 500);
      expect(delayQueue.isFull()).toBe(true);
      expect(delayQueue.enqueue('task 3', 250)).toBe(-1); // Should fail to enqueue

      expect(delayQueue.size()).toBe(2);
    });

    it('should convert delay queue to array in ready time order', () => {
      const delayQueue = new DelayQueue<string>();

      delayQueue.enqueue('task 1', 1000); // Ready at 2000
      delayQueue.enqueue('task 2', 500); // Ready at 1500
      delayQueue.enqueue('task 3', 1500); // Ready at 2500

      const array = delayQueue.toArray();
      expect(array).toEqual(['task 2', 'task 1', 'task 3']);

      // Ensure the original queue is not modified
      expect(delayQueue.size()).toBe(3);
    });

    it('should clear the delay queue', () => {
      const delayQueue = new DelayQueue<string>();

      delayQueue.enqueue('task 1', 1000);
      delayQueue.enqueue('task 2', 500);

      delayQueue.clear();
      expect(delayQueue.isEmpty()).toBe(true);
      expect(delayQueue.size()).toBe(0);
    });

    it('should return -1 for timeUntilNext when queue is empty', () => {
      const delayQueue = new DelayQueue<string>();
      expect(delayQueue.timeUntilNext()).toBe(-1);
    });
  });

  describe('QueueUtils', () => {
    it('should create a queue using the utility method', () => {
      const queue = QueueUtils.createQueue<number>({ initialItems: [1, 2, 3] });
      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(1);
    });

    it('should create a bounded queue using the utility method', () => {
      const queue = QueueUtils.createQueue<number>({ maxSize: 3 });
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.enqueue(4)).toBe(-1); // Should fail to enqueue
    });

    it('should create a stack using the utility method', () => {
      const stack = QueueUtils.createStack<string>({
        initialItems: ['a', 'b', 'c'],
      });
      expect(stack.size()).toBe(3);
      expect(stack.peek()).toBe('c');
    });

    it('should create a bounded stack using the utility method', () => {
      const stack = QueueUtils.createStack<string>({ maxSize: 2 });
      stack.push('a');
      stack.push('b');
      expect(stack.push('c')).toBe(-1); // Should fail to push
    });

    it('should create a multi-queue using the utility method', () => {
      const multiQueue = QueueUtils.createMultiQueue<number>({
        initialItems: {
          high: [1, 2],
          low: [3, 4],
        },
      });

      expect(multiQueue.size('high')).toBe(2);
      expect(multiQueue.peek('high')).toBe(1);
      expect(multiQueue.size('low')).toBe(2);
      expect(multiQueue.peek('low')).toBe(3);
    });

    it('should create a bounded multi-queue using the utility method', () => {
      const multiQueue = QueueUtils.createMultiQueue<number>({
        channelMaxSizes: {
          high: 2,
          low: 3,
        },
        defaultMaxSize: 5,
      });

      multiQueue.enqueue(1, 'high');
      multiQueue.enqueue(2, 'high');
      expect(multiQueue.enqueue(3, 'high')).toBe(-1); // Should fail to enqueue

      multiQueue.enqueue(1, 'medium'); // Should use default max size
      multiQueue.enqueue(2, 'medium');
      multiQueue.enqueue(3, 'medium');
      multiQueue.enqueue(4, 'medium');
      multiQueue.enqueue(5, 'medium');
      expect(multiQueue.enqueue(6, 'medium')).toBe(-1); // Should fail to enqueue
    });

    it('should create a circular buffer using the utility method', () => {
      const buffer = QueueUtils.createCircularBuffer<number>({ capacity: 3 });
      buffer.add(1);
      buffer.add(2);
      buffer.add(3);
      expect(buffer.add(4)).toBe(false); // Should fail to add
      expect(buffer.getSize()).toBe(3);
      expect(buffer.peek()).toBe(1);
    });

    it('should create a priority queue using the utility method', () => {
      const priorityQueue = QueueUtils.createPriorityQueue<string>();

      priorityQueue.enqueue('medium task', 5);
      priorityQueue.enqueue('urgent task', 1);
      priorityQueue.enqueue('low task', 10);

      expect(priorityQueue.size()).toBe(3);
      expect(priorityQueue.peek()).toBe('urgent task');
      expect(priorityQueue.dequeue()).toBe('urgent task');
    });

    it('should create a delay queue using the utility method', () => {
      // Mock Date.now()
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = jest.fn(() => mockTime);

      try {
        const delayQueue = QueueUtils.createDelayQueue<string>();

        delayQueue.enqueue('task 1', 1000); // Ready at 2000
        delayQueue.enqueue('task 2', 500); // Ready at 1500

        expect(delayQueue.size()).toBe(2);
        expect(delayQueue.peek()).toBe('task 2');

        // Advance time
        mockTime = 1600;

        const readyItems = delayQueue.dequeueReady();
        expect(readyItems).toEqual(['task 2']);
      } finally {
        Date.now = originalDateNow;
      }
    });
  });
});
