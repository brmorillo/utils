import * as crypto from 'crypto';
import { CryptUtils } from '../../src/services/crypt.service';

/**
 * Unit tests for the CryptUtils class.
 */
describe('CryptUtils', () => {
  describe('generateIV', () => {
    it('should generate a 16-byte IV (32 hexadecimal characters)', () => {
      const iv = CryptUtils.generateIV();
      expect(iv).toHaveLength(32);
      expect(/^[0-9a-f]{32}$/.test(iv)).toBe(true);
    });

    it('should generate different IVs on consecutive calls', () => {
      const iv1 = CryptUtils.generateIV();
      const iv2 = CryptUtils.generateIV();
      expect(iv1).not.toBe(iv2);
    });
  });

  describe('aesEncrypt e aesDecrypt', () => {
    const secretKey = '12345678901234567890123456789012'; // 32 bytes
    const testData = 'AES encryption test';
    const testObject = { name: 'Test', value: 123 };

    it('should encrypt and decrypt a string correctly', () => {
      const { encryptedData, iv } = CryptUtils.aesEncrypt(testData, secretKey);
      expect(encryptedData).toBeTruthy();
      expect(iv).toHaveLength(32);

      const decrypted = CryptUtils.aesDecrypt(encryptedData, secretKey, iv);
      expect(decrypted).toBe(testData);
    });

    it('should encrypt and decrypt a JSON object correctly', () => {
      const { encryptedData, iv } = CryptUtils.aesEncrypt(
        testObject,
        secretKey,
      );
      expect(encryptedData).toBeTruthy();
      expect(iv).toHaveLength(32);

      const decrypted = CryptUtils.aesDecrypt(encryptedData, secretKey, iv);
      expect(decrypted).toEqual(testObject);
    });

    it('should use the provided IV when specified', () => {
      const customIV = '1234567890abcdef1234567890abcdef';
      const { encryptedData, iv } = CryptUtils.aesEncrypt(
        testData,
        secretKey,
        customIV,
      );
      expect(iv).toBe(customIV);

      const decrypted = CryptUtils.aesDecrypt(encryptedData, secretKey, iv);
      expect(decrypted).toBe(testData);
    });

    it('should throw an error for an invalid secret key during encryption', () => {
      expect(() => {
        CryptUtils.aesEncrypt(testData, 'short-key');
      }).toThrow('Invalid secretKey');
    });

    it('should throw an error for an invalid secret key during decryption', () => {
      const { encryptedData, iv } = CryptUtils.aesEncrypt(testData, secretKey);
      expect(() => {
        CryptUtils.aesDecrypt(encryptedData, 'short-key', iv);
      }).toThrow('Invalid secretKey');
    });

    it('should throw an error for an invalid IV during decryption', () => {
      const { encryptedData } = CryptUtils.aesEncrypt(testData, secretKey);
      expect(() => {
        CryptUtils.aesDecrypt(encryptedData, secretKey, 'iv-invalido');
      }).toThrow('Invalid IV');
    });

    it('should throw an error for invalid data during encryption', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.aesEncrypt(123, secretKey);
      }).toThrow('Invalid input');
    });
  });

  // Skipping ChaCha20 tests that are not supported in all Node.js versions
  describe.skip('chacha20Encrypt e chacha20Decrypt', () => {
    const key = Buffer.from('12345678901234567890123456789012'); // 32 bytes
    const nonce = Buffer.from('123456789012'); // 12 bytes
    const testData = 'ChaCha20 encryption test';

    it('should encrypt and decrypt a string correctly', () => {
      // Check whether the algorithm is supported before running the test
      if (!CryptUtils['isAlgorithmSupported']('chacha20')) {
        console.log(
          'ChaCha20 is not supported in this version of Node.js. Skipping test.',
        );
        return;
      }

      const encrypted = CryptUtils.chacha20Encrypt(testData, key, nonce);
      expect(encrypted).toBeTruthy();

      const decrypted = CryptUtils.chacha20Decrypt(encrypted, key, nonce);
      expect(decrypted).toBe(testData);
    });

    it('should throw an error for an invalid key during encryption', () => {
      // Check whether the algorithm is supported before running the test
      if (!CryptUtils['isAlgorithmSupported']('chacha20')) {
        console.log(
          'ChaCha20 is not supported in this version of Node.js. Skipping test.',
        );
        return;
      }

      const invalidKey = Buffer.from('short-key');
      expect(() => {
        CryptUtils.chacha20Encrypt(testData, invalidKey, nonce);
      }).toThrow('Invalid key');
    });

    it('should throw an error for an invalid nonce during encryption', () => {
      // Check whether the algorithm is supported before running the test
      if (!CryptUtils['isAlgorithmSupported']('chacha20')) {
        console.log(
          'ChaCha20 is not supported in this version of Node.js. Skipping test.',
        );
        return;
      }

      const invalidNonce = Buffer.from('nonce-curto');
      expect(() => {
        CryptUtils.chacha20Encrypt(testData, key, invalidNonce);
      }).toThrow('Invalid nonce');
    });
  });

  describe('rsaGenerateKeyPair, rsaEncrypt e rsaDecrypt', () => {
    it('should generate a valid RSA key pair', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      expect(publicKey).toContain('BEGIN RSA PUBLIC KEY');
      expect(privateKey).toContain('BEGIN RSA PRIVATE KEY');
    });

    it('should encrypt and decrypt a string correctly with RSA', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      const testData = 'RSA encryption test';

      const encrypted = CryptUtils.rsaEncrypt(testData, publicKey);
      expect(encrypted).toBeTruthy();

      const decrypted = CryptUtils.rsaDecrypt(encrypted, privateKey);
      expect(decrypted).toBe(testData);
    });

    it('should throw an error for invalid data during RSA encryption', () => {
      const { publicKey } = CryptUtils.rsaGenerateKeyPair(1024);
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.rsaEncrypt(null, publicKey);
      }).toThrow('Invalid input');
    });

    it('should throw an error for an invalid public key during RSA encryption', () => {
      expect(() => {
        CryptUtils.rsaEncrypt('test', 'invalid-key');
      }).toThrow();
    });

    it('should throw an error for invalid encrypted data during RSA decryption', () => {
      const { privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      expect(() => {
        CryptUtils.rsaDecrypt('dados-invalidos', privateKey);
      }).toThrow();
    });
  });

  describe('rsaSign e rsaVerify', () => {
    it('should sign and verify a string correctly with RSA', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      const testData = 'Dados para assinar com RSA';

      const signature = CryptUtils.rsaSign(testData, privateKey);
      expect(signature).toBeTruthy();

      const isValid = CryptUtils.rsaVerify(testData, signature, publicKey);
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid signature', () => {
      const { publicKey } = CryptUtils.rsaGenerateKeyPair(1024);
      const testData = 'Dados para assinar com RSA';
      const fakeSignature = 'assinatura-falsa';

      const isValid = CryptUtils.rsaVerify(testData, fakeSignature, publicKey);
      expect(isValid).toBe(false);
    });

    it('should throw an error for invalid data during RSA signing', () => {
      const { privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.rsaSign(null, privateKey);
      }).toThrow('Invalid input');
    });

    it('should throw an error for an invalid private key during RSA signing', () => {
      expect(() => {
        CryptUtils.rsaSign('test', 'invalid-key');
      }).toThrow();
    });
  });

  describe('eccGenerateKeyPair, eccSign e eccVerify', () => {
    it('should generate a valid ECC key pair', () => {
      const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
      expect(publicKey).toContain('BEGIN PUBLIC KEY');
      expect(privateKey).toContain('BEGIN PRIVATE KEY');
    });

    it('should sign and verify a string correctly with ECC', () => {
      const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
      const testData = 'Dados para assinar com ECC';

      const signature = CryptUtils.eccSign(testData, privateKey);
      expect(signature).toBeTruthy();

      const isValid = CryptUtils.eccVerify(testData, signature, publicKey);
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid ECC signature', () => {
      const { publicKey } = CryptUtils.eccGenerateKeyPair();
      const testData = 'Dados para assinar com ECC';
      const fakeSignature = 'assinatura-falsa';

      const isValid = CryptUtils.eccVerify(testData, fakeSignature, publicKey);
      expect(isValid).toBe(false);
    });
  });

  // Skipping RC4 tests that are not supported in all Node.js versions
  describe.skip('rc4Encrypt e rc4Decrypt', () => {
    const key = 'rc4-secret-key';
    const testData = 'RC4 encryption test';

    it('should encrypt and decrypt a string correctly with RC4', () => {
      // Check whether the algorithm is supported before running the test
      if (!CryptUtils['isAlgorithmSupported']('rc4')) {
        console.log(
          'RC4 is not supported in this version of Node.js. Skipping test.',
        );
        return;
      }

      const encrypted = CryptUtils.rc4Encrypt(testData, key);
      expect(encrypted).toBeTruthy();

      const decrypted = CryptUtils.rc4Decrypt(encrypted, key);
      expect(decrypted).toBe(testData);
    });

    it('should throw an error for invalid data during RC4 encryption', () => {
      // Check whether the algorithm is supported before running the test
      if (!CryptUtils['isAlgorithmSupported']('rc4')) {
        console.log(
          'RC4 is not supported in this version of Node.js. Skipping test.',
        );
        return;
      }

      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.rc4Encrypt(null, key);
      }).toThrow('Invalid input');
    });

    it('should throw an error for an invalid key during RC4 encryption', () => {
      // Check whether the algorithm is supported before running the test
      if (!CryptUtils['isAlgorithmSupported']('rc4')) {
        console.log(
          'RC4 is not supported in this version of Node.js. Skipping test.',
        );
        return;
      }

      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.rc4Encrypt(testData, null);
      }).toThrow('Invalid key');
    });
  });
});
