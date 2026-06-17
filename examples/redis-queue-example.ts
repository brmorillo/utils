/**
 * This is an example of how to implement a queue using Redis with the IQueue interface.
 * Note that this is just an example and requires the 'redis' library to be installed.
 *
 * To install: npm install redis
 */

import { createClient } from 'redis';
import { IQueue } from '../src/services/queue.service';

/**
 * Implementation of a queue using Redis.
 * @template T The type of elements stored in the queue.
 */
export class RedisQueue<T> implements IQueue<T> {
  private client;
  private queueKey: string;

  /**
   * Creates a new RedisQueue instance.
   * @param queueKey The key used to identify the queue in Redis.
   * @param redisUrl The Redis connection URL (optional).
   */
  constructor(queueKey: string, redisUrl: string = 'redis://localhost:6379') {
    this.queueKey = queueKey;
    this.client = createClient({ url: redisUrl });
    this.client.connect().catch(console.error);
  }

  /**
   * Adds an element to the end of the queue.
   * @param item The item to be enqueued.
   * @returns The updated size of the queue.
   */
  async enqueue(item: T): Promise<number> {
    const serializedItem = JSON.stringify(item);
    await this.client.rPush(this.queueKey, serializedItem);
    return this.size();
  }

  /**
   * Removes and returns the element at the front of the queue.
   * @returns The dequeued item or undefined if the queue is empty.
   */
  async dequeue(): Promise<T | undefined> {
    const item = await this.client.lPop(this.queueKey);
    if (!item) return undefined;
    return JSON.parse(item);
  }

  /**
   * Returns the element at the front of the queue without removing it.
   * @returns The item at the front or undefined if the queue is empty.
   */
  async peek(): Promise<T | undefined> {
    const items = await this.client.lRange(this.queueKey, 0, 0);
    if (!items || items.length === 0) return undefined;
    return JSON.parse(items[0]);
  }

  /**
   * Returns the current size of the queue.
   * @returns The number of elements in the queue.
   */
  async size(): Promise<number> {
    return await this.client.lLen(this.queueKey);
  }

  /**
   * Checks whether the queue is empty.
   * @returns True if the queue is empty, false otherwise.
   */
  async isEmpty(): Promise<boolean> {
    const size = await this.size();
    return size === 0;
  }

  /**
   * Clears all elements from the queue.
   */
  async clear(): Promise<void> {
    await this.client.del(this.queueKey);
  }

  /**
   * Returns all elements of the queue without removing them.
   * @returns An array containing all elements of the queue.
   */
  async toArray(): Promise<T[]> {
    const items = await this.client.lRange(this.queueKey, 0, -1);
    return items.map(item => JSON.parse(item));
  }

  /**
   * Closes the connection to Redis.
   */
  async close(): Promise<void> {
    await this.client.quit();
  }
}

/**
 * Example usage of RedisQueue
 */
async function redisQueueExample() {
  // Create a Redis queue to store messages
  const messageQueue = new RedisQueue<{ id: number; text: string }>(
    'message_queue',
  );

  try {
    // Clear the queue to start with an empty queue
    await messageQueue.clear();
    console.log('Queue cleared.');

    // Add some messages to the queue
    await messageQueue.enqueue({ id: 1, text: 'First message' });
    await messageQueue.enqueue({ id: 2, text: 'Second message' });
    await messageQueue.enqueue({ id: 3, text: 'Third message' });

    // Check the size of the queue
    const size = await messageQueue.size();
    console.log(`Queue size: ${size}`);

    // Check the first message without removing it
    const firstMessage = await messageQueue.peek();
    console.log('First message in the queue:', firstMessage);

    // Process all messages in the queue
    console.log('Processing messages:');
    while (!(await messageQueue.isEmpty())) {
      const message = await messageQueue.dequeue();
      console.log(`- Processing message ${message?.id}: ${message?.text}`);
    }

    // Check whether the queue is empty
    const isEmpty = await messageQueue.isEmpty();
    console.log(`Is the queue empty? ${isEmpty}`);
  } catch (error) {
    console.error('Error using the Redis queue:', error);
  } finally {
    // Close the connection to Redis
    await messageQueue.close();
  }
}

// Run the example (uncomment to test)
// redisQueueExample().catch(console.error);

/**
 * Example implementation of a priority queue using Redis
 */
export class RedisPriorityQueue<T> {
  private client;
  private queueKey: string;

  /**
   * Creates a new RedisPriorityQueue instance.
   * @param queueKey The key used to identify the queue in Redis.
   * @param redisUrl The Redis connection URL (optional).
   */
  constructor(queueKey: string, redisUrl: string = 'redis://localhost:6379') {
    this.queueKey = queueKey;
    this.client = createClient({ url: redisUrl });
    this.client.connect().catch(console.error);
  }

  /**
   * Adds an element to the queue with a specific priority.
   * Lower priorities are processed first.
   * @param item The item to be enqueued.
   * @param priority The priority of the item (lower = higher priority).
   */
  async enqueue(item: T, priority: number): Promise<void> {
    const serializedItem = JSON.stringify(item);
    await this.client.zAdd(this.queueKey, [
      { score: priority, value: serializedItem },
    ]);
  }

  /**
   * Removes and returns the element with the highest priority (lowest score).
   * @returns The dequeued item or undefined if the queue is empty.
   */
  async dequeue(): Promise<T | undefined> {
    // Get the item with the highest priority (lowest score)
    const items = await this.client.zRangeWithScores(this.queueKey, 0, 0);
    if (!items || items.length === 0) return undefined;

    // Remove the item from the queue
    await this.client.zRem(this.queueKey, items[0].value);

    return JSON.parse(items[0].value);
  }

  /**
   * Returns the current size of the queue.
   * @returns The number of elements in the queue.
   */
  async size(): Promise<number> {
    return await this.client.zCard(this.queueKey);
  }

  /**
   * Clears all elements from the queue.
   */
  async clear(): Promise<void> {
    await this.client.del(this.queueKey);
  }

  /**
   * Closes the connection to Redis.
   */
  async close(): Promise<void> {
    await this.client.quit();
  }
}

/**
 * Example usage of RedisPriorityQueue
 */
async function redisPriorityQueueExample() {
  // Create a Redis priority queue for tasks
  const taskQueue = new RedisPriorityQueue<{ id: number; task: string }>(
    'task_priority_queue',
  );

  try {
    // Clear the queue to start with an empty queue
    await taskQueue.clear();
    console.log('Priority queue cleared.');

    // Add some tasks with different priorities
    await taskQueue.enqueue({ id: 1, task: 'Low priority task' }, 3);
    await taskQueue.enqueue({ id: 2, task: 'High priority task' }, 1);
    await taskQueue.enqueue({ id: 3, task: 'Medium priority task' }, 2);

    // Check the size of the queue
    const size = await taskQueue.size();
    console.log(`Priority queue size: ${size}`);

    // Process all tasks in priority order
    console.log('Processing tasks by priority:');
    while ((await taskQueue.size()) > 0) {
      const task = await taskQueue.dequeue();
      console.log(`- Processing task ${task?.id}: ${task?.task}`);
    }
  } catch (error) {
    console.error('Error using the Redis priority queue:', error);
  } finally {
    // Close the connection to Redis
    await taskQueue.close();
  }
}

// Run the example (uncomment to test)
// redisPriorityQueueExample().catch(console.error);
