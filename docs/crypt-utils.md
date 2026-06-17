# CryptUtils

The CryptUtils class provides utility methods for symmetric and asymmetric cryptography, including AES-256-GCM, ChaCha20-Poly1305, RSA (OAEP), and ECC, plus IV generation.

> Note: Like the rest of the library, `CryptUtils` methods take a single destructured object argument (except `generateIV()` / `generateGcmIV()`, which take no arguments).

## Security notes

- The symmetric ciphers (`aesEncrypt`/`aesDecrypt`, `chacha20Encrypt`/`chacha20Decrypt`) are **authenticated** (AEAD). Encryption returns an `authTag` that **must** be supplied to decryption; decryption throws if the ciphertext, IV/nonce, or tag has been tampered with.
- An IV/nonce **must be unique for every message** encrypted with the same key. Reusing an IV/nonce with GCM or Poly1305 breaks both confidentiality and authenticity. Prefer omitting `iv` (a fresh random IV is generated) over supplying a fixed value.
- `rsaGenerateKeyPair` and `eccGenerateKeyPair` emit the **private key as an unencrypted PEM**. Treat it as a secret: never log it, and store it encrypted at rest.

## Basic Usage

```javascript
import { CryptUtils } from '@brmorillo/utils';

// AES-256-GCM authenticated encryption (secretKey must be 32 bytes)
const secretKey = '12345678901234567890123456789012';
const { encryptedData, iv, authTag } = CryptUtils.aesEncrypt({ data: 'Hello, World!', secretKey });
const decrypted = CryptUtils.aesDecrypt({ encryptedData, secretKey, iv, authTag });
console.log(decrypted); // "Hello, World!"

// RSA key pair, encryption and decryption (OAEP / SHA-256)
const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({ modulusLength: 2048 });
const cipher = CryptUtils.rsaEncrypt({ data: 'Secret', publicKey });
console.log(CryptUtils.rsaDecrypt({ encryptedData: cipher, privateKey })); // "Secret"
```

## Methods

### generateIV()

Generates a random 16-byte Initialization Vector (IV) as a hexadecimal string. Kept for backwards compatibility; for AES-256-GCM use `generateGcmIV()` (or let `aesEncrypt` generate one).

```javascript
const iv = CryptUtils.generateIV();
console.log(iv); // 32-character hex string
```

### generateGcmIV()

Generates a random 12-byte IV as a 24-character hexadecimal string, suitable for AES-256-GCM / ChaCha20-Poly1305.

```javascript
const iv = CryptUtils.generateGcmIV();
console.log(iv); // 24-character hex string
```

### aesEncrypt({ data, secretKey, iv? })

Encrypts a string or JSON object using **AES-256-GCM** (authenticated). `secretKey` must be 32 bytes (validated by byte length); if `iv` is omitted, a fresh random 12-byte IV is generated. If supplied, `iv` must be a 24-character hex string (12 bytes). Returns `{ encryptedData, iv, authTag }`. The `authTag` is required to decrypt.

```javascript
const secretKey = '12345678901234567890123456789012';
const { encryptedData, iv, authTag } = CryptUtils.aesEncrypt({ data: { name: 'Alice' }, secretKey });
console.log(encryptedData, iv, authTag);
```

### aesDecrypt({ encryptedData, secretKey, iv, authTag })

Decrypts an AES-256-GCM encrypted Base64 string and verifies the `authTag`. Returns a string, or a parsed object if the decrypted content is valid JSON. `secretKey` must be 32 bytes, `iv` a 24-character hex string (12 bytes), and `authTag` the Base64 tag from `aesEncrypt`. Throws if the ciphertext, IV, or tag was tampered with.

```javascript
const result = CryptUtils.aesDecrypt({ encryptedData, secretKey, iv, authTag });
console.log(result); // { name: 'Alice' }
```

### chacha20Encrypt({ data, key, nonce })

Encrypts a string using **ChaCha20-Poly1305** (authenticated AEAD). `key` must be a 32-byte Buffer and `nonce` a 12-byte Buffer. Returns `{ encryptedData, authTag }` (both Base64). The `authTag` is required to decrypt.

```javascript
const key = Buffer.alloc(32, 'k');
const nonce = Buffer.alloc(12, 'n');
const { encryptedData, authTag } = CryptUtils.chacha20Encrypt({ data: 'Hello', key, nonce });
console.log(encryptedData, authTag);
```

### chacha20Decrypt({ encryptedData, key, nonce, authTag })

Decrypts a Base64 ChaCha20-Poly1305-encrypted string and verifies the `authTag`. `key` must be a 32-byte Buffer, `nonce` a 12-byte Buffer, and `authTag` the Base64 tag from `chacha20Encrypt`. Throws if the ciphertext, nonce, or tag was tampered with.

```javascript
const decrypted = CryptUtils.chacha20Decrypt({ encryptedData, key, nonce, authTag });
console.log(decrypted); // "Hello"
```

### rsaGenerateKeyPair({ modulusLength? })

Generates an RSA key pair in PEM format (`modulusLength` defaults to `2048`). Returns `{ publicKey, privateKey }`.

```javascript
const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({ modulusLength: 2048 });
console.log(publicKey, privateKey);
```

### rsaEncrypt({ data, publicKey })

Encrypts a string with an RSA public key (PEM) using **OAEP padding (SHA-256)**. Returns Base64.

```javascript
const encrypted = CryptUtils.rsaEncrypt({ data: 'Hello, World!', publicKey });
console.log(encrypted);
```

### rsaDecrypt({ encryptedData, privateKey })

Decrypts an RSA Base64-encrypted string using the private key (PEM) with **OAEP padding (SHA-256)**. The padding must match the one used during encryption.

```javascript
const decrypted = CryptUtils.rsaDecrypt({ encryptedData, privateKey });
console.log(decrypted);
```

### rsaSign({ data, privateKey })

Signs a string with an RSA private key (PEM) using SHA-256. Returns the signature in Base64.

```javascript
const signature = CryptUtils.rsaSign({ data: 'My data', privateKey });
console.log(signature);
```

### rsaVerify({ data, signature, publicKey })

Verifies an RSA signature against the original data using the public key (PEM). Returns a boolean.

```javascript
const isValid = CryptUtils.rsaVerify({ data: 'My data', signature, publicKey });
console.log(isValid); // true or false
```

### eccGenerateKeyPair({ curve? })

Generates an ECC key pair in PEM format (`curve` defaults to `'prime256v1'`). Returns `{ publicKey, privateKey }`.

```javascript
const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair({ curve: 'prime256v1' });
console.log(publicKey, privateKey);
```

### eccSign({ data, privateKey })

Signs a string with an ECC private key (PEM) using SHA-256. Returns the signature in Base64.

```javascript
const signature = CryptUtils.eccSign({ data: 'My data', privateKey });
console.log(signature);
```

### eccVerify({ data, signature, publicKey })

Verifies an ECC signature against the original data using the public key (PEM). Returns a boolean.

```javascript
const isValid = CryptUtils.eccVerify({ data: 'My data', signature, publicKey });
console.log(isValid); // true or false
```
