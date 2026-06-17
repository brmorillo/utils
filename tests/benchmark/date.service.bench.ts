import { DateUtils } from '../../src/services/date.service';
import { DateTime } from 'luxon';
/**
 * Benchmark tests for the DateUtils class.
 * These tests verify the class's performance in high-frequency operations.
 */
describe('DateUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('Getting current date in bulk', () => {
    it('should get 10,000 current dates in a reasonable time', () => {
      const count = 10000;
      const dates: DateTime[] = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          dates.push(DateUtils.now());
        }
      });
      console.log(
        `Time to get ${count} current dates: ${executionTime.toFixed(2)}ms`,
      );
      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
    it('should get 10,000 UTC dates in a reasonable time', () => {
      const count = 10000;
      const dates: DateTime[] = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          dates.push(DateUtils.now({ utc: true }));
        }
      });
      console.log(
        `Time to get ${count} UTC dates: ${executionTime.toFixed(2)}ms`,
      );
      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Creating intervals in bulk', () => {
    it('should create 10,000 intervals in a reasonable time', () => {
      const count = 10000;
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const intervals = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          intervals.push(
            DateUtils.createInterval({ startDate, endDate }),
          );
        }
      });
      console.log(
        `Time to create ${count} intervals: ${executionTime.toFixed(2)}ms`,
      );
      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Adding time in bulk', () => {
    it('should add time to 10,000 dates in a reasonable time', () => {
      const count = 10000;
      const date = '2023-01-01';
      const timeToAdd = { days: 5 };
      const results = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(DateUtils.addTime({ date, timeToAdd }));
        }
      });
      console.log(
        `Time to add time to ${count} dates: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Calculating difference between dates in bulk', () => {
    it('should calculate the difference between 10,000 pairs of dates in a reasonable time', () => {
      const count = 10000;
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const units = ['days', 'hours', 'minutes'] as const;
      const results = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(
            DateUtils.diffBetween({ startDate, endDate, units: [...units] }),
          );
        }
      });
      console.log(
        `Time to calculate difference between ${count} pairs of dates: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Timezone conversion in bulk', () => {
    it('should convert 10,000 dates to UTC in a reasonable time', () => {
      const count = 10000;
      const date = DateTime.local();
      const results = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(DateUtils.toUTC({ date }));
        }
      });
      console.log(
        `Time to convert ${count} dates to UTC: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });

    it('should convert 10,000 dates to a specific timezone in a reasonable time', () => {
      const count = 10000;
      const date = DateTime.utc();
      const timeZone = 'America/New_York';
      const results = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(DateUtils.toTimeZone({ date, timeZone }));
        }
      });
      console.log(
        `Time to convert ${count} dates to ${timeZone}: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Performance comparison between operations', () => {
    it('should compare the performance of different date operations', () => {
      const count = 1000;
      const results: Record<string, number> = {};

      // Test now
      results.now = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.now();
        }
      });

      // Test createInterval
      const start = '2023-01-01';
      const end = '2023-12-31';
      results.createInterval = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.createInterval({ startDate: start, endDate: end });
        }
      });

      // Test addTime
      results.addTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.addTime({
            date: start,
            timeToAdd: { days: i % 30 },
          });
        }
      });

      // Test diffBetween
      const units = ['days'] as const;
      results.diffBetween = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.diffBetween({
            startDate: start,
            endDate: end,
            units: [...units],
          });
        }
      });

      // Display the results
      console.log('Performance comparison for different date operations:');
      Object.entries(results).forEach(([operation, time]) => {
        console.log(
          `${operation}: ${time.toFixed(2)}ms (${(time / count).toFixed(
            3,
          )}ms per operation)`,
        );
      });

      // We don't make specific assertions here, as the goal is just to collect data for analysis
    });
  });
});