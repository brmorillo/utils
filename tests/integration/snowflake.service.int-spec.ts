import { SnowflakeUtils } from '../../src/services/snowflake.service';

/**
 * Integration tests for the SnowflakeUtils class.
 * These tests verify the behavior of the class in more complex scenarios
 * and with interactions between different methods.
 */
describe('SnowflakeUtils - Integration Tests', () => {
  const testEpoch = new Date('2023-01-01T00:00:00.000Z');

  describe('Complete generation and decoding flow', () => {
    it('should generate an ID and decode it correctly', () => {
      // Generate an ID with specific parameters
      const workerId = 5n;
      const processId = 10n;

      const id = SnowflakeUtils.generate({
        epoch: testEpoch,
        workerId,
        processId,
      });

      // Decode the ID
      const components = SnowflakeUtils.decode({
        snowflakeId: id,
        epoch: testEpoch,
      });

      // Verify that the components match the original values
      expect(components.workerId).toBe(workerId);
      expect(components.processId).toBe(processId);

      // Extract the timestamp
      const timestamp = SnowflakeUtils.getTimestamp({
        snowflakeId: id,
        epoch: testEpoch,
      });

      // Verify that the timestamp is close to the current moment
      const now = new Date();
      const diff = Math.abs(timestamp.getTime() - now.getTime());
      expect(diff).toBeLessThan(5000); // Within 5 seconds
    });
  });

  describe('Sorting Snowflake IDs', () => {
    it('should generate IDs that can be sorted chronologically', () => {
      // Create a series of IDs with specific timestamps
      const timestamps = [
        new Date('2023-01-01T12:00:00.000Z'),
        new Date('2023-01-02T12:00:00.000Z'),
        new Date('2023-01-03T12:00:00.000Z'),
        new Date('2023-01-04T12:00:00.000Z'),
        new Date('2023-01-05T12:00:00.000Z'),
      ];

      // Generate IDs for each timestamp (in random order)
      const ids = [
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[2],
          epoch: testEpoch,
        }),
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[0],
          epoch: testEpoch,
        }),
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[4],
          epoch: testEpoch,
        }),
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[1],
          epoch: testEpoch,
        }),
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[3],
          epoch: testEpoch,
        }),
      ];

      // Sort the IDs
      const sortedIds = [...ids].sort((a, b) => {
        return SnowflakeUtils.compare({ first: a, second: b });
      });

      // Extract the timestamps from the sorted IDs
      const sortedTimestamps = sortedIds.map(id =>
        SnowflakeUtils.getTimestamp({ snowflakeId: id, epoch: testEpoch }),
      );

      // Verify that the timestamps are in chronological order
      for (let i = 1; i < sortedTimestamps.length; i++) {
        expect(sortedTimestamps[i].getTime()).toBeGreaterThan(
          sortedTimestamps[i - 1].getTime(),
        );
      }

      // Verify that the first timestamp matches the oldest timestamp
      expect(sortedTimestamps[0].getDate()).toBe(timestamps[0].getDate());

      // Verify that the last timestamp matches the most recent timestamp
      expect(sortedTimestamps[4].getDate()).toBe(timestamps[4].getDate());
    });
  });

  describe('ID validation and comparison', () => {
    it('should validate and compare IDs correctly', () => {
      // Generate two IDs with different timestamps to guarantee the order
      const timestamp1 = new Date('2023-01-01T12:00:00.000Z');
      const timestamp2 = new Date('2023-01-02T12:00:00.000Z');

      const id1 = SnowflakeUtils.fromTimestamp({
        timestamp: timestamp1,
        epoch: testEpoch,
      });
      const id2 = SnowflakeUtils.fromTimestamp({
        timestamp: timestamp2,
        epoch: testEpoch,
      });

      // Validate the IDs
      expect(
        SnowflakeUtils.isValidSnowflake({ snowflakeId: id1.toString() }),
      ).toBe(true);
      expect(
        SnowflakeUtils.isValidSnowflake({ snowflakeId: id2.toString() }),
      ).toBe(true);

      // Compare the IDs - id2 should be greater (more recent) than id1
      const comparisonResult = SnowflakeUtils.compare({
        first: id2,
        second: id1,
      });
      expect(comparisonResult).toBe(1);

      // Verify the reverse comparison
      expect(SnowflakeUtils.compare({ first: id1, second: id2 })).toBe(-1);

      // Verify that the timestamps confirm the order
      const extractedTimestamp1 = SnowflakeUtils.getTimestamp({
        snowflakeId: id1,
        epoch: testEpoch,
      });
      const extractedTimestamp2 = SnowflakeUtils.getTimestamp({
        snowflakeId: id2,
        epoch: testEpoch,
      });

      expect(extractedTimestamp2.getTime()).toBeGreaterThan(
        extractedTimestamp1.getTime(),
      );
    });
  });

  describe('Compatibility between different formats', () => {
    it('should maintain compatibility between string and bigint', () => {
      // Generate an ID
      const id = SnowflakeUtils.generate({ epoch: testEpoch });

      // Convert to string
      const idString = id.toString();

      // Decode using both formats
      const componentsBigint = SnowflakeUtils.decode({
        snowflakeId: id,
        epoch: testEpoch,
      });

      const componentsString = SnowflakeUtils.decode({
        snowflakeId: idString,
        epoch: testEpoch,
      });

      // Verify that the components are identical
      expect(componentsBigint.timestamp).toEqual(componentsString.timestamp);
      expect(componentsBigint.workerId).toEqual(componentsString.workerId);
      expect(componentsBigint.processId).toEqual(componentsString.processId);
      expect(componentsBigint.increment).toEqual(componentsString.increment);
    });
  });
});
