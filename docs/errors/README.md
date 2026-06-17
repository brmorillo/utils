# Errors

A small hierarchy of typed errors used across the whole library. Every error thrown by the library is an instance of `BaseError` (which extends the native `Error`), so consumers can branch on the concrete type or on the machine-readable `code`.

```javascript
import {
  BaseError,
  ValidationError,
  HttpError,
  StorageError,
  QueueFullError,
} from '@brmorillo/utils';

try {
  // ...call a utility...
} catch (error) {
  if (error instanceof ValidationError) {
    // bad input — error.field / error.expected / error.actual
  } else if (error instanceof BaseError) {
    // any library error — error.code, error.statusCode, error.details
  }
}
```

## Which error is thrown where

| Situation | Error |
| --- | --- |
| Invalid input / failed input guard | `ValidationError` |
| File / storage operation failure | `StorageError` |
| HTTP-related failure | `HttpError` |
| Bounded queue/stack is full | `QueueFullError` |
| Any other operational failure | `BaseError` with a domain `code` (e.g. `CRYPTO_ERROR`, `JWT_ERROR`, `SNOWFLAKE_ERROR`) |

When the library wraps a lower-level error, the original is attached as the standard `cause` property.

## BaseError

The base class for every library error.

| Member | Type | Description |
| --- | --- | --- |
| `message` | `string` | Human-readable message |
| `code` | `string` | Machine-readable code (defaults to `'UNKNOWN_ERROR'`) |
| `statusCode` | `number \| undefined` | Optional HTTP status code |
| `details` | `Record<string, any> \| undefined` | Optional structured context |
| `cause` | `unknown` | The original error, when wrapping one |

```ts
new BaseError(message, code?, statusCode?, details?, options?: { cause?: unknown })
```

### `toJSON(options?)`

Serializes the error to a plain object. **For security, the `stack` is omitted by default** (stack traces leak filesystem paths when returned in HTTP responses). Pass `{ includeStack: true }` to include it, e.g. for internal logs.

```javascript
err.toJSON();                       // { name, message, code, statusCode, details }
err.toJSON({ includeStack: true }); // ...also includes `stack`
```

## ValidationError

Thrown for invalid input. Extends `BaseError` with `code = 'VALIDATION_ERROR'`, `statusCode = 400`, and the extra fields `field`, `expected`, `actual`.

```ts
new ValidationError(message, field?, expected?, actual?, details?, options?)
```

Static factories: `ValidationError.required(field)`, `ValidationError.invalidType(field, expected, actual)` (detects `array`/`null` correctly), `ValidationError.invalidFormat(field, format, actual)`, `ValidationError.outOfRange(field, min, max, actual)`.

## HttpError

HTTP-specific error (`code = 'HTTP_ERROR'`, configurable `statusCode`).

```ts
new HttpError(message, statusCode?, code?, details?, options?)
```

Static factories: `badRequest` (400), `unauthorized` (401), `forbidden` (403), `notFound` (404), `timeout` (408), `conflict` (409), `unprocessableEntity` (422), `tooManyRequests` (429), `serverError` (500), `badGateway` (502), `serviceUnavailable` (503).

## StorageError

Storage/file-system error (`code` defaults to `'STORAGE_ERROR'`).

```ts
new StorageError(message, code?, details?, options?)
```

Static factories: `fileNotFound(path)`, `permissionDenied(path)`, `fileAlreadyExists(path)`, `quotaExceeded()`, `invalidPath(path)`.

## QueueFullError

Thrown by bounded queues/stacks when `enqueue`/`push` is called on a full structure (`code = 'QUEUE_FULL'`). Its `details` carry the current `size` and `maxSize`.

```ts
new QueueFullError(message?, details?, options?)
```
