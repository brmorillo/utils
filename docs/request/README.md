# RequestUtils

The RequestUtils class provides a static method for extracting relevant data (user agent, IP address, headers, and parsed browser/OS/device info) from an HTTP request object.

## Basic Usage

```javascript
import { RequestUtils } from '@brmorillo/utils';

// Extract data from an incoming HTTP request (e.g. Express request)
const requestData = RequestUtils.extractRequestData({ request });
console.log(requestData.ipAddress);
console.log(requestData.browser);
```

## Methods

### extractRequestData({ request })

Extracts relevant data from an HTTP request object. Reads headers and IP information from `request`, and parses the User-Agent string (using `ua-parser-js`) to derive browser, OS, and device. Returns an object with the following fields, each `string | undefined`:

- `userAgent`
- `ipAddress`
- `xForwardedFor`
- `xRealIp`
- `referer`
- `origin`
- `host`
- `browser`
- `os`
- `device`

`request` is typed as `HttpRequestLike` — an object with an optional `headers` map (values may be `string`, `string[]`, or `undefined`; array-valued headers are normalized to their first entry) and an optional `ip` string. Passing `null`/`undefined` throws a `ValidationError`.

> **Security:** `xForwardedFor` and `xRealIp` come from the `x-forwarded-for` / `x-real-ip` headers, which are client-controlled and trivially spoofable. Only trust them when your app sits behind a trusted reverse proxy that overwrites them; do not use them for authorization, rate-limiting, or audit logging otherwise.

```javascript
// Example with an Express-style request object
const requestData = RequestUtils.extractRequestData({ request });

console.log(requestData);
// {
//   userAgent: 'Mozilla/5.0 ...',
//   ipAddress: '203.0.113.10',
//   xForwardedFor: '203.0.113.10',
//   xRealIp: undefined,
//   referer: 'https://example.com',
//   origin: 'https://example.com',
//   host: 'example.com',
//   browser: 'Chrome',
//   os: 'Windows',
//   device: undefined
// }
```
