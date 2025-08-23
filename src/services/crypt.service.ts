import * as crypto from 'crypto';

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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to encrypt data using AES: ${errorMessage}`);
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to decrypt data using AES: ${errorMessage}`);
    }
  }

  /**
   * Encrypts data using ChaCha20.
   * @param data The string to encrypt.
   * @param key A 32-byte key.
   * @param nonce A 12-byte nonce.
   * @returns The encrypted data in Base64 format.
   * @throws {Error} If encryption fails or if ChaCha20 is not supported.
   */
  public static chacha20Encrypt(
    data: string,
    key: Buffer,
    nonce: Buffer,
  ): string {
    if (!CryptUtils.isAlgorithmSupported('chacha20')) {
      throw new Error(
        'ChaCha20 algorithm is not supported in this Node.js version.',
      );
    }

    if (key.length !== 32) {
      throw new Error('Invalid key: must be 32 bytes.');
    }
    if (nonce.length !== 12) {
      throw new Error('Invalid nonce: must be 12 bytes.');
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
      throw new Error(`Failed to encrypt data using ChaCha20: ${errorMessage}`);
    }
  }

  /**
   * Decrypts data encrypted using ChaCha20.
   * @param encryptedData The encrypted data in Base64 format.
   * @param key A 32-byte key.
   * @param nonce A 12-byte nonce.
   * @returns The decrypted string.
   * @throws {Error} If decryption fails or if ChaCha20 is not supported.
   */
  public static chacha20Decrypt(
    encryptedData: string,
    key: Buffer,
    nonce: Buffer,
  ): string {
    if (!CryptUtils.isAlgorithmSupported('chacha20')) {
      throw new Error(
        'ChaCha20 algorithm is not supported in this Node.js version.',
      );
    }

    if (key.length !== 32) {
      throw new Error('Invalid key: must be 32 bytes.');
    }
    if (nonce.length !== 12) {
      throw new Error('Invalid nonce: must be 12 bytes.');
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
      throw new Error(`Failed to decrypt data using ChaCha20: ${errorMessage}`);
    }
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
  public static rsaGenerateKeyPair(modulusLength = 2048): {
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
      throw new Error(`Failed to generate RSA key pair: ${errorMessage}`);
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to encrypt data using RSA: ${errorMessage}`);
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to decrypt data using RSA: ${errorMessage}`);
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to sign data using RSA: ${errorMessage}`);
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to verify signature using RSA: ${errorMessage}`);
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
  public static eccGenerateKeyPair(curve = 'secp256k1'): {
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
      throw new Error(`Failed to generate ECC key pair: ${errorMessage}`);
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to sign data using ECC: ${errorMessage}`);
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to verify signature using ECC: ${errorMessage}`);
    }
  }

  /**
   * Encrypts data using RC4.
   * @param data The string to encrypt.
   * @param key The key for encryption.
   * @returns The encrypted data in Base64 format.
   * @throws {Error} If encryption fails or if RC4 is not supported.
   * @example
   * const encrypted = CryptUtils.rc4Encrypt('Hello, World!', 'mySecretKey');
   * console.log(encrypted);
   */
  public static rc4Encrypt(data: string, key: string): string {
    if (!CryptUtils.isAlgorithmSupported('rc4')) {
      throw new Error(
        'RC4 algorithm is not supported in this Node.js version.',
      );
    }

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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to encrypt data using RC4: ${errorMessage}`);
    }
  }

  /**
   * Decrypts data encrypted using RC4.
   * @param encryptedData The encrypted data in Base64 format.
   * @param key The key for decryption.
   * @returns The decrypted string.
   * @throws {Error} If decryption fails or if RC4 is not supported.
   * @example
   * const decrypted = CryptUtils.rc4Decrypt(encryptedData, 'mySecretKey');
   * console.log(decrypted);
   */
  public static rc4Decrypt(encryptedData: string, key: string): string {
    if (!CryptUtils.isAlgorithmSupported('rc4')) {
      throw new Error(
        'RC4 algorithm is not supported in this Node.js version.',
      );
    }

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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to decrypt data using RC4: ${errorMessage}`);
    }
  }
}
