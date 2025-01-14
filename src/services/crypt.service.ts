import * as crypto from 'crypto';
import { handleError } from '../utils/error.util';

export class CryptUtils {
  /**
   * Generates a random Initialization Vector (IV) for AES encryption.
   * @returns A 16-byte IV as a hexadecimal string.
   */
  public static generateIV(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Encrypts a string or JSON object using AES-256-CBC with optional IV generation.
   * @param data The string or JSON to encrypt.
   * @param secretKey A 32-byte secret key.
   * @param iv A 16-byte initialization vector (IV). If not provided, a random IV is generated.
   * @returns The encrypted data in Base64 format and the IV used.
   * @throws {Error} If encryption fails.
   */
  public static aesEncrypt(
    data: string | object,
    secretKey: string,
    iv?: string,
  ): { encryptedData: string; iv: string } {
    const usedIV = iv || CryptUtils.generateIV();

    if (typeof data !== 'string' && typeof data !== 'object') {
      throw new Error('Invalid input: data must be a string or JSON object.');
    }
    if (secretKey.length !== 32) {
      throw new Error('Invalid secretKey: must be 32 bytes.');
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
      return handleError('Failed to encrypt data using AES', error);
    }
  }

  /**
   * Decrypts an AES-256-CBC encrypted string.
   * @param encryptedData The encrypted data in Base64 format.
   * @param secretKey A 32-byte secret key.
   * @param iv A 16-byte initialization vector (IV).
   * @returns The decrypted string or JSON object.
   * @throws {Error} If decryption fails.
   */
  public static aesDecrypt(
    encryptedData: string,
    secretKey: string,
    iv: string,
  ): string | object {
    if (typeof encryptedData !== 'string') {
      throw new Error('Invalid input: encryptedData must be a string.');
    }
    if (secretKey.length !== 32) {
      throw new Error('Invalid secretKey: must be 32 bytes.');
    }
    if (iv.length !== 32) {
      throw new Error('Invalid IV: must be 16 bytes in hexadecimal format.');
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
      return handleError('Failed to decrypt data using AES', error);
    }
  }

  /**
   * Encrypts data using ChaCha20.
   * @param data The string to encrypt.
   * @param key A 32-byte key.
   * @param nonce A 12-byte nonce.
   * @returns The encrypted data in Base64 format.
   */
  public static chacha20Encrypt(
    data: string,
    key: Buffer,
    nonce: Buffer,
  ): string {
    if (key.length !== 32) {
      throw new Error('Invalid key: must be 32 bytes.');
    }
    if (nonce.length !== 12) {
      throw new Error('Invalid nonce: must be 12 bytes.');
    }

    const cipher = crypto.createCipheriv('chacha20', key, nonce);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final(),
    ]);
    return encrypted.toString('base64');
  }

  /**
   * Decrypts data encrypted using ChaCha20.
   * @param encryptedData The encrypted data in Base64 format.
   * @param key A 32-byte key.
   * @param nonce A 12-byte nonce.
   * @returns The decrypted string.
   */
  public static chacha20Decrypt(
    encryptedData: string,
    key: Buffer,
    nonce: Buffer,
  ): string {
    if (key.length !== 32) {
      throw new Error('Invalid key: must be 32 bytes.');
    }
    if (nonce.length !== 12) {
      throw new Error('Invalid nonce: must be 12 bytes.');
    }

    const decipher = crypto.createDecipheriv('chacha20', key, nonce);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData, 'base64')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }

  /**
   * Generates an RSA key pair.
   * @param modulusLength The length of the key in bits (default: 2048).
   * @returns An object containing the public and private keys in PEM format.
   * @throws {Error} If key generation fails.
   * @example
   * const { publicKey, privateKey } = HashUtils.generateRSAKeyPair(2048);
   * console.log(publicKey, privateKey);
   */
  public static rsaGenerateKeyPair(modulusLength: number = 2048): {
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
      handleError('Failed to generate RSA key pair', error);
    }
  }

  /**
   * Encrypts data using an RSA public key.
   * @param data The string to encrypt.
   * @param publicKey The public key in PEM format.
   * @returns The encrypted data in Base64 format.
   * @throws {Error} If encryption fails.
   * @example
   * const encrypted = HashUtils.rsaEncrypt('Hello, World!', publicKey);
   * console.log(encrypted);
   */
  public static rsaEncrypt(data: string, publicKey: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error('Invalid input: publicKey must be a non-empty string.');
    }

    try {
      const encrypted = crypto.publicEncrypt(
        publicKey,
        Buffer.from(data, 'utf8'),
      );
      return encrypted.toString('base64');
    } catch (error) {
      handleError('Failed to encrypt data using RSA', error);
    }
  }

  /**
   * Decrypts data encrypted with an RSA public key using the private key.
   * @param encryptedData The encrypted data in Base64 format.
   * @param privateKey The private key in PEM format.
   * @returns The decrypted string.
   * @throws {Error} If decryption fails.
   * @example
   * const decrypted = HashUtils.rsaDecrypt(encryptedData, privateKey);
   * console.log(decrypted);
   */
  public static rsaDecrypt(encryptedData: string, privateKey: string): string {
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error(
        'Invalid input: encryptedData must be a non-empty string.',
      );
    }
    if (!privateKey || typeof privateKey !== 'string') {
      throw new Error('Invalid input: privateKey must be a non-empty string.');
    }

    try {
      const decrypted = crypto.privateDecrypt(
        privateKey,
        Buffer.from(encryptedData, 'base64'),
      );
      return decrypted.toString('utf8');
    } catch (error) {
      handleError('Failed to decrypt data using RSA', error);
    }
  }

  /**
   * Signs data using an RSA private key.
   * @param data The string to sign.
   * @param privateKey The private key in PEM format.
   * @returns The signature in Base64 format.
   * @throws {Error} If signing fails.
   * @example
   * const signature = HashUtils.rsaSign('My data', privateKey);
   * console.log(signature);
   */
  public static rsaSign(data: string, privateKey: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!privateKey || typeof privateKey !== 'string') {
      throw new Error('Invalid input: privateKey must be a non-empty string.');
    }

    try {
      const signer = crypto.createSign('sha256');
      signer.update(data);
      signer.end();
      return signer.sign(privateKey, 'base64');
    } catch (error) {
      handleError('Failed to sign data using RSA', error);
    }
  }

  /**
   * Verifies a signature using an RSA public key.
   * @param data The original string that was signed.
   * @param signature The signature to verify in Base64 format.
   * @param publicKey The public key in PEM format.
   * @returns `true` if the signature is valid, otherwise `false`.
   * @throws {Error} If verification fails.
   * @example
   * const isValid = HashUtils.rsaVerify('My data', signature, publicKey);
   * console.log(isValid); // true or false
   */
  public static rsaVerify(
    data: string,
    signature: string,
    publicKey: string,
  ): boolean {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!signature || typeof signature !== 'string') {
      throw new Error('Invalid input: signature must be a non-empty string.');
    }
    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error('Invalid input: publicKey must be a non-empty string.');
    }

    try {
      const verifier = crypto.createVerify('sha256');
      verifier.update(data);
      verifier.end();
      return verifier.verify(publicKey, signature, 'base64');
    } catch (error) {
      handleError('Failed to verify signature using RSA', error);
    }
  }

  /**
   * Generates an ECC key pair.
   * @param curve The elliptic curve to use (default: 'secp256k1').
   * @returns An object containing the public and private keys in PEM format.
   * @throws {Error} If key generation fails.
   * @example
   * const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
   * console.log(publicKey, privateKey);
   */
  public static eccGenerateKeyPair(curve: string = 'secp256k1'): {
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
      handleError('Failed to generate ECC key pair', error);
    }
  }

  /**
   * Signs data using an ECC private key.
   * @param data The string to sign.
   * @param privateKey The private key in PEM format.
   * @returns The signature in Base64 format.
   * @throws {Error} If signing fails.
   * @example
   * const signature = CryptUtils.eccSign('My data', privateKey);
   * console.log(signature);
   */
  public static eccSign(data: string, privateKey: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!privateKey || typeof privateKey !== 'string') {
      throw new Error('Invalid input: privateKey must be a non-empty string.');
    }

    try {
      const signer = crypto.createSign('sha256');
      signer.update(data);
      signer.end();
      return signer.sign(privateKey, 'base64');
    } catch (error) {
      handleError('Failed to sign data using ECC', error);
    }
  }

  /**
   * Verifies a signature using an ECC public key.
   * @param data The original string that was signed.
   * @param signature The signature to verify in Base64 format.
   * @param publicKey The public key in PEM format.
   * @returns `true` if the signature is valid, otherwise `false`.
   * @throws {Error} If verification fails.
   * @example
   * const isValid = CryptUtils.eccVerify('My data', signature, publicKey);
   * console.log(isValid); // true or false
   */
  public static eccVerify(
    data: string,
    signature: string,
    publicKey: string,
  ): boolean {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!signature || typeof signature !== 'string') {
      throw new Error('Invalid input: signature must be a non-empty string.');
    }
    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error('Invalid input: publicKey must be a non-empty string.');
    }

    try {
      const verifier = crypto.createVerify('sha256');
      verifier.update(data);
      verifier.end();
      return verifier.verify(publicKey, signature, 'base64');
    } catch (error) {
      handleError('Failed to verify signature using ECC', error);
    }
  }

  /**
   * Encrypts data using Blowfish with CBC mode.
   * @param data The string to encrypt.
   * @param key The key for encryption (up to 56 bytes).
   * @param iv A 8-byte initialization vector (IV).
   * @returns The encrypted data in Base64 format.
   * @throws {Error} If encryption fails.
   * @example
   * const encrypted = CryptUtils.blowfishEncrypt('Hello, World!', 'mySecretKey', '12345678');
   * console.log(encrypted);
   */
  public static blowfishEncrypt(data: string, key: string, iv: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!key || typeof key !== 'string' || key.length > 56) {
      throw new Error(
        'Invalid key: must be a non-empty string up to 56 bytes.',
      );
    }
    if (!iv || iv.length !== 8) {
      throw new Error('Invalid IV: must be 8 bytes.');
    }

    try {
      const cipher = crypto.createCipheriv(
        'bf-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      return encrypted.toString('base64');
    } catch (error) {
      handleError('Failed to encrypt data using Blowfish', error);
    }
  }

  /**
   * Decrypts data encrypted using Blowfish with CBC mode.
   * @param encryptedData The encrypted data in Base64 format.
   * @param key The key for decryption (up to 56 bytes).
   * @param iv A 8-byte initialization vector (IV).
   * @returns The decrypted string.
   * @throws {Error} If decryption fails.
   * @example
   * const decrypted = CryptUtils.blowfishDecrypt(encryptedData, 'mySecretKey', '12345678');
   * console.log(decrypted);
   */
  public static blowfishDecrypt(
    encryptedData: string,
    key: string,
    iv: string,
  ): string {
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error(
        'Invalid input: encryptedData must be a non-empty string.',
      );
    }
    if (!key || typeof key !== 'string' || key.length > 56) {
      throw new Error(
        'Invalid key: must be a non-empty string up to 56 bytes.',
      );
    }
    if (!iv || iv.length !== 8) {
      throw new Error('Invalid IV: must be 8 bytes.');
    }

    try {
      const decipher = crypto.createDecipheriv(
        'bf-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      handleError('Failed to decrypt data using Blowfish', error);
    }
  }

  /**
   * Encrypts data using Triple DES (3DES) with CBC mode.
   * @param data The string to encrypt.
   * @param key The key for encryption (must be 24 bytes).
   * @param iv A 8-byte initialization vector (IV).
   * @returns The encrypted data in Base64 format.
   * @throws {Error} If encryption fails.
   * @example
   * const encrypted = CryptUtils.tripleDESEncrypt('Hello, World!', 'my24ByteSecretKey123456', '12345678');
   * console.log(encrypted);
   */
  public static tripleDESEncrypt(
    data: string,
    key: string,
    iv: string,
  ): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!key || typeof key !== 'string' || key.length !== 24) {
      throw new Error('Invalid key: must be a 24-byte string.');
    }
    if (!iv || iv.length !== 8) {
      throw new Error('Invalid IV: must be 8 bytes.');
    }

    try {
      const cipher = crypto.createCipheriv(
        'des-ede3-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      return encrypted.toString('base64');
    } catch (error) {
      handleError('Failed to encrypt data using Triple DES', error);
    }
  }

  /**
   * Decrypts data encrypted using Triple DES (3DES) with CBC mode.
   * @param encryptedData The encrypted data in Base64 format.
   * @param key The key for decryption (must be 24 bytes).
   * @param iv A 8-byte initialization vector (IV).
   * @returns The decrypted string.
   * @throws {Error} If decryption fails.
   * @example
   * const decrypted = CryptUtils.tripleDESDecrypt(encryptedData, 'my24ByteSecretKey123456', '12345678');
   * console.log(decrypted);
   */
  public static tripleDESDecrypt(
    encryptedData: string,
    key: string,
    iv: string,
  ): string {
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error(
        'Invalid input: encryptedData must be a non-empty string.',
      );
    }
    if (!key || typeof key !== 'string' || key.length !== 24) {
      throw new Error('Invalid key: must be a 24-byte string.');
    }
    if (!iv || iv.length !== 8) {
      throw new Error('Invalid IV: must be 8 bytes.');
    }

    try {
      const decipher = crypto.createDecipheriv(
        'des-ede3-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      handleError('Failed to decrypt data using Triple DES', error);
    }
  }

  /**
   * Encrypts data using RC4.
   * @param data The string to encrypt.
   * @param key The key for encryption.
   * @returns The encrypted data in Base64 format.
   * @throws {Error} If encryption fails.
   * @example
   * const encrypted = CryptUtils.rc4Encrypt('Hello, World!', 'mySecretKey');
   * console.log(encrypted);
   */
  public static rc4Encrypt(data: string, key: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid key: must be a non-empty string.');
    }

    try {
      const cipher = crypto.createCipheriv('rc4', Buffer.from(key), null);
      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      return encrypted.toString('base64');
    } catch (error) {
      handleError('Failed to encrypt data using RC4', error);
    }
  }

  /**
   * Decrypts data encrypted using RC4.
   * @param encryptedData The encrypted data in Base64 format.
   * @param key The key for decryption.
   * @returns The decrypted string.
   * @throws {Error} If decryption fails.
   * @example
   * const decrypted = CryptUtils.rc4Decrypt(encryptedData, 'mySecretKey');
   * console.log(decrypted);
   */
  public static rc4Decrypt(encryptedData: string, key: string): string {
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error(
        'Invalid input: encryptedData must be a non-empty string.',
      );
    }
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid key: must be a non-empty string.');
    }

    try {
      const decipher = crypto.createDecipheriv('rc4', Buffer.from(key), null);
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      handleError('Failed to decrypt data using RC4', error);
    }
  }

  /**
   * Encrypts data using Camellia with CBC mode.
   * @param data The string to encrypt.
   * @param key The key for encryption (16, 24, or 32 bytes).
   * @param iv A 16-byte initialization vector (IV).
   * @returns The encrypted data in Base64 format.
   * @throws {Error} If encryption fails.
   * @example
   * const encrypted = CryptUtils.camelliaEncrypt('Hello, World!', 'my32ByteSecretKeyForEncryption', '1234567890abcdef');
   * console.log(encrypted);
   */
  public static camelliaEncrypt(data: string, key: string, iv: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!key || typeof key !== 'string' || ![16, 24, 32].includes(key.length)) {
      throw new Error('Invalid key: must be 16, 24, or 32 bytes.');
    }
    if (!iv || iv.length !== 16) {
      throw new Error('Invalid IV: must be 16 bytes.');
    }

    try {
      const cipher = crypto.createCipheriv(
        'camellia-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      return encrypted.toString('base64');
    } catch (error) {
      handleError('Failed to encrypt data using Camellia', error);
    }
  }

  /**
   * Decrypts data encrypted using Camellia with CBC mode.
   * @param encryptedData The encrypted data in Base64 format.
   * @param key The key for decryption (16, 24, or 32 bytes).
   * @param iv A 16-byte initialization vector (IV).
   * @returns The decrypted string.
   * @throws {Error} If decryption fails.
   * @example
   * const decrypted = CryptUtils.camelliaDecrypt(encryptedData, 'my32ByteSecretKeyForEncryption', '1234567890abcdef');
   * console.log(decrypted);
   */
  public static camelliaDecrypt(
    encryptedData: string,
    key: string,
    iv: string,
  ): string {
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error(
        'Invalid input: encryptedData must be a non-empty string.',
      );
    }
    if (!key || typeof key !== 'string' || ![16, 24, 32].includes(key.length)) {
      throw new Error('Invalid key: must be 16, 24, or 32 bytes.');
    }
    if (!iv || iv.length !== 16) {
      throw new Error('Invalid IV: must be 16 bytes.');
    }

    try {
      const decipher = crypto.createDecipheriv(
        'camellia-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      handleError('Failed to decrypt data using Camellia', error);
    }
  }

  /**
   * Encrypts data using Serpent with CBC mode.
   * @param data The string to encrypt.
   * @param key The key for encryption (16, 24, or 32 bytes).
   * @param iv A 16-byte initialization vector (IV).
   * @returns The encrypted data in Base64 format.
   * @throws {Error} If encryption fails.
   * @example
   * const encrypted = CryptUtils.serpentEncrypt('Hello, World!', 'my32ByteSecretKeyForEncryption', '1234567890abcdef');
   * console.log(encrypted);
   */
  public static serpentEncrypt(data: string, key: string, iv: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!key || typeof key !== 'string' || ![16, 24, 32].includes(key.length)) {
      throw new Error('Invalid key: must be 16, 24, or 32 bytes.');
    }
    if (!iv || iv.length !== 16) {
      throw new Error('Invalid IV: must be 16 bytes.');
    }

    try {
      const cipher = crypto.createCipheriv(
        'serpent-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      return encrypted.toString('base64');
    } catch (error) {
      handleError('Failed to encrypt data using Serpent', error);
    }
  }

  /**
   * Decrypts data encrypted using Serpent with CBC mode.
   * @param encryptedData The encrypted data in Base64 format.
   * @param key The key for decryption (16, 24, or 32 bytes).
   * @param iv A 16-byte initialization vector (IV).
   * @returns The decrypted string.
   * @throws {Error} If decryption fails.
   * @example
   * const decrypted = CryptUtils.serpentDecrypt(encryptedData, 'my32ByteSecretKeyForEncryption', '1234567890abcdef');
   * console.log(decrypted);
   */
  public static serpentDecrypt(
    encryptedData: string,
    key: string,
    iv: string,
  ): string {
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error(
        'Invalid input: encryptedData must be a non-empty string.',
      );
    }
    if (!key || typeof key !== 'string' || ![16, 24, 32].includes(key.length)) {
      throw new Error('Invalid key: must be 16, 24, or 32 bytes.');
    }
    if (!iv || iv.length !== 16) {
      throw new Error('Invalid IV: must be 16 bytes.');
    }

    try {
      const decipher = crypto.createDecipheriv(
        'serpent-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      handleError('Failed to decrypt data using Serpent', error);
    }
  }

  /**
   * Generates a DSA key pair.
   * @param modulusLength The length of the key in bits (default: 2048).
   * @returns An object containing the public and private keys in PEM format.
   * @throws {Error} If key generation fails.
   * @example
   * const { publicKey, privateKey } = CryptUtils.dsaGenerateKeyPair();
   * console.log(publicKey, privateKey);
   */
  public static dsaGenerateKeyPair(modulusLength: number = 2048): {
    publicKey: string;
    privateKey: string;
  } {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('dsa', {
        modulusLength,
        divisorLength: 256,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      return { publicKey, privateKey };
    } catch (error) {
      handleError('Failed to generate DSA key pair', error);
    }
  }

  /**
   * Signs data using a DSA private key.
   * @param data The string to sign.
   * @param privateKey The private key in PEM format.
   * @returns The signature in Base64 format.
   * @throws {Error} If signing fails.
   * @example
   * const signature = CryptUtils.dsaSign('My data', privateKey);
   * console.log(signature);
   */
  public static dsaSign(data: string, privateKey: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!privateKey || typeof privateKey !== 'string') {
      throw new Error('Invalid input: privateKey must be a non-empty string.');
    }

    try {
      const signer = crypto.createSign('sha256');
      signer.update(data);
      signer.end();
      return signer.sign(privateKey, 'base64');
    } catch (error) {
      handleError('Failed to sign data using DSA', error);
    }
  }

  /**
   * Verifies a DSA signature using a public key.
   * @param data The original string that was signed.
   * @param signature The signature to verify in Base64 format.
   * @param publicKey The public key in PEM format.
   * @returns `true` if the signature is valid, otherwise `false`.
   * @throws {Error} If verification fails.
   * @example
   * const isValid = CryptUtils.dsaVerify('My data', signature, publicKey);
   * console.log(isValid); // true or false
   */
  public static dsaVerify(
    data: string,
    signature: string,
    publicKey: string,
  ): boolean {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!signature || typeof signature !== 'string') {
      throw new Error('Invalid input: signature must be a non-empty string.');
    }
    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error('Invalid input: publicKey must be a non-empty string.');
    }

    try {
      const verifier = crypto.createVerify('sha256');
      verifier.update(data);
      verifier.end();
      return verifier.verify(publicKey, signature, 'base64');
    } catch (error) {
      handleError('Failed to verify DSA signature', error);
    }
  }

  /**
   * Generates an EdDSA key pair (using Ed25519).
   * @returns An object containing the public and private keys in PEM format.
   * @throws {Error} If key generation fails.
   * @example
   * const { publicKey, privateKey } = CryptUtils.eddsaGenerateKeyPair();
   * console.log(publicKey, privateKey);
   */
  public static eddsaGenerateKeyPair(): {
    publicKey: string;
    privateKey: string;
  } {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      return { publicKey, privateKey };
    } catch (error) {
      handleError('Failed to generate EdDSA key pair', error);
    }
  }

  /**
   * Signs data using an EdDSA private key.
   * @param data The string to sign.
   * @param privateKey The private key in PEM format.
   * @returns The signature in Base64 format.
   * @throws {Error} If signing fails.
   * @example
   * const signature = CryptUtils.eddsaSign('My data', privateKey);
   * console.log(signature);
   */
  public static eddsaSign(data: string, privateKey: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!privateKey || typeof privateKey !== 'string') {
      throw new Error('Invalid input: privateKey must be a non-empty string.');
    }

    try {
      const signer = crypto.createSign('sha256');
      signer.update(data);
      signer.end();
      return signer.sign(privateKey, 'base64');
    } catch (error) {
      handleError('Failed to sign data using EdDSA', error);
    }
  }

  /**
   * Verifies an EdDSA signature using a public key.
   * @param data The original string that was signed.
   * @param signature The signature to verify in Base64 format.
   * @param publicKey The public key in PEM format.
   * @returns `true` if the signature is valid, otherwise `false`.
   * @throws {Error} If verification fails.
   * @example
   * const isValid = CryptUtils.eddsaVerify('My data', signature, publicKey);
   * console.log(isValid); // true or false
   */
  public static eddsaVerify(
    data: string,
    signature: string,
    publicKey: string,
  ): boolean {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!signature || typeof signature !== 'string') {
      throw new Error('Invalid input: signature must be a non-empty string.');
    }
    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error('Invalid input: publicKey must be a non-empty string.');
    }

    try {
      const verifier = crypto.createVerify('sha256');
      verifier.update(data);
      verifier.end();
      return verifier.verify(publicKey, signature, 'base64');
    } catch (error) {
      handleError('Failed to verify EdDSA signature', error);
    }
  }

  /**
   * Encrypts data using Twofish with CBC mode.
   * @param data The string to encrypt.
   * @param key The key for encryption (16, 24, or 32 bytes).
   * @param iv A 16-byte initialization vector (IV).
   * @returns The encrypted data in Base64 format.
   * @throws {Error} If encryption fails.
   * @example
   * const encrypted = CryptUtils.twofishEncrypt('Hello, World!', 'my32ByteSecretKeyForEncryption', '1234567890abcdef');
   * console.log(encrypted);
   */
  public static twofishEncrypt(data: string, key: string, iv: string): string {
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid input: data must be a non-empty string.');
    }
    if (!key || typeof key !== 'string' || ![16, 24, 32].includes(key.length)) {
      throw new Error('Invalid key: must be 16, 24, or 32 bytes.');
    }
    if (!iv || iv.length !== 16) {
      throw new Error('Invalid IV: must be 16 bytes.');
    }

    try {
      const cipher = crypto.createCipheriv(
        'twofish-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final(),
      ]);
      return encrypted.toString('base64');
    } catch (error) {
      handleError('Failed to encrypt data using Twofish', error);
    }
  }

  /**
   * Decrypts data encrypted using Twofish with CBC mode.
   * @param encryptedData The encrypted data in Base64 format.
   * @param key The key for decryption (16, 24, or 32 bytes).
   * @param iv A 16-byte initialization vector (IV).
   * @returns The decrypted string.
   * @throws {Error} If decryption fails.
   * @example
   * const decrypted = CryptUtils.twofishDecrypt(encryptedData, 'my32ByteSecretKeyForEncryption', '1234567890abcdef');
   * console.log(decrypted);
   */
  public static twofishDecrypt(
    encryptedData: string,
    key: string,
    iv: string,
  ): string {
    if (!encryptedData || typeof encryptedData !== 'string') {
      throw new Error(
        'Invalid input: encryptedData must be a non-empty string.',
      );
    }
    if (!key || typeof key !== 'string' || ![16, 24, 32].includes(key.length)) {
      throw new Error('Invalid key: must be 16, 24, or 32 bytes.');
    }
    if (!iv || iv.length !== 16) {
      throw new Error('Invalid IV: must be 16 bytes.');
    }

    try {
      const decipher = crypto.createDecipheriv(
        'twofish-cbc',
        Buffer.from(key),
        Buffer.from(iv),
      );
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error) {
      handleError('Failed to decrypt data using Twofish', error);
    }
  }
}
