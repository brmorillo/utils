# @brmorillo/utils

[![npm version](https://badge.fury.io/js/@brmorillo%2Futils.svg)](https://www.npmjs.com/package/@brmorillo/utils)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@brmorillo/utils.svg)](https://www.npmjs.com/package/@brmorillo/utils)

> If you have a problem, it's probably already solved here.

A comprehensive, production-ready utility library for JavaScript/TypeScript. It bundles ~27 modules — array/object/string/number helpers, cryptography, hashing, JWT, ID generators, data structures, HTTP, logging, storage and more — behind one type-safe, consistent API.

- 🎯 **Type-safe** — full TypeScript types, ships its own declarations
- 📦 **Dual build** — CommonJS **and** ESM, tree-shakeable
- 🧩 **Consistent API** — every utility takes a single destructured object argument
- 🚨 **Typed errors** — branchable error hierarchy with machine-readable codes
- 🔒 **Secure defaults** — authenticated crypto, JWT algorithm allowlist, path-traversal protection
- 🧪 **Well tested** — large unit/integration suite with high coverage

## Installation

```bash
bun add @brmorillo/utils
# or
npm install @brmorillo/utils
# or
pnpm add @brmorillo/utils
# or
yarn add @brmorillo/utils
```

Requires **Node.js >= 18**.

## Quick start

```typescript
import { ArrayUtils, StringUtils, HashUtils } from '@brmorillo/utils';

// Arrays
ArrayUtils.removeDuplicates({ array: [1, 2, 2, 3] }); // [1, 2, 3]

// Strings
StringUtils.toCamelCase({ input: 'hello world' }); // "helloWorld"

// Hashing
HashUtils.sha256Hash({ value: 'sensitive data' }); // "ef92b778..."
```

Import only what you need — the package is tree-shakeable, so unused modules are dropped by your bundler.

## Conventions

These rules hold across the whole library:

- **One object argument.** Static utility methods take a single destructured object:
  `NumberUtils.clamp({ value, min, max })`, `SortUtils.quickSort({ array })`,
  `CryptUtils.aesEncrypt({ data, secretKey })`. The configurable services
  (`HttpService`, `LogService`, `StorageService`) use a method-style API instead.
- **Typed errors.** Failures throw a typed error, never a bare `Error`:
  `ValidationError` (bad input), `StorageError`, `HttpError`, `QueueFullError`,
  or `BaseError` with a `code`. See [error handling](#error-handling).
- **Predicate naming.** Property predicates are `is*` (`isEven`, `isPrime`,
  `isPalindrome`); format validators are `isValid*` (`isValidEmail`, `isValidCPF`).

## Modules

Full per-module reference lives in **[docs/](./docs/README.md)**. Each module has a complete page under `docs/<module>/README.md`.

### Core data
| Module | Class | Highlights |
| --- | --- | --- |
| [array](./docs/array/README.md) | `ArrayUtils` | `removeDuplicates`, `intersect`, `flatten`, `groupBy`, `shuffle`, `sort` |
| [object](./docs/object/README.md) | `ObjectUtils` | `deepClone`, `deepMerge`, `pick`, `omit`, `flattenObject`, `diff`, `deepFreeze` |
| [string](./docs/string/README.md) | `StringUtils` | `toCamelCase`, `toKebabCase`, `truncate`, `isPalindrome`, `replacePlaceholders` |
| [number](./docs/number/README.md) | `NumberUtils` | `roundToDecimals`, `isEven`, `clamp`, `factorial`, `toCents`, random ranges |
| [math](./docs/math/README.md) | `MathUtils` | `percentage`, `gcd`, `lcm`, `clamp`, `isPrime`, `randomInRange` |

### Data & validation
| Module | Class | Highlights |
| --- | --- | --- |
| [convert](./docs/convert/README.md) | `ConvertUtils` | `space`, `weight`, `volume`, `value` (type/roman) |
| [date](./docs/date/README.md) | `DateUtils` | intervals, add/remove time, diff, time zones (Luxon) |
| [validation](./docs/validation/README.md) | `ValidationUtils` | `isValidEmail`, `isValidURL`, `isValidJSON`, CPF/CNPJ/RG |

### Security & cryptography
| Module | Class | Highlights |
| --- | --- | --- |
| [crypt](./docs/crypt/README.md) | `CryptUtils` | AES-256-GCM, ChaCha20-Poly1305, RSA (OAEP), ECC |
| [hash](./docs/hash/README.md) | `HashUtils` | bcrypt, SHA-256/512, random tokens |
| [jwt](./docs/jwt/README.md) | `JWTUtils` | `generate`, `verify` (algorithm allowlist), `decode`, `refresh` |

### Identifiers
| Module | Class | Highlights |
| --- | --- | --- |
| [uuid](./docs/uuid/README.md) | `UUIDUtils` | UUID v1/v4/v5 + validation |
| [cuid](./docs/cuid/README.md) | `CuidUtils` | CUID2 generation + format check |
| [snowflake](./docs/snowflake/README.md) | `SnowflakeUtils` | Snowflake IDs with custom epoch |

### Data structures & algorithms
| Module | Class | Highlights |
| --- | --- | --- |
| [sort](./docs/sort/README.md) | `SortUtils` | 18 sorting algorithms |
| [queue](./docs/queue/README.md) | `QueueUtils` | queue, stack, priority/delay queue, circular & multi-queue |
| [cache](./docs/cache/README.md) | `CacheUtils`, `Cache` | LRU/LFU/FIFO caches with TTL |
| [benchmark](./docs/benchmark/README.md) | `BenchmarkUtils` | timing & memory benchmarks |

### System & I/O
| Module | Class | Highlights |
| --- | --- | --- |
| [file](./docs/file/README.md) | `FileUtils` | read/write/copy/move/hash files |
| [request](./docs/request/README.md) | `RequestUtils` | extract IP / user-agent metadata |
| [http](./docs/http/README.md) | `HttpService` | configurable HTTP client (Axios or native) |
| [log](./docs/log/README.md) | `LogService` | structured logging (Pino/Winston/Console) |
| [storage](./docs/storage/README.md) | `StorageService` | local filesystem or AWS S3 |

### Events & control flow
| Module | Class | Highlights |
| --- | --- | --- |
| [event](./docs/event/README.md) | `EventUtils` | type-safe event emitter |
| [retry](./docs/retry/README.md) | `RetryUtils` | retry with capped backoff + jitter |
| [lazy-loader](./docs/lazy-loader/README.md) | `LazyLoader` | lazy, cached value creation |

### Shared
| Module | Highlights |
| --- | --- |
| [errors](./docs/errors/README.md) | `BaseError`, `ValidationError`, `HttpError`, `StorageError`, `QueueFullError` |

## Configurable services

`HttpService`, `LogService` and `StorageService` are configurable singletons. You can use them directly or via the `Utils` facade:

```typescript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance({
  logger: { type: 'pino', level: 'info', prettyPrint: true },
  http: { clientType: 'axios', baseUrl: 'https://api.example.com', timeout: 5000 },
  storage: { providerType: 'local', local: { basePath: './storage' } },
});

utils.getLogger().info('Application started');
const res = await utils.getHttpService().get('/health');
await utils.getStorageService().uploadFile('notes.txt', 'hello');
```

See [http](./docs/http/README.md), [log](./docs/log/README.md) and [storage](./docs/storage/README.md) for full configuration options.

## Error handling

Every failure is a typed error extending `BaseError`, so you can branch on the type or the `code`:

```typescript
import { ValidationError, BaseError } from '@brmorillo/utils';

try {
  CryptUtils.aesEncrypt({ data: 'x', secretKey: 'too-short' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Bad input:', error.message, error.field);
  } else if (error instanceof BaseError) {
    console.error(error.code, error.details); // e.g. 'CRYPTO_ERROR'
  }
}
```

Wrapped errors keep the original under the standard `cause` property. `BaseError.toJSON()` omits the stack trace by default (safe to return in HTTP responses). See [errors](./docs/errors/README.md).

## Security

- **Authenticated encryption** — AES-256-GCM and ChaCha20-Poly1305 return an `authTag` that is verified on decryption; tampering throws. RSA uses OAEP. RC4 is not provided.
- **JWT** — `verify` enforces an algorithm allowlist (defaults to `HS256`, rejects `none`); `generate` sets a default expiry and pins the algorithm.
- **Storage** — the local provider confines all paths to its configured root.
- **Object utilities** — `deepMerge`/`unflattenObject` reject prototype-pollution keys.

## Documentation

- 📚 **[Module reference](./docs/README.md)** — one page per module
- 🧪 **[Examples](./examples)** — runnable usage examples
- 🤖 **[CLAUDE.md](./CLAUDE.md)** — architecture & conventions for contributors and AI assistants

## Development

```bash
bun install          # install dependencies (this project uses bun)
bun run build        # typecheck + build (CJS + ESM + .d.ts)
bun run test         # run unit + integration tests
bun run lint         # lint
bun run format       # format with Prettier
```

## License

MIT © [Bruno Morillo](https://github.com/brmorillo)
