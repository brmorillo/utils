import * as crypto from 'crypto';
import { BaseError, ValidationError } from '../errors';

/**
 * Utility methods for symmetric and asymmetric cryptography.
 *
 * Security notes:
 * - All symmetric ciphers exposed here are authenticated (AEAD): AES-256-GCM
 *   and ChaCha20-Poly1305. Decryption verifies the authentication tag and
 *   throws if the ciphertext, IV/nonce, or tag has been tampered with.
 * - An IV/nonce MUST be unique for every message encrypted with the same key.
 *   Reusing an IV/nonce with GCM or Poly1305 catastrophically breaks
 *   confidentiality and authenticity. Prefer omitting `iv`/generating a fresh
 *   one per message rather than supplying a fixed value.
 * - Key-pair generators emit the private key as an UNENCRYPTED PEM. Treat the
 *   returned `privateKey` as a secret: do not log it, and store it encrypted
 *   at rest.
 */
export class CryptUtils {
  /**
   * Checks if a specific crypto algorithm is supported by the current Node.js version.
   * @param algorithm The algorithm to check.
   * @returns `true` if the algorithm is supported, otherwise `false`.
   */
  private static isAlgorithmSupported(algorithm: string): boolean {
    try {
      const algorithms = crypto.getCiphers();
      return algorithms.includes(algorithm);
    } catch {
      return false;
    }
  }

