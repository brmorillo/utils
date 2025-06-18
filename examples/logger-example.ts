import { Utils } from '../src';

// Example 1: Initialize with default configuration (Pino logger)
const utils = Utils.getInstance();
const logger = utils.getLogger();

logger.info('This is an info message with default Pino logger');
logger.warn('This is a warning message');
logger.error('This is an error message', { code: 500 });
logger.debug("This debug message won't show with default level");

// Example 2: Reconfigure to use Winston logger with pretty printing
utils.configure({
  logger: {
    type: 'winston',
    level: 'debug',
    prettyPrint: true,
  },
});

logger.info('Now using Winston logger');
logger.debug('Debug messages are now visible');

// Example 3: Reconfigure to use Console logger
utils.configure({
  logger: {
    type: 'console',
    level: 'debug',
  },
});

logger.info('Now using Console logger');
logger.debug('Debug messages are still visible');
logger.error('Error with metadata', {
  error: new Error('Something went wrong'),
});

// Example 4: Create a new instance with specific configuration
const anotherUtils = Utils.getInstance({
  logger: {
    type: 'pino',
    level: 'error',
    prettyPrint: true,
  },
});

// This will return the same instance as Utils is a singleton
const anotherLogger = anotherUtils.getLogger();
anotherLogger.info("This info message won't show with error level");
anotherLogger.error('Only error messages will show');
