# Documentation

Per-module documentation for **[@brmorillo/utils](../README.md)**. Each module has its own folder with a complete `README.md` (overview, every public method, parameters, return values, examples, and errors thrown).

For architecture, design conventions and contributor guidance, see [CLAUDE.md](../CLAUDE.md).

> Conventions used throughout the library:
> - **Static utility classes** (e.g. `ArrayUtils`, `StringUtils`) expose only static methods — no instances. The configurable services (`HttpService`, `LogService`, `StorageService`) are singletons with a method-style API instead.
> - **Single object argument**: utility methods take one destructured object, e.g. `StringUtils.toCamelCase({ input })`.
> - **Non-mutating by default**: methods that transform data return a new value and leave the input untouched. In-place mutation is opt-in via `inPlace: true` (on `SortUtils.*` and `ObjectUtils.unflattenObject`). The sole exception is `ObjectUtils.deepFreeze`, which freezes its input in place by design.
> - **`is*` vs `isValid*`**: property predicates are `is*` (`isEven`, `isPrime`); format validators are `isValid*` (`isValidEmail`, `isValidCPF`).
> - **Typed errors**: failures throw `ValidationError`, `StorageError`, `HttpError`, `QueueFullError`, or `BaseError` (with a machine-readable `code`). See [Errors](./errors/README.md).

## Core data

| Module | Class | Description |
| --- | --- | --- |
| [array](./array/README.md) | `ArrayUtils` | Deduplicate, intersect, flatten, group, shuffle, sort, subset checks |
| [object](./object/README.md) | `ObjectUtils` | Deep clone/merge, pick/omit, flatten, diff, compare, freeze |
| [string](./string/README.md) | `StringUtils` | Case conversion, truncate, palindrome, occurrences, templating |
| [number](./number/README.md) | `NumberUtils` | Rounding, parity, ranges, factorial, clamp, cents |
| [math](./math/README.md) | `MathUtils` | Percentage, gcd/lcm, clamp, primality, random ranges |

## Data & validation

| Module | Class | Description |
| --- | --- | --- |
| [convert](./convert/README.md) | `ConvertUtils` | Unit conversion (space/weight/volume) and value/type conversion |
| [date](./date/README.md) | `DateUtils` | Date/interval/duration handling and time zones (Luxon) |
| [validation](./validation/README.md) | `ValidationUtils` | Email, URL, phone, JSON, hex color, CPF/CNPJ/RG |

## Security & cryptography

| Module | Class | Description |
| --- | --- | --- |
| [crypt](./crypt/README.md) | `CryptUtils` | AES-256-GCM, ChaCha20-Poly1305, RSA (OAEP), ECC |
| [hash](./hash/README.md) | `HashUtils` | bcrypt, SHA-256/512, random tokens |
| [jwt](./jwt/README.md) | `JWTUtils` | Sign, verify (algorithm allowlist), decode, refresh |

## Identifiers

| Module | Class | Description |
| --- | --- | --- |
| [uuid](./uuid/README.md) | `UUIDUtils` | UUID v1/v4/v5 generation and validation |
| [cuid](./cuid/README.md) | `CuidUtils` | CUID2 generation and format checking |
| [snowflake](./snowflake/README.md) | `SnowflakeUtils` | Twitter-style Snowflake IDs (custom epoch) |

## Data structures & algorithms

| Module | Class | Description |
| --- | --- | --- |
| [sort](./sort/README.md) | `SortUtils` | 18 sorting algorithms |
| [queue](./queue/README.md) | `QueueUtils` | Queue, stack, priority queue, delay queue, circular buffer, multi-queue |
| [cache](./cache/README.md) | `CacheUtils`, `Cache` | In-memory caching (LRU/LFU/FIFO) with TTL |
| [benchmark](./benchmark/README.md) | `BenchmarkUtils` | Execution-time and memory benchmarking |

## System & I/O

| Module | Class | Description |
| --- | --- | --- |
| [file](./file/README.md) | `FileUtils` | File-system read/write/copy/move/hash helpers |
| [request](./request/README.md) | `RequestUtils` | Extract request metadata (IP, user-agent parsing) |
| [http](./http/README.md) | `HttpService` | HTTP client (Axios or native), configurable |
| [log](./log/README.md) | `LogService` | Structured logging (Pino, Winston, Console) |
| [storage](./storage/README.md) | `StorageService` | File storage (local filesystem or AWS S3) |

## Events & control flow

| Module | Class | Description |
| --- | --- | --- |
| [event](./event/README.md) | `EventUtils` | Type-safe event emitter / observer pattern |
| [retry](./retry/README.md) | `RetryUtils` | Retry with capped exponential backoff and jitter |
| [lazy-loader](./lazy-loader/README.md) | `LazyLoader` | Lazy, cached, one-time value creation |

## Shared

| Module | Description |
| --- | --- |
| [errors](./errors/README.md) | Typed error hierarchy (`BaseError` and subclasses) |
