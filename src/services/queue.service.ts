/**
 * Queue Service - Provides implementations for various queue-like data structures.
 * Supports generic types and can be used with both local variables and external storage systems.
 */

/**
 * Interface for a basic queue data structure.
 * @template T The type of elements stored in the queue.
 */
export interface IQueue<T> {
  /**
   * Adds an element to the end of the queue.
   * @param item The item to enqueue.
   * @returns The updated queue size, or -1 if the queue is full.
   */
  enqueue(item: T): number;

  /**
   * Removes and returns the element at the front of the queue.
   * @returns The dequeued item or undefined if the queue is empty.
   */
  dequeue(): T | undefined;

  /**
   * Returns the element at the front of the queue without removing it.
   * @returns The item at the front or undefined if the queue is empty.
   */
  peek(): T | undefined;

  /**
   * Returns the current size of the queue.
   * @returns The number of elements in the queue.
   */
  size(): number;

  /**
   * Checks if the queue is empty.
   * @returns True if the queue is empty, false otherwise.
   */
  isEmpty(): boolean;

  /**
   * Clears all elements from the queue.
   */
  clear(): void;

  /**
   * Returns all elements in the queue without removing them.
   * @returns An array containing all elements in the queue.
   */
  toArray(): T[];
}

/**
 * Interface for a basic stack data structure.
 * @template T The type of elements stored in the stack.
 */
export interface IStack<T> {
  /**
   * Adds an element to the top of the stack.
   * @param item The item to push onto the stack.
   * @returns The updated stack size, or -1 if the stack is full.
   */
  push(item: T): number;

  /**
   * Removes and returns the element at the top of the stack.
   * @returns The popped item or undefined if the stack is empty.
   */
  pop(): T | undefined;

  /**
   * Returns the element at the top of the stack without removing it.
   * @returns The item at the top or undefined if the stack is empty.
   */
  peek(): T | undefined;

  /**
   * Returns the current size of the stack.
   * @returns The number of elements in the stack.
   */
  size(): number;

  /**
   * Checks if the stack is empty.
   * @returns True if the stack is empty, false otherwise.
   */
  isEmpty(): boolean;

  /**
   * Clears all elements from the stack.
   */
  clear(): void;

  /**
   * Returns all elements in the stack without removing them.
   * @returns An array containing all elements in the stack.
   */
  toArray(): T[];
}

/**
 * Interface for a multi-output queue data structure.
 * @template T The type of elements stored in the queue.
 */
export interface IMultiQueue<T> {
  /**
   * Adds an element to the queue with a specified priority or channel.
   * @param item The item to enqueue.
   * @param channel The channel or priority to assign to the item.
   * @returns The updated queue size for the specified channel, or -1 if the channel is full.
   */
  enqueue(item: T, channel: string | number): number;

  /**
   * Removes and returns the next element from a specific channel.
   * @param channel The channel to dequeue from.
   * @returns The dequeued item or undefined if the channel is empty.
   */
  dequeue(channel: string | number): T | undefined;

  /**
   * Returns the next element from a specific channel without removing it.
   * @param channel The channel to peek from.
   * @returns The item at the front of the channel or undefined if empty.
   */
  peek(channel: string | number): T | undefined;

  /**
   * Returns the current size of a specific channel.
   * @param channel The channel to check.
   * @returns The number of elements in the specified channel.
   */
  size(channel: string | number): number;

  /**
   * Checks if a specific channel is empty.
   * @param channel The channel to check.
   * @returns True if the channel is empty, false otherwise.
   */
  isEmpty(channel: string | number): boolean;

  /**
   * Returns all available channels in the multi-queue.
   * @returns An array of channel identifiers.
   */
  channels(): (string | number)[];

  /**
   * Clears all elements from a specific channel.
   * @param channel The channel to clear.
   */
  clearChannel(channel: string | number): void;

  /**
   * Clears all elements from all channels.
   */
  clearAll(): void;

  /**
   * Returns all elements in a specific channel without removing them.
   * @param channel The channel to get elements from.
   * @returns An array containing all elements in the specified channel.
   */
  toArray(channel: string | number): T[];

