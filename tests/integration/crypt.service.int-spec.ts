import * as crypto from 'crypto';
import { CryptUtils } from '../../src/services/crypt.service';

/**
 * Integration tests for the CryptUtils class.
 * These tests verify the behavior of the class in more complex scenarios
 * and with interactions between different methods.
 */
describe('CryptUtils - Integration Tests', () => {
  describe('Complete AES encryption flow', () => {
    it('should encrypt, decrypt and maintain data integrity', () => {
      const secretKey = '12345678901234567890123456789012'; // 32 bytes
      const originalData = {
        id: 1,
        name: 'Teste de Integração',
        details: {
          type: 'confidencial',
          level: 3,
          tags: ['seguro', 'criptografado'],
        },
      };

      // Generate a 12-byte IV suitable for AES-256-GCM
      const iv = CryptUtils.generateGcmIV();

      // Encrypt data
      const { encryptedData, authTag } = CryptUtils.aesEncrypt({
        data: originalData,
        secretKey,
        iv,
      });

      // Decrypt data
      const decryptedData = CryptUtils.aesDecrypt({
        encryptedData,
        secretKey,
        iv,
        authTag,
      });

      // Verify that the data was preserved correctly
      expect(decryptedData).toEqual(originalData);
    });
  });

  describe('Signing and verification with different algorithms', () => {
    const testData = 'Dados para teste de assinatura e verificação';

    it('should sign with RSA and verify correctly', () => {
      // Generate RSA key pair
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 1024,
      });

      // Sign data
      const signature = CryptUtils.rsaSign({ data: testData, privateKey });

      // Verify signature
      const isValid = CryptUtils.rsaVerify({
        data: testData,
        signature,
        publicKey,
      });

      expect(isValid).toBe(true);
    });

    it('should sign with ECC and verify correctly', () => {
      // Generate ECC key pair
      const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();

      // Sign data
      const signature = CryptUtils.eccSign({ data: testData, privateKey });

      // Verify signature
      const isValid = CryptUtils.eccVerify({
        data: testData,
        signature,
        publicKey,
      });

      expect(isValid).toBe(true);
    });

    it('should detect an invalid signature between different algorithms', () => {
      // Generate key pairs
      const rsaKeys = CryptUtils.rsaGenerateKeyPair({ modulusLength: 1024 });
      const eccKeys = CryptUtils.eccGenerateKeyPair();

      // Sign with RSA
      const rsaSignature = CryptUtils.rsaSign({
        data: testData,
        privateKey: rsaKeys.privateKey,
      });

      // Try to verify an RSA signature with an ECC key (should fail)
      const isValid = CryptUtils.eccVerify({
        data: testData,
        signature: rsaSignature,
        publicKey: eccKeys.publicKey,
      });

      expect(isValid).toBe(false);
    });
  });

  describe('Layered encryption', () => {
    it('should apply multiple layers of encryption and decrypt correctly', () => {
      const originalData =
        'Dados sensíveis para múltiplas camadas de criptografia';

      // Layer 1: AES-256-GCM
      const aesKey = '12345678901234567890123456789012';
      const aesIV = CryptUtils.generateGcmIV();
      const {
        encryptedData: aesEncrypted,
        authTag: aesAuthTag,
      } = CryptUtils.aesEncrypt({
        data: originalData,
        secretKey: aesKey,
        iv: aesIV,
      });

      // Layer 2: RSA (OAEP)
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({
        modulusLength: 2048,
      });
      const finalEncrypted = CryptUtils.rsaEncrypt({
        data: aesEncrypted,
        publicKey,
      });

      // Decrypt in reverse order
      // Layer 2: RSA
      const rsaDecrypted = CryptUtils.rsaDecrypt({
        encryptedData: finalEncrypted,
        privateKey,
      });

      // Layer 1: AES-256-GCM
      const finalDecrypted = CryptUtils.aesDecrypt({
        encryptedData: rsaDecrypted,
        secretKey: aesKey,
        iv: aesIV,
        authTag: aesAuthTag,
      });

      // Verify that the original data was recovered
      expect(finalDecrypted).toBe(originalData);
    });
  });
});
