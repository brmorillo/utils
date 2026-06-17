# RetryUtils

The RetryUtils class provides static methods for retrying asynchronous functions that may fail, with support for fixed/exponential backoff and custom retry strategies.

## Basic Usage

```javascript
import { RetryUtils } from '@brmorillo/utils';

// Retry an async function up to 5 times with exponential backoff
const result = await RetryUtils.retry({
  fn: async () => {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },
  maxAttempts: 5,
  delay: 1000,
  exponentialBackoff: true
});
```

## Methods

### retry({ fn, maxAttempts, delay, exponentialBackoff, maxDelay, jitter })

Retries an async function until it succeeds or the maximum number of attempts is reached. When all attempts fail, the last encountered error is thrown.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `fn` | `() => Promise<T>` | required | The async function to retry. |
| `maxAttempts` | number | `3` | Maximum number of attempts. |
| `delay` | number | `1000` | Base delay between attempts, in milliseconds. |
| `exponentialBackoff` | boolean | `false` | When `true`, the delay grows as `delay * 2^(attempt - 1)`. |
| `maxDelay` | number | `30000` | Upper bound (in ms) the computed delay is clamped to. |
| `jitter` | boolean | `false` | When `true`, randomizes the (clamped) delay to a value in `[0, delay]` to avoid thundering-herd retries. |

```javascript
const result = await RetryUtils.retry({
  fn: async () => {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },
  maxAttempts: 5,
  delay: 1000,
  exponentialBackoff: true,
  maxDelay: 30000,
  jitter: true
});
```

### retryWithStrategy({ fn, shouldRetry, getDelay, maxAttempts })

Retries an async function using a custom strategy. `shouldRetry(error)` decides whether another attempt should be made, and `getDelay(attempt)` returns the delay (in milliseconds) before the next attempt. `maxAttempts` defaults to `3`. The last encountered error is thrown if all attempts fail.

```javascript
const result = await RetryUtils.retryWithStrategy({
  fn: fetchData,
  shouldRetry: (error) => error.status === 429, // only retry on rate limit
  getDelay: (attempt) => attempt * 1000,        // linear backoff
  maxAttempts: 5
});
```

### withRetry({ fn, options })

Wraps a function so it automatically retries on failure, returning a new function with the same signature. `options` may include `maxAttempts` (default `3`), `delay` (default `1000`), `exponentialBackoff` (default `false`), `maxDelay` (default `30000`, the cap the computed delay is clamped to), and `jitter` (default `false`, randomizes the delay to `[0, delay]`).

```javascript
const fetchWithRetry = RetryUtils.withRetry({
  fn: fetch,
  options: {
    maxAttempts: 5,
    delay: 1000,
    exponentialBackoff: true
  }
});

// Use it just like the original function
const response = await fetchWithRetry('https://api.example.com/data');
```
