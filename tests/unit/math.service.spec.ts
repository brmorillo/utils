import { MathUtils } from '../../src/services/math.service';
import { ValidationError } from '../../src/errors';

/**
 * Unit tests for the MathUtils class.
 */
describe('MathUtils', () => {
  describe('roundToDecimals', () => {
    it('should round to 2 decimal places by default', () => {
      const result = MathUtils.roundToDecimals({ value: 3.14159 });
      expect(result).toBe(3.14);
    });

    it('should round to the specified number of decimal places', () => {
      const result = MathUtils.roundToDecimals({ value: 3.14159, decimals: 3 });
      expect(result).toBe(3.142);
    });

    it('should round up when the next digit is >= 5', () => {
      const result = MathUtils.roundToDecimals({ value: 3.145, decimals: 2 });
      expect(result).toBe(3.15);
    });

    it('should round down when the next digit is < 5', () => {
      const result = MathUtils.roundToDecimals({ value: 3.144, decimals: 2 });
      expect(result).toBe(3.14);
    });

    it('should handle negative numbers correctly', () => {
      const result = MathUtils.roundToDecimals({
        value: -3.14159,
        decimals: 2,
      });
      expect(result).toBe(-3.14);
    });

    it('should handle zero decimal places', () => {
      const result = MathUtils.roundToDecimals({ value: 3.14159, decimals: 0 });
      expect(result).toBe(3);
    });
  });

  describe('percentage', () => {
    it('should calculate the percentage correctly', () => {
      const result = MathUtils.percentage({ total: 200, part: 50 });
      expect(result).toBe(25);
    });

    it('should handle decimal numbers', () => {
      const result = MathUtils.percentage({ total: 200, part: 33.3 });
      expect(result).toBeCloseTo(16.65);
    });

    it('should return 100 when part and total are equal', () => {
      const result = MathUtils.percentage({ total: 50, part: 50 });
      expect(result).toBe(100);
    });

    it('should return 0 when part is 0', () => {
      const result = MathUtils.percentage({ total: 50, part: 0 });
      expect(result).toBe(0);
    });

    it('should throw an error when total is 0', () => {
      expect(() => {
        MathUtils.percentage({ total: 0, part: 50 });
      }).toThrow('Total cannot be zero');
    });
  });

  describe('randomInRange', () => {
    it('should generate a number within the specified range', () => {
      const min = 10;
      const max = 20;

      // Runs several times to increase confidence
      for (let i = 0; i < 100; i++) {
        const result = MathUtils.randomInRange({ min, max });
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
      }
    });

    it('should work with negative numbers', () => {
      const min = -20;
      const max = -10;

      const result = MathUtils.randomInRange({ min, max });
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    it('should work when min and max are equal', () => {
      const min = 10;
      const max = 10;

      const result = MathUtils.randomInRange({ min, max });
      expect(result).toBe(10);
    });

    it('should throw an error when min is greater than max', () => {
      expect(() => {
        MathUtils.randomInRange({ min: 20, max: 10 });
      }).toThrow('Min cannot be greater than max');
    });
  });

  describe('gcd', () => {
    it('should calculate the GCD of two positive numbers', () => {
      const result = MathUtils.gcd({ a: 24, b: 36 });
      expect(result).toBe(12);
    });

    it('should return the number itself when the other is zero', () => {
      expect(MathUtils.gcd({ a: 24, b: 0 })).toBe(24);
      expect(MathUtils.gcd({ a: 0, b: 36 })).toBe(36);
    });

    it('should work with coprime numbers', () => {
      const result = MathUtils.gcd({ a: 17, b: 13 });
      expect(result).toBe(1);
    });

    it('should work with equal numbers', () => {
      const result = MathUtils.gcd({ a: 24, b: 24 });
      expect(result).toBe(24);
    });

    it('should return a non-negative GCD for negative inputs', () => {
      expect(MathUtils.gcd({ a: -24, b: 36 })).toBe(12);
      expect(MathUtils.gcd({ a: -24, b: -36 })).toBe(12);
    });

    it('should throw a ValidationError for non-integer input', () => {
      expect(() => MathUtils.gcd({ a: 2.5, b: 5 })).toThrow(ValidationError);
      expect(() => MathUtils.gcd({ a: 5, b: NaN })).toThrow(ValidationError);
    });
  });

  describe('lcm', () => {
    it('should calculate the LCM of two positive numbers', () => {
      const result = MathUtils.lcm({ a: 4, b: 6 });
      expect(result).toBe(12);
    });

    it('should return zero when one of the numbers is zero', () => {
      expect(MathUtils.lcm({ a: 4, b: 0 })).toBe(0);
      expect(MathUtils.lcm({ a: 0, b: 6 })).toBe(0);
    });

    it('should return zero when both numbers are zero', () => {
      expect(MathUtils.lcm({ a: 0, b: 0 })).toBe(0);
    });

    it('should return a non-negative LCM for negative inputs', () => {
      expect(MathUtils.lcm({ a: -4, b: 6 })).toBe(12);
      expect(MathUtils.lcm({ a: -4, b: -6 })).toBe(12);
    });

    it('should work with coprime numbers', () => {
      const result = MathUtils.lcm({ a: 17, b: 13 });
      expect(result).toBe(17 * 13);
    });

    it('should work with equal numbers', () => {
      const result = MathUtils.lcm({ a: 24, b: 24 });
      expect(result).toBe(24);
    });
  });

  describe('clamp', () => {
    it('should return the value when it is within the range', () => {
      const result = MathUtils.clamp({ value: 5, min: 0, max: 10 });
      expect(result).toBe(5);
    });

    it('should return the minimum value when the value is lower', () => {
      const result = MathUtils.clamp({ value: -5, min: 0, max: 10 });
      expect(result).toBe(0);
    });

    it('should return the maximum value when the value is higher', () => {
      const result = MathUtils.clamp({ value: 15, min: 0, max: 10 });
      expect(result).toBe(10);
    });

    it('should work when min and max are equal', () => {
      const result = MathUtils.clamp({ value: 15, min: 10, max: 10 });
      expect(result).toBe(10);
    });

    it('should swap min and max when min is greater than max', () => {
      expect(MathUtils.clamp({ value: 3, min: 5, max: 0 })).toBe(3);
      expect(MathUtils.clamp({ value: 15, min: 10, max: 0 })).toBe(10);
      expect(MathUtils.clamp({ value: -5, min: 10, max: 0 })).toBe(0);
    });
  });

  describe('isPrime', () => {
    it('should identify prime numbers correctly', () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

      primes.forEach(prime => {
        expect(MathUtils.isPrime({ value: prime })).toBe(true);
      });
    });

    it('should identify non-prime numbers correctly', () => {
      const nonPrimes = [1, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];

      nonPrimes.forEach(nonPrime => {
        expect(MathUtils.isPrime({ value: nonPrime })).toBe(false);
      });
    });

    it('should return false for negative numbers', () => {
      expect(MathUtils.isPrime({ value: -7 })).toBe(false);
    });

    it('should return false for zero', () => {
      expect(MathUtils.isPrime({ value: 0 })).toBe(false);
    });

    it('should return false for one', () => {
      expect(MathUtils.isPrime({ value: 1 })).toBe(false);
    });

    it('should throw a ValidationError for non-integer input', () => {
      expect(() => MathUtils.isPrime({ value: 2.5 })).toThrow(ValidationError);
      expect(() => MathUtils.isPrime({ value: NaN })).toThrow(ValidationError);
    });
  });
});