  /**
   * Returns all elements from all channels.
   * @returns An object mapping each channel to its array of elements.
   */
  toFullArray(): Record<string | number, T[]>;
}

/**
 * Implementation of a basic queue data structure.
 * @template T The type of elements stored in the queue.
 */
export class Queue<T> implements IQueue<T> {
  private items: T[] = [];
  private maxSize?: number;

  /**
   * Creates a new Queue instance.
   * @param initialItems Optional array of items to initialize the queue with.
   * @param maxSize Optional maximum size of the queue. If specified, the queue will not grow beyond this size.
   */
  constructor(initialItems?: T[], maxSize?: number) {
    if (initialItems && Array.isArray(initialItems)) {
      this.items = maxSize ? initialItems.slice(0, maxSize) : [...initialItems];
    }
    this.maxSize = maxSize;
  }

  /**
   * Adds an element to the end of the queue.
   * @param item The item to enqueue.
   * @returns The updated queue size, or -1 if the queue is full.
   */
  public enqueue(item: T): number {
    if (this.maxSize !== undefined && this.items.length >= this.maxSize) {
      return -1; // Queue is full
    }
    this.items.push(item);
    return this.items.length;
  }

  /**
   * Removes and returns the element at the front of the queue.
   * @returns The dequeued item or undefined if the queue is empty.
   */
  public dequeue(): T | undefined {
    return this.items.shift();
  }

  /**
   * Returns the element at the front of the queue without removing it.
   * @returns The item at the front or undefined if the queue is empty.
   */
  public peek(): T | undefined {
    return this.items[0];
  }

  /**
   * Returns the current size of the queue.
   * @returns The number of elements in the queue.
   */
  public size(): number {
    return this.items.length;
  }

  /**
   * Checks if the queue is empty.
   * @returns True if the queue is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Checks if the queue is full.
   * @returns True if the queue is full, false otherwise.
   */
  public isFull(): boolean {
    return this.maxSize !== undefined && this.items.length >= this.maxSize;
  }

  /**
   * Returns the maximum size of the queue, if set.
   * @returns The maximum size or undefined if no limit is set.
   */
  public getMaxSize(): number | undefined {
    return this.maxSize;
  }

  /**
   * Clears all elements from the queue.
   */
  public clear(): void {
    this.items = [];
  }

  /**
   * Returns all elements in the queue without removing them.
   * @returns An array containing all elements in the queue.
   */
  public toArray(): T[] {
    return [...this.items];
  }
}

/**
 * Implementation of a basic stack data structure.
 * @template T The type of elements stored in the stack.
 */
export class Stack<T> implements IStack<T> {
  private items: T[] = [];
  private maxSize?: number;

  /**
   * Creates a new Stack instance.
   * @param initialItems Optional array of items to initialize the stack with.
   * @param maxSize Optional maximum size of the stack. If specified, the stack will not grow beyond this size.
   */
  constructor(initialItems?: T[], maxSize?: number) {
    if (initialItems && Array.isArray(initialItems)) {
      this.items = maxSize ? initialItems.slice(0, maxSize) : [...initialItems];
    }
    this.maxSize = maxSize;
  }

  /**
   * Adds an element to the top of the stack.
   * @param item The item to push onto the stack.
   * @returns The updated stack size, or -1 if the stack is full.
   */
  public push(item: T): number {
    if (this.maxSize !== undefined && this.items.length >= this.maxSize) {
      return -1; // Stack is full
    }
    this.items.push(item);
    return this.items.length;
  }

  /**
   * Removes and returns the element at the top of the stack.
   * @returns The popped item or undefined if the stack is empty.
   */
  public pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Returns the element at the top of the stack without removing it.
   * @returns The item at the top or undefined if the stack is empty.
   */
  public peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * Returns the current size of the stack.
   * @returns The number of elements in the stack.
   */
  public size(): number {
    return this.items.length;
  }

