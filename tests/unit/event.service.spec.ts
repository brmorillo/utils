import { EventUtils, EventEmitter } from '../../src/services/event.service';

/**
 * Unit tests for the EventUtils class and the EventEmitter.
 * These tests verify the behavior of each public method individually.
 */
describe('EventUtils', () => {
  describe('createEmitter', () => {
    it('should create a new EventEmitter instance', () => {
      // Arrange & Act
      const emitter = EventUtils.createEmitter();

      // Assert
      expect(emitter).toBeInstanceOf(EventEmitter);
    });
  });
});

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe('on / emit', () => {
    it('should call a subscribed handler when the event is emitted', () => {
      // Arrange
      const handler = jest.fn();
      emitter.on('test', handler);

      // Act
      emitter.emit('test', { value: 42 });

      // Assert
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ value: 42 });
    });

    it('should call multiple handlers for the same event', () => {
      // Arrange
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      emitter.on('test', handler1);
      emitter.on('test', handler2);

      // Act
      emitter.emit('test', 'data');

      // Assert
      expect(handler1).toHaveBeenCalledWith('data');
      expect(handler2).toHaveBeenCalledWith('data');
    });

    it('should do nothing when emitting an event with no subscribers', () => {
      // Arrange & Act & Assert
      expect(() => emitter.emit('noListeners', 'data')).not.toThrow();
    });

    it('should return an unsubscribe function from on', () => {
      // Arrange
      const handler = jest.fn();
      const unsubscribe = emitter.on('test', handler);

      // Act
      unsubscribe();
      emitter.emit('test', 'data');

      // Assert
      expect(handler).not.toHaveBeenCalled();
    });

    it('should isolate errors thrown by a handler and still call the others', () => {
      // Arrange
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const failing = jest.fn(() => {
        throw new Error('handler failed');
      });
      const succeeding = jest.fn();
      emitter.on('test', failing);
      emitter.on('test', succeeding);

      // Act
      emitter.emit('test', 'data');

      // Assert
      expect(failing).toHaveBeenCalled();
      expect(succeeding).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('once', () => {
    it('should call the handler only once', () => {
      // Arrange
      const handler = jest.fn();
      emitter.once('test', handler);

      // Act
      emitter.emit('test', 'first');
      emitter.emit('test', 'second');

      // Assert
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith('first');
    });

    it('should remove the listener after the first emission', () => {
      // Arrange
      const handler = jest.fn();
      emitter.once('test', handler);

      // Act
      emitter.emit('test', 'data');

      // Assert
      expect(emitter.hasListeners('test')).toBe(false);
    });

    it('should allow unsubscribing before the event fires', () => {
      // Arrange
      const handler = jest.fn();
      const unsubscribe = emitter.once('test', handler);

      // Act
      unsubscribe();
      emitter.emit('test', 'data');

      // Assert
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should remove a specific handler', () => {
      // Arrange
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      emitter.on('test', handler1);
      emitter.on('test', handler2);

      // Act
      emitter.off('test', handler1);
      emitter.emit('test', 'data');

      // Assert
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith('data');
    });

    it('should do nothing when removing a handler from an unknown event', () => {
      // Arrange
      const handler = jest.fn();

      // Act & Assert
      expect(() => emitter.off('unknown', handler)).not.toThrow();
    });

    it('should remove the event entry once the last handler is removed', () => {
      // Arrange
      const handler = jest.fn();
      emitter.on('test', handler);

      // Act
      emitter.off('test', handler);

      // Assert
      expect(emitter.eventNames()).not.toContain('test');
    });
  });

  describe('hasListeners', () => {
    it('should return true when an event has subscribers', () => {
      // Arrange
      emitter.on('test', jest.fn());

      // Act & Assert
      expect(emitter.hasListeners('test')).toBe(true);
    });

    it('should return false when an event has no subscribers', () => {
      // Arrange & Act & Assert
      expect(emitter.hasListeners('missing')).toBe(false);
    });
  });

  describe('listenerCount', () => {
    it('should return the number of subscribers for an event', () => {
      // Arrange
      emitter.on('test', jest.fn());
      emitter.on('test', jest.fn());

      // Act & Assert
      expect(emitter.listenerCount('test')).toBe(2);
    });

    it('should return 0 for an event with no subscribers', () => {
      // Arrange & Act & Assert
      expect(emitter.listenerCount('missing')).toBe(0);
    });
  });

  describe('eventNames', () => {
    it('should return all event names that have subscribers', () => {
      // Arrange
      emitter.on('eventA', jest.fn());
      emitter.on('eventB', jest.fn());

      // Act
      const names = emitter.eventNames();

      // Assert
      expect(names).toContain('eventA');
      expect(names).toContain('eventB');
      expect(names).toHaveLength(2);
    });

    it('should return an empty array when there are no events', () => {
      // Arrange & Act & Assert
      expect(emitter.eventNames()).toEqual([]);
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for a specific event', () => {
      // Arrange
      emitter.on('eventA', jest.fn());
      emitter.on('eventB', jest.fn());

      // Act
      emitter.removeAllListeners('eventA');

      // Assert
      expect(emitter.hasListeners('eventA')).toBe(false);
      expect(emitter.hasListeners('eventB')).toBe(true);
    });

    it('should remove all listeners for all events when no name is given', () => {
      // Arrange
      emitter.on('eventA', jest.fn());
      emitter.on('eventB', jest.fn());

      // Act
      emitter.removeAllListeners();

      // Assert
      expect(emitter.eventNames()).toEqual([]);
    });
  });
});
