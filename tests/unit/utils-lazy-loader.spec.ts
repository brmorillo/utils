import { LazyLoader } from '../../src/utils/lazy-loader';

/**
 * Unit tests for the LazyLoader class.
 * These tests verify lazy creation, load state tracking, reset
 * and both the instance and static async accessors.
 */
describe('LazyLoader', () => {
  describe('get', () => {
    it('should create the instance lazily only once', () => {
      // Arrange
      const factory = jest.fn(() => ({ id: 1 }));
      const loader = new LazyLoader(factory);

      // Act
      const first = loader.get();
      const second = loader.get();

      // Assert
      expect(factory).toHaveBeenCalledTimes(1);
      expect(first).toBe(second);
      expect(first).toEqual({ id: 1 });
    });

    it('should not call the factory before get is invoked', () => {
      // Arrange
      const factory = jest.fn(() => 'value');

      // Act
      new LazyLoader(factory);

      // Assert
      expect(factory).not.toHaveBeenCalled();
    });
  });

  describe('isLoaded', () => {
    it('should be false before the instance is created', () => {
      // Arrange
      const loader = new LazyLoader(() => 'value');

      // Act & Assert
      expect(loader.isLoaded()).toBe(false);
    });

    it('should be true after the instance is created', () => {
      // Arrange
      const loader = new LazyLoader(() => 'value');

      // Act
      loader.get();

      // Assert
      expect(loader.isLoaded()).toBe(true);
    });
  });

  describe('reset', () => {
    it('should force the instance to be recreated on next get', () => {
      // Arrange
      const factory = jest.fn(() => ({ value: Math.random() }));
      const loader = new LazyLoader(factory);
      const first = loader.get();

      // Act
      loader.reset();
      const second = loader.get();

      // Assert
      expect(loader.isLoaded()).toBe(true);
      expect(factory).toHaveBeenCalledTimes(2);
      expect(second).not.toBe(first);
    });

    it('should report not loaded immediately after reset', () => {
      // Arrange
      const loader = new LazyLoader(() => 'value');
      loader.get();

      // Act
      loader.reset();

      // Assert
      expect(loader.isLoaded()).toBe(false);
    });
  });

  describe('getAsync (instance)', () => {
    it('should resolve with the lazily created instance', async () => {
      // Arrange
      const factory = jest.fn(() => 'async-value');
      const loader = new LazyLoader(factory);

      // Act
      const result = await loader.getAsync();

      // Assert
      expect(result).toBe('async-value');
      expect(loader.isLoaded()).toBe(true);
    });

    it('should create the instance only once across concurrent calls', async () => {
      // Arrange
      const factory = jest.fn(() => ({ id: 1 }));
      const loader = new LazyLoader(factory);

      // Act
      const [a, b] = await Promise.all([loader.getAsync(), loader.getAsync()]);

      // Assert
      expect(factory).toHaveBeenCalledTimes(1);
      expect(a).toBe(b);
    });

    it('should return the existing instance synchronously when already loaded', async () => {
      // Arrange
      const factory = jest.fn(() => 'value');
      const loader = new LazyLoader(factory);
      loader.get();

      // Act
      const result = await loader.getAsync();

      // Assert
      expect(result).toBe('value');
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAsync (static)', () => {
    it('should resolve the value from the async factory', async () => {
      // Arrange
      const asyncFactory = jest.fn(async () => 'static-async');

      // Act
      const result = await LazyLoader.getAsync(asyncFactory);

      // Assert
      expect(result).toBe('static-async');
      expect(asyncFactory).toHaveBeenCalledTimes(1);
    });
  });
});