  /**
   * Checks if the stack is empty.
   * @returns True if the stack is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Checks if the stack is full.
   * @returns True if the stack is full, false otherwise.
   */
  public isFull(): boolean {
    return this.maxSize !== undefined && this.items.length >= this.maxSize;
  }

  /**
   * Returns the maximum size of the stack, if set.
   * @returns The maximum size or undefined if no limit is set.
   */
  public getMaxSize(): number | undefined {
    return this.maxSize;
  }

  /**
   * Clears all elements from the stack.
   */
  public clear(): void {
    this.items = [];
  }

  /**
   * Returns all elements in the stack without removing them.
   * @returns An array containing all elements in the stack.
   */
  public toArray(): T[] {
    return [...this.items];
  }
}

/**
 * Implementation of a multi-output queue data structure.
 * @template T The type of elements stored in the queue.
 */
export class MultiQueue<T> implements IMultiQueue<T> {
  private queues: Record<string | number, T[]> = {};
  private channelMaxSizes?: Record<string | number, number>;
  private defaultMaxSize?: number;

  /**
   * Creates a new MultiQueue instance.
   * @param initialItems Optional object mapping channels to arrays of items.
   * @param channelMaxSizes Optional object mapping channels to their maximum sizes.
   * @param defaultMaxSize Optional default maximum size for all channels.
   */
  constructor(
    initialItems?: Record<string | number, T[]>,
    channelMaxSizes?: Record<string | number, number>,
    defaultMaxSize?: number,
  ) {
    if (initialItems && typeof initialItems === 'object') {
      for (const channel in initialItems) {
        if (Array.isArray(initialItems[channel])) {
          const maxSize = channelMaxSizes?.[channel] || defaultMaxSize;
          this.queues[channel] = maxSize
            ? initialItems[channel].slice(0, maxSize)
            : [...initialItems[channel]];
        }
      }
    }
    this.channelMaxSizes = channelMaxSizes;
    this.defaultMaxSize = defaultMaxSize;
  }

  /**
   * Adds an element to the queue with a specified channel.
   * @param item The item to enqueue.
   * @param channel The channel to assign to the item.
   * @returns The updated queue size for the specified channel, or -1 if the channel is full.
   */
  public enqueue(item: T, channel: string | number): number {
    if (!this.queues[channel]) {
      this.queues[channel] = [];
    }

    const maxSize = this.channelMaxSizes?.[channel] || this.defaultMaxSize;
    if (maxSize !== undefined && this.queues[channel].length >= maxSize) {
      return -1; // Channel is full
    }

    this.queues[channel].push(item);
    return this.queues[channel].length;
  }

  /**
   * Removes and returns the next element from a specific channel.
   * @param channel The channel to dequeue from.
   * @returns The dequeued item or undefined if the channel is empty.
   */
  public dequeue(channel: string | number): T | undefined {
    if (!this.queues[channel] || this.queues[channel].length === 0) {
      return undefined;
    }
    return this.queues[channel].shift();
  }

  /**
   * Returns the next element from a specific channel without removing it.
   * @param channel The channel to peek from.
   * @returns The item at the front of the channel or undefined if empty.
   */
  public peek(channel: string | number): T | undefined {
    if (!this.queues[channel] || this.queues[channel].length === 0) {
      return undefined;
    }
    return this.queues[channel][0];
  }

  /**
   * Returns the current size of a specific channel.
   * @param channel The channel to check.
   * @returns The number of elements in the specified channel.
   */
  public size(channel: string | number): number {
    return this.queues[channel]?.length || 0;
  }

  /**
   * Checks if a specific channel is empty.
   * @param channel The channel to check.
   * @returns True if the channel is empty or doesn't exist, false otherwise.
   */
  public isEmpty(channel: string | number): boolean {
    return !this.queues[channel] || this.queues[channel].length === 0;
  }

  /**
   * Checks if a specific channel is full.
   * @param channel The channel to check.
   * @returns True if the channel is full, false otherwise.
   */
  public isFull(channel: string | number): boolean {
    if (!this.queues[channel]) {
      return false;
    }
    const maxSize = this.channelMaxSizes?.[channel] || this.defaultMaxSize;
    return maxSize !== undefined && this.queues[channel].length >= maxSize;
  }