  /**
   * Generates a random Initialization Vector (IV).
   *
   * Note: this returns a 16-byte IV for backwards compatibility. AES-256-GCM
   * requires a 12-byte IV, which {@link CryptUtils.aesEncrypt} generates
   * internally when no `iv` is supplied. If you pass a custom `iv` to
   * `aesEncrypt`, it must be a 24-character hex string (12 bytes).
   * @returns A 16-byte IV as a hexadecimal string.
   */
  public static generateIV(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generates a random 12-byte Initialization Vector (IV) suitable for
   * AES-256-GCM / ChaCha20-Poly1305.
   * @returns A 12-byte IV as a 24-character hexadecimal string.
   */
  public static generateGcmIV(): string {
    return crypto.randomBytes(12).toString('hex');
  }

  /**
   * Encrypts a string or JSON object using AES-256-GCM (authenticated
   * encryption) with optional IV generation.
   *
   * Security: GCM requires a UNIQUE 12-byte IV per message for a given key.
   * When `iv` is omitted a fresh random IV is generated; never reuse an IV
   * with the same key. The returned `authTag` must be supplied to
   * {@link CryptUtils.aesDecrypt} and is verified on decryption.
   * @param params The parameters object.
   * @param params.data The string or JSON to encrypt.
   * @param params.secretKey A 32-byte secret key (validated by byte length).
   * @param params.iv A 12-byte IV as a 24-character hex string. If not provided, a random IV is generated.
   * @returns The encrypted data (Base64), the IV used (hex), and the authentication tag (Base64).
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If encryption fails.
   * @example
   * const { encryptedData, iv, authTag } = CryptUtils.aesEncrypt({ data: 'Hello', secretKey });
   * console.log(encryptedData, iv, authTag);
   */
  public static aesEncrypt({
    data,
    secretKey,
    iv,
  }: {
    data: string | object;
    secretKey: string;
    iv?: string;
  }): { encryptedData: string; iv: string; authTag: string } {
    if (typeof data !== 'string' && typeof data !== 'object') {
      throw new ValidationError(
        'Invalid input: data must be a string or JSON object.',
      );
    }
    if (Buffer.byteLength(secretKey) !== 32) {
      throw new ValidationError('Invalid secretKey: must be 32 bytes.');
    }

    const usedIV = iv || CryptUtils.generateGcmIV();
    if (!/^[0-9a-fA-F]{24}$/.test(usedIV)) {
      throw new ValidationError(
        'Invalid IV: must be 12 bytes (24 hexadecimal characters).',
      );
    }

    try {
      const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(secretKey),
        Buffer.from(usedIV, 'hex'),
      );
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      const encrypted = Buffer.concat([
        cipher.update(jsonData, 'utf8'),
        cipher.final(),
      ]);
      const authTag = cipher.getAuthTag();
      return {
        encryptedData: encrypted.toString('base64'),
        iv: usedIV,
        authTag: authTag.toString('base64'),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to encrypt data using AES: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Decrypts an AES-256-GCM encrypted string and verifies its authentication
   * tag. Decryption fails (throws) if the ciphertext, IV, or tag was tampered
   * with.
   * @param params The parameters object.
   * @param params.encryptedData The encrypted data in Base64 format.
   * @param params.secretKey A 32-byte secret key (validated by byte length).
   * @param params.iv The 12-byte IV as a 24-character hex string used during encryption.
   * @param params.authTag The authentication tag (Base64) produced during encryption.
   * @returns The decrypted string or JSON object.
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If decryption or authentication fails.
   * @example
   * const decrypted = CryptUtils.aesDecrypt({ encryptedData, secretKey, iv, authTag });
   * console.log(decrypted);
   */
  public static aesDecrypt({
    encryptedData,
    secretKey,
    iv,
    authTag,
  }: {
    encryptedData: string;
    secretKey: string;
    iv: string;
    authTag: string;
  }): string | object {
    if (typeof encryptedData !== 'string') {
      throw new ValidationError('Invalid input: encryptedData must be a string.');
    }
    if (Buffer.byteLength(secretKey) !== 32) {
      throw new ValidationError('Invalid secretKey: must be 32 bytes.');
    }
    if (typeof iv !== 'string' || !/^[0-9a-fA-F]{24}$/.test(iv)) {
      throw new ValidationError(
        'Invalid IV: must be 12 bytes (24 hexadecimal characters).',
      );
    }
    if (typeof authTag !== 'string' || authTag.length === 0) {
      throw new ValidationError(
        'Invalid authTag: must be a non-empty Base64 string.',
      );
    }

    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(secretKey),
        Buffer.from(iv, 'hex'),
      );
      decipher.setAuthTag(Buffer.from(authTag, 'base64'));
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      const decryptedText = decrypted.toString('utf8');
      try {
        return JSON.parse(decryptedText);
      } catch {
        return decryptedText; // If it's not JSON, return as string.
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to decrypt data using AES: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Encrypts data using ChaCha20-Poly1305 (authenticated AEAD encryption).
   *
   * Security: the 12-byte nonce MUST be unique per message for a given key.
   * Never reuse a nonce with the same key. The returned `authTag` must be
   * supplied to {@link CryptUtils.chacha20Decrypt} and is verified on
   * decryption.
   * @param params The parameters object.
   * @param params.data The string to encrypt.
   * @param params.key A 32-byte key.
   * @param params.nonce A 12-byte nonce.
   * @returns The encrypted data (Base64) and the authentication tag (Base64).
   * @throws {ValidationError} If the input is invalid or if ChaCha20-Poly1305 is not supported.
   * @throws {BaseError} If encryption fails.
   * @example
   * const { encryptedData, authTag } = CryptUtils.chacha20Encrypt({ data: 'Hello', key, nonce });
   * console.log(encryptedData, authTag);
   */
  public static chacha20Encrypt({
    data,
    key,
    nonce,
  }: {
    data: string;
    key: Buffer;
    nonce: Buffer;
  }): { encryptedData: string; authTag: string } {
    if (!CryptUtils.isAlgorithmSupported('chacha20-poly1305')) {
      throw new ValidationError(
        'ChaCha20-Poly1305 algorithm is not supported in this Node.js version.',
      );
    }

    if (key.length !== 32) {
      throw new ValidationError('Invalid key: must be 32 bytes.');
    }
    if (nonce.length !== 12) {
      throw new ValidationError('Invalid nonce: must be 12 bytes.');
    }

    try {
      const cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, {
        authTagLength: 16,
      });
      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      const authTag = cipher.getAuthTag();
      return {
        encryptedData: encrypted.toString('base64'),
        authTag: authTag.toString('base64'),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to encrypt data using ChaCha20-Poly1305: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Decrypts data encrypted using ChaCha20-Poly1305 and verifies its
   * authentication tag. Decryption fails (throws) if the ciphertext, nonce, or
   * tag was tampered with.
   * @param params The parameters object.
   * @param params.encryptedData The encrypted data in Base64 format.
   * @param params.key A 32-byte key.
   * @param params.nonce A 12-byte nonce.
   * @param params.authTag The authentication tag (Base64) produced during encryption.
   * @returns The decrypted string.
   * @throws {ValidationError} If the input is invalid or if ChaCha20-Poly1305 is not supported.
   * @throws {BaseError} If decryption or authentication fails.
   * @example
   * const decrypted = CryptUtils.chacha20Decrypt({ encryptedData, key, nonce, authTag });
   * console.log(decrypted);
   */
  public static chacha20Decrypt({
    encryptedData,
    key,
    nonce,
    authTag,
  }: {
    encryptedData: string;
    key: Buffer;
    nonce: Buffer;
    authTag: string;
  }): string {
    if (!CryptUtils.isAlgorithmSupported('chacha20-poly1305')) {
      throw new ValidationError(
        'ChaCha20-Poly1305 algorithm is not supported in this Node.js version.',
      );
    }

    if (key.length !== 32) {
      throw new ValidationError('Invalid key: must be 32 bytes.');
    }
    if (nonce.length !== 12) {
      throw new ValidationError('Invalid nonce: must be 12 bytes.');
    }
    if (typeof authTag !== 'string' || authTag.length === 0) {
      throw new ValidationError(
        'Invalid authTag: must be a non-empty Base64 string.',
      );
    }

    try {
      const decipher = crypto.createDecipheriv('chacha20-poly1305', key, nonce, {
        authTagLength: 16,
      });
      decipher.setAuthTag(Buffer.from(authTag, 'base64'));
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to decrypt data using ChaCha20-Poly1305: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Generates an RSA key pair.
   * @param params The parameters object.
   * @param params.modulusLength The length of the key in bits (default: 2048).
   * @returns An object containing the public and private keys in PEM format.
   *
   * Security: the `privateKey` is emitted as an UNENCRYPTED PEM. Treat it as a
   * secret, never log it, and store it encrypted at rest.
   * @throws {BaseError} If key generation fails.
   * @example
   * const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({ modulusLength: 2048 });
   * console.log(publicKey, privateKey);
   */
  public static rsaGenerateKeyPair({
    modulusLength = 2048,
  }: {
    modulusLength?: number;
  } = {}): {
    publicKey: string;
    privateKey: string;
  } {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
      });
      return { publicKey, privateKey };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to generate RSA key pair: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Encrypts data using an RSA public key with OAEP padding (SHA-256).
   * @param params The parameters object.
   * @param params.data The string to encrypt.
   * @param params.publicKey The public key in PEM format.
   * @returns The encrypted data in Base64 format.
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If encryption fails.
   * @example
   * const encrypted = CryptUtils.rsaEncrypt({ data: 'Hello, World!', publicKey });
   * console.log(encrypted);
   */
  public static rsaEncrypt({
    data,
    publicKey,
  }: {
    data: string;
    publicKey: string;
  }): string {
    if (!data || typeof data !== 'string') {
      throw new ValidationError(
        'Invalid input: data must be a non-empty string.',
      );
    }
    if (!publicKey || typeof publicKey !== 'string') {
      throw new ValidationError(
        'Invalid input: publicKey must be a non-empty string.',
      );
    }

    try {
      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(data, 'utf8'),
      );
      return encrypted.toString('base64');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to encrypt data using RSA: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Decrypts data encrypted with an RSA public key using the private key,
   * with OAEP padding (SHA-256). The padding must match the one used during
   * encryption.
   * @param params The parameters object.
   * @param params.encryptedData The encrypted data in Base64 format.
   * @param params.privateKey The private key in PEM format.
   * @returns The decrypted string.
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If decryption fails.
   * @example
   * const decrypted = CryptUtils.rsaDecrypt({ encryptedData, privateKey });
   * console.log(decrypted);
   */
  public static rsaDecrypt({
    encryptedData,
    privateKey,
  }: {
    encryptedData: string;
    privateKey: string;
  }): string {
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new ValidationError(
        'Invalid input: encryptedData must be a non-empty string.',
      );
    }
    if (!privateKey || typeof privateKey !== 'string') {
      throw new ValidationError(
        'Invalid input: privateKey must be a non-empty string.',
      );
    }

    try {
      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(encryptedData, 'base64'),
      );
      return decrypted.toString('utf8');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to decrypt data using RSA: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Signs data using an RSA private key.
   * @param params The parameters object.
   * @param params.data The string to sign.
   * @param params.privateKey The private key in PEM format.
   * @returns The signature in Base64 format.
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If signing fails.
   * @example
   * const signature = CryptUtils.rsaSign({ data: 'My data', privateKey });
   * console.log(signature);
   */
  public static rsaSign({
    data,
    privateKey,
  }: {
    data: string;
    privateKey: string;
  }): string {
    if (!data || typeof data !== 'string') {
      throw new ValidationError(
        'Invalid input: data must be a non-empty string.',
      );
    }
    if (!privateKey || typeof privateKey !== 'string') {
      throw new ValidationError(
        'Invalid input: privateKey must be a non-empty string.',
      );
    }

    try {
      const signer = crypto.createSign('sha256');
      signer.update(data);
      signer.end();
      return signer.sign(privateKey, 'base64');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to sign data using RSA: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Verifies a signature using an RSA public key.
   * @param params The parameters object.
   * @param params.data The original string that was signed.
   * @param params.signature The signature to verify in Base64 format.
   * @param params.publicKey The public key in PEM format.
   * @returns `true` if the signature is valid, otherwise `false`.
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If verification fails.
   * @example
   * const isValid = CryptUtils.rsaVerify({ data: 'My data', signature, publicKey });
   * console.log(isValid); // true or false
   */
  public static rsaVerify({
    data,
    signature,
    publicKey,
  }: {
    data: string;
    signature: string;
    publicKey: string;
  }): boolean {
    if (!data || typeof data !== 'string') {
      throw new ValidationError(
        'Invalid input: data must be a non-empty string.',
      );
    }
    if (!signature || typeof signature !== 'string') {
      throw new ValidationError(
        'Invalid input: signature must be a non-empty string.',
      );
    }
    if (!publicKey || typeof publicKey !== 'string') {
      throw new ValidationError(
        'Invalid input: publicKey must be a non-empty string.',
      );
    }

    try {
      const verifier = crypto.createVerify('sha256');
      verifier.update(data);
      verifier.end();
      return verifier.verify(publicKey, signature, 'base64');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to verify signature using RSA: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Generates an ECC key pair.
   * @param params The parameters object.
   * @param params.curve The elliptic curve to use (default: 'prime256v1').
   * @returns An object containing the public and private keys in PEM format.
   *
   * Security: the `privateKey` is emitted as an UNENCRYPTED PEM. Treat it as a
   * secret, never log it, and store it encrypted at rest.
   * @throws {BaseError} If key generation fails.
   * @example
   * const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair({ curve: 'prime256v1' });
   * console.log(publicKey, privateKey);
   */
  public static eccGenerateKeyPair({
    curve = 'prime256v1',
  }: {
    curve?: string;
  } = {}): {
    publicKey: string;
    privateKey: string;
  } {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: curve,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      return { publicKey, privateKey };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to generate ECC key pair: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Signs data using an ECC private key.
   * @param params The parameters object.
   * @param params.data The string to sign.
   * @param params.privateKey The private key in PEM format.
   * @returns The signature in Base64 format.
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If signing fails.
   * @example
   * const signature = CryptUtils.eccSign({ data: 'My data', privateKey });
   * console.log(signature);
   */
  public static eccSign({
    data,
    privateKey,
  }: {
    data: string;
    privateKey: string;
  }): string {
    if (!data || typeof data !== 'string') {
      throw new ValidationError(
        'Invalid input: data must be a non-empty string.',
      );
    }
    if (!privateKey || typeof privateKey !== 'string') {
      throw new ValidationError(
        'Invalid input: privateKey must be a non-empty string.',
      );
    }

    try {
      const signer = crypto.createSign('sha256');
      signer.update(data);
      signer.end();
      return signer.sign(privateKey, 'base64');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to sign data using ECC: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Verifies a signature using an ECC public key.
   * @param params The parameters object.
   * @param params.data The original string that was signed.
   * @param params.signature The signature to verify in Base64 format.
   * @param params.publicKey The public key in PEM format.
   * @returns `true` if the signature is valid, otherwise `false`.
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If verification fails.
   * @example
   * const isValid = CryptUtils.eccVerify({ data: 'My data', signature, publicKey });
   * console.log(isValid); // true or false
   */
  public static eccVerify({
    data,
    signature,
    publicKey,
  }: {
    data: string;
    signature: string;
    publicKey: string;
  }): boolean {
    if (!data || typeof data !== 'string') {
      throw new ValidationError(
        'Invalid input: data must be a non-empty string.',
      );
    }
    if (!signature || typeof signature !== 'string') {
      throw new ValidationError(
        'Invalid input: signature must be a non-empty string.',
      );
    }
    if (!publicKey || typeof publicKey !== 'string') {
      throw new ValidationError(
        'Invalid input: publicKey must be a non-empty string.',
      );
    }

    try {
      const verifier = crypto.createVerify('sha256');
      verifier.update(data);
      verifier.end();
      return verifier.verify(publicKey, signature, 'base64');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to verify signature using ECC: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }
}
