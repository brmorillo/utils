# Configuration Guide

This guide explains how to configure the @brmorillo/utils library to suit your needs.

## Basic Configuration

The library can be configured when initializing the `Utils` instance:

```javascript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance({
  logger: {
    // Logger configuration
    type: 'pino',
    level: 'info',
    prettyPrint: true
  },
  http: {
    // HTTP client configuration
    clientType: 'axios',
    baseUrl: 'https://api.example.com',
    defaultHeaders: {
      'Authorization': 'Bearer token'
    },
    timeout: 5000
  },
  storage: {
    // Storage configuration
    providerType: 'local',
    local: {
      basePath: './storage',
      baseUrl: 'http://localhost:3000/files'
    }
  }
});
```

## Reconfiguring Services

You can reconfigure the services at any time:

```javascript
utils.configure({
  logger: {
    type: 'winston',
    level: 'debug'
  },
  http: {
    clientType: 'http',
    baseUrl: 'https://api.example.com/v2'
  },
  storage: {
    providerType: 's3',
    s3: {
      bucket: 'my-bucket',
      region: 'us-east-1'
    }
  }
});
```

## Configuration Options

### Logger Configuration

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `type` | string | Logger type ('pino', 'winston', or 'console') | 'pino' |
| `level` | string | Log level ('error', 'warn', 'info', or 'debug') | 'info' |
| `prettyPrint` | boolean | Format logs for better readability | false |

### HTTP Client Configuration

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `clientType` | string | HTTP client type ('axios' or 'http') | 'axios' |
| `baseUrl` | string | Base URL for all requests | '' |
| `defaultHeaders` | object | Default headers to include in all requests | {} |
| `timeout` | number | Request timeout in milliseconds | undefined |

### Storage Configuration

#### Local Storage

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `providerType` | string | Storage provider type ('local' or 's3') | 'local' |
| `local.basePath` | string | Base directory path for file storage | required |
| `local.baseUrl` | string | Base URL for accessing files | '' |

#### S3 Storage

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `providerType` | string | Storage provider type ('local' or 's3') | 'local' |
| `s3.bucket` | string | S3 bucket name | required |
| `s3.region` | string | AWS region | required |
| `s3.accessKeyId` | string | AWS access key ID | optional |
| `s3.secretAccessKey` | string | AWS secret access key | optional |
| `s3.endpoint` | string | Custom S3 endpoint | optional |
| `s3.forcePathStyle` | boolean | Use path-style URLs | optional |
| `s3.baseUrl` | string | Custom base URL for files | optional |

## Environment-Based Configuration

You can configure the library based on the environment:

```javascript
import { Utils } from '@brmorillo/utils';

// Get environment
const env = process.env.NODE_ENV || 'development';

// Environment-specific configurations
const configs = {
  development: {
    logger: {
      type: 'console',
      level: 'debug',
      prettyPrint: true
    },
    http: {
      clientType: 'axios',
      baseUrl: 'http://localhost:3000/api'
    },
    storage: {
      providerType: 'local',
      local: {
        basePath: './storage'
      }
    }
  },
  production: {
    logger: {
      type: 'pino',
      level: 'info',
      prettyPrint: false
    },
    http: {
      clientType: 'axios',
      baseUrl: 'https://api.example.com',
      timeout: 10000
    },
    storage: {
      providerType: 's3',
      s3: {
        bucket: 'my-production-bucket',
        region: 'us-east-1'
      }
    }
  }
};

// Initialize with environment-specific configuration
const utils = Utils.getInstance(configs[env]);
```

## Using Environment Variables

You can use environment variables for sensitive configuration:

```javascript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance({
  http: {
    baseUrl: process.env.API_BASE_URL,
    defaultHeaders: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`
    }
  },
  storage: {
    providerType: 's3',
    s3: {
      bucket: process.env.S3_BUCKET,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  }
});
```

## Direct Service Configuration

You can also configure services directly:

```javascript
import { LogService, HttpService, StorageService } from '@brmorillo/utils';

// Configure logger
const logger = LogService.getInstance({
  type: 'winston',
  level: 'debug'
});

// Configure HTTP client
const http = HttpService.getInstance({
  clientType: 'axios',
  baseUrl: 'https://api.example.com'
});

// Configure storage
const storage = StorageService.getInstance({
  providerType: 'local',
  local: {
    basePath: './storage'
  }
});
```

## Configuration Best Practices

1. **Use environment variables** for sensitive information like API keys and tokens
2. **Create environment-specific configurations** for development, testing, and production
3. **Set appropriate log levels** for each environment (debug for development, info/warn for production)
4. **Configure timeouts** for HTTP requests to prevent hanging requests
5. **Use a configuration file** to centralize your configuration settings