  /**
   * Returns the maximum size of a specific channel, if set.
   * @param channel The channel to check.
   * @returns The maximum size or undefined if no limit is set.
   */
  public getChannelMaxSize(channel: string | number): number | undefined {
    return this.channelMaxSizes?.[channel] || this.defaultMaxSize;
  }

  /**
   * Returns all available channels in the multi-queue.
   * @returns An array of channel identifiers.
   */
  public channels(): (string | number)[] {
    return Object.keys(this.queues);
  }

  /**
   * Clears all elements from a specific channel.
   * @param channel The channel to clear.
   */
  public clearChannel(channel: string | number): void {
    if (this.queues[channel]) {
      this.queues[channel] = [];
    }
  }

  /**
   * Clears all elements from all channels.
   */
  public clearAll(): void {
    this.queues = {};
  }

  /**
   * Returns all elements in a specific channel without removing them.
   * @param channel The channel to get elements from.
   * @returns An array containing all elements in the specified channel.
   */
  public toArray(channel: string | number): T[] {
    return this.queues[channel] ? [...this.queues[channel]] : [];
  }

  /**
   * Returns all elements from all channels.
   * @returns An object mapping each channel to its array of elements.
   */
  public toFullArray(): Record<string | number, T[]> {
    const result: Record<string | number, T[]> = {};
    for (const channel in this.queues) {
      result[channel] = [...this.queues[channel]];
    }
    return result;
  }
}

/**
 * Implementation of a circular buffer (ring buffer).
 * @template T The type of elements stored in the buffer.
 */
export class CircularBuffer<T> {
  private buffer: (T | undefined)[];
  private head: number = 0;
  private tail: number = 0;
  private size: number = 0;
  private capacity: number;

  /**
   * Creates a new CircularBuffer instance.
   * @param capacity The maximum number of elements the buffer can hold.
   */
  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  /**
   * Adds an element to the buffer.
   * @param item The item to add.
   * @returns True if the item was added, false if the buffer is full.
   */
  public add(item: T): boolean {
    if (this.isFull()) {
      return false;
    }

    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    this.size++;
    return true;
  }

  /**
   * Adds an element to the buffer, overwriting the oldest element if the buffer is full.
   * @param item The item to add.
   * @returns The overwritten item, or undefined if no item was overwritten.
   */
  public addOverwrite(item: T): T | undefined {
    let overwritten: T | undefined;

    if (this.isFull()) {
      overwritten = this.buffer[this.head];
      this.head = (this.head + 1) % this.capacity;
      this.size--;
    }

    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    this.size++;

    return overwritten;
  }

  /**
   * Removes and returns the oldest element from the buffer.
   * @returns The removed item or undefined if the buffer is empty.
   */
  public remove(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return item;
  }

  /**
   * Returns the oldest element without removing it.
   * @returns The oldest item or undefined if the buffer is empty.
   */
  public peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.buffer[this.head];
  }

  /**
   * Returns the current number of elements in the buffer.
   * @returns The number of elements in the buffer.
   */
  public getSize(): number {
    return this.size;
  }

  /**
   * Returns the maximum capacity of the buffer.
   * @returns The buffer capacity.
   */
  public getCapacity(): number {
    return this.capacity;
  }

  /**
   * Checks if the buffer is empty.
   * @returns True if the buffer is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Checks if the buffer is full.
   * @returns True if the buffer is full, false otherwise.
   */
  public isFull(): boolean {
    return this.size === this.capacity;
  }

  /**
   * Clears all elements from the buffer.
   */
  public clear(): void {
    this.buffer = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }

  /**
   * Returns all elements in the buffer without removing them.
   * @returns An array containing all elements in the buffer in order from oldest to newest.
   */
  public toArray(): T[] {
    const result: T[] = [];
    if (this.isEmpty()) {
      return result;
    }

    let index = this.head;
    for (let i = 0; i < this.size; i++) {
      if (this.buffer[index] !== undefined) {
        result.push(this.buffer[index] as T);
      }
      index = (index + 1) % this.capacity;
    }
    return result;
  }
}

