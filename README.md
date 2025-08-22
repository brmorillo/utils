# @brmorillo/utils

[![npm version](https://badge.fury.io/js/@brmorillo%2Futils.svg)](https://badge.fury.io/js/@brmorillo%2Futils)
[![CI/CD Pipeline](https://github.com/brmorillo/utils/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/brmorillo/utils/actions)
[![codecov](https://codecov.io/gh/brmorillo/utils/branch/main/graph/badge.svg)](https://codecov.io/gh/brmorillo/utils)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@brmorillo/utils.svg)](https://www.npmjs.com/package/@brmorillo/utils)

> If you have a problem, it's probably already solved here.

A comprehensive, **production-ready** utility library for JavaScript/TypeScript projects that provides a centralized collection of common utilities and helpers to solve everyday programming challenges.

## ✨ Features

- 🔧 **20+ utility services** for common development tasks
- 🏗️ **Zero-config setup** with sensible defaults
- 🎯 **Type-safe** with full TypeScript support
- 🚀 **Tree-shakeable** for optimal bundle size
- 📦 **Multiple formats** (CJS, ESM) for maximum compatibility
- 🧪 **100% test coverage** with comprehensive test suite
- 📚 **Extensive documentation** with examples
- 🔒 **Security-focused** with regular vulnerability scans

## 📚 Available Services

The library includes 20+ utility services to cover common development needs:

### Core Services

- **ArrayUtils** - Array manipulation, filtering, grouping, and transformations
- **ObjectUtils** - Deep merging, cloning, flattening, and property manipulation
- **StringUtils** - Case conversion, validation, templating, and text processing
- **NumberUtils** - Mathematical operations, formatting, and validations
- **MathUtils** - Advanced mathematical functions and calculations

### Data & Validation

- **ValidationUtils** - Input validation, sanitization, and type checking
- **ConvertUtils** - Data type conversions and transformations
- **DateUtils** - Date manipulation, formatting, and timezone handling (powered by Luxon)

### Security & Cryptography

- **HashUtils** - SHA-256, SHA-512, bcrypt hashing and token generation
- **CryptUtils** - AES, RSA, ChaCha20 encryption/decryption
- **JWTUtils** - JWT token generation, verification, and management

### Identifiers & Generators

- **UUIDUtils** - UUID v1, v4, v5 generation and validation
- **CuidUtils** - CUID generation and validation
- **SnowflakeUtils** - Twitter Snowflake ID generation

### Data Structures & Algorithms

- **SortUtils** - Multiple sorting algorithms (bubble, merge, quick, heap)
- **QueueUtils** - Queue, stack, priority queue implementations
- **CacheUtils** - In-memory caching with TTL support

### Network & HTTP

- **HttpService** - HTTP client abstraction (Axios and native)
- **RequestUtils** - HTTP request utilities and helpers

### System & Performance

- **BenchmarkUtils** - Performance testing and function comparison
- **FileUtils** - File system operations and utilities
- **LogService** - Structured logging (Pino, Winston, Console)
- **StorageService** - File storage abstraction (Local, AWS S3)

### Event Management

- **EventUtils** - Type-safe event emitter and observer pattern
- **RetryUtils** - Retry logic with exponential backoff

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

## 🚀 Getting Started

### Basic Usage

```typescript
import { ArrayUtils, StringUtils, HashUtils } from '@brmorillo/utils';

// Array operations
const numbers = [1, 2, 2, 3, 4, 4, 5];
const unique = ArrayUtils.removeDuplicates(numbers);
console.log(unique); // [1, 2, 3, 4, 5]

// String operations
const text = "hello world";
const camelCase = StringUtils.toCamelCase(text);
console.log(camelCase); // "helloWorld"

// Hashing
const hash = HashUtils.sha256Hash("sensitive data");
console.log(hash); // SHA-256 hash string
```

### Tree-shaking Support

Import only what you need for optimal bundle size:

```typescript
// Instead of importing everything
import * as utils from '@brmorillo/utils';

// Import only specific utilities
import { ArrayUtils } from '@brmorillo/utils';
import { StringUtils } from '@brmorillo/utils';
```

## 📖 Documentation

For detailed documentation and examples for each utility, visit our [documentation](./docs/index.md).

### Quick Links

- [📊 Array Utils](./docs/array-utils.md) - Array manipulation and processing
- [🔒 Security Utils](./docs/) - Cryptography, hashing, and JWT
- [🌐 HTTP Utils](./docs/http-service.md) - HTTP client and request utilities
- [📁 Storage Utils](./docs/storage-service.md) - File storage abstraction
- [📝 Logging](./docs/log-service.md) - Structured logging
- [⚡ Performance](./docs/) - Benchmarking and optimization

## 🛠️ Development

### Prerequisites

- Node.js >= 16
- pnpm >= 8

### Setup

```bash
# Clone the repository
git clone https://github.com/brmorillo/utils.git
cd utils

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build
```

### Scripts

- `pnpm build` - Build the library
- `pnpm test` - Run all tests
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Lint the code
- `pnpm format` - Format the code

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Luxon](https://moment.github.io/luxon/) for date manipulation
- [Axios](https://axios-http.com/) for HTTP client
- [Pino](https://getpino.io/) and [Winston](https://github.com/winstonjs/winston) for logging
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) for S3 storage
- All the amazing open-source contributors

---

**Made with ❤️ by [Bruno Morillo](https://github.com/brmorillo)**

- [**ConvertUtils**](./docs/convert-utils.md) - Data type conversion utilities
- [**RequestUtils**](./docs/request-utils.md) - HTTP request data extraction utilities
- [**FileUtils**](./docs/file-utils.md) - File system utilities

## Documentation

For detailed documentation and examples, see the [docs](./docs) directory.

## License

MIT

## Author

Bruno Morillo
