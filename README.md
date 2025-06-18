# @brmorillo/utils

> If you have a problem, it's probably already solved here.

A comprehensive utility library for JavaScript/TypeScript projects that provides a centralized collection of common utilities and helpers to solve everyday programming challenges.

## Installation

```bash
npm install @brmorillo/utils
```

or

```bash
yarn add @brmorillo/utils
```

or

```bash
pnpm add @brmorillo/utils
```

## Quick Start

```javascript
import { Utils } from '@brmorillo/utils';

// Initialize with default configuration
const utils = Utils.getInstance();

// Get logger
const logger = utils.getLogger();
logger.info('Application started');

// Get HTTP service
const http = utils.getHttpService();
const response = await http.get('https://api.example.com/data');

// Get storage service
const storage = utils.getStorageService();
await storage.uploadFile('path/to/file.txt', 'Hello, world!');
```

## Configuration

The library can be configured with different options:

```javascript
const utils = Utils.getInstance({
  // Logger configuration
  logger: {
    type: 'pino', // 'pino', 'winston', or 'console'
    level: 'debug', // 'error', 'warn', 'info', or 'debug'
    prettyPrint: true, // Format logs for better readability
  },

  // HTTP client configuration
  http: {
    clientType: 'axios', // 'axios' or 'http' (native)
    baseUrl: 'https://api.example.com',
    defaultHeaders: {
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
    },
    timeout: 5000, // Request timeout in milliseconds
  },

  // Storage configuration
  storage: {
    providerType: 'local', // 'local' or 's3'

    // Local storage options (when providerType is 'local')
    local: {
      basePath: './storage',
      baseUrl: 'http://localhost:3000/files',
    },

    // S3 storage options (when providerType is 's3')
    s3: {
      bucket: 'my-bucket',
      region: 'us-east-1',
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      endpoint: 'https://custom-endpoint.com', // Optional
      forcePathStyle: true, // Optional
      baseUrl: 'https://cdn.example.com', // Optional
    },
  },
});

// Reconfigure later if needed
utils.configure({
  logger: {
    type: 'winston',
    level: 'info',
  },
});
```

## NestJS Integration Example

```typescript
// utils.module.ts
import { Module, Global } from '@nestjs/common';
import { Utils } from '@brmorillo/utils';

@Global()
@Module({
  providers: [
    {
      provide: 'UTILS',
      useFactory: () => {
        return Utils.getInstance({
          logger: {
            type: 'pino',
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            prettyPrint: process.env.NODE_ENV !== 'production',
          },
          http: {
            clientType: 'axios',
            baseUrl: process.env.API_BASE_URL,
            defaultHeaders: {
              Authorization: `Bearer ${process.env.API_TOKEN}`,
            },
            timeout: 10000,
          },
          storage: {
            providerType: process.env.STORAGE_PROVIDER || 'local',
            local: {
              basePath: './storage',
              baseUrl: `${process.env.APP_URL}/files`,
            },
            s3: {
              bucket: process.env.S3_BUCKET,
              region: process.env.AWS_REGION,
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          },
        });
      },
    },
  ],
  exports: ['UTILS'],
})
export class UtilsModule {}

// app.module.ts
import { Module } from '@nestjs/common';
import { UtilsModule } from './utils.module';

@Module({
  imports: [UtilsModule],
})
export class AppModule {}

// users.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Utils } from '@brmorillo/utils';

@Injectable()
export class UsersService {
  private logger;
  private http;
  private storage;

  constructor(@Inject('UTILS') private utils: Utils) {
    this.logger = utils.getLogger();
    this.http = utils.getHttpService();
    this.storage = utils.getStorageService();
  }

  async getUsers() {
    this.logger.info('Fetching users');
    const response = await this.http.get('/users');
    return response.data;
  }

  async uploadAvatar(userId: string, avatar: Buffer) {
    this.logger.info('Uploading avatar', { userId });
    const path = `avatars/${userId}.jpg`;
    const url = await this.storage.uploadFile(path, avatar, {
      contentType: 'image/jpeg',
    });
    return url;
  }
}
```

## Available Utilities

The library contains the following utility classes:

### Core Services

- [**LogService**](./docs/log-service.md) - Configurable logging with support for multiple providers (Pino, Winston, Console)
- [**HttpService**](./docs/http-service.md) - HTTP client with support for multiple providers (Axios, native HTTP/HTTPS)
- [**StorageService**](./docs/storage-service.md) - File storage with support for multiple providers (Local, S3)

### Data Manipulation

- [**ArrayUtils**](./docs/array-utils.md) - Array manipulation utilities (sorting, filtering, grouping)
- [**ObjectUtils**](./docs/object-utils.md) - Object manipulation utilities (deep clone, merge, pick, omit)
- [**StringUtils**](./docs/string-utils.md) - String manipulation utilities (formatting, validation, transformation)
- [**NumberUtils**](./docs/number-utils.md) - Number manipulation utilities (formatting, rounding, validation)
- [**DateUtils**](./docs/date-utils.md) - Date manipulation utilities (formatting, calculations, timezone conversion)

### Security & Cryptography

- [**CryptUtils**](./docs/crypt-utils.md) - Encryption and decryption utilities (AES, RSA, ECC)
- [**HashUtils**](./docs/hash-utils.md) - Hashing utilities (SHA, bcrypt)
- [**JwtUtils**](./docs/jwt-utils.md) - JWT token generation and verification

### Identifiers & Validation

- [**UuidUtils**](./docs/uuid-utils.md) - UUID generation and validation
- [**CuidUtils**](./docs/cuid-utils.md) - CUID generation and validation
- [**SnowflakeUtils**](./docs/snowflake-utils.md) - Snowflake ID generation and decoding
- [**ValidationUtils**](./docs/validation-utils.md) - Data validation utilities

### Performance & Algorithms

- [**BenchmarkUtils**](./docs/benchmark-utils.md) - Performance measurement utilities
- [**SortUtils**](./docs/sort-utils.md) - Sorting algorithm implementations
- [**QueueUtils**](./docs/queue-utils.md) - Queue data structure implementations

### Miscellaneous

- [**ConvertUtils**](./docs/convert-utils.md) - Data type conversion utilities
- [**RequestUtils**](./docs/request-utils.md) - HTTP request data extraction utilities
- [**FileUtils**](./docs/file-utils.md) - File system utilities

## Documentation

For detailed documentation and examples, see the [docs](./docs) directory.

## License

MIT

## Author

Bruno Morillo