/**
 * Interface for a priority queue data structure.
 * @template T The type of elements stored in the queue.
 */
export interface IPriorityQueue<T> {
  /**
   * Adds an element to the queue with a specified priority.
   * @param item The item to enqueue.
   * @param priority The priority of the item (lower number = higher priority).
   * @returns The updated queue size, or -1 if the queue is full.
   */
  enqueue(item: T, priority: number): number;

  /**
   * Removes and returns the highest priority element.
   * @returns The dequeued item or undefined if the queue is empty.
   */
  dequeue(): T | undefined;

  /**
   * Returns the highest priority element without removing it.
   * @returns The highest priority item or undefined if the queue is empty.
   */
  peek(): T | undefined;

  /**
   * Returns the current size of the queue.
   * @returns The number of elements in the queue.
   */
  size(): number;

  /**
   * Checks if the queue is empty.
   * @returns True if the queue is empty, false otherwise.
   */
  isEmpty(): boolean;

  /**
   * Clears all elements from the queue.
   */
  clear(): void;

  /**
   * Returns all elements in the queue without removing them.
   * @returns An array containing all elements in the queue, sorted by priority.
   */
  toArray(): T[];
}

/**
 * Interface for a delay queue data structure.
 * @template T The type of elements stored in the queue.
 */
export interface IDelayQueue<T> {
  /**
   * Adds an element to the queue with a specified delay.
   * @param item The item to enqueue.
   * @param delayMs The delay in milliseconds before the item becomes available.
   * @returns The updated queue size, or -1 if the queue is full.
   */
  enqueue(item: T, delayMs: number): number;

  /**
   * Removes and returns elements that are ready (delay has passed).
   * @returns An array of items that are ready, or empty array if none are ready.
   */
  dequeueReady(): T[];

  /**
   * Returns the next element that will be ready without removing it.
   * @returns The next item that will be ready or undefined if the queue is empty.
   */
  peek(): T | undefined;

  /**
   * Returns the time in milliseconds until the next item is ready.
   * @returns The time in milliseconds, or -1 if the queue is empty.
   */
  timeUntilNext(): number;

  /**
   * Returns the current size of the queue.
   * @returns The number of elements in the queue.
   */
  size(): number;

  /**
   * Checks if the queue is empty.
   * @returns True if the queue is empty, false otherwise.
   */
  isEmpty(): boolean;

  /**
   * Clears all elements from the queue.
   */
  clear(): void;

  /**
   * Returns all elements in the queue without removing them.
   * @returns An array containing all elements in the queue, sorted by ready time.
   */
  toArray(): T[];
}

/**
 * Implementation of a priority queue using a binary heap.
 * @template T The type of elements stored in the queue.
 */
export class PriorityQueue<T> implements IPriorityQueue<T> {
  private items: Array<{ item: T; priority: number }> = [];
  private maxSize?: number;

  /**
   * Creates a new PriorityQueue instance.
   * @param maxSize Optional maximum size of the queue.
   */
  constructor(maxSize?: number) {
    this.maxSize = maxSize;
  }

  /**
   * Adds an element to the queue with a specified priority.
   * @param item The item to enqueue.
   * @param priority The priority of the item (lower number = higher priority).
   * @returns The updated queue size, or -1 if the queue is full.
   */
  public enqueue(item: T, priority: number): number {
    if (this.maxSize !== undefined && this.items.length >= this.maxSize) {
      return -1; // Queue is full
    }

    // Add the item to the end
    this.items.push({ item, priority });

    // Bubble up to maintain heap property
    this.bubbleUp(this.items.length - 1);

    return this.items.length;
  }

  /**
   * Removes and returns the highest priority element.
   * @returns The dequeued item or undefined if the queue is empty.
   */
  public dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const top = this.items[0];
    const bottom = this.items.pop();

    if (this.items.length > 0 && bottom) {
      this.items[0] = bottom;
      this.bubbleDown(0);
    }

