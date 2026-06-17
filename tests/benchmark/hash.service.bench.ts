import { HashUtils } from '../../src/services/hash.service';

/**
 * Benchmark tests for the HashUtils class.
 * These tests verify the class's performance in high-frequency operations.
 */
describe('HashUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('bcryptHash in bulk', () => {
    it('should generate 100 bcrypt hashes in a reasonable time', () => {
      const count = 100; // bcrypt is intentionally slow, so we use a smaller number
      const value = 'senha123';
      const saltRounds = 8; // Smaller number of rounds for the benchmark
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          hashes.push(HashUtils.bcryptHash({ value, saltRounds }));
        }
      });

      console.log(
        `Time to generate ${count} bcrypt hashes: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether all hashes are different
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // The average time per hash should be reasonable (bcrypt is slow by design)
      const avgTimePerHash = executionTime / count;
      console.log(
        `Average time per bcrypt hash: ${avgTimePerHash.toFixed(2)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(100); // Less than 100ms per hash
    });
  });

  describe('bcryptCompare in bulk', () => {
    it('should compare 1,000 bcrypt hashes in a reasonable time', () => {
      const count = 1000;
      const value = 'senha123';

      // Generate a hash to compare repeatedly
      const hash = HashUtils.bcryptHash({ value, saltRounds: 8 });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.bcryptCompare({ value, encryptedValue: hash });
        }
      });

      console.log(
        `Time to compare ${count} bcrypt hashes: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per comparison should be reasonable for bcrypt (which is intentionally slow for security)
      const avgTimePerComparison = executionTime / count;
      console.log(
        `Average time per bcrypt comparison: ${avgTimePerComparison.toFixed(2)}ms`,
      );
      expect(avgTimePerComparison).toBeLessThan(50); // bcrypt is slow by design - up to 50ms is acceptable
    });
  });

  describe('sha256Hash in bulk', () => {
    it('should generate 10,000 SHA-256 hashes in a reasonable time', () => {
      const count = 10000;
      const value = 'texto para hash';
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          hashes.push(HashUtils.sha256Hash({ value: value + i }));
        }
      });

      console.log(
        `Time to generate ${count} SHA-256 hashes: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether all hashes are different
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // The average time per hash should be very fast
      const avgTimePerHash = executionTime / count;
      console.log(
        `Average time per SHA-256 hash: ${avgTimePerHash.toFixed(3)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(0.1); // Less than 0.1ms per hash
    });
  });

  describe('sha256HashJson in bulk', () => {
    it('should generate 10,000 SHA-256 hashes of JSON objects in a reasonable time', () => {
      const count = 10000;
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const json = { id: i, value: `valor-${i}` };
          hashes.push(HashUtils.sha256HashJson({ json }));
        }
      });

      console.log(
        `Time to generate ${count} SHA-256 hashes of JSON: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether all hashes are different
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // The average time per hash should be fast
      const avgTimePerHash = executionTime / count;
      console.log(
        `Average time per SHA-256 hash of JSON: ${avgTimePerHash.toFixed(3)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(0.2); // Less than 0.2ms per hash
    });
  });

  describe('sha256GenerateToken in bulk', () => {
    it('should generate 10,000 SHA-256 tokens in a reasonable time', () => {
      const count = 10000;
      const tokens: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          tokens.push(HashUtils.sha256GenerateToken());
        }
      });

      console.log(
        `Time to generate ${count} SHA-256 tokens: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether all tokens are different
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(count);

      // The average time per token should be fast
      const avgTimePerToken = executionTime / count;
      console.log(
        `Average time per SHA-256 token: ${avgTimePerToken.toFixed(3)}ms`,
      );
      expect(avgTimePerToken).toBeLessThan(0.2); // Less than 0.2ms per token
    });
  });

  describe('sha512Hash in bulk', () => {
    it('should generate 10,000 SHA-512 hashes in a reasonable time', () => {
      const count = 10000;
      const value = 'texto para hash';
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          hashes.push(HashUtils.sha512Hash({ value: value + i }));
        }
      });

      console.log(
        `Time to generate ${count} SHA-512 hashes: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether all hashes are different
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // The average time per hash should be fast
      const avgTimePerHash = executionTime / count;
      console.log(
        `Average time per SHA-512 hash: ${avgTimePerHash.toFixed(3)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(0.1); // Less than 0.1ms per hash
    });
  });

  describe('sha512HashJson in bulk', () => {
    it('should generate 10,000 SHA-512 hashes of JSON objects in a reasonable time', () => {
      const count = 10000;
      const hashes: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const json = { id: i, value: `valor-${i}` };
          hashes.push(HashUtils.sha512HashJson({ json }));
        }
      });

      console.log(
        `Time to generate ${count} SHA-512 hashes of JSON: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether all hashes are different
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(count);

      // The average time per hash should be fast
      const avgTimePerHash = executionTime / count;
      console.log(
        `Average time per SHA-512 hash of JSON: ${avgTimePerHash.toFixed(3)}ms`,
      );
      expect(avgTimePerHash).toBeLessThan(0.2); // Less than 0.2ms per hash
    });
  });

  describe('sha512GenerateToken in bulk', () => {
    it('should generate 10,000 SHA-512 tokens in a reasonable time', () => {
      const count = 10000;
      const tokens: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          tokens.push(HashUtils.sha512GenerateToken());
        }
      });

      console.log(
        `Time to generate ${count} SHA-512 tokens: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether all tokens are different
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(count);

      // The average time per token should be fast
      const avgTimePerToken = executionTime / count;
      console.log(
        `Average time per SHA-512 token: ${avgTimePerToken.toFixed(3)}ms`,
      );
      expect(avgTimePerToken).toBeLessThan(0.2); // Less than 0.2ms per token
    });
  });

  describe('Performance comparison between algorithms', () => {
    it('should compare the performance between SHA-256 and SHA-512', () => {
      const count = 5000;
      const value = 'texto para comparação de desempenho';

      // Measure the time for SHA-256
      const sha256Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.sha256Hash({ value: value + i });
        }
      });

      // Measure the time for SHA-512
      const sha512Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.sha512Hash({ value: value + i });
        }
      });

      console.log(
        `Time for ${count} SHA-256 hashes: ${sha256Time.toFixed(2)}ms`,
      );
      console.log(
        `Time for ${count} SHA-512 hashes: ${sha512Time.toFixed(2)}ms`,
      );
      console.log(
        `SHA-512/SHA-256 ratio: ${(sha512Time / sha256Time).toFixed(2)}x`,
      );

      // SHA-512 should be slightly slower than SHA-256
      expect(sha512Time).toBeGreaterThan(sha256Time * 0.8);
    });

    it('should compare the performance between bcrypt and SHA', () => {
      const count = 100; // Smaller number for bcrypt
      const value = 'texto para comparação de desempenho';

      // Measure the time for bcrypt
      const bcryptTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.bcryptHash({ value: value + i, saltRounds: 8 });
        }
      });

      // Measure the time for SHA-256
      const shaTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          HashUtils.sha256Hash({ value: value + i });
        }
      });

      console.log(
        `Time for ${count} bcrypt hashes: ${bcryptTime.toFixed(2)}ms`,
      );
      console.log(
        `Time for ${count} SHA-256 hashes: ${shaTime.toFixed(2)}ms`,
      );
      console.log(
        `bcrypt is approximately ${(bcryptTime / shaTime).toFixed(2)}x slower than SHA-256`,
      );

      // bcrypt should be significantly slower than SHA-256 (by design)
      expect(bcryptTime).toBeGreaterThan(shaTime * 10);
    });
  });
});
