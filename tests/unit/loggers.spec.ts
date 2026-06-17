import { ConsoleLogger } from '../../src/loggers/console-logger';
import { PinoLogger } from '../../src/loggers/pino-logger';
import { WinstonLogger } from '../../src/loggers/winston-logger';

/**
 * Unit tests for the concrete logger implementations.
 * These tests execute the real code paths of each logger so that the level
 * filtering logic and the third-party adapters (pino, winston) are exercised.
 */
describe('Loggers', () => {
  describe('ConsoleLogger', () => {
    let infoSpy: jest.SpyInstance;
    let warnSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;
    let debugSpy: jest.SpyInstance;

    beforeEach(() => {
      // Arrange: silence and observe the console methods.
      infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      debugSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should log all levels when the level is debug', () => {
      // Arrange
      const logger = new ConsoleLogger('debug');

      // Act
      logger.info('info message', { a: 1 });
      logger.warn('warn message');
      logger.error('error message');
      logger.debug('debug message');

      // Assert
      expect(infoSpy).toHaveBeenCalledWith('[INFO] info message', { a: 1 });
      expect(warnSpy).toHaveBeenCalledWith('[WARN] warn message');
      expect(errorSpy).toHaveBeenCalledWith('[ERROR] error message');
      expect(debugSpy).toHaveBeenCalledWith('[DEBUG] debug message');
    });

    it('should default to info level and suppress debug', () => {
      // Arrange
      const logger = new ConsoleLogger();

      // Act
      logger.info('info message');
      logger.debug('debug message');

      // Assert
      expect(infoSpy).toHaveBeenCalledWith('[INFO] info message');
      expect(debugSpy).not.toHaveBeenCalled();
    });

    it('should only log error and warn when the level is warn', () => {
      // Arrange
      const logger = new ConsoleLogger('warn');

      // Act
      logger.error('error message');
      logger.warn('warn message');
      logger.info('info message');
      logger.debug('debug message');

      // Assert
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).not.toHaveBeenCalled();
      expect(debugSpy).not.toHaveBeenCalled();
    });

    it('should only log error when the level is error', () => {
      // Arrange
      const logger = new ConsoleLogger('error');

      // Act
      logger.error('error message');
      logger.warn('warn message');
      logger.info('info message');
      logger.debug('debug message');

      // Assert
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(debugSpy).not.toHaveBeenCalled();
    });
  });

  describe('PinoLogger', () => {
    it('should log all levels without throwing', () => {
      // Arrange: prettyPrint is disabled to avoid transport requirements.
      const logger = new PinoLogger({ level: 'debug', prettyPrint: false });

      // Act / Assert
      expect(() => {
        logger.info('info message', { context: 'test' });
        logger.warn('warn message');
        logger.error('error message', new Error('boom'));
        logger.debug('debug message');
      }).not.toThrow();
    });

    it('should construct with default options without throwing', () => {
      // Act / Assert
      expect(() => {
        const logger = new PinoLogger();
        logger.info('default message');
      }).not.toThrow();
    });

    it('should construct with prettyPrint enabled without throwing', () => {
      // Arrange: pino-pretty is installed, so the transport branch is exercised.
      const logger = new PinoLogger({ level: 'debug', prettyPrint: true });

      // Act / Assert
      expect(() => {
        logger.info('pretty info message', { id: 1 });
        logger.warn('pretty warn message');
        logger.error('pretty error message');
        logger.debug('pretty debug message');
      }).not.toThrow();
    });

    it('should fall back to a console logger when pino is not available', () => {
      // Arrange: force the dynamic require of 'pino' to fail so the catch
      // branch installs the console-backed fallback logger.
      const infoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => undefined);
      const warnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const debugSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);

      jest.isolateModules(() => {
        jest.doMock('pino', () => {
          throw new Error('not installed');
        });

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PinoLogger: FreshPinoLogger } = require('../../src/loggers/pino-logger');
        const logger = new FreshPinoLogger({ level: 'debug' });

        // Act
        expect(() => {
          logger.info('info message', { a: 1 });
          logger.warn('warn message');
          logger.error('error message');
          logger.debug('debug message');
        }).not.toThrow();

        jest.dontMock('pino');
      });

      // Assert: the fallback routes through console.* with the formatted prefix.
      expect(infoSpy).toHaveBeenCalledWith('[INFO] info message', {
        meta: [{ a: 1 }],
      });
      expect(warnSpy).toHaveBeenCalledWith('[WARN] warn message', { meta: [] });
      expect(errorSpy).toHaveBeenCalledWith('[ERROR] error message', {
        meta: [],
      });
      expect(debugSpy).toHaveBeenCalledWith('[DEBUG] debug message', {
        meta: [],
      });

      jest.restoreAllMocks();
    });
  });

  describe('WinstonLogger', () => {
    it('should log all levels without throwing', () => {
      // Arrange
      const logger = new WinstonLogger({ level: 'debug', prettyPrint: false });

      // Act / Assert
      expect(() => {
        logger.info('info message', { context: 'test' });
        logger.warn('warn message');
        logger.error('error message');
        logger.debug('debug message');
      }).not.toThrow();
    });

    it('should construct with prettyPrint enabled without throwing', () => {
      // Arrange
      const logger = new WinstonLogger({ level: 'info', prettyPrint: true });

      // Act / Assert
      expect(() => {
        logger.info('pretty info message', { id: 1 });
      }).not.toThrow();
    });

    it('should construct with default options without throwing', () => {
      // Act / Assert
      expect(() => {
        const logger = new WinstonLogger();
        logger.info('default message');
      }).not.toThrow();
    });

    it('should fall back to a console logger when winston is not available', () => {
      // Arrange: force the dynamic require of 'winston' to fail so the catch
      // branch installs the console-backed fallback logger.
      const infoSpy = jest
        .spyOn(console, 'info')
        .mockImplementation(() => undefined);
      const warnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const debugSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);

      jest.isolateModules(() => {
        jest.doMock('winston', () => {
          throw new Error('not installed');
        });

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {
          WinstonLogger: FreshWinstonLogger,
        } = require('../../src/loggers/winston-logger');
        const logger = new FreshWinstonLogger({ level: 'debug' });

        // Act
        expect(() => {
          logger.info('info message', { a: 1 });
          logger.warn('warn message');
          logger.error('error message');
          logger.debug('debug message');
        }).not.toThrow();

        jest.dontMock('winston');
      });

      // Assert: the fallback routes through console.* with the formatted prefix.
      expect(infoSpy).toHaveBeenCalledWith('[INFO] info message', { a: 1 });
      expect(warnSpy).toHaveBeenCalledWith('[WARN] warn message');
      expect(errorSpy).toHaveBeenCalledWith('[ERROR] error message');
      expect(debugSpy).toHaveBeenCalledWith('[DEBUG] debug message');

      jest.restoreAllMocks();
    });
  });
});