    return top.item;
  }

  /**
   * Returns the highest priority element without removing it.
   * @returns The highest priority item or undefined if the queue is empty.
   */
  public peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[0].item;
  }

  /**
   * Returns the current size of the queue.
   * @returns The number of elements in the queue.
   */
  public size(): number {
    return this.items.length;
  }

  /**
   * Checks if the queue is empty.
   * @returns True if the queue is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Checks if the queue is full.
   * @returns True if the queue is full, false otherwise.
   */
  public isFull(): boolean {
    return this.maxSize !== undefined && this.items.length >= this.maxSize;
  }

  /**
   * Clears all elements from the queue.
   */
  public clear(): void {
    this.items = [];
  }

  /**
   * Returns all elements in the queue without removing them.
   * @returns An array containing all elements in the queue, sorted by priority.
   */
  public toArray(): T[] {
    // Create a copy of the heap and extract elements in priority order
    const copy = [...this.items];
    const result: T[] = [];

    while (copy.length > 0) {
      const top = copy[0];
      const bottom = copy.pop();

      if (copy.length > 0 && bottom) {
        copy[0] = bottom;
        this.bubbleDownArray(copy, 0);
      }

      result.push(top.item);
    }

    return result;
  }

  /**
   * Moves an element up the heap until the heap property is satisfied.
   * @param index The index of the element to bubble up.
   */
  private bubbleUp(index: number): void {
    const item = this.items[index];

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.items[parentIndex];

      if (parent.priority <= item.priority) {
        break;
      }

      this.items[parentIndex] = item;
      this.items[index] = parent;
      index = parentIndex;
    }
  }

  /**
   * Moves an element down the heap until the heap property is satisfied.
   * @param index The index of the element to bubble down.
   */
  private bubbleDown(index: number): void {
    const item = this.items[index];
    const length = this.items.length;

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestChildIndex = index;

      // Find the smallest child
      if (
        leftChildIndex < length &&
        this.items[leftChildIndex].priority <
          this.items[smallestChildIndex].priority
      ) {
        smallestChildIndex = leftChildIndex;
      }

      if (
        rightChildIndex < length &&
        this.items[rightChildIndex].priority <
          this.items[smallestChildIndex].priority
      ) {
        smallestChildIndex = rightChildIndex;
      }

      if (smallestChildIndex === index) {
        break;
      }

      // Swap with the smallest child
      this.items[index] = this.items[smallestChildIndex];
      this.items[smallestChildIndex] = item;
      index = smallestChildIndex;
    }
  }

  /**
   * Moves an element down the heap until the heap property is satisfied (for a copy array).
   * @param array The array to operate on.
   * @param index The index of the element to bubble down.
   */
  private bubbleDownArray(
    array: Array<{ item: T; priority: number }>,
    index: number,
  ): void {
    const item = array[index];
    const length = array.length;

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestChildIndex = index;

      if (
        leftChildIndex < length &&
        array[leftChildIndex].priority < array[smallestChildIndex].priority
      ) {
        smallestChildIndex = leftChildIndex;
      }

      if (
        rightChildIndex < length &&
        array[rightChildIndex].priority < array[smallestChildIndex].priority
      ) {
        smallestChildIndex = rightChildIndex;
      }

      if (smallestChildIndex === index) {
        break;
      }

      array[index] = array[smallestChildIndex];
      array[smallestChildIndex] = item;
      index = smallestChildIndex;
    }
  }
}

/**
 * Implementation of a delay queue.
 * @template T The type of elements stored in the queue.
 */
export class DelayQueue<T> implements IDelayQueue<T> {
  private items: Array<{ item: T; readyTime: number }> = [];
  private maxSize?: number;

  /**
   * Creates a new DelayQueue instance.
   * @param maxSize Optional maximum size of the queue.
   */
  constructor(maxSize?: number) {
    this.maxSize = maxSize;
  }

