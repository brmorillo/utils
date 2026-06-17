# JWTUtils

The JWTUtils class provides utility methods for generating, verifying, decoding, and inspecting JSON Web Tokens (JWT).

> Errors: invalid arguments (missing/empty `token`, `secretKey`, or `payload`) throw a `ValidationError`. Operational failures — a bad signature, an expired token in `verify()`, or a malformed token in `decode()` — throw a `BaseError` with code `JWT_ERROR`.

## Basic Usage

```javascript
import { JWTUtils } from '@brmorillo/utils';

// Generate a token
const token = JWTUtils.generate({
  payload: { userId: '123', role: 'admin' },
  secretKey: 'your-secret-key',
  options: { expiresIn: '1h' },
});

// Verify a token
const decoded = JWTUtils.verify({
  token,
  secretKey: 'your-secret-key',
});
console.log(decoded.userId); // '123'
```

## Methods

### generate({ payload, secretKey, options })

Generates a signed JWT token. `options` is optional and accepts standard `jsonwebtoken` sign options (e.g. `expiresIn`, `issuer`, `audience`, `subject`).

Secure defaults: when `options.expiresIn` is omitted the token defaults to a **`'1h'`** expiry, and the signing algorithm is pinned to **`'HS256'`** unless you explicitly override `options.algorithm`.

```javascript
const token = JWTUtils.generate({
  payload: { userId: '123', role: 'admin' },
  secretKey: 'your-secret-key',
  options: { expiresIn: '1h' },
});
console.log(token);
```

### verify({ token, secretKey, options })

Verifies a JWT token and returns its decoded payload. `options` is optional and accepts standard `jsonwebtoken` verify options (e.g. `issuer`, `audience`, `subject`).

Algorithm allowlist: verification enforces an algorithms allowlist. By default only **`'HS256'`** is accepted. You may widen the list via `options.algorithms` (e.g. `['HS256', 'HS512']`), but the insecure **`'none'`** algorithm is always stripped and rejected, even if explicitly requested.

```javascript
const decoded = JWTUtils.verify({
  token: 'your-jwt-token',
  secretKey: 'your-secret-key',
});
console.log(decoded.userId); // '123'
```

### decode({ token, complete })

Decodes a JWT token without verifying its signature. When `complete` is `true` (default `false`), returns the decoded header and payload; otherwise returns only the payload.

> ⚠️ **Security warning:** `decode()` does **NOT** verify the token signature. Its output is **untrusted** and may have been forged or tampered with. Never make authentication or authorization decisions based on it — use `verify()` when the payload must be trusted. The same caveat applies to `isExpired()` and `getExpirationTime()`, which both read the `exp` claim without verifying the signature.

```javascript
const decoded = JWTUtils.decode({ token: 'your-jwt-token' });
console.log(decoded.userId); // '123'

const decodedComplete = JWTUtils.decode({
  token: 'your-jwt-token',
  complete: true,
});
console.log(decodedComplete.header); // { alg: 'HS256', typ: 'JWT' }
console.log(decodedComplete.payload); // { userId: '123', ... }
```

### refresh({ token, secretKey, options })

Refreshes a token by verifying it (ignoring expiration), stripping standard claims (`iat`, `exp`, `nbf`, `aud`, `iss`, `sub`), and generating a new token with the same payload. `options` is optional sign options for the new token. The old token's signature is verified using the same algorithms allowlist as `verify()` (default `'HS256'`, never `'none'`).

> ⚠️ **Note:** `refresh()` does **NOT** consult any revocation/blocklist. Any token with a valid signature will be refreshed even if it was logically revoked. Enforce revocation separately before refreshing.

```javascript
const newToken = JWTUtils.refresh({
  token: 'your-expired-token',
  secretKey: 'your-secret-key',
  options: { expiresIn: '1h' },
});
console.log(newToken);
```

### isExpired({ token })

Checks whether a JWT token is expired based on its `exp` claim. Returns a boolean.

```javascript
const isExpired = JWTUtils.isExpired({ token: 'your-jwt-token' });
console.log(isExpired); // true or false
```

### getExpirationTime({ token })

Returns the remaining time in seconds until the token expires, or `0` if already expired.

```javascript
const remainingSeconds = JWTUtils.getExpirationTime({ token: 'your-jwt-token' });
console.log(remainingSeconds); // e.g., 3600 for 1 hour
```
