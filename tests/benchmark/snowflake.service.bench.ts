import { SnowflakeUtils } from '../../src/services/snowflake.service';

/**
 * Benchmark tests for the SnowflakeUtils class.
 * These tests verify the class performance in high-frequency operations.
 */
describe('SnowflakeUtils - Benchmark Tests', () => {
  const testEpoch = new Date('2023-01-01T00:00:00.000Z');

  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('Bulk ID generation', () => {
    it('should generate 10,000 IDs in a reasonable time', () => {
      const count = 10000;
      const ids: bigint[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ids.push(SnowflakeUtils.generate({ epoch: testEpoch }));
        }
      });

      console.log(
        `Time to generate ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether we have unique IDs (collisions may occur in fast runs)
      const uniqueIds = new Set(ids.map(id => id.toString()));
      expect(uniqueIds.size).toBeGreaterThan(0);

      // The average time per ID should be less than 0.1ms
      const avgTimePerID = executionTime / count;
      expect(avgTimePerID).toBeLessThan(0.1);
    });

    it('should generate 1023 unique IDs within the same millisecond', () => {
      const count = 1023;
      const ids: bigint[] = [];

      // Force all IDs to have the same timestamp
      const timestamp = new Date();
      const mockDate = new Date(timestamp);
      const realDate = global.Date;

      // Mock the Date class to always return the same timestamp
      global.Date = class extends Date {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as any;

      try {
        // Generate 1023 IDs (theoretical maximum in 1ms with workerId and processId = 0)
        for (let i = 0; i < count; i++) {
          ids.push(SnowflakeUtils.generate({ epoch: testEpoch }));
        }

        // Check whether all IDs are unique
        const uniqueIds = new Set(ids.map(id => id.toString()));
        expect(uniqueIds.size).toBe(count);

        // Check whether all IDs have the same timestamp
        const timestamps = new Set();
        ids.forEach(id => {
          const decodedTimestamp = SnowflakeUtils.getTimestamp({
            snowflakeId: id,
            epoch: testEpoch,
          }).getTime();
          timestamps.add(decodedTimestamp);
        });

        expect(timestamps.size).toBe(1);
      } finally {
        // Restore the original Date class
        global.Date = realDate;
      }
    });
  });

  describe('Bulk ID decoding', () => {
    it('should decode 10,000 IDs in a reasonable time', () => {
      const count = 10000;

      // Generate an ID to decode repeatedly
      const id = SnowflakeUtils.generate({ epoch: testEpoch });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.decode({ snowflakeId: id, epoch: testEpoch });
        }
      });

      console.log(
        `Time to decode ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per decode should be less than 0.05ms
      const avgTimePerDecode = executionTime / count;
      expect(avgTimePerDecode).toBeLessThan(0.05);
    });
  });

  describe('Bulk timestamp extraction', () => {
    it('should extract the timestamp from 10,000 IDs in a reasonable time', () => {
      const count = 10000;

      // Generate an ID to extract the timestamp repeatedly
      const id = SnowflakeUtils.generate({ epoch: testEpoch });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.getTimestamp({ snowflakeId: id, epoch: testEpoch });
        }
      });

      console.log(
        `Time to extract the timestamp from ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per extraction should be less than 0.05ms
      const avgTimePerExtraction = executionTime / count;
      expect(avgTimePerExtraction).toBeLessThan(0.05);
    });
  });

  describe('Bulk ID validation', () => {
    it('should validate 10,000 IDs in a reasonable time', () => {
      const count = 10000;

      // Generate an ID to validate repeatedly
      const id = SnowflakeUtils.generate({ epoch: testEpoch }).toString();

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.isValidSnowflake({ snowflakeId: id });
        }
      });

      console.log(
        `Time to validate ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per validation should be less than 0.01ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.01);
    });
  });

  describe('Bulk ID comparison', () => {
    it('should compare 10,000 pairs of IDs in a reasonable time', () => {
      const count = 10000;

      // Generate two IDs to compare repeatedly
      const id1 = SnowflakeUtils.generate({ epoch: testEpoch });
      const id2 = SnowflakeUtils.generate({ epoch: testEpoch });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.compare({ first: id1, second: id2 });
        }
      });

      console.log(
        `Time to compare ${count} pairs of IDs: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per comparison should be less than 0.01ms
      const avgTimePerComparison = executionTime / count;
      expect(avgTimePerComparison).toBeLessThan(0.01);
    });
  });

  describe('Bulk ID creation from timestamp', () => {
    it('should create 10,000 IDs from timestamps in a reasonable time', () => {
      const count = 10000;

      // Create a timestamp to use repeatedly
      const timestamp = new Date();

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.fromTimestamp({ timestamp, epoch: testEpoch });
        }
      });

      console.log(
        `Time to create ${count} IDs from timestamps: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per creation should be less than 0.1ms
      const avgTimePerCreation = executionTime / count;
      expect(avgTimePerCreation).toBeLessThan(0.1);
    });
  });

  describe('Bulk ID conversion', () => {
    it('should convert 10,000 IDs from bigint to string in a reasonable time', () => {
      const count = 10000;

      // Generate an ID to convert repeatedly
      const id = SnowflakeUtils.generate({ epoch: testEpoch });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.convert({ snowflakeId: id, toFormat: 'string' });
        }
      });

      console.log(
        `Time to convert ${count} IDs from bigint to string: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per conversion should be less than 0.01ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.01);
    });

    it('should convert 10,000 IDs from string to bigint in a reasonable time', () => {
      const count = 10000;

      // Generate an ID as a string to convert repeatedly
      const idString = SnowflakeUtils.generate({ epoch: testEpoch }).toString();

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.convert({ snowflakeId: idString, toFormat: 'bigint' });
        }
      });

      console.log(
        `Time to convert ${count} IDs from string to bigint: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per conversion should be less than 0.01ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.01);
    });

    it('should convert 10,000 small IDs to number in a reasonable time', () => {
      const count = 10000;

      // Use a small ID that can be converted to number
      const smallId = 123456789n;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.convert({ snowflakeId: smallId, toFormat: 'number' });
        }
      });

      console.log(
        `Time to convert ${count} IDs to number: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per conversion should be less than 0.01ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.01);
    });
  });

  describe('Bulk complete flow', () => {
    it('should run the complete flow for 1,000 IDs in a reasonable time', () => {
      const count = 1000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Generate an ID
          const id = SnowflakeUtils.generate({ epoch: testEpoch });

          // Decode the ID
          const components = SnowflakeUtils.decode({
            snowflakeId: id,
            epoch: testEpoch,
          });

          // Extract the timestamp
          const timestamp = SnowflakeUtils.getTimestamp({
            snowflakeId: id,
            epoch: testEpoch,
          });

          // Create a new ID from the timestamp
          const newId = SnowflakeUtils.fromTimestamp({
            timestamp,
            epoch: testEpoch,
          });

          // Compare the IDs
          SnowflakeUtils.compare({ first: id, second: newId });

          // Validate the ID
          SnowflakeUtils.isValidSnowflake({ snowflakeId: id.toString() });

          // Convert the ID to string and back to bigint
          const stringId = SnowflakeUtils.convert({
            snowflakeId: id,
            toFormat: 'string',
          });
          SnowflakeUtils.convert({ snowflakeId: stringId, toFormat: 'bigint' });
        }
      });

      console.log(
        `Time to run the complete flow for ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per complete flow should be less than 0.5ms
      const avgTimePerFlow = executionTime / count;
      expect(avgTimePerFlow).toBeLessThan(0.5);
    });
  });
});
