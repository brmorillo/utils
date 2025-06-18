/**
 * A type-safe event emitter implementation for implementing the observer pattern.
 */
export class EventUtils {
  /**
   * Creates a new event emitter instance.
   * @returns {EventEmitter} A new event emitter instance.
   * @example
   * const emitter = EventUtils.createEmitter();
   * 
   * // Subscribe to an event
   * const unsubscribe = emitter.on('userLoggedIn', (user) => {
   *   console.log(`User logged in: ${user.name}`);
   * });
   * 
   * // Emit an event
   * emitter.emit('userLoggedIn', { id: 1, name: 'John' });
   * 
   * // Unsubscribe from the event
   * unsubscribe();
   */
  public static createEmitter(): EventEmitter {
    return new EventEmitter();
  }
}

/**
 * Type definition for event handlers.
 */
export type EventHandler<T = any> = (data: T) => void;

/**
 * Type definition for the unsubscribe function.
 */
export type Unsubscribe = () => void;

/**
 * A type-safe event emitter implementation.
 */
export class EventEmitter {
  private events: Map<string, Set<EventHandler>> = new Map();

  /**
   * Subscribes to an event.
   * @param {string} eventName - The name of the event to subscribe to.
   * @param {EventHandler<T>} handler - The event handler function.
   * @returns {Unsubscribe} A function to unsubscribe from the event.
   * @example
   * const unsubscribe = emitter.on('dataLoaded', (data) => {
   *   console.log('Data loaded:', data);
   * });
   * 
   * // Later, when you want to unsubscribe
   * unsubscribe();
   */
  public on<T>(eventName: string, handler: EventHandler<T>): Unsubscribe {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    const handlers = this.events.get(eventName)!;
    handlers.add(handler as EventHandler);

    return () => {
      this.off(eventName, handler);
    };
  }

  /**
   * Subscribes to an event and automatically unsubscribes after the first occurrence.
   * @param {string} eventName - The name of the event to subscribe to.
   * @param {EventHandler<T>} handler - The event handler function.
   * @returns {Unsubscribe} A function to unsubscribe from the event.
   * @example
   * const unsubscribe = emitter.once('serverResponse', (response) => {
   *   console.log('Response received:', response);
   * });
   */
  public once<T>(eventName: string, handler: EventHandler<T>): Unsubscribe {
    const wrappedHandler = ((data: T) => {
      this.off(eventName, wrappedHandler as EventHandler<T>);
      handler(data);
    }) as EventHandler;

    return this.on(eventName, wrappedHandler);
  }

  /**
   * Unsubscribes from an event.
   * @param {string} eventName - The name of the event to unsubscribe from.
   * @param {EventHandler} handler - The event handler function to remove.
   * @example
   * emitter.off('dataLoaded', handleDataLoaded);
   */
  public off<T>(eventName: string, handler: EventHandler<T>): void {
    const handlers = this.events.get(eventName);
    if (!handlers) return;

    handlers.delete(handler as EventHandler);

    if (handlers.size === 0) {
      this.events.delete(eventName);
    }
  }

  /**
   * Emits an event with data.
   * @param {string} eventName - The name of the event to emit.
   * @param {T} data - The data to pass to the event handlers.
   * @example
   * emitter.emit('userLoggedIn', { id: 1, name: 'John' });
   */
  public emit<T>(eventName: string, data: T): void {
    const handlers = this.events.get(eventName);
    if (!handlers) return;

    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for "${eventName}":`, error);
      }
    });
  }

  /**
   * Checks if an event has any subscribers.
   * @param {string} eventName - The name of the event to check.
   * @returns {boolean} `true` if the event has subscribers, otherwise `false`.
   * @example
   * if (emitter.hasListeners('dataLoaded')) {
   *   console.log('Someone is listening for data loaded events');
   * }
   */
  public hasListeners(eventName: string): boolean {
    const handlers = this.events.get(eventName);
    return !!handlers && handlers.size > 0;
  }

  /**
   * Returns the number of subscribers for an event.
   * @param {string} eventName - The name of the event to check.
   * @returns {number} The number of subscribers.
   * @example
   * const count = emitter.listenerCount('dataLoaded');
   * console.log(`There are ${count} listeners for dataLoaded events`);
   */
  public listenerCount(eventName: string): number {
    const handlers = this.events.get(eventName);
    return handlers ? handlers.size : 0;
  }

  /**
   * Returns an array of all event names that have subscribers.
   * @returns {string[]} An array of event names.
   * @example
   * const eventNames = emitter.eventNames();
   * console.log('Active events:', eventNames);
   */
  public eventNames(): string[] {
    return Array.from(this.events.keys());
  }

  /**
   * Removes all event listeners.
   * @param {string} [eventName] - Optional event name. If provided, only listeners for this event are removed.
   * @example
   * // Remove all listeners for a specific event
   * emitter.removeAllListeners('dataLoaded');
   * 
   * // Remove all listeners for all events
   * emitter.removeAllListeners();
   */
  public removeAllListeners(eventName?: string): void {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
}