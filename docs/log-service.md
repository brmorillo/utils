# LogService

The LogService provides a configurable logging system with support for multiple logging providers (Pino, Winston, Console).

## Basic Usage

```javascript
import { Utils } from '@brmorillo/utils';

// Initialize with default configuration (Pino logger)
const utils = Utils.getInstance();
const logger = utils.getLogger();

// Log messages with different levels
logger.info('This is an info message');
logger.warn('This is a warning message');
logger.error('This is an error message', { code: 500 });
logger.debug('This is a debug message');
```

## Configuration

You can configure the logger when initializing the Utils instance:

```javascript
const utils = Utils.getInstance({
  logger: {
    type: 'winston',
    level: 'debug',
    prettyPrint: true
  }
});
```

Or reconfigure it later:

```javascript
utils.configure({
  logger: {
    type: 'console',
    level: 'info'
  }
});
```

### Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `type` | string | Logger type ('pino', 'winston', or 'console') | 'pino' |
| `level` | string | Log level ('error', 'warn', 'info', or 'debug') | 'info' |
| `prettyPrint` | boolean | Format logs for better readability | false |

## Methods

### info(message, ...meta)

Logs an info message.

```javascript
logger.info('User logged in', { userId: '123' });
```

### warn(message, ...meta)

Logs a warning message.

```javascript
logger.warn('Rate limit approaching', { current: 80, limit: 100 });
```

### error(message, ...meta)

Logs an error message.

```javascript
logger.error('Database connection failed', { error: err });
```

### debug(message, ...meta)

Logs a debug message.

```javascript
logger.debug('Function execution time', { time: '10ms' });
```

## Examples

### Example 1: Basic Logging

```javascript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance();
const logger = utils.getLogger();

logger.info('Application started');
logger.warn('Configuration file not found, using defaults');
logger.error('Failed to connect to database', { 
  host: 'localhost', 
  port: 5432, 
  error: 'Connection refused' 
});
```

### Example 2: Configuring Different Logger Types

```javascript
import { Utils } from '@brmorillo/utils';

// Using Winston logger
const utils = Utils.getInstance({
  logger: {
    type: 'winston',
    level: 'debug',
    prettyPrint: true
  }
});

const logger = utils.getLogger();
logger.debug('Debugging with Winston');

// Switch to Console logger
utils.configure({
  logger: {
    type: 'console',
    level: 'info'
  }
});

logger.info('Now using Console logger');
```

### Example 3: Structured Logging

```javascript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance();
const logger = utils.getLogger();

// Log with structured metadata
function processOrder(order) {
  logger.info('Processing order', { 
    orderId: order.id,
    customer: order.customer,
    items: order.items.length,
    total: order.total
  });
  
  // Business logic...
  
  if (order.total > 1000) {
    logger.warn('Large order detected', { orderId: order.id, total: order.total });
  }
  
  try {
    // More business logic...
  } catch (error) {
    logger.error('Order processing failed', { 
      orderId: order.id, 
      error: error.message,
      stack: error.stack
    });
  }
}
```

For more detailed examples and advanced usage, see the [complete LogService documentation](./log-service-detailed.md).