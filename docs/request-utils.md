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
