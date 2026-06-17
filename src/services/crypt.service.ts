import * as crypto from 'crypto';
import { BaseError, ValidationError } from '../errors';

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
   * Generates a random Initialization Vector (IV) for AES encryption.
   * @returns A 16-byte IV as a hexadecimal string.
   */
  public static generateIV(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Encrypts a string or JSON object using AES-256-CBC with optional IV generation.
   * @param params The parameters object.
   * @param params.data The string or JSON to encrypt.
   * @param params.secretKey A 32-byte secret key.
   * @param params.iv A 16-byte initialization vector (IV). If not provided, a random IV is generated.
   * @returns The encrypted data in Base64 format and the IV used.
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If encryption fails.
   * @example
   * const { encryptedData, iv } = CryptUtils.aesEncrypt({ data: 'Hello', secretKey });
   * console.log(encryptedData, iv);
   */
  public static aesEncrypt({
    data,
    secretKey,
    iv,
  }: {
    data: string | object;
    secretKey: string;
    iv?: string;
  }): { encryptedData: string; iv: string } {
    const usedIV = iv || CryptUtils.generateIV();

    if (typeof data !== 'string' && typeof data !== 'object') {
      throw new ValidationError(
        'Invalid input: data must be a string or JSON object.',
      );
    }
    if (secretKey.length !== 32) {
      throw new ValidationError('Invalid secretKey: must be 32 bytes.');
    }

    try {
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(secretKey),
        Buffer.from(usedIV, 'hex'),
      );
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      const encrypted = Buffer.concat([
        cipher.update(jsonData, 'utf8'),
        cipher.final(),
      ]);
      return {
        encryptedData: encrypted.toString('base64'),
        iv: usedIV,
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
   * Decrypts an AES-256-CBC encrypted string.
   * @param params The parameters object.
   * @param params.encryptedData The encrypted data in Base64 format.
   * @param params.secretKey A 32-byte secret key.
   * @param params.iv A 16-byte initialization vector (IV).
   * @returns The decrypted string or JSON object.
   * @throws {ValidationError} If the input is invalid.
   * @throws {BaseError} If decryption fails.
   * @example
   * const decrypted = CryptUtils.aesDecrypt({ encryptedData, secretKey, iv });
   * console.log(decrypted);
   */
  public static aesDecrypt({
    encryptedData,
    secretKey,
    iv,
  }: {
    encryptedData: string;
    secretKey: string;
    iv: string;
  }): string | object {
    if (typeof encryptedData !== 'string') {
      throw new ValidationError('Invalid input: encryptedData must be a string.');
    }
    if (secretKey.length !== 32) {
      throw new ValidationError('Invalid secretKey: must be 32 bytes.');
    }
    if (iv.length !== 32) {
      throw new ValidationError(
        'Invalid IV: must be 16 bytes in hexadecimal format.',
      );
    }

    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(secretKey),
        Buffer.from(iv, 'hex'),
      );
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
   * Encrypts data using ChaCha20.
   * @param params The parameters object.
   * @param params.data The string to encrypt.
   * @param params.key A 32-byte key.
   * @param params.nonce A 12-byte nonce.
   * @returns The encrypted data in Base64 format.
   * @throws {ValidationError} If the input is invalid or if ChaCha20 is not supported.
   * @throws {BaseError} If encryption fails.
   * @example
   * const encrypted = CryptUtils.chacha20Encrypt({ data: 'Hello', key, nonce });
   * console.log(encrypted);
   */
  public static chacha20Encrypt({
    data,
    key,
    nonce,
  }: {
    data: string;
    key: Buffer;
    nonce: Buffer;
  }): string {
    if (!CryptUtils.isAlgorithmSupported('chacha20')) {
      throw new ValidationError(
        'ChaCha20 algorithm is not supported in this Node.js version.',
      );
    }

    if (key.length !== 32) {
      throw new ValidationError('Invalid key: must be 32 bytes.');
    }
    if (nonce.length !== 12) {
      throw new ValidationError('Invalid nonce: must be 12 bytes.');
    }

    try {
      const cipher = crypto.createCipheriv('chacha20', key, nonce);
      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      return encrypted.toString('base64');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to encrypt data using ChaCha20: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Decrypts data encrypted using ChaCha20.
   * @param params The parameters object.
   * @param params.encryptedData The encrypted data in Base64 format.
   * @param params.key A 32-byte key.
   * @param params.nonce A 12-byte nonce.
   * @returns The decrypted string.
   * @throws {ValidationError} If the input is invalid or if ChaCha20 is not supported.
   * @throws {BaseError} If decryption fails.
   * @example
   * const decrypted = CryptUtils.chacha20Decrypt({ encryptedData, key, nonce });
   * console.log(decrypted);
   */
  public static chacha20Decrypt({
    encryptedData,
    key,
    nonce,
  }: {
    encryptedData: string;
    key: Buffer;
    nonce: Buffer;
  }): string {
    if (!CryptUtils.isAlgorithmSupported('chacha20')) {
      throw new ValidationError(
        'ChaCha20 algorithm is not supported in this Node.js version.',
      );
    }

    if (key.length !== 32) {
      throw new ValidationError('Invalid key: must be 32 bytes.');
    }
    if (nonce.length !== 12) {
      throw new ValidationError('Invalid nonce: must be 12 bytes.');
    }

    try {
      const decipher = crypto.createDecipheriv('chacha20', key, nonce);
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to decrypt data using ChaCha20: ${errorMessage}`,
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
   * Encrypts data using an RSA public key.
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
        publicKey,
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
   * Decrypts data encrypted with an RSA public key using the private key.
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
        privateKey,
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
   * @param params.curve The elliptic curve to use (default: 'secp256k1').
   * @returns An object containing the public and private keys in PEM format.
   * @throws {BaseError} If key generation fails.
   * @example
   * const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair({ curve: 'secp256k1' });
   * console.log(publicKey, privateKey);
   */
  public static eccGenerateKeyPair({
    curve = 'secp256k1',
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

  /**
   * Encrypts data using RC4.
   * @param params The parameters object.
   * @param params.data The string to encrypt.
   * @param params.key The key for encryption.
   * @returns The encrypted data in Base64 format.
   * @throws {ValidationError} If the input is invalid or if RC4 is not supported.
   * @throws {BaseError} If encryption fails.
   * @example
   * const encrypted = CryptUtils.rc4Encrypt({ data: 'Hello, World!', key: 'mySecretKey' });
   * console.log(encrypted);
   */
  public static rc4Encrypt({
    data,
    key,
  }: {
    data: string;
    key: string;
  }): string {
    if (!CryptUtils.isAlgorithmSupported('rc4')) {
      throw new ValidationError(
        'RC4 algorithm is not supported in this Node.js version.',
      );
    }

    if (!data || typeof data !== 'string') {
      throw new ValidationError(
        'Invalid input: data must be a non-empty string.',
      );
    }
    if (!key || typeof key !== 'string') {
      throw new ValidationError('Invalid key: must be a non-empty string.');
    }

    try {
      const cipher = crypto.createCipheriv('rc4', Buffer.from(key), null);
      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      return encrypted.toString('base64');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to encrypt data using RC4: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Decrypts data encrypted using RC4.
   * @param params The parameters object.
   * @param params.encryptedData The encrypted data in Base64 format.
   * @param params.key The key for decryption.
   * @returns The decrypted string.
   * @throws {ValidationError} If the input is invalid or if RC4 is not supported.
   * @throws {BaseError} If decryption fails.
   * @example
   * const decrypted = CryptUtils.rc4Decrypt({ encryptedData, key: 'mySecretKey' });
   * console.log(decrypted);
   */
  public static rc4Decrypt({
    encryptedData,
    key,
  }: {
    encryptedData: string;
    key: string;
  }): string {
    if (!CryptUtils.isAlgorithmSupported('rc4')) {
      throw new ValidationError(
        'RC4 algorithm is not supported in this Node.js version.',
      );
    }

    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new ValidationError(
        'Invalid input: encryptedData must be a non-empty string.',
      );
    }
    if (!key || typeof key !== 'string') {
      throw new ValidationError('Invalid key: must be a non-empty string.');
    }

    try {
      const decipher = crypto.createDecipheriv('rc4', Buffer.from(key), null);
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BaseError(
        `Failed to decrypt data using RC4: ${errorMessage}`,
        'CRYPTO_ERROR',
        undefined,
        undefined,
        { cause: error },
      );
    }
  }
}
