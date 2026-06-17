import { CuidUtils } from '../../src/services/cuid.service';

/**
 * Benchmark tests for the CuidUtils class.
 * These tests check the class performance in high-frequency operations.
 */
describe('CuidUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('generate', () => {
    it('should generate 100,000 CUIDs in a reasonable time', () => {
      const count = 100000;
      const cuids: string[] = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          cuids.push(CuidUtils.generate());
        }
      });
      console.log(
        `Time to generate ${count} CUIDs: ${executionTime.toFixed(2)}ms`,
      );
      // Check whether we have unique CUIDs
      const uniqueCuids = new Set(cuids);
      expect(uniqueCuids.size).toBe(count);
      // The average time per CUID should be less than 0.5ms (realistic value)
      const avgTimePerCuid = executionTime / count;
      expect(avgTimePerCuid).toBeLessThan(0.5);
    });

    it('should generate CUIDs with custom lengths', () => {
      const count = 10000;
      const lengths = [10, 20, 30];
      const results: Record<number, number> = {};

      for (const length of lengths) {
        const executionTime = measureExecutionTime(() => {
          for (let i = 0; i < count; i++) {
            CuidUtils.generate({ length });
          }
        });
        results[length] = executionTime;
        console.log(
          `Time to generate ${count} CUIDs of length ${length}: ${executionTime.toFixed(
            2,
          )}ms`,
        );
      }

      // Check whether the execution time increases with the length
      // (may not always be true due to optimizations, but it is a reasonable check)
      expect(results[30]).toBeGreaterThanOrEqual(results[10] * 0.8);
    });
  });

  describe('isValidCuid', () => {
    it('should validate 100,000 valid CUIDs in a reasonable time', () => {
      const count = 100000;
      // Generate a CUID to validate repeatedly
      const validId = CuidUtils.generate();
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CuidUtils.isValidCuid({ id: validId });
        }
      });
      console.log(
        `Time to validate ${count} valid CUIDs: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per validation should be less than 0.005ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.005);
    });

    it('should validate 100,000 invalid strings in a reasonable time', () => {
      const count = 100000;
      // Invalid string to validate repeatedly
      const invalidId = 'not-a-cuid';
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CuidUtils.isValidCuid({ id: invalidId });
        }
      });
      console.log(
        `Time to validate ${count} invalid strings: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per validation should be less than 0.005ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.005);
    });
  });

  describe('Performance comparison', () => {
    it('should compare generation and validation performance', () => {
      const count = 10000;
      const ids: string[] = [];

      // Measure the time to generate CUIDs
      const generateTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ids.push(CuidUtils.generate());
        }
      });

      // Measure the time to validate CUIDs
      const validateTime = measureExecutionTime(() => {
        for (const id of ids) {
          CuidUtils.isValidCuid({ id });
        }
      });

      console.log(
        `Time to generate ${count} CUIDs: ${generateTime.toFixed(2)}ms`,
      );
      console.log(
        `Time to validate ${count} CUIDs: ${validateTime.toFixed(2)}ms`,
      );
      console.log(
        `Validation/generation ratio: ${(validateTime / generateTime).toFixed(
          2,
        )}`,
      );

      // Validation should generally be faster than generation
      expect(validateTime).toBeLessThan(generateTime * 2);
    });
  });
});