import { UUIDUtils } from '../../src/services/uuid.service';

/**
 * Benchmark tests for the UUIDUtils class.
 * These tests verify the class performance in high-frequency operations.
 */
describe('UUIDUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('uuidV1Generate', () => {
    it('should generate 100,000 v1 UUIDs in a reasonable time', () => {
      const count = 100000;
      const uuids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          uuids.push(UUIDUtils.uuidV1Generate());
        }
      });

      console.log(
        `Time to generate ${count} v1 UUIDs: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether we have unique UUIDs
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(count);

      // The average time per UUID should be less than 0.01ms
      const avgTimePerUuid = executionTime / count;
      expect(avgTimePerUuid).toBeLessThan(0.01);
    });
  });

  describe('uuidV4Generate', () => {
    it('should generate 100,000 v4 UUIDs in a reasonable time', () => {
      const count = 100000;
      const uuids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          uuids.push(UUIDUtils.uuidV4Generate());
        }
      });

      console.log(
        `Time to generate ${count} v4 UUIDs: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether we have unique UUIDs (theoretical collisions may occur, but are extremely unlikely)
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(count);

      // The average time per UUID should be less than 0.01ms
      const avgTimePerUuid = executionTime / count;
      expect(avgTimePerUuid).toBeLessThan(0.01);
    });
  });

  describe('uuidV5Generate', () => {
    it('should generate 100,000 v5 UUIDs in a reasonable time', () => {
      const count = 100000;
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const uuids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Use a different name for each UUID to ensure uniqueness
          uuids.push(
            UUIDUtils.uuidV5Generate({
              namespace,
              name: `test-${i}`,
            }),
          );
        }
      });

      console.log(
        `Time to generate ${count} v5 UUIDs: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether we have unique UUIDs
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(count);

      // The average time per UUID should be less than 0.01ms
      const avgTimePerUuid = executionTime / count;
      expect(avgTimePerUuid).toBeLessThan(0.01);
    });

    it('should generate 100,000 v5 UUIDs with automatic namespace in a reasonable time', () => {
      const count = 100000;
      const uuids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Use a different name for each UUID to ensure uniqueness
          uuids.push(
            UUIDUtils.uuidV5Generate({
              name: `test-${i}`,
            }),
          );
        }
      });

      console.log(
        `Time to generate ${count} v5 UUIDs with automatic namespace: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether we have unique UUIDs
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(count);

      // The average time per UUID should be less than 0.02ms (slower due to namespace generation)
      const avgTimePerUuid = executionTime / count;
      expect(avgTimePerUuid).toBeLessThan(0.02);
    });
  });

  describe('isValidUuid', () => {
    it('should validate 100,000 valid UUIDs in a reasonable time', () => {
      const count = 100000;

      // Generate a UUID to validate repeatedly
      const uuid = UUIDUtils.uuidV4Generate();

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.isValidUuid({ id: uuid });
        }
      });

      console.log(
        `Time to validate ${count} valid UUIDs: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per validation should be less than 0.005ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.005);
    });

    it('should validate 100,000 invalid strings in a reasonable time', () => {
      const count = 100000;

      // Invalid string to validate repeatedly
      const invalidUuid = 'not-a-uuid';

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.isValidUuid({ id: invalidUuid });
        }
      });

      console.log(
        `Time to validate ${count} invalid strings: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per validation should be less than 0.005ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.005);
    });
  });

  describe('Performance comparison', () => {
    it('should compare generation performance across different UUID versions', () => {
      const count = 10000;

      // Measure the time to generate v1 UUIDs
      const v1Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.uuidV1Generate();
        }
      });

      // Measure the time to generate v4 UUIDs
      const v4Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.uuidV4Generate();
        }
      });

      // Measure the time to generate v5 UUIDs with a fixed namespace
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const v5Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.uuidV5Generate({
            namespace,
            name: `test-${i}`,
          });
        }
      });

      console.log(`Performance comparison for ${count} UUIDs:`);
      console.log(
        `- UUID v1: ${v1Time.toFixed(2)}ms (${(v1Time / count).toFixed(5)}ms per UUID)`,
      );
      console.log(
        `- UUID v4: ${v4Time.toFixed(2)}ms (${(v4Time / count).toFixed(5)}ms per UUID)`,
      );
      console.log(
        `- UUID v5: ${v5Time.toFixed(2)}ms (${(v5Time / count).toFixed(5)}ms per UUID)`,
      );

      // We do not make specific assertions here, since we are only comparing performance
    });
  });
});
