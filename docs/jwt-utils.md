# JWTUtils

The JWTUtils class provides utility methods for generating, verifying, decoding, and inspecting JSON Web Tokens (JWT).

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

```javascript
const decoded = JWTUtils.verify({
  token: 'your-jwt-token',
  secretKey: 'your-secret-key',
});
console.log(decoded.userId); // '123'
```

### decode({ token, complete })

Decodes a JWT token without verifying its signature. When `complete` is `true` (default `false`), returns the decoded header and payload; otherwise returns only the payload.

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

Refreshes a token by verifying it (ignoring expiration), stripping standard claims (`iat`, `exp`, `nbf`, `aud`, `iss`, `sub`), and generating a new token with the same payload. `options` is optional sign options for the new token.

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
