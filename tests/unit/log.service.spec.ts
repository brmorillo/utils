import { LogService } from '../../src/services/log.service';

/**
 * Unit tests for the LogService singleton.
 * These tests use the 'console' logger type and spy on the console methods
 * to assert that messages are emitted and that level filtering is respected.
 *
 * NOTE: LogService is a singleton with shared state, so each relevant test
 * configures the instance explicitly at the start.
 */
describe('LogService', () => {
  let logSpy: jest.SpyInstance;
  let infoSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;

  beforeEach(() => {
    // Arrange: silence and spy on all console methods used by ConsoleLogger
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => {
    // Cleanup: restore the original console methods
    jest.restoreAllMocks();
  });

  // Tests for the getInstance singleton behavior
  describe('getInstance', () => {
    it('should return the same instance on subsequent calls', () => {
      // Arrange & Act
      const first = LogService.getInstance({ type: 'console' });
      const second = LogService.getInstance();

      // Assert
      expect(first).toBe(second);
    });

    it('should return an object exposing the logging methods', () => {
      // Arrange & Act
      const instance = LogService.getInstance({ type: 'console' });

      // Assert
      expect(typeof instance.info).toBe('function');
      expect(typeof instance.warn).toBe('function');
      expect(typeof instance.error).toBe('function');
      expect(typeof instance.debug).toBe('function');
    });
  });

  // Tests for the logging methods using the console logger
  describe('logging methods', () => {
    it('should log an info message through console.info', () => {
      // Arrange
      const service = LogService.getInstance();
      service.configure({ type: 'console', level: 'info' });

      // Act
      service.info('hello info');

      // Assert
      expect(infoSpy).toHaveBeenCalledWith('[INFO] hello info');
    });

    it('should log a warning message through console.warn', () => {
      // Arrange
      const service = LogService.getInstance();
      service.configure({ type: 'console', level: 'info' });

      // Act
      service.warn('hello warn');

      // Assert
      expect(warnSpy).toHaveBeenCalledWith('[WARN] hello warn');
    });

    it('should log an error message through console.error', () => {
      // Arrange
      const service = LogService.getInstance();
      service.configure({ type: 'console', level: 'info' });

      // Act
      service.error('hello error');

      // Assert
      expect(errorSpy).toHaveBeenCalledWith('[ERROR] hello error');
    });

    it('should pass additional metadata to the console method', () => {
      // Arrange
      const service = LogService.getInstance();
      service.configure({ type: 'console', level: 'info' });
      const meta = { userId: 42 };

      // Act
      service.info('with meta', meta);

      // Assert
      expect(infoSpy).toHaveBeenCalledWith('[INFO] with meta', meta);
    });
  });

  // Tests for the configure method and level filtering
  describe('configure and level filtering', () => {
    it('should not log debug messages when the level is info', () => {
      // Arrange
      const service = LogService.getInstance();
      service.configure({ type: 'console', level: 'info' });

      // Act
      service.debug('hidden debug');

      // Assert
      expect(debugSpy).not.toHaveBeenCalled();
    });

    it('should log debug messages when the level is debug', () => {
      // Arrange
      const service = LogService.getInstance();
      service.configure({ type: 'console', level: 'debug' });

      // Act
      service.debug('visible debug');

      // Assert
      expect(debugSpy).toHaveBeenCalledWith('[DEBUG] visible debug');
    });

    it('should only log errors when the level is error', () => {
      // Arrange
      const service = LogService.getInstance();
      service.configure({ type: 'console', level: 'error' });

      // Act
      service.info('hidden info');
      service.warn('hidden warn');
      service.debug('hidden debug');
      service.error('visible error');

      // Assert
      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
      expect(debugSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith('[ERROR] visible error');
    });

    it('should reconfigure the logger so previously filtered levels are emitted', () => {
      // Arrange
      const service = LogService.getInstance();
      service.configure({ type: 'console', level: 'error' });
      service.warn('first warn');
      expect(warnSpy).not.toHaveBeenCalled();

      // Act: reconfigure to a more verbose level
      service.configure({ type: 'console', level: 'warn' });
      service.warn('second warn');

      // Assert
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith('[WARN] second warn');
    });
  });
});
