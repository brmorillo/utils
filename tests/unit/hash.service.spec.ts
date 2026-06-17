import { HashUtils } from '../../src/services/hash.service';
import * as bcrypt from 'bcryptjs';

/**
 * Unit tests for the HashUtils class.
 */
describe('HashUtils', () => {
  describe('bcryptHash', () => {
    it('should generate a valid bcrypt hash', () => {
      const value = 'password123';
      const hash = HashUtils.bcryptHash({ value });

      // Verifies that the hash starts with the correct bcrypt format
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);

      // Verifies that the hash is valid by comparing with the original value
      expect(bcrypt.compareSync(value, hash)).toBe(true);
    });

    it('should generate different hashes for the same input on consecutive calls', () => {
      const value = 'password123';
      const hash1 = HashUtils.bcryptHash({ value });
      const hash2 = HashUtils.bcryptHash({ value });

      expect(hash1).not.toBe(hash2);
    });

    it('should respect the specified number of salt rounds', () => {
      const value = 'password123';
      const saltRounds = 12;
      const hash = HashUtils.bcryptHash({ value, saltRounds });

      // Verifies that the hash contains the correct number of salt rounds
      expect(hash).toMatch(/^\$2[aby]\$12\$/);
    });

    it('should throw an error for an empty value', () => {
      expect(() => {
        HashUtils.bcryptHash({ value: '' });
      }).toThrow('Invalid input');
    });

    it('should throw an error for invalid saltRounds', () => {
      expect(() => {
        HashUtils.bcryptHash({ value: 'password123', saltRounds: 3 });
      }).toThrow('Invalid saltRounds');
    });
  });

  describe('bcryptCompare', () => {
    it('should return true when comparing a correct value with its hash', () => {
      const value = 'password123';
      const hash = bcrypt.hashSync(value, 10);

      const result = HashUtils.bcryptCompare({ value, encryptedValue: hash });

      expect(result).toBe(true);
    });

    it('should return false when comparing an incorrect value with its hash', () => {
      const value = 'password123';
      const wrongValue = 'password456';
      const hash = bcrypt.hashSync(value, 10);

      const result = HashUtils.bcryptCompare({
        value: wrongValue,
        encryptedValue: hash,
      });

      expect(result).toBe(false);
    });

    it('should throw an error for an empty value', () => {
      expect(() => {
        HashUtils.bcryptCompare({ value: '', encryptedValue: 'hash' });
      }).toThrow('Invalid input');
    });

    it('should throw an error for an empty hash', () => {
      expect(() => {
        HashUtils.bcryptCompare({ value: 'password123', encryptedValue: '' });
      }).toThrow('Invalid input');
    });
  });

  describe('bcryptRandomString', () => {
    it('should generate a random string with bcrypt format', () => {
      const randomString = HashUtils.bcryptRandomString({});

      // Verifies that the string has the bcrypt hash format
      expect(randomString).toMatch(/^\$2[aby]\$\d{2}\$/);
    });

    it('should generate different strings on consecutive calls', () => {
      const randomString1 = HashUtils.bcryptRandomString({});
      const randomString2 = HashUtils.bcryptRandomString({});

      expect(randomString1).not.toBe(randomString2);
    });

    it('should respect the specified length', () => {
      const length = 12;
      const randomString = HashUtils.bcryptRandomString({ length });

      // Verifies that the hash contains the correct number of salt rounds
      expect(randomString).toMatch(/^\$2[aby]\$12\$/);
    });

    it('should throw an error for an invalid length', () => {
      expect(() => {
        HashUtils.bcryptRandomString({ length: 3 });
      }).toThrow('Invalid length');
    });
  });

  describe('sha256Hash', () => {
    it('should generate a valid SHA-256 hash', () => {
      const value = 'texto para hash';
      const hash = HashUtils.sha256Hash({ value });

      // SHA-256 always generates a 64-character hexadecimal hash
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should generate the same hash for the same input', () => {
      const value = 'texto para hash';
      const hash1 = HashUtils.sha256Hash({ value });
      const hash2 = HashUtils.sha256Hash({ value });

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = HashUtils.sha256Hash({ value: 'texto1' });
      const hash2 = HashUtils.sha256Hash({ value: 'texto2' });

      expect(hash1).not.toBe(hash2);
    });

    it('should throw an error for an empty value', () => {
      expect(() => {
        HashUtils.sha256Hash({ value: '' });
      }).toThrow('Invalid input');
    });
  });

  describe('sha256HashJson', () => {
    it('should generate a valid SHA-256 hash for a JSON object', () => {
      const json = { name: 'test', value: 123 };
      const hash = HashUtils.sha256HashJson({ json });

      // SHA-256 always generates a 64-character hexadecimal hash
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should generate the same hash for the same JSON object', () => {
      const json = { name: 'test', value: 123 };
      const hash1 = HashUtils.sha256HashJson({ json });
      const hash2 = HashUtils.sha256HashJson({ json });

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different JSON objects', () => {
      const json1 = { name: 'test1' };
      const json2 = { name: 'test2' };

      const hash1 = HashUtils.sha256HashJson({ json: json1 });
      const hash2 = HashUtils.sha256HashJson({ json: json2 });

      expect(hash1).not.toBe(hash2);
    });

    it('should throw an error for non-object input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        HashUtils.sha256HashJson('not an object');
      }).toThrow('Invalid input');
    });
  });

  describe('sha256GenerateToken', () => {
    it('should generate a random token with the default length', () => {
      const token = HashUtils.sha256GenerateToken();

      // Default length is 32
      expect(token).toHaveLength(32);
      expect(token).toMatch(/^[0-9a-f]{32}$/);
    });

    it('should generate a token with the specified length', () => {
      const length = 16;
      const token = HashUtils.sha256GenerateToken({ length });

      expect(token).toHaveLength(length);
      expect(token).toMatch(/^[0-9a-f]{16}$/);
    });

    it('should generate different tokens on consecutive calls', () => {
      const token1 = HashUtils.sha256GenerateToken();
      const token2 = HashUtils.sha256GenerateToken();

      expect(token1).not.toBe(token2);
    });

    it('should throw an error for an invalid length', () => {
      expect(() => {
        HashUtils.sha256GenerateToken({ length: 0 });
      }).toThrow('Invalid length');
    });
  });

  describe('sha512Hash', () => {
    it('should generate a valid SHA-512 hash', () => {
      const value = 'texto para hash';
      const hash = HashUtils.sha512Hash({ value });

      // SHA-512 always generates a 128-character hexadecimal hash
      expect(hash).toHaveLength(128);
      expect(hash).toMatch(/^[0-9a-f]{128}$/);
    });

    it('should generate the same hash for the same input', () => {
      const value = 'texto para hash';
      const hash1 = HashUtils.sha512Hash({ value });
      const hash2 = HashUtils.sha512Hash({ value });

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = HashUtils.sha512Hash({ value: 'texto1' });
      const hash2 = HashUtils.sha512Hash({ value: 'texto2' });

      expect(hash1).not.toBe(hash2);
    });

    it('should throw an error for an empty value', () => {
      expect(() => {
        HashUtils.sha512Hash({ value: '' });
      }).toThrow('Invalid input');
    });
  });

  describe('sha512HashJson', () => {
    it('should generate a valid SHA-512 hash for a JSON object', () => {
      const json = { name: 'test', value: 123 };
      const hash = HashUtils.sha512HashJson({ json });

      // SHA-512 always generates a 128-character hexadecimal hash
      expect(hash).toHaveLength(128);
      expect(hash).toMatch(/^[0-9a-f]{128}$/);
    });

    it('should generate the same hash for the same JSON object', () => {
      const json = { name: 'test', value: 123 };
      const hash1 = HashUtils.sha512HashJson({ json });
      const hash2 = HashUtils.sha512HashJson({ json });

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different JSON objects', () => {
      const json1 = { name: 'test1' };
      const json2 = { name: 'test2' };

      const hash1 = HashUtils.sha512HashJson({ json: json1 });
      const hash2 = HashUtils.sha512HashJson({ json: json2 });

      expect(hash1).not.toBe(hash2);
    });

    it('should throw an error for non-object input', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        HashUtils.sha512HashJson('not an object');
      }).toThrow('Invalid input');
    });
  });

  describe('sha512GenerateToken', () => {
    it('should generate a random token with the default length', () => {
      const token = HashUtils.sha512GenerateToken();

      // Default length is 32
      expect(token).toHaveLength(32);
      expect(token).toMatch(/^[0-9a-f]{32}$/);
    });

    it('should generate a token with the specified length', () => {
      const length = 16;
      const token = HashUtils.sha512GenerateToken({ length });

      expect(token).toHaveLength(length);
      expect(token).toMatch(/^[0-9a-f]{16}$/);
    });

    it('should generate different tokens on consecutive calls', () => {
      const token1 = HashUtils.sha512GenerateToken();
      const token2 = HashUtils.sha512GenerateToken();

      expect(token1).not.toBe(token2);
    });

    it('should throw an error for an invalid length', () => {
      expect(() => {
        HashUtils.sha512GenerateToken({ length: 0 });
      }).toThrow('Invalid length');
    });
  });
});
