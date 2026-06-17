import { NumberUtils } from '../../src/services/number.service';
import { MathUtils } from '../../src/services/math.service';

/**
 * Benchmark tests for the NumberUtils class.
 * These tests verify the performance of the class in high-frequency operations.
 */
describe('NumberUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('isValidEven and isOdd in bulk', () => {
    it('should check 1,000,000 even/odd numbers in a reasonable time', () => {
      const count = 1000000;
      const results: boolean[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.isValidEven({ value: i }));
        }
      });

      console.log(
        `Time to check ${count} even numbers: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('normalize in bulk', () => {
    it('should normalize 1,000,000 numbers in a reasonable time', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.normalize({ value: i % 2 === 0 ? 0 : -0 }));
        }
      });

      console.log(
        `Time to normalize ${count} numbers: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('roundDown, roundUp and roundToNearest in bulk', () => {
    it('should round 1,000,000 numbers in a reasonable time', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.roundToNearest({ value: i + 0.5 }));
        }
      });

      console.log(
        `Time to round ${count} numbers: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('roundToDecimals in bulk', () => {
    it('should round 1,000,000 numbers to decimals in a reasonable time', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(
            NumberUtils.roundToDecimals({
              value: Math.PI + i * 0.0001,
              decimals: 2,
            }),
          );
        }
      });

      console.log(
        `Time to round ${count} numbers to decimals: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('toCents in bulk', () => {
    it('should convert 1,000,000 numbers to cents in a reasonable time', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.toCents({ value: i * 0.01 }));
        }
      });

      console.log(
        `Time to convert ${count} numbers to cents: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('addDecimalPlaces in bulk', () => {
    it('should add decimal places to 1,000,000 numbers in a reasonable time', () => {
      const count = 1000000;
      const results: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(
            NumberUtils.addDecimalPlaces({ value: i, decimalPlaces: 2 }),
          );
        }
      });

      console.log(
        `Time to add decimal places to ${count} numbers: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('removeDecimalPlaces in bulk', () => {
    it('should remove decimal places from 1,000,000 numbers in a reasonable time', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.removeDecimalPlaces({ value: i + 0.123 }));
        }
      });

      console.log(
        `Time to remove decimal places from ${count} numbers: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('randomIntegerInRange in bulk', () => {
    it('should generate 1,000,000 random integers in a reasonable time', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.randomIntegerInRange({ min: 1, max: 100 }));
        }
      });

      console.log(
        `Time to generate ${count} random integers: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('randomFloatInRange in bulk', () => {
    it('should generate 1,000,000 random floats in a reasonable time', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(
            NumberUtils.randomFloatInRange({ min: 1, max: 100, decimals: 2 }),
          );
        }
      });

      console.log(
        `Time to generate ${count} random floats: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('factorial in bulk', () => {
    it('should compute the factorial of 100,000 small numbers in a reasonable time', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.factorial({ value: i % 10 })); // Use numbers from 0 to 9
        }
      });

      console.log(
        `Time to compute the factorial of ${count} numbers: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('clamp in bulk', () => {
    it('should clamp 1,000,000 numbers in a reasonable time', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.clamp({ value: i, min: 0, max: 100 }));
        }
      });

      console.log(
        `Time to clamp ${count} numbers: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('isValidPrime in bulk', () => {
    it('should check whether 100,000 numbers are prime in a reasonable time', () => {
      const count = 100000;
      const results: boolean[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.isValidPrime({ value: i }));
        }
      });

      console.log(
        `Time to check whether ${count} numbers are prime: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('Performance comparison between methods', () => {
    it('should compare the performance of different methods', () => {
      const count = 100000;
      const results: Record<string, number> = {};

      // Test isValidEven
      results.isValidEven = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          NumberUtils.isValidEven({ value: i });
        }
      });

      // Test isOdd
      results.isOdd = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          NumberUtils.isValidOdd({ value: i });
        }
      });

      // Test roundToDecimals
      results.roundToDecimals = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          NumberUtils.roundToDecimals({ value: Math.PI, decimals: 2 });
        }
      });

      // Test isValidPrime
      results.isValidPrime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.isValidPrime({ value: i % 100 });
        }
      });

      // Display the results
      console.log('Performance comparison for different methods:');
      Object.entries(results).forEach(([method, time]) => {
        console.log(
          `${method}: ${time.toFixed(2)}ms (${(time / count).toFixed(6)}ms per operation)`,
        );
      });

      // We don't make specific assertions here, as the goal is just to collect data for analysis
    });
  });

  describe('Performance with different inputs', () => {
    it('should measure the performance of isValidPrime with numbers of different sizes', () => {
      const count = 1000;
      const numbers = [2, 101, 997, 9973, 99991];
      const results: Record<number, number> = {};

      for (const num of numbers) {
        results[num] = measureExecutionTime(() => {
          for (let i = 0; i < count; i++) {
            MathUtils.isValidPrime({ value: num });
          }
        });

        console.log(
          `Time to check ${count} times whether ${num} is prime: ${results[num].toFixed(2)}ms`,
        );
      }

      // Larger numbers are expected to take more time
      // But we don't make specific assertions, as the performance may vary
    });
  });
});
