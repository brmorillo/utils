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

### retry({ fn, maxAttempts, delay, exponentialBackoff })

Retries an async function until it succeeds or the maximum number of attempts is reached. `maxAttempts` defaults to `3`, `delay` (in milliseconds) defaults to `1000`, and `exponentialBackoff` defaults to `false`. When all attempts fail, the last encountered error is thrown.

```javascript
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

Wraps a function so it automatically retries on failure, returning a new function with the same signature. `options` may include `maxAttempts` (default `3`), `delay` (default `1000`), and `exponentialBackoff` (default `false`).

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
