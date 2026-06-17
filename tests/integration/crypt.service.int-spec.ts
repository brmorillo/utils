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

      // Generate IV
      const iv = CryptUtils.generateIV();

      // Encrypt data
      const { encryptedData } = CryptUtils.aesEncrypt(
        originalData,
        secretKey,
        iv,
      );

      // Decrypt data
      const decryptedData = CryptUtils.aesDecrypt(encryptedData, secretKey, iv);

      // Verify that the data was preserved correctly
      expect(decryptedData).toEqual(originalData);
    });
  });

  describe('Signing and verification with different algorithms', () => {
    const testData = 'Dados para teste de assinatura e verificação';

    it('should sign with RSA and verify correctly', () => {
      // Generate RSA key pair
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);

      // Sign data
      const signature = CryptUtils.rsaSign(testData, privateKey);

      // Verify signature
      const isValid = CryptUtils.rsaVerify(testData, signature, publicKey);

      expect(isValid).toBe(true);
    });

    it('should sign with ECC and verify correctly', () => {
      // Generate ECC key pair
      const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();

      // Sign data
      const signature = CryptUtils.eccSign(testData, privateKey);

      // Verify signature
      const isValid = CryptUtils.eccVerify(testData, signature, publicKey);

      expect(isValid).toBe(true);
    });

    it('should detect an invalid signature between different algorithms', () => {
      // Generate key pairs
      const rsaKeys = CryptUtils.rsaGenerateKeyPair(1024);
      const eccKeys = CryptUtils.eccGenerateKeyPair();

      // Sign with RSA
      const rsaSignature = CryptUtils.rsaSign(testData, rsaKeys.privateKey);

      // Try to verify an RSA signature with an ECC key (should fail)
      const isValid = CryptUtils.eccVerify(
        testData,
        rsaSignature,
        eccKeys.publicKey,
      );

      expect(isValid).toBe(false);
    });
  });

  describe('Layered encryption', () => {
    it.skip('should apply multiple layers of encryption and decrypt correctly', () => {
      const originalData =
        'Dados sensíveis para múltiplas camadas de criptografia';

      // Layer 1: RC4
      const rc4Key = 'chave-rc4-secreta';
      const rc4Encrypted = CryptUtils.rc4Encrypt(originalData, rc4Key);

      // Layer 2: AES
      const aesKey = '12345678901234567890123456789012';
      const aesIV = CryptUtils.generateIV();
      const { encryptedData: aesEncrypted } = CryptUtils.aesEncrypt(
        rc4Encrypted,
        aesKey,
        aesIV,
      );

      // Layer 3: RSA
      const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair(1024);
      const finalEncrypted = CryptUtils.rsaEncrypt(aesEncrypted, publicKey);

      // Decrypt in reverse order
      // Layer 3: RSA
      const rsaDecrypted = CryptUtils.rsaDecrypt(finalEncrypted, privateKey);

      // Layer 2: AES
      const aesDecrypted = CryptUtils.aesDecrypt(rsaDecrypted, aesKey, aesIV);

      // Layer 1: RC4
      const finalDecrypted = CryptUtils.rc4Decrypt(
        String(aesDecrypted),
        rc4Key,
      );

      // Verify that the original data was recovered
      expect(finalDecrypted).toBe(originalData);
    });
  });

  describe('Compatibility between different algorithms', () => {
    it.skip('should encrypt with different algorithms and compare results', () => {
      const testData = 'Dados para teste de compatibilidade';
      const key32 = '12345678901234567890123456789012'; // 32 bytes
      const iv16 = '1234567890123456'; // 16 bytes

      // Encrypt with AES
      const { encryptedData: aesEncrypted } = CryptUtils.aesEncrypt(
        testData,
        key32,
        iv16,
      );

      // Encrypt with RC4
      const rc4Encrypted = CryptUtils.rc4Encrypt(testData, key32);

      // Verify that the outputs are different (different algorithms)
      expect(aesEncrypted).not.toBe(rc4Encrypted);

      // Decrypt and verify that both recover the original data
      const aesDecrypted = CryptUtils.aesDecrypt(aesEncrypted, key32, iv16);
      const rc4Decrypted = CryptUtils.rc4Decrypt(rc4Encrypted, key32);

      expect(aesDecrypted).toBe(testData);
      expect(rc4Decrypted).toBe(testData);
    });
  });
});
