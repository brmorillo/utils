import { ConvertUtils } from '../../src/services/convert.service';

/**
 * Benchmark tests for the ConvertUtils class.
 * These tests check the class performance in high-frequency operations.
 */
describe('ConvertUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('Space conversion in bulk', () => {
    it('should convert 100,000 values from meters to kilometers in a reasonable time', () => {
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ConvertUtils.space({
            value: i,
            fromType: 'meters',
            toType: 'kilometers',
          });
        }
      });

      console.log(
        `Time to convert ${count} values from meters to kilometers: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per conversion should be less than 0.001ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.001);
    });
  });

  describe('Weight conversion in bulk', () => {
    it('should convert 100,000 values from kilograms to pounds in a reasonable time', () => {
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ConvertUtils.weight({
            value: i,
            fromType: 'kilograms',
            toType: 'pounds',
          });
        }
      });

      console.log(
        `Time to convert ${count} values from kilograms to pounds: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per conversion should be less than 0.001ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.001);
    });
  });

  describe('Volume conversion in bulk', () => {
    it('should convert 100,000 values from liters to gallons in a reasonable time', () => {
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ConvertUtils.volume({
            value: i,
            fromType: 'liters',
            toType: 'gallons',
          });
        }
      });

      console.log(
        `Time to convert ${count} values from liters to gallons: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per conversion should be less than 0.001ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.001);
    });
  });

  describe('Value conversion in bulk', () => {
    it('should convert 100,000 values from string to number in a reasonable time', () => {
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ConvertUtils.value({
            value: i.toString(),
            toType: 'number',
          });
        }
      });

      console.log(
        `Time to convert ${count} values from string to number: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per conversion should be less than 0.001ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.001);
    });

    it('should convert 10,000 values from number to roman in a reasonable time', () => {
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 1; i <= count; i++) {
          ConvertUtils.value({
            value: i,
            toType: 'roman',
          });
        }
      });

      console.log(
        `Time to convert ${count} values from number to roman: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per conversion should be less than 0.05ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.05);
    });
  });

  describe('Complete flow in bulk', () => {
    it('should run a complete conversion flow for 10,000 values in a reasonable time', () => {
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 1; i <= count; i++) {
          // Convert meters to kilometers
          const kmValue = ConvertUtils.space({
            value: i,
            fromType: 'meters',
            toType: 'kilometers',
          });

          // Convert kilometers to string
          const strValue = ConvertUtils.value({
            value: kmValue,
            toType: 'string',
          });

          // Convert string back to number
          const numValue = ConvertUtils.value({
            value: strValue,
            toType: 'number',
          });

          // Convert number to liters (simulating a conversion between systems)
          const literValue = numValue;

          // Convert liters to gallons
          ConvertUtils.volume({
            value: literValue,
            fromType: 'liters',
            toType: 'gallons',
          });
        }
      });

      console.log(
        `Time to run complete flow for ${count} values: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per complete flow should be less than 0.05ms
      const avgTimePerFlow = executionTime / count;
      expect(avgTimePerFlow).toBeLessThan(0.05);
    });
  });
});
