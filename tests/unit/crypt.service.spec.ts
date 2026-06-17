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
      const { encryptedData, iv, authTag } = CryptUtils.aesEncrypt({
        data: testData,
        secretKey,
      });
      expect(encryptedData).toBeTruthy();
      expect(iv).toHaveLength(24);
      expect(authTag).toBeTruthy();

      const decrypted = CryptUtils.aesDecrypt({
        encryptedData,
        secretKey,
        iv,
        authTag,
      });
      expect(decrypted).toBe(testData);
    });

    it('should encrypt and decrypt a JSON object correctly', () => {
      const { encryptedData, iv, authTag } = CryptUtils.aesEncrypt({
        data: testObject,
        secretKey,
      });
      expect(encryptedData).toBeTruthy();
      expect(iv).toHaveLength(24);

      const decrypted = CryptUtils.aesDecrypt({
        encryptedData,
        secretKey,
        iv,
        authTag,
      });
      expect(decrypted).toEqual(testObject);
    });

    it('should use the provided IV when specified', () => {
      const customIV = '1234567890abcdef12345678'; // 12 bytes / 24 hex chars
      const { encryptedData, iv, authTag } = CryptUtils.aesEncrypt({
        data: testData,
        secretKey,
        iv: customIV,
      });
      expect(iv).toBe(customIV);

      const decrypted = CryptUtils.aesDecrypt({
        encryptedData,
        secretKey,
        iv,
        authTag,
      });
      expect(decrypted).toBe(testData);
    });

    it('should throw when decrypting with a tampered authTag', () => {
      const { encryptedData, iv } = CryptUtils.aesEncrypt({
        data: testData,
        secretKey,
      });
      const wrongTag = Buffer.alloc(16, 0).toString('base64');
      expect(() => {
        CryptUtils.aesDecrypt({
          encryptedData,
          secretKey,
          iv,
          authTag: wrongTag,
        });
      }).toThrow('Failed to decrypt data using AES');
    });

    it('should throw when decrypting tampered ciphertext', () => {
      const { iv, authTag } = CryptUtils.aesEncrypt({
        data: testData,
        secretKey,
      });
      const tampered = Buffer.from('totally-different-bytes').toString('base64');
      expect(() => {
        CryptUtils.aesDecrypt({
          encryptedData: tampered,
          secretKey,
          iv,
          authTag,
        });
      }).toThrow('Failed to decrypt data using AES');
    });

    it('should throw an error for an invalid secret key during encryption', () => {
      expect(() => {
        CryptUtils.aesEncrypt({ data: testData, secretKey: 'short-key' });
      }).toThrow('Invalid secretKey');
    });

    it('should throw an error for an invalid secret key during decryption', () => {
      const { encryptedData, iv, authTag } = CryptUtils.aesEncrypt({
        data: testData,
        secretKey,
      });
      expect(() => {
        CryptUtils.aesDecrypt({
          encryptedData,
          secretKey: 'short-key',
          iv,
          authTag,
        });
      }).toThrow('Invalid secretKey');
    });

    it('should throw an error for an invalid IV during encryption', () => {
      expect(() => {
        CryptUtils.aesEncrypt({ data: testData, secretKey, iv: 'too-short' });
      }).toThrow('Invalid IV');
    });

    it('should throw an error for an invalid IV during decryption', () => {
      const { encryptedData, authTag } = CryptUtils.aesEncrypt({
        data: testData,
        secretKey,
      });
      expect(() => {
        CryptUtils.aesDecrypt({
          encryptedData,
          secretKey,
          iv: 'iv-invalido',
          authTag,
        });
      }).toThrow('Invalid IV');
    });

    it('should throw an error for a missing authTag during decryption', () => {
      const { encryptedData, iv } = CryptUtils.aesEncrypt({
        data: testData,
        secretKey,
      });
      expect(() => {
        CryptUtils.aesDecrypt({
          encryptedData,
          secretKey,
          iv,
          // @ts-ignore - Intentionally testing with missing value
          authTag: '',
        });
      }).toThrow('Invalid authTag');
    });

    it('should throw an error for invalid data during encryption', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.aesEncrypt({ data: 123, secretKey });
      }).toThrow('Invalid input');
    });
  });

  describe('chacha20Encrypt and chacha20Decrypt', () => {
    const key = Buffer.from('12345678901234567890123456789012'); // 32 bytes
    const nonce = Buffer.from('123456789012'); // 12 bytes
    const testData = 'ChaCha20 encryption test';
    const chacha20Supported = crypto
      .getCiphers()
      .includes('chacha20-poly1305');

    it('should encrypt and decrypt a string correctly (or throw if unsupported)', () => {
      if (!chacha20Supported) {
        expect(() => {
          CryptUtils.chacha20Encrypt({ data: testData, key, nonce });
        }).toThrow('ChaCha20-Poly1305 algorithm is not supported');
        expect(() => {
          CryptUtils.chacha20Decrypt({
            encryptedData: 'data',
            key,
            nonce,
            authTag: 'dGFn',
          });
        }).toThrow('ChaCha20-Poly1305 algorithm is not supported');
        return;
      }

      const { encryptedData, authTag } = CryptUtils.chacha20Encrypt({
        data: testData,
        key,
        nonce,
      });
      expect(encryptedData).toBeTruthy();
      expect(authTag).toBeTruthy();

      const decrypted = CryptUtils.chacha20Decrypt({
        encryptedData,
        key,
        nonce,
        authTag,
      });
      expect(decrypted).toBe(testData);
    });

    it('should throw when decrypting with a tampered authTag', () => {
      if (!chacha20Supported) {
        return;
      }
      const { encryptedData } = CryptUtils.chacha20Encrypt({
        data: testData,
        key,
        nonce,
      });
      const wrongTag = Buffer.alloc(16, 0).toString('base64');
      expect(() => {
        CryptUtils.chacha20Decrypt({
          encryptedData,
          key,
          nonce,
          authTag: wrongTag,
        });
      }).toThrow('Failed to decrypt data using ChaCha20-Poly1305');
    });

    it('should throw an error for an invalid key during encryption', () => {
      const invalidKey = Buffer.from('short-key');
      const expectedError = chacha20Supported
        ? 'Invalid key'
        : 'ChaCha20-Poly1305 algorithm is not supported';
      expect(() => {
        CryptUtils.chacha20Encrypt({ data: testData, key: invalidKey, nonce });
      }).toThrow(expectedError);
    });

    it('should throw an error for an invalid nonce during encryption', () => {
      const invalidNonce = Buffer.from('short-nonce');
      const expectedError = chacha20Supported
        ? 'Invalid nonce'
        : 'ChaCha20-Poly1305 algorithm is not supported';
      expect(() => {
        CryptUtils.chacha20Encrypt({ data: testData, key, nonce: invalidNonce });
      }).toThrow(expectedError);
    });

    it('should throw an error for an invalid key during decryption', () => {
      const invalidKey = Buffer.from('short-key');
      const expectedError = chacha20Supported
        ? 'Invalid key'
        : 'ChaCha20-Poly1305 algorithm is not supported';
      expect(() => {
        CryptUtils.chacha20Decrypt({
          encryptedData: 'data',
          key: invalidKey,
          nonce,
          authTag: 'dGFn',
        });
      }).toThrow(expectedError);
    });

    it('should throw an error for an invalid nonce during decryption', () => {
      const invalidNonce = Buffer.from('short-nonce');
      const expectedError = chacha20Supported
        ? 'Invalid nonce'
        : 'ChaCha20-Poly1305 algorithm is not supported';
      expect(() => {
        CryptUtils.chacha20Decrypt({
          encryptedData: 'data',
          key,
          nonce: invalidNonce,
          authTag: 'dGFn',
        });
      }).toThrow(expectedError);
    });

    it('should throw an error for a missing authTag during decryption', () => {
      if (!chacha20Supported) {
        return;
      }
      expect(() => {
        CryptUtils.chacha20Decrypt({
          encryptedData: 'data',
          key,
          nonce,
          authTag: '',
        });
      }).toThrow('Invalid authTag');
    });
  });

  describe('rsaGenerateKeyPair, rsaEncrypt e rsaDecrypt', () => {
    it('should generate a valid RSA key pair', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      expect(publicKey).toContain('BEGIN RSA PUBLIC KEY');
      expect(privateKey).toContain('BEGIN RSA PRIVATE KEY');
    });

    it('should encrypt and decrypt a string correctly with RSA', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      const testData = 'RSA encryption test';

      const encrypted = CryptUtils.rsaEncrypt({ data: testData, publicKey });
      expect(encrypted).toBeTruthy();

      const decrypted = CryptUtils.rsaDecrypt({
        encryptedData: encrypted,
        privateKey,
      });
      expect(decrypted).toBe(testData);
    });

    it('should throw an error for invalid data during RSA encryption', () => {
      const { publicKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.rsaEncrypt({ data: null, publicKey });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an invalid public key during RSA encryption', () => {
      expect(() => {
        CryptUtils.rsaEncrypt({ data: 'test', publicKey: 'invalid-key' });
      }).toThrow();
    });

    it('should throw an error for invalid encrypted data during RSA decryption', () => {
      const { privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      expect(() => {
        CryptUtils.rsaDecrypt({
          encryptedData: 'dados-invalidos',
          privateKey,
        });
      }).toThrow();
    });
  });

  describe('rsaSign e rsaVerify', () => {
    it('should sign and verify a string correctly with RSA', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      const testData = 'Dados para assinar com RSA';

      const signature = CryptUtils.rsaSign({ data: testData, privateKey });
      expect(signature).toBeTruthy();

      const isValid = CryptUtils.rsaVerify({
        data: testData,
        signature,
        publicKey,
      });
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid signature', () => {
      const { publicKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      const testData = 'Dados para assinar com RSA';
      const fakeSignature = 'assinatura-falsa';

      const isValid = CryptUtils.rsaVerify({
        data: testData,
        signature: fakeSignature,
        publicKey,
      });
      expect(isValid).toBe(false);
    });

    it('should throw an error for invalid data during RSA signing', () => {
      const { privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.rsaSign({ data: null, privateKey });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an invalid private key during RSA signing', () => {
      expect(() => {
        CryptUtils.rsaSign({ data: 'test', privateKey: 'invalid-key' });
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

      const signature = CryptUtils.eccSign({ data: testData, privateKey });
      expect(signature).toBeTruthy();

      const isValid = CryptUtils.eccVerify({
        data: testData,
        signature,
        publicKey,
      });
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid ECC signature', () => {
      const { publicKey } = CryptUtils.eccGenerateKeyPair();
      const testData = 'Dados para assinar com ECC';
      const fakeSignature = 'assinatura-falsa';

      const isValid = CryptUtils.eccVerify({
        data: testData,
        signature: fakeSignature,
        publicKey,
      });
      expect(isValid).toBe(false);
    });
  });

  describe('additional ECC coverage', () => {
    it('should throw an error for invalid data during ECC signing', () => {
      const { privateKey } = CryptUtils.eccGenerateKeyPair();
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.eccSign({ data: null, privateKey });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an empty private key during ECC signing', () => {
      expect(() => {
        CryptUtils.eccSign({ data: 'test', privateKey: '' });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an invalid private key during ECC signing', () => {
      expect(() => {
        CryptUtils.eccSign({ data: 'test', privateKey: 'invalid-key' });
      }).toThrow('Failed to sign data using ECC');
    });

    it('should throw an error for an empty public key during ECC verification', () => {
      expect(() => {
        CryptUtils.eccVerify({ data: 'data', signature: 'c2ln', publicKey: '' });
      }).toThrow('Invalid input');
    });

    it('should throw an error for invalid data during ECC verification', () => {
      const { publicKey } = CryptUtils.eccGenerateKeyPair();
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        CryptUtils.eccVerify({ data: null, signature: 'sig', publicKey });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an empty signature during ECC verification', () => {
      const { publicKey } = CryptUtils.eccGenerateKeyPair();
      expect(() => {
        CryptUtils.eccVerify({ data: 'data', signature: '', publicKey });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an invalid public key during ECC verification', () => {
      expect(() => {
        CryptUtils.eccVerify({
          data: 'data',
          signature: 'c2ln',
          publicKey: 'invalid-key',
        });
      }).toThrow('Failed to verify signature using ECC');
    });

    it('should return false when verifying with wrong data', () => {
      const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
      const signature = CryptUtils.eccSign({
        data: 'original data',
        privateKey,
      });
      const isValid = CryptUtils.eccVerify({
        data: 'tampered data',
        signature,
        publicKey,
      });
      expect(isValid).toBe(false);
    });
  });

  describe('additional RSA coverage', () => {
    it('should throw an error for empty encrypted data during RSA decryption', () => {
      const { privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      expect(() => {
        CryptUtils.rsaDecrypt({ encryptedData: '', privateKey });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an empty private key during RSA decryption', () => {
      expect(() => {
        CryptUtils.rsaDecrypt({ encryptedData: 'ZGF0YQ==', privateKey: '' });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an empty public key during RSA encryption', () => {
      expect(() => {
        CryptUtils.rsaEncrypt({ data: 'data', publicKey: '' });
      }).toThrow('Invalid input');
    });

    it('should throw an error for empty data during RSA signing', () => {
      const { privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      expect(() => {
        CryptUtils.rsaSign({ data: '', privateKey });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an empty private key during RSA signing', () => {
      expect(() => {
        CryptUtils.rsaSign({ data: 'data', privateKey: '' });
      }).toThrow('Invalid input');
    });

    it('should throw an error for empty data during RSA verification', () => {
      const { publicKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      expect(() => {
        CryptUtils.rsaVerify({ data: '', signature: 'sig', publicKey });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an empty signature during RSA verification', () => {
      const { publicKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      expect(() => {
        CryptUtils.rsaVerify({ data: 'data', signature: '', publicKey });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an empty public key during RSA verification', () => {
      expect(() => {
        CryptUtils.rsaVerify({ data: 'data', signature: 'sig', publicKey: '' });
      }).toThrow('Invalid input');
    });

    it('should return false when verifying RSA with tampered data', () => {
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });
      const signature = CryptUtils.rsaSign({
        data: 'original data',
        privateKey,
      });
      const isValid = CryptUtils.rsaVerify({
        data: 'tampered data',
        signature,
        publicKey,
      });
      expect(isValid).toBe(false);
    });

    it('should throw an error for an invalid public key during RSA verification', () => {
      expect(() => {
        CryptUtils.rsaVerify({
          data: 'data',
          signature: 'c2ln',
          publicKey: 'invalid-key',
        });
      }).toThrow('Failed to verify signature using RSA');
    });
  });

  describe('additional AES coverage', () => {
    const secretKey = '12345678901234567890123456789012'; // 32 bytes

    it('should throw an error for non-string encryptedData during decryption', () => {
      expect(() => {
        CryptUtils.aesDecrypt({
          // @ts-ignore - Intentionally testing with invalid value
          encryptedData: 123,
          secretKey,
          iv: CryptUtils.generateGcmIV(),
          authTag: 'dGFn',
        });
      }).toThrow('Invalid input');
    });

    it('should fail to decrypt with a wrong IV length error message', () => {
      const { encryptedData, authTag } = CryptUtils.aesEncrypt({
        data: 'data',
        secretKey,
      });
      expect(() => {
        CryptUtils.aesDecrypt({ encryptedData, secretKey, iv: 'abcd', authTag });
      }).toThrow('Invalid IV');
    });

    it('should throw a wrapped error when decryption fails with corrupt data', () => {
      const iv = CryptUtils.generateGcmIV();
      expect(() => {
        CryptUtils.aesDecrypt({
          encryptedData: 'not-valid-base64-cipher',
          secretKey,
          iv,
          authTag: Buffer.alloc(16, 0).toString('base64'),
        });
      }).toThrow('Failed to decrypt data using AES');
    });
  });

  describe('wrapped-error (catch block) coverage', () => {
    const cryptoCjs = require('crypto');

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('aesEncrypt should wrap underlying crypto errors', () => {
      const secretKey = '12345678901234567890123456789012';
      jest.spyOn(cryptoCjs, 'createCipheriv').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => {
        CryptUtils.aesEncrypt({ data: 'data', secretKey });
      }).toThrow('Failed to encrypt data using AES');
    });

    it('rsaGenerateKeyPair should wrap underlying errors', () => {
      jest.spyOn(cryptoCjs, 'generateKeyPairSync').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => {
        CryptUtils.rsaGenerateKeyPair({ modulusLength: 1024 });
      }).toThrow('Failed to generate RSA key pair');
    });

    it('rsaEncrypt should wrap underlying errors', () => {
      jest.spyOn(cryptoCjs, 'publicEncrypt').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => {
        CryptUtils.rsaEncrypt({ data: 'data', publicKey: 'some-public-key' });
      }).toThrow('Failed to encrypt data using RSA');
    });

    it('rsaDecrypt should wrap underlying errors', () => {
      jest.spyOn(cryptoCjs, 'privateDecrypt').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => {
        CryptUtils.rsaDecrypt({
          encryptedData: 'ZGF0YQ==',
          privateKey: 'some-private-key',
        });
      }).toThrow('Failed to decrypt data using RSA');
    });

    it('rsaSign should wrap underlying errors', () => {
      jest.spyOn(cryptoCjs, 'createSign').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => {
        CryptUtils.rsaSign({ data: 'data', privateKey: 'some-private-key' });
      }).toThrow('Failed to sign data using RSA');
    });

    it('eccGenerateKeyPair should wrap underlying errors', () => {
      jest.spyOn(cryptoCjs, 'generateKeyPairSync').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => {
        CryptUtils.eccGenerateKeyPair();
      }).toThrow('Failed to generate ECC key pair');
    });

    it('eccSign should wrap underlying errors', () => {
      jest.spyOn(cryptoCjs, 'createSign').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => {
        CryptUtils.eccSign({ data: 'data', privateKey: 'some-private-key' });
      }).toThrow('Failed to sign data using ECC');
    });

    it('chacha20Encrypt should throw not-supported when algorithm is absent', () => {
      const key = Buffer.alloc(32, 1);
      const nonce = Buffer.alloc(12, 1);
      jest
        .spyOn(cryptoCjs, 'getCiphers')
        .mockReturnValue(['aes-256-cbc']);
      expect(() => {
        CryptUtils.chacha20Encrypt({ data: 'data', key, nonce });
      }).toThrow('ChaCha20-Poly1305 algorithm is not supported');
    });

    it('chacha20Decrypt should throw not-supported when algorithm is absent', () => {
      const key = Buffer.alloc(32, 1);
      const nonce = Buffer.alloc(12, 1);
      jest
        .spyOn(cryptoCjs, 'getCiphers')
        .mockReturnValue(['aes-256-cbc']);
      expect(() => {
        CryptUtils.chacha20Decrypt({
          encryptedData: 'data',
          key,
          nonce,
          authTag: 'dGFn',
        });
      }).toThrow('ChaCha20-Poly1305 algorithm is not supported');
    });

    it('chacha20Encrypt body executes end-to-end with a stubbed cipher', () => {
      const key = Buffer.alloc(32, 9);
      const nonce = Buffer.alloc(12, 9);
      // Ensure the supported branch is taken regardless of the build.
      jest
        .spyOn(cryptoCjs, 'getCiphers')
        .mockReturnValue(['chacha20-poly1305']);
      // Stub the cipher so the post-createCipheriv body runs deterministically.
      const fakeCipher = {
        update: jest.fn().mockReturnValue(Buffer.from('abc')),
        final: jest.fn().mockReturnValue(Buffer.from('def')),
        getAuthTag: jest.fn().mockReturnValue(Buffer.from('tag')),
      };
      jest
        .spyOn(cryptoCjs, 'createCipheriv')
        .mockReturnValue(fakeCipher as any);
      const result = CryptUtils.chacha20Encrypt({
        data: 'payload',
        key,
        nonce,
      });
      expect(result.encryptedData).toBe(Buffer.from('abcdef').toString('base64'));
      expect(result.authTag).toBe(Buffer.from('tag').toString('base64'));
      expect(fakeCipher.update).toHaveBeenCalled();
      expect(fakeCipher.final).toHaveBeenCalled();
    });

    it('chacha20Decrypt body executes end-to-end with a stubbed decipher', () => {
      const key = Buffer.alloc(32, 9);
      const nonce = Buffer.alloc(12, 9);
      jest
        .spyOn(cryptoCjs, 'getCiphers')
        .mockReturnValue(['chacha20-poly1305']);
      const fakeDecipher = {
        setAuthTag: jest.fn(),
        update: jest.fn().mockReturnValue(Buffer.from('plain')),
        final: jest.fn().mockReturnValue(Buffer.from('text')),
      };
      jest
        .spyOn(cryptoCjs, 'createDecipheriv')
        .mockReturnValue(fakeDecipher as any);
      const result = CryptUtils.chacha20Decrypt({
        encryptedData: 'ZGF0YQ==',
        key,
        nonce,
        authTag: 'dGFn',
      });
      expect(result).toBe('plaintext');
      expect(fakeDecipher.setAuthTag).toHaveBeenCalled();
      expect(fakeDecipher.update).toHaveBeenCalled();
      expect(fakeDecipher.final).toHaveBeenCalled();
    });

    it('chacha20Encrypt should wrap underlying cipher errors', () => {
      const key = Buffer.alloc(32, 9);
      const nonce = Buffer.alloc(12, 9);
      jest
        .spyOn(cryptoCjs, 'getCiphers')
        .mockReturnValue(['chacha20-poly1305']);
      jest.spyOn(cryptoCjs, 'createCipheriv').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => {
        CryptUtils.chacha20Encrypt({ data: 'payload', key, nonce });
      }).toThrow('Failed to encrypt data using ChaCha20-Poly1305');
    });

    it('chacha20Decrypt should wrap underlying decipher errors', () => {
      const key = Buffer.alloc(32, 9);
      const nonce = Buffer.alloc(12, 9);
      jest
        .spyOn(cryptoCjs, 'getCiphers')
        .mockReturnValue(['chacha20-poly1305']);
      jest.spyOn(cryptoCjs, 'createDecipheriv').mockImplementation(() => {
        throw new Error('boom');
      });
      expect(() => {
        CryptUtils.chacha20Decrypt({
          encryptedData: 'ZGF0YQ==',
          key,
          nonce,
          authTag: 'dGFn',
        });
      }).toThrow('Failed to decrypt data using ChaCha20-Poly1305');
    });

    it('isAlgorithmSupported should return false when getCiphers throws', () => {
      jest.spyOn(cryptoCjs, 'getCiphers').mockImplementation(() => {
        throw new Error('boom');
      });
      // chacha20Encrypt routes through isAlgorithmSupported; a throwing
      // getCiphers must be caught and treated as "not supported".
      expect(() => {
        CryptUtils.chacha20Encrypt({
          data: 'data',
          key: Buffer.alloc(32),
          nonce: Buffer.alloc(12),
        });
      }).toThrow('ChaCha20-Poly1305 algorithm is not supported');
    });
  });
});