  /**
   * Adds an element to the queue with a specified delay.
   * @param item The item to enqueue.
   * @param delayMs The delay in milliseconds before the item becomes available.
   * @returns The updated queue size, or -1 if the queue is full.
   */
  public enqueue(item: T, delayMs: number): number {
    if (this.maxSize !== undefined && this.items.length >= this.maxSize) {
      return -1; // Queue is full
    }

    const readyTime = Date.now() + delayMs;

    // Insert in sorted order by ready time
    const index = this.findInsertionIndex(readyTime);
    this.items.splice(index, 0, { item, readyTime });

    return this.items.length;
  }

  /**
   * Removes and returns elements that are ready (delay has passed).
   * @returns An array of items that are ready, or empty array if none are ready.
   */
  public dequeueReady(): T[] {
    const now = Date.now();
    const ready: T[] = [];

    while (this.items.length > 0 && this.items[0].readyTime <= now) {
      ready.push(this.items.shift()!.item);
    }

    return ready;
  }

  /**
   * Returns the next element that will be ready without removing it.
   * @returns The next item that will be ready or undefined if the queue is empty.
   */
  public peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[0].item;
  }

  /**
   * Returns the time in milliseconds until the next item is ready.
   * @returns The time in milliseconds, or -1 if the queue is empty.
   */
  public timeUntilNext(): number {
    if (this.isEmpty()) {
      return -1;
    }

    const timeLeft = this.items[0].readyTime - Date.now();
    return Math.max(0, timeLeft);
  }

  /**
   * Returns the current size of the queue.
   * @returns The number of elements in the queue.
   */
  public size(): number {
    return this.items.length;
  }

  /**
   * Checks if the queue is empty.
   * @returns True if the queue is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Checks if the queue is full.
   * @returns True if the queue is full, false otherwise.
   */
  public isFull(): boolean {
    return this.maxSize !== undefined && this.items.length >= this.maxSize;
  }

  /**
   * Clears all elements from the queue.
   */
  public clear(): void {
    this.items = [];
  }

  /**
   * Returns all elements in the queue without removing them.
   * @returns An array containing all elements in the queue, sorted by ready time.
   */
  public toArray(): T[] {
    return this.items.map(item => item.item);
  }

  /**
   * Finds the index where a new item should be inserted to maintain sorted order.
   * @param readyTime The ready time of the new item.
   * @returns The index where the item should be inserted.
   */
  private findInsertionIndex(readyTime: number): number {
    let low = 0;
    let high = this.items.length;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.items[mid].readyTime > readyTime) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }

    return low;
  }
}

/**
 * Utility class for working with queue-like data structures.
 */
export class QueueUtils {
  /**
   * Creates a new Queue instance.
   * @template T The type of elements to be stored in the queue.
   * @param {object} [params] - The parameters for the method.
   * @param {T[]} [params.initialItems] - Optional array of items to initialize the queue with.
   * @param {number} [params.maxSize] - Optional maximum size of the queue.
   * @returns {IQueue<T>} A new Queue instance.
   * @example
   * const queue = QueueUtils.createQueue<number>({ initialItems: [1, 2, 3] });
   * console.log(queue.peek()); // 1
   *
   * // Create a bounded queue with maximum size
   * const boundedQueue = QueueUtils.createQueue<number>({ maxSize: 5 });
   */
  public static createQueue<T>({
    initialItems,
    maxSize,
  }: { initialItems?: T[]; maxSize?: number } = {}): IQueue<T> {
    return new Queue<T>(initialItems, maxSize);
  }

  /**
   * Creates a new Stack instance.
   * @template T The type of elements to be stored in the stack.
   * @param {object} [params] - The parameters for the method.
   * @param {T[]} [params.initialItems] - Optional array of items to initialize the stack with.
   * @param {number} [params.maxSize] - Optional maximum size of the stack.
   * @returns {IStack<T>} A new Stack instance.
   * @example
   * const stack = QueueUtils.createStack<string>({ initialItems: ['a', 'b', 'c'] });
   * console.log(stack.peek()); // 'c'
   *
   * // Create a bounded stack with maximum size
   * const boundedStack = QueueUtils.createStack<string>({ maxSize: 10 });
   */
  public static createStack<T>({
    initialItems,
    maxSize,
  }: { initialItems?: T[]; maxSize?: number } = {}): IStack<T> {
    return new Stack<T>(initialItems, maxSize);
  }

