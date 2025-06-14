import { MathUtils } from '../services/math.service';

describe('MathUtils', () => {
  describe('roundToDecimals', () => {
    it('should round a number to the specified decimal places', () => {
      expect(MathUtils.roundToDecimals({ value: 3.14159, decimals: 2 })).toBe(3.14);
      expect(MathUtils.roundToDecimals({ value: 3.14159 })).toBe(3.14);
      expect(MathUtils.roundToDecimals({ value: 3.14559, decimals: 3 })).toBe(3.146);
    });
  });

  describe('percentage', () => {
    it('should calculate the percentage correctly', () => {
      expect(MathUtils.percentage({ total: 200, part: 50 })).toBe(25);
      expect(MathUtils.percentage({ total: 100, part: 25 })).toBe(25);
    });

    it('should throw an error if total is zero', () => {
      expect(() => MathUtils.percentage({ total: 0, part: 50 })).toThrow('Total cannot be zero');
    });
  });

  describe('randomInRange', () => {
    it('should generate a random number within the specified range', () => {
      const result = MathUtils.randomInRange({ min: 1, max: 10 });
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it('should throw an error if min is greater than max', () => {
      expect(() => MathUtils.randomInRange({ min: 10, max: 1 })).toThrow('Min cannot be greater than max');
    });
  });

  describe('gcd', () => {
    it('should find the greatest common divisor of two numbers', () => {
      expect(MathUtils.gcd({ a: 24, b: 36 })).toBe(12);
      expect(MathUtils.gcd({ a: 17, b: 23 })).toBe(1);
      expect(MathUtils.gcd({ a: 0, b: 5 })).toBe(5);
    });
  });

  describe('lcm', () => {
    it('should find the least common multiple of two numbers', () => {
      expect(MathUtils.lcm({ a: 4, b: 6 })).toBe(12);
      expect(MathUtils.lcm({ a: 3, b: 5 })).toBe(15);
    });
  });

  describe('clamp', () => {
    it('should clamp a number within the specified range', () => {
      expect(MathUtils.clamp({ value: 10, min: 0, max: 5 })).toBe(5);
      expect(MathUtils.clamp({ value: -5, min: 0, max: 5 })).toBe(0);
      expect(MathUtils.clamp({ value: 3, min: 0, max: 5 })).toBe(3);
    });
  });

  describe('isPrime', () => {
    it('should correctly identify prime numbers', () => {
      expect(MathUtils.isPrime({ value: 2 })).toBe(true);
      expect(MathUtils.isPrime({ value: 3 })).toBe(true);
      expect(MathUtils.isPrime({ value: 7 })).toBe(true);
      expect(MathUtils.isPrime({ value: 17 })).toBe(true);
    });

    it('should correctly identify non-prime numbers', () => {
      expect(MathUtils.isPrime({ value: 1 })).toBe(false);
      expect(MathUtils.isPrime({ value: 4 })).toBe(false);
      expect(MathUtils.isPrime({ value: 9 })).toBe(false);
      expect(MathUtils.isPrime({ value: 15 })).toBe(false);
    });
  });
});