import { MathUtils } from '../../src/services/math.service';

/**
 * Benchmark tests for the MathUtils class.
 * These tests verify the class's performance in high-frequency operations.
 */
describe('MathUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('roundToDecimals in bulk', () => {
    it('should round 100,000 numbers in a reasonable time', () => {
      const count = 100000;
      const value = Math.PI;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.roundToDecimals({ value, decimals: 2 }));
        }
      });

      console.log(
        `Time to round ${count} numbers: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the result is correct
      expect(results[0]).toBe(3.14);

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('percentage in bulk', () => {
    it('should calculate 100,000 percentages in a reasonable time', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.percentage({ total: 200, part: 50 }));
        }
      });

      console.log(
        `Time to calculate ${count} percentages: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the result is correct
      expect(results[0]).toBe(25);

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('randomInRange in bulk', () => {
    it('should generate 100,000 random numbers in a reasonable time', () => {
      const count = 100000;
      const min = 1;
      const max = 100;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.randomInRange({ min, max }));
        }
      });

      console.log(
        `Time to generate ${count} random numbers: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the results are within the range
      const allInRange = results.every(r => r >= min && r <= max);
      expect(allInRange).toBe(true);

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('gcd in bulk', () => {
    it('should calculate 100,000 GCDs in a reasonable time', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.gcd({ a: 24, b: 36 }));
        }
      });

      console.log(
        `Time to calculate ${count} GCDs: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the result is correct
      expect(results[0]).toBe(12);

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('lcm in bulk', () => {
    it('should calculate 100,000 LCMs in a reasonable time', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.lcm({ a: 4, b: 6 }));
        }
      });

      console.log(
        `Time to calculate ${count} LCMs: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the result is correct
      expect(results[0]).toBe(12);

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('clamp in bulk', () => {
    it('should clamp 100,000 values in a reasonable time', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.clamp({ value: 15, min: 0, max: 10 }));
        }
      });

      console.log(
        `Time to clamp ${count} values: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the result is correct
      expect(results[0]).toBe(10);

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('isValidPrime in bulk', () => {
    it('should check 10,000 prime numbers in a reasonable time', () => {
      const count = 10000;
      const results: boolean[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.isValidPrime({ value: 997 })); // A large prime number
        }
      });

      console.log(
        `Time to check ${count} prime numbers: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the result is correct
      expect(results[0]).toBe(true);

      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });

    it('should check 10,000 non-prime numbers in a reasonable time', () => {
      const count = 10000;
      const results: boolean[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.isValidPrime({ value: 996 })); // A large non-prime number
        }
      });

      console.log(
        `Time to check ${count} non-prime numbers: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether the result is correct
      expect(results[0]).toBe(false);

      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Performance comparison between methods', () => {
    it('should compare the performance of different methods', () => {
      const count = 10000;
      const results: Record<string, number> = {};

      // Test roundToDecimals
      results.roundToDecimals = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.roundToDecimals({ value: Math.PI, decimals: 2 });
        }
      });

      // Test percentage
      results.percentage = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.percentage({ total: 200, part: 50 });
        }
      });

      // Test randomInRange
      results.randomInRange = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.randomInRange({ min: 1, max: 100 });
        }
      });

      // Test gcd
      results.gcd = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.gcd({ a: 24, b: 36 });
        }
      });

      // Test lcm
      results.lcm = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.lcm({ a: 4, b: 6 });
        }
      });

      // Test clamp
      results.clamp = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.clamp({ value: 15, min: 0, max: 10 });
        }
      });

      // Test isValidPrime
      results.isValidPrime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.isValidPrime({ value: 997 });
        }
      });

      // Display the results
      console.log('Performance comparison for different methods:');
      Object.entries(results).forEach(([method, time]) => {
        console.log(
          `${method}: ${time.toFixed(2)}ms (${(time / count).toFixed(3)}ms per operation)`,
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
      // But we don't make specific assertions, as performance may vary
    });
  });
});