  /**
   * Creates a new MultiQueue instance.
   * @template T The type of elements to be stored in the multi-queue.
   * @param {object} [params] - The parameters for the method.
   * @param {Record<string | number, T[]>} [params.initialItems] - Optional object mapping channels to arrays of items.
   * @param {Record<string | number, number>} [params.channelMaxSizes] - Optional object mapping channels to their maximum sizes.
   * @param {number} [params.defaultMaxSize] - Optional default maximum size for all channels.
   * @returns {IMultiQueue<T>} A new MultiQueue instance.
   * @example
   * const multiQueue = QueueUtils.createMultiQueue<number>({
   *   initialItems: {
   *     high: [1, 2],
   *     low: [3, 4]
   *   }
   * });
   * console.log(multiQueue.peek('high')); // 1
   *
   * // Create a bounded multi-queue with different sizes per channel
   * const boundedMultiQueue = QueueUtils.createMultiQueue<number>({
   *   channelMaxSizes: {
   *     high: 10,
   *     medium: 20,
   *     low: 50
   *   },
   *   defaultMaxSize: 30
   * });
   */
  public static createMultiQueue<T>({
    initialItems,
    channelMaxSizes,
    defaultMaxSize,
  }: {
    initialItems?: Record<string | number, T[]>;
    channelMaxSizes?: Record<string | number, number>;
    defaultMaxSize?: number;
  } = {}): IMultiQueue<T> {
    return new MultiQueue<T>(initialItems, channelMaxSizes, defaultMaxSize);
  }

  /**
   * Creates a new CircularBuffer instance.
   * @template T The type of elements to be stored in the buffer.
   * @param {object} params - The parameters for the method.
   * @param {number} params.capacity - The maximum capacity of the buffer.
   * @returns {CircularBuffer<T>} A new CircularBuffer instance.
   * @example
   * const buffer = QueueUtils.createCircularBuffer<number>({ capacity: 5 });
   * buffer.add(1);
   * buffer.add(2);
   * console.log(buffer.peek()); // 1
   */
  public static createCircularBuffer<T>({
    capacity,
  }: {
    capacity: number;
  }): CircularBuffer<T> {
    return new CircularBuffer<T>(capacity);
  }

  /**
   * Creates a new PriorityQueue instance.
   * @template T The type of elements to be stored in the priority queue.
   * @param {object} [params] - The parameters for the method.
   * @param {number} [params.maxSize] - Optional maximum size of the queue.
   * @returns {IPriorityQueue<T>} A new PriorityQueue instance.
   * @example
   * const priorityQueue = QueueUtils.createPriorityQueue<string>();
   * priorityQueue.enqueue('medium task', 5);
   * priorityQueue.enqueue('urgent task', 1);
   * priorityQueue.enqueue('low task', 10);
   * console.log(priorityQueue.dequeue()); // 'urgent task'
   */
  public static createPriorityQueue<T>({
    maxSize,
  }: { maxSize?: number } = {}): IPriorityQueue<T> {
    return new PriorityQueue<T>(maxSize);
  }

  /**
   * Creates a new DelayQueue instance.
   * @template T The type of elements to be stored in the delay queue.
   * @param {object} [params] - The parameters for the method.
   * @param {number} [params.maxSize] - Optional maximum size of the queue.
   * @returns {IDelayQueue<T>} A new DelayQueue instance.
   * @example
   * const delayQueue = QueueUtils.createDelayQueue<string>();
   * delayQueue.enqueue('process after 1s', 1000);
   * delayQueue.enqueue('process after 500ms', 500);
   *
   * // Later...
   * const readyItems = delayQueue.dequeueReady();
   * console.log(readyItems); // ['process after 500ms', 'process after 1s']
   */
  public static createDelayQueue<T>({
    maxSize,
  }: { maxSize?: number } = {}): IDelayQueue<T> {
    return new DelayQueue<T>(maxSize);
  }
}
