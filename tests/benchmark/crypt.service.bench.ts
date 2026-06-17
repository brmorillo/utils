import { CryptUtils } from '../../src/services/crypt.service';
import * as crypto from 'crypto';

/**
 * Benchmark tests for the CryptUtils class.
 * These tests check the class performance in high-frequency operations.
 */
describe('CryptUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('IV generation in bulk', () => {
    it('should generate 10,000 IVs in a reasonable time', () => {
      const count = 10000;
      const ivs: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ivs.push(CryptUtils.generateIV());
        }
      });

      console.log(
        `Time to generate ${count} IVs: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether we have unique IVs
      const uniqueIvs = new Set(ivs);
      expect(uniqueIvs.size).toBe(count);

      // The average time per IV should be less than 0.1ms
      const avgTimePerIV = executionTime / count;
      expect(avgTimePerIV).toBeLessThan(0.1);
    });
  });

  describe('AES encryption in bulk', () => {
    const secretKey = '12345678901234567890123456789012'; // 32 bytes
    const testData = 'AES encryption test for benchmark';
    const iv = CryptUtils.generateGcmIV();

    it('should encrypt 10,000 strings in a reasonable time', () => {
      const count = 10000;
      const encryptedResults: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const { encryptedData } = CryptUtils.aesEncrypt({
            data: testData,
            secretKey,
            iv,
          });
          encryptedResults.push(encryptedData);
        }
      });

      console.log(
        `Time to encrypt ${count} strings with AES: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per encryption should be less than 0.5ms
      const avgTimePerEncryption = executionTime / count;
      expect(avgTimePerEncryption).toBeLessThan(0.5);
    });

    it('should decrypt 10,000 strings in a reasonable time', () => {
      const count = 10000;

      // Encrypt a string to use in the tests
      const { encryptedData, authTag } = CryptUtils.aesEncrypt({
        data: testData,
        secretKey,
        iv,
      });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.aesDecrypt({ encryptedData, secretKey, iv, authTag });
        }
      });

      console.log(
        `Time to decrypt ${count} strings with AES: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per decryption should be less than 0.5ms
      const avgTimePerDecryption = executionTime / count;
      expect(avgTimePerDecryption).toBeLessThan(0.5);
    });
  });

  describe('ChaCha20 encryption in bulk', () => {
    const key = Buffer.from('12345678901234567890123456789012'); // 32 bytes
    const nonce = Buffer.from('123456789012'); // 12 bytes
    const testData = 'ChaCha20 encryption test for benchmark';

    it('should encrypt 10,000 strings in a reasonable time', () => {
      const count = 10000;
      const encryptedResults: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const { encryptedData } = CryptUtils.chacha20Encrypt({
            data: testData,
            key,
            nonce,
          });
          encryptedResults.push(encryptedData);
        }
      });

      console.log(
        `Time to encrypt ${count} strings with ChaCha20: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per encryption should be less than 0.5ms
      const avgTimePerEncryption = executionTime / count;
      expect(avgTimePerEncryption).toBeLessThan(0.5);
    });

    it('should decrypt 10,000 strings in a reasonable time', () => {
      const count = 10000;

      // Encrypt a string to use in the tests
      const { encryptedData, authTag } = CryptUtils.chacha20Encrypt({
        data: testData,
        key,
        nonce,
      });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.chacha20Decrypt({ encryptedData, key, nonce, authTag });
        }
      });

      console.log(
        `Time to decrypt ${count} strings with ChaCha20: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per decryption should be less than 0.5ms
      const avgTimePerDecryption = executionTime / count;
      expect(avgTimePerDecryption).toBeLessThan(0.5);
    });
  });

  describe('RSA key generation', () => {
    it('should generate 10 RSA key pairs in a reasonable time', () => {
      const count = 10;
      const keyPairs: { publicKey: string; privateKey: string }[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          keyPairs.push(CryptUtils.rsaGenerateKeyPair({ modulusLength: 1024 }));
        }
      });

      console.log(
        `Time to generate ${count} RSA key pairs (1024 bits): ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the keys were generated correctly
      expect(keyPairs.length).toBe(count);
      keyPairs.forEach(({ publicKey, privateKey }) => {
        expect(publicKey).toContain('BEGIN RSA PUBLIC KEY');
        expect(privateKey).toContain('BEGIN RSA PRIVATE KEY');
      });

      // The average time per generation should be reasonable (RSA is naturally slow)
      const avgTimePerGeneration = executionTime / count;
      expect(avgTimePerGeneration).toBeLessThan(1000); // Less than 1 second per pair
    });
  });

  describe('RSA signing and verification in bulk', () => {
    // Generate a key pair for all the tests
    const { publicKey, privateKey } = CryptUtils.rsaGenerateKeyPair({
      modulusLength: 1024,
    });
    const testData = 'Data to sign with RSA in benchmark';

    it('should sign 1,000 messages in a reasonable time', () => {
      const count = 1000;
      const signatures: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          signatures.push(CryptUtils.rsaSign({ data: testData, privateKey }));
        }
      });

      console.log(
        `Time to sign ${count} messages with RSA: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per signature should be reasonable
      const avgTimePerSignature = executionTime / count;
      expect(avgTimePerSignature).toBeLessThan(5); // Less than 5ms per signature
    });

    it('should verify 1,000 signatures in a reasonable time', () => {
      const count = 1000;

      // Create a signature to verify repeatedly
      const signature = CryptUtils.rsaSign({ data: testData, privateKey });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.rsaVerify({ data: testData, signature, publicKey });
        }
      });

      console.log(
        `Time to verify ${count} signatures with RSA: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per verification should be reasonable
      const avgTimePerVerification = executionTime / count;
      expect(avgTimePerVerification).toBeLessThan(1); // Less than 1ms per verification
    });
  });

  describe('ECC key generation', () => {
    it('should generate 50 ECC key pairs in a reasonable time', () => {
      const count = 50;
      const keyPairs: { publicKey: string; privateKey: string }[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          keyPairs.push(CryptUtils.eccGenerateKeyPair());
        }
      });

      console.log(
        `Time to generate ${count} ECC key pairs: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the keys were generated correctly
      expect(keyPairs.length).toBe(count);
      keyPairs.forEach(({ publicKey, privateKey }) => {
        expect(publicKey).toContain('BEGIN PUBLIC KEY');
        expect(privateKey).toContain('BEGIN PRIVATE KEY');
      });

      // The average time per generation should be reasonable
      const avgTimePerGeneration = executionTime / count;
      expect(avgTimePerGeneration).toBeLessThan(100); // Less than 100ms per pair
    });
  });

  describe('ECC signing and verification in bulk', () => {
    // Generate a key pair for all the tests
    const { publicKey, privateKey } = CryptUtils.eccGenerateKeyPair();
    const testData = 'Data to sign with ECC in benchmark';

    it('should sign 1,000 messages in a reasonable time', () => {
      const count = 1000;
      const signatures: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          signatures.push(CryptUtils.eccSign({ data: testData, privateKey }));
        }
      });

      console.log(
        `Time to sign ${count} messages with ECC: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per signature should be reasonable
      const avgTimePerSignature = executionTime / count;
      expect(avgTimePerSignature).toBeLessThan(2); // Less than 2ms per signature
    });

    it('should verify 1,000 signatures in a reasonable time', () => {
      const count = 1000;

      // Create a signature to verify repeatedly
      const signature = CryptUtils.eccSign({ data: testData, privateKey });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.eccVerify({ data: testData, signature, publicKey });
        }
      });

      console.log(
        `Time to verify ${count} signatures with ECC: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per verification should be reasonable
      const avgTimePerVerification = executionTime / count;
      expect(avgTimePerVerification).toBeLessThan(1); // Less than 1ms per verification
    });
  });

  describe('Performance comparison between algorithms', () => {
    const testData = 'Data for performance comparison between algorithms';
    const aesKey = '12345678901234567890123456789012'; // 32 bytes
    const aesIv = CryptUtils.generateGcmIV();
    const chachaKey = Buffer.from('12345678901234567890123456789012'); // 32 bytes
    const chachaNonce = Buffer.from('123456789012'); // 12 bytes

    it('should compare encryption performance between AES-GCM and ChaCha20-Poly1305', () => {
      const count = 5000;

      // Measure the time for AES-256-GCM
      const aesTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.aesEncrypt({ data: testData, secretKey: aesKey, iv: aesIv });
        }
      });

      // Measure the time for ChaCha20-Poly1305
      const chachaTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CryptUtils.chacha20Encrypt({
            data: testData,
            key: chachaKey,
            nonce: chachaNonce,
          });
        }
      });

      console.log(
        `Time for ${count} AES-256-GCM encryptions: ${aesTime.toFixed(2)}ms`,
      );
      console.log(
        `Time for ${count} ChaCha20-Poly1305 encryptions: ${chachaTime.toFixed(2)}ms`,
      );

      // Both AEAD ciphers should complete the workload.
      expect(aesTime).toBeGreaterThan(0);
      expect(chachaTime).toBeGreaterThan(0);
    });
  });
});
