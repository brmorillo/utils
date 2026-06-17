# CryptUtils

The CryptUtils class provides utility methods for symmetric and asymmetric cryptography, including AES, ChaCha20, RSA, ECC, and RC4, plus IV generation.

> Note: Like the rest of the library, `CryptUtils` methods take a single destructured object argument (except `generateIV()`, which takes no arguments).

## Basic Usage

```javascript
import { CryptUtils } from '@brmorillo/utils';

// AES-256-CBC encryption (secretKey must be 32 bytes)
const secretKey = '12345678901234567890123456789012';
const { encryptedData, iv } = CryptUtils.aesEncrypt({ data: 'Hello, World!', secretKey });
const decrypted = CryptUtils.aesDecrypt({ encryptedData, secretKey, iv });
console.log(decrypted); // "Hello, World!"

// RSA key pair, encryption and decryption
const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({ modulusLength: 2048 });
const cipher = CryptUtils.rsaEncrypt({ data: 'Secret', publicKey });
console.log(CryptUtils.rsaDecrypt({ encryptedData: cipher, privateKey })); // "Secret"
```

## Methods

### generateIV()

Generates a random 16-byte Initialization Vector (IV) as a hexadecimal string.

```javascript
const iv = CryptUtils.generateIV();
console.log(iv); // 32-character hex string
```

### aesEncrypt({ data, secretKey, iv? })

Encrypts a string or JSON object using AES-256-CBC. `secretKey` must be 32 bytes; if `iv` is omitted, a random IV is generated. Returns `{ encryptedData, iv }`.

```javascript
const secretKey = '12345678901234567890123456789012';
const { encryptedData, iv } = CryptUtils.aesEncrypt({ data: { name: 'Alice' }, secretKey });
console.log(encryptedData, iv);
```

### aesDecrypt({ encryptedData, secretKey, iv })

Decrypts an AES-256-CBC encrypted Base64 string. Returns a string, or a parsed object if the decrypted content is valid JSON. `secretKey` must be 32 bytes and `iv` a 16-byte hex string.

```javascript
const result = CryptUtils.aesDecrypt({ encryptedData, secretKey, iv });
console.log(result); // { name: 'Alice' }
```

### chacha20Encrypt({ data, key, nonce })

Encrypts a string using ChaCha20. `key` must be a 32-byte Buffer and `nonce` a 12-byte Buffer. Returns Base64.

```javascript
const key = Buffer.alloc(32, 'k');
const nonce = Buffer.alloc(12, 'n');
const encrypted = CryptUtils.chacha20Encrypt({ data: 'Hello', key, nonce });
console.log(encrypted);
```

### chacha20Decrypt({ encryptedData, key, nonce })

Decrypts a Base64 ChaCha20-encrypted string. `key` must be a 32-byte Buffer and `nonce` a 12-byte Buffer.

```javascript
const decrypted = CryptUtils.chacha20Decrypt({ encryptedData: encrypted, key, nonce });
console.log(decrypted); // "Hello"
```

### rsaGenerateKeyPair({ modulusLength? })

Generates an RSA key pair in PEM format (`modulusLength` defaults to `2048`). Returns `{ publicKey, privateKey }`.

```javascript
const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({ modulusLength: 2048 });
console.log(publicKey, privateKey);
```

### rsaEncrypt({ data, publicKey })

Encrypts a string with an RSA public key (PEM). Returns Base64.

```javascript
const encrypted = CryptUtils.rsaEncrypt({ data: 'Hello, World!', publicKey });
console.log(encrypted);
```

### rsaDecrypt({ encryptedData, privateKey })

Decrypts an RSA Base64-encrypted string using the private key (PEM).

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

Generates an ECC key pair in PEM format (`curve` defaults to `'secp256k1'`). Returns `{ publicKey, privateKey }`.

```javascript
const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair({ curve: 'secp256k1' });
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

### rc4Encrypt({ data, key })

Encrypts a string using RC4 with a string key. Returns Base64. Throws if RC4 is not supported by the current Node.js version.

```javascript
const encrypted = CryptUtils.rc4Encrypt({ data: 'Hello, World!', key: 'mySecretKey' });
console.log(encrypted);
```

### rc4Decrypt({ encryptedData, key })

Decrypts a Base64 RC4-encrypted string using a string key. Throws if RC4 is not supported by the current Node.js version.

```javascript
const decrypted = CryptUtils.rc4Decrypt({ encryptedData, key: 'mySecretKey' });
console.log(decrypted);
```
