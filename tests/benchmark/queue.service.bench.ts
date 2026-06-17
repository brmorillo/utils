import { Queue, Stack, MultiQueue } from '../../src/services/queue.service';

/**
 * Benchmark tests for the queue data structures.
 * These tests verify the performance of the classes in high-frequency operations.
 */
describe('Queue Service - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('Queue - Bulk operations', () => {
    it('should process 1,000,000 enqueue operations in a reasonable time', () => {
      const queue = new Queue<number>();
      const count = 1000000;
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          queue.enqueue(i);
        }
      });
      
      console.log(
        `Time to enqueue ${count} items: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
      expect(queue.size()).toBe(count);
    });

    it('should process 100,000 dequeue operations in a reasonable time', () => {
      const queue = new Queue<number>();
      const count = 100000;

      // Fill the queue first
      for (let i = 0; i < count; i++) {
        queue.enqueue(i);
      }
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          queue.dequeue();
        }
      });
      
      console.log(
        `Time to dequeue ${count} items: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('Stack - Bulk operations', () => {
    it('should process 1,000,000 push operations in a reasonable time', () => {
      const stack = new Stack<number>();
      const count = 1000000;
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          stack.push(i);
        }
      });
      
      console.log(
        `Time to push ${count} items: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
      expect(stack.size()).toBe(count);
    });

    it('should process 100,000 pop operations in a reasonable time', () => {
      const stack = new Stack<number>();
      const count = 100000;

      // Fill the stack first
      for (let i = 0; i < count; i++) {
        stack.push(i);
      }
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          stack.pop();
        }
      });
      
      console.log(
        `Time to pop ${count} items: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
      expect(stack.isEmpty()).toBe(true);
    });
  });

  describe('MultiQueue - Bulk operations', () => {
    it('should process 500,000 enqueue operations across multiple channels in a reasonable time', () => {
      const multiQueue = new MultiQueue<number>();
      const count = 500000;
      const channels = ['high', 'medium', 'low'];
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const channel = channels[i % channels.length];
          multiQueue.enqueue(i, channel);
        }
      });
      
      console.log(
        `Time to enqueue ${count} items across ${channels.length} channels: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.002ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.002);

      // Check whether the items were distributed correctly
      const totalItems = channels.reduce((sum, channel) => sum + multiQueue.size(channel), 0);
      expect(totalItems).toBe(count);
    });

    it('should process 100,000 dequeue operations across multiple channels in a reasonable time', () => {
      const multiQueue = new MultiQueue<number>();
      const count = 100000;
      const channels = ['high', 'medium', 'low'];

      // Fill the queue first
      for (let i = 0; i < count; i++) {
        const channel = channels[i % channels.length];
        multiQueue.enqueue(i, channel);
      }
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count / channels.length; i++) {
          for (const channel of channels) {
            multiQueue.dequeue(channel);
          }
        }
      });
      
      console.log(
        `Time to dequeue ${count} items from ${channels.length} channels: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);

      // Check whether all channels are empty
      for (const channel of channels) {
        expect(multiQueue.isEmpty(channel)).toBe(true);
      }
    });
  });

  describe('Performance comparison', () => {
    it('should compare the performance between different data structures', () => {
      const count = 100000;
      const results: Record<string, number> = {};

      // Test Queue enqueue
      const queue = new Queue<number>();
      results.queueEnqueue = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          queue.enqueue(i);
        }
      });

      // Test Stack push
      const stack = new Stack<number>();
      results.stackPush = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          stack.push(i);
        }
      });

      // Test MultiQueue enqueue
      const multiQueue = new MultiQueue<number>();
      results.multiQueueEnqueue = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          multiQueue.enqueue(i, i % 2 === 0 ? 'even' : 'odd');
        }
      });

      // Test Queue dequeue
      results.queueDequeue = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          queue.dequeue();
        }
      });

      // Test Stack pop
      results.stackPop = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          stack.pop();
        }
      });

      // Display the results
      console.log('Performance comparison for different structures:');
      Object.entries(results).forEach(([method, time]) => {
        console.log(
          `${method}: ${time.toFixed(2)}ms (${(time / count).toFixed(6)}ms per operation)`,
        );
      });

      // We don't make specific assertions here, as the goal is just to collect data for analysis
    });
  });
});