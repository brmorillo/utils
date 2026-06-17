# HashUtils

The HashUtils class provides utility methods for hashing and token generation using bcrypt, SHA-256, and SHA-512.

> Errors: invalid arguments (e.g. an empty `value`, a non-object `json`, `saltRounds`/`length` below the minimum) throw a `ValidationError`. Failures in the underlying hashing operation throw a `BaseError` with code `HASH_ERROR`.

## Basic Usage

```javascript
import { HashUtils } from '@brmorillo/utils';

// Hash a value with bcrypt
const hash = HashUtils.bcryptHash({ value: 'password123', saltRounds: 12 });
console.log(hash);

// Compare a value against a bcrypt hash
const isValid = HashUtils.bcryptCompare({ value: 'password123', encryptedValue: hash });
console.log(isValid); // true

// Hash a value with SHA-256
const sha = HashUtils.sha256Hash({ value: 'password123' });
console.log(sha);
```

## Methods

### bcryptHash({ value, saltRounds })

Encrypts a string value using bcrypt synchronously (`saltRounds` defaults to `10`, must be >= 4).

```javascript
const hash = HashUtils.bcryptHash({ value: 'password123', saltRounds: 12 });
console.log(hash);
```

### bcryptCompare({ value, encryptedValue })

Compares a plain text value with a bcrypt-encrypted value synchronously.

```javascript
const isValid = HashUtils.bcryptCompare({
  value: 'password123',
  encryptedValue: hash,
});
console.log(isValid); // true
```

### bcryptRandomString({ length })

Generates a random bcrypt hash string (`length` defaults to `10`, must be >= 4).

```javascript
const randomString = HashUtils.bcryptRandomString({ length: 12 });
console.log(randomString);
```

### sha256Hash({ value })

Hashes a string value using SHA-256 and returns a hexadecimal string.

```javascript
const hash = HashUtils.sha256Hash({ value: 'password123' });
console.log(hash); // "ef92b778bafe771e89245b89ecbc08a44a4e166c06659..."
```

### sha256HashJson({ json })

Serializes a JSON object and hashes it using SHA-256.

```javascript
const hash = HashUtils.sha256HashJson({ json: { key: 'value' } });
console.log(hash);
```

### sha256GenerateToken({ length })

Generates a random hexadecimal token using SHA-256 (`length` defaults to `32`).

```javascript
const token = HashUtils.sha256GenerateToken({ length: 16 });
console.log(token); // "a1b2c3d4e5f67890"
```

### sha512Hash({ value })

Hashes a string value using SHA-512 and returns a hexadecimal string.

```javascript
const hash = HashUtils.sha512Hash({ value: 'password123' });
console.log(hash);
```

### sha512HashJson({ json })

Serializes a JSON object and hashes it using SHA-512.

```javascript
const hash = HashUtils.sha512HashJson({ json: { key: 'value' } });
console.log(hash);
```

### sha512GenerateToken({ length })

Generates a random hexadecimal token using SHA-512 (`length` defaults to `32`).

```javascript
const token = HashUtils.sha512GenerateToken({ length: 16 });
console.log(token); // "a1b2c3d4e5f67890"
```
