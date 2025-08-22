# LogService - Detailed Documentation

This document provides detailed information about the LogService, including all available methods, configuration options, and advanced usage examples.

## Architecture

The LogService uses a provider-based architecture:

- `LogService`: The main service that provides a unified logging interface
- `ILogger`: Interface that all logger implementations must follow
- Logger implementations:
  - `PinoLogger`: Implementation using Pino
  - `WinstonLogger`: Implementation using Winston
  - `ConsoleLogger`: Implementation using native console methods

## Configuration Options

### LoggerOptions

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `type` | LoggerType | Logger type ('pino', 'winston', or 'console') | 'pino' |
| `level` | string | Log level ('error', 'warn', 'info', or 'debug') | 'info' |
| `prettyPrint` | boolean | Format logs for better readability | false |

### LoggerType

```typescript
type LoggerType = 'pino' | 'winston' | 'console';
```

## Methods

### info(message, ...meta)

Logs an info message.

**Parameters:**
- `message`: string - The message to log
- `...meta`: any[] - Additional metadata to include in the log

**Example:**
```javascript
logger.info('User registered', { userId: '123', email: 'user@example.com' });
```

### warn(message, ...meta)

Logs a warning message.

**Parameters:**
- `message`: string - The message to log
- `...meta`: any[] - Additional metadata to include in the log

**Example:**
```javascript
logger.warn('API rate limit at 80%', { endpoint: '/users', current: 80, limit: 100 });
```

### error(message, ...meta)

Logs an error message.

**Parameters:**
- `message`: string - The message to log
- `...meta`: any[] - Additional metadata to include in the log

**Example:**
```javascript
try {
  // Some code that might throw
} catch (err) {
  logger.error('Operation failed', { 
    operation: 'processPayment', 
    error: err.message,
    stack: err.stack
  });
}
```

### debug(message, ...meta)

Logs a debug message.

**Parameters:**
- `message`: string - The message to log
- `...meta`: any[] - Additional metadata to include in the log

**Example:**
```javascript
logger.debug('Function execution details', { 
  function: 'calculateTotal', 
  input: { items: 5 }, 
  output: 125.50,
  executionTime: '45ms'
});
```

## Advanced Examples

### Example 1: Custom Logger Configuration

```javascript
import { Utils, LogService } from '@brmorillo/utils';

// Get direct access to LogService
const logService = LogService.getInstance({
  type: 'pino',
  level: 'debug',
  prettyPrint: true
});

// Log with different levels
logService.debug('Debug message');
logService.info('Info message');
logService.warn('Warning message');
logService.error('Error message');

// Reconfigure the logger
logService.configure({
  type: 'winston',
  level: 'info'
});
```

### Example 2: Contextual Logging

```javascript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance();
const logger = utils.getLogger();

function processUserRequest(userId, action) {
  // Add context to all logs within this function
  const contextLogger = {
    info: (message, ...meta) => logger.info(message, { userId, action, ...meta }),
    warn: (message, ...meta) => logger.warn(message, { userId, action, ...meta }),
    error: (message, ...meta) => logger.error(message, { userId, action, ...meta }),
    debug: (message, ...meta) => logger.debug(message, { userId, action, ...meta })
  };
  
  contextLogger.info('Processing user request');
  
  // Business logic...
  
  contextLogger.debug('Request processed successfully');
}

processUserRequest('user-123', 'download-report');
```

### Example 3: Logging in Different Environments

```javascript
import { Utils } from '@brmorillo/utils';

// Configure based on environment
const environment = process.env.NODE_ENV || 'development';

const loggerConfig = {
  development: {
    type: 'console',
    level: 'debug',
    prettyPrint: true
  },
  test: {
    type: 'pino',
    level: 'info',
    prettyPrint: false
  },
  production: {
    type: 'winston',
    level: 'warn',
    prettyPrint: false
  }
};

const utils = Utils.getInstance({
  logger: loggerConfig[environment]
});

const logger = utils.getLogger();
logger.info(`Application started in ${environment} mode`);
```

### Example 4: Error Handling with Logging

```javascript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance();
const logger = utils.getLogger();

async function fetchData(url) {
  try {
    logger.debug('Fetching data', { url });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      logger.warn('Non-OK response', { 
        url, 
        status: response.status, 
        statusText: response.statusText 
      });
      
      if (response.status >= 500) {
        logger.error('Server error', { url, status: response.status });
        throw new Error(`Server error: ${response.status}`);
      }
    }
    
    const data = await response.json();
    logger.info('Data fetched successfully', { url, dataSize: JSON.stringify(data).length });
    
    return data;
  } catch (error) {
    logger.error('Failed to fetch data', { 
      url, 
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
```

## Implementation Details

### Pino Logger

The Pino logger implementation uses the [pino](https://github.com/pinojs/pino) package for high-performance logging. It's the default logger and provides excellent performance with low overhead.

### Winston Logger

The Winston logger implementation uses the [winston](https://github.com/winstonjs/winston) package, which provides a highly configurable logging system with support for multiple transports.

### Console Logger

The Console logger implementation uses the native `console` methods for logging. It's the simplest option and doesn't require any external dependencies.