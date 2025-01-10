import { MathUtils } from './math.service';
import { NumberUtils } from './number.service';

describe('MathUtils', () => {
  describe('roundToDecimals', () => {
    it('should round a number to the specified number of decimal places', () => {
      expect(NumberUtils.roundToDecimals({ value: 3.14159, decimals: 2 })).toBe(
        3.14,
      );
      expect(NumberUtils.roundToDecimals({ value: 3.1459, decimals: 3 })).toBe(
        3.146,
      );
      expect(
        NumberUtils.roundToDecimals({ value: 10.123456, decimals: 4 }),
      ).toBe(10.1235);
      expect(NumberUtils.roundToDecimals({ value: -1.236, decimals: 2 })).toBe(
        -1.24,
      );
    });
  });

  describe('percentage', () => {
    it('should calculate the percentage of a value', () => {
      expect(MathUtils.percentage({ total: 200, part: 50 })).toBe(25);
      expect(MathUtils.percentage({ total: 100, part: 25 })).toBe(25);
      expect(MathUtils.percentage({ total: 500, part: 50 })).toBe(10);
      expect(MathUtils.percentage({ total: 1, part: 0.5 })).toBe(50);
      expect(MathUtils.percentage({ total: 100, part: 0 })).toBe(0); // Caso onde o part é zero
    });

    it('should throw an error for a total of 0', () => {
      expect(() => MathUtils.percentage({ total: 0, part: 50 })).toThrow(
        'Total cannot be zero',
      );
    });

    it('should handle negative values correctly', () => {
      expect(MathUtils.percentage({ total: -200, part: -50 })).toBe(25); // Negativos proporcionais
      expect(MathUtils.percentage({ total: 200, part: -50 })).toBe(-25); // Part negativo
      expect(MathUtils.percentage({ total: -200, part: 50 })).toBe(-25); // Total negativo
    });

    it('should handle floating-point precision', () => {
      expect(MathUtils.percentage({ total: 1, part: 0.333 })).toBeCloseTo(
        33.3,
        1,
      ); // Aproximação
    });

    it('should return 100 for part equal to total', () => {
      expect(MathUtils.percentage({ total: 50, part: 50 })).toBe(100);
    });
  });

  describe('gcd', () => {
    it('should calculate the greatest common divisor (GCD) of two numbers', () => {
      expect(MathUtils.gcd({ a: 24, b: 36 })).toBe(12);
      expect(MathUtils.gcd({ a: 17, b: 13 })).toBe(1);
      expect(MathUtils.gcd({ a: 100, b: 25 })).toBe(25);
      expect(MathUtils.gcd({ a: 0, b: 10 })).toBe(10);
      expect(MathUtils.gcd({ a: 10, b: 0 })).toBe(10);
    });
  });

  describe('lcm', () => {
    it('should calculate the least common multiple (LCM) of two numbers', () => {
      expect(MathUtils.lcm({ a: 4, b: 6 })).toBe(12);
      expect(MathUtils.lcm({ a: 7, b: 3 })).toBe(21);
      expect(MathUtils.lcm({ a: 10, b: 5 })).toBe(10);
      expect(MathUtils.lcm({ a: 0, b: 10 })).toBe(0);
      expect(MathUtils.lcm({ a: 10, b: 0 })).toBe(0);
    });
  });

  describe('randomInRange', () => {
    it('should generate a random number within the specified range', () => {
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomIntegerInRange({ min: 1, max: 10 });
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
      }
    });

    it('should handle a range where min and max are the same', () => {
      expect(NumberUtils.randomIntegerInRange({ min: 5, max: 5 })).toBe(5);
    });
  });
});
