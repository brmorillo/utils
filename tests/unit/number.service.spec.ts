import { NumberUtils } from '../../src/services/number.service';
import { MathUtils } from '../../src/services/math.service';
import { ValidationError } from '../../src/errors';

describe('NumberUtils', () => {
  describe('normalize', () => {
    it('should convert -0 to 0', () => {
      expect(NumberUtils.normalize({ value: -0 })).toBe(0);
    });

    it('should keep other numbers unchanged', () => {
      expect(NumberUtils.normalize({ value: 5 })).toBe(5);
      expect(NumberUtils.normalize({ value: -5 })).toBe(-5);
      expect(NumberUtils.normalize({ value: 0 })).toBe(0);
    });
  });

  describe('roundDown', () => {
    it('should round numbers down', () => {
      expect(NumberUtils.roundDown({ value: 4.7 })).toBe(4);
      expect(NumberUtils.roundDown({ value: 4.2 })).toBe(4);
      expect(NumberUtils.roundDown({ value: 4.0 })).toBe(4);
    });

    it('should round negative numbers down', () => {
      expect(NumberUtils.roundDown({ value: -4.7 })).toBe(-5);
      expect(NumberUtils.roundDown({ value: -4.2 })).toBe(-5);
      expect(NumberUtils.roundDown({ value: -4.0 })).toBe(-4);
    });
  });

  describe('isPositive', () => {
    it('should identify positive numbers', () => {
      expect(NumberUtils.isPositive({ value: 5 })).toBe(true);
      expect(NumberUtils.isPositive({ value: 0.1 })).toBe(true);
    });

    it('should identify non-positive numbers', () => {
      expect(NumberUtils.isPositive({ value: 0 })).toBe(false);
      expect(NumberUtils.isPositive({ value: -5 })).toBe(false);
    });

    it('should handle positive and negative zero', () => {
      expect(NumberUtils.isPositive({ value: 0 })).toBe(false);
      expect(NumberUtils.isPositive({ value: -0 })).toBe(false);
    });
  });

  describe('roundUp', () => {
    it('should round numbers up', () => {
      expect(NumberUtils.roundUp({ value: 4.3 })).toBe(5);
      expect(NumberUtils.roundUp({ value: 4.7 })).toBe(5);
      expect(NumberUtils.roundUp({ value: 4.0 })).toBe(4);
    });

    it('should round negative numbers up', () => {
      expect(NumberUtils.roundUp({ value: -4.3 })).toBe(-4);
      expect(NumberUtils.roundUp({ value: -4.7 })).toBe(-4);
      expect(NumberUtils.roundUp({ value: -4.0 })).toBe(-4);
    });
  });

  describe('roundToNearest', () => {
    it('should round numbers to the nearest integer', () => {
      expect(NumberUtils.roundToNearest({ value: 4.4 })).toBe(4);
      expect(NumberUtils.roundToNearest({ value: 4.5 })).toBe(5);
      expect(NumberUtils.roundToNearest({ value: 4.6 })).toBe(5);
    });

    it('should round negative numbers to the nearest integer', () => {
      expect(NumberUtils.roundToNearest({ value: -4.4 })).toBe(-4);
      expect(NumberUtils.roundToNearest({ value: -4.5 })).toBe(-4);
      expect(NumberUtils.roundToNearest({ value: -4.6 })).toBe(-5);
    });
  });

  describe('roundToDecimals', () => {
    it('should round to the specified number of decimal places', () => {
      expect(NumberUtils.roundToDecimals({ value: 3.14159, decimals: 2 })).toBe(
        3.14,
      );
      expect(NumberUtils.roundToDecimals({ value: 3.14159, decimals: 3 })).toBe(
        3.142,
      );
    });

    it('should use 2 decimal places by default', () => {
      expect(NumberUtils.roundToDecimals({ value: 3.14159 })).toBe(3.14);
    });

    it('should handle negative numbers', () => {
      expect(NumberUtils.roundToDecimals({ value: -3.14159, decimals: 2 })).toBe(
        -3.14,
      );
    });
  });

  describe('toCents', () => {
    it('should convert numbers to cents', () => {
      expect(NumberUtils.toCents({ value: 10.56 })).toBe(1056);
      expect(NumberUtils.toCents({ value: 0.99 })).toBe(99);
      expect(NumberUtils.toCents({ value: 0.01 })).toBe(1);
    });

    it('should handle numbers without decimal places', () => {
      expect(NumberUtils.toCents({ value: 10 })).toBe(1000);
      expect(NumberUtils.toCents({ value: 0 })).toBe(0);
    });

    it('should round to the nearest cent', () => {
      expect(NumberUtils.toCents({ value: 10.567 })).toBe(1057);
      expect(NumberUtils.toCents({ value: 10.562 })).toBe(1056);
    });
  });

  describe('addDecimalPlaces', () => {
    it('should add decimal places to a number', () => {
      expect(NumberUtils.addDecimalPlaces({ value: 10, decimalPlaces: 2 })).toBe(
        '10.00',
      );
      expect(NumberUtils.addDecimalPlaces({ value: 10.5, decimalPlaces: 3 })).toBe(
        '10.500',
      );
    });

    it('should handle negative numbers', () => {
      expect(
        NumberUtils.addDecimalPlaces({ value: -10, decimalPlaces: 2 }),
      ).toBe('-10.00');
    });

    it('should throw an error for invalid values', () => {
      expect(() =>
        NumberUtils.addDecimalPlaces({ value: NaN, decimalPlaces: 2 }),
      ).toThrow();
      expect(() =>
        NumberUtils.addDecimalPlaces({ value: 10, decimalPlaces: -1 }),
      ).toThrow();
    });
  });

  describe('removeDecimalPlaces', () => {
    it('should remove all decimal places', () => {
      expect(NumberUtils.removeDecimalPlaces({ value: 10.56 })).toBe(10);
      expect(NumberUtils.removeDecimalPlaces({ value: 10.99 })).toBe(10);
    });

    it('should handle negative numbers', () => {
      expect(NumberUtils.removeDecimalPlaces({ value: -10.56 })).toBe(-10);
    });

    it('should keep numbers without decimal places unchanged', () => {
      expect(NumberUtils.removeDecimalPlaces({ value: 10 })).toBe(10);
      expect(NumberUtils.removeDecimalPlaces({ value: -10 })).toBe(-10);
    });
  });

  describe('randomIntegerInRange', () => {
    it('should generate numbers within the specified range', () => {
      const min = 1;
      const max = 10;
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomIntegerInRange({ min, max });
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should throw an error if min is greater than max', () => {
      expect(() =>
        NumberUtils.randomIntegerInRange({ min: 10, max: 1 }),
      ).toThrow();
    });
  });

  describe('randomFloatInRange', () => {
    it('should generate numbers within the specified range', () => {
      const min = 1;
      const max = 10;
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomFloatInRange({ min, max });
        expect(result).toBeGreaterThanOrEqual(min);
        // Rounding to the requested decimals can legitimately yield `max`.
        expect(result).toBeLessThanOrEqual(max);
      }
    });

    it('should respect the number of decimal places', () => {
      const result = NumberUtils.randomFloatInRange({
        min: 1,
        max: 10,
        decimals: 3,
      });
      expect(result.toString()).toMatch(/^\d+\.\d{1,3}$/);
    });

    it('should throw an error if min is greater than max', () => {
      expect(() =>
        NumberUtils.randomFloatInRange({ min: 10, max: 1 }),
      ).toThrow();
    });
  });

  describe('factorial', () => {
    it('should calculate the factorial correctly', () => {
      expect(NumberUtils.factorial({ value: 0 })).toBe(1);
      expect(NumberUtils.factorial({ value: 1 })).toBe(1);
      expect(NumberUtils.factorial({ value: 5 })).toBe(120);
    });

    it('should throw a ValidationError for negative numbers', () => {
      expect(() => NumberUtils.factorial({ value: -1 })).toThrow(
        ValidationError,
      );
      expect(() => NumberUtils.factorial({ value: -5 })).toThrow(
        ValidationError,
      );
    });

    it('should throw a ValidationError for non-integer input', () => {
      expect(() => NumberUtils.factorial({ value: 2.5 })).toThrow(
        ValidationError,
      );
      expect(() => NumberUtils.factorial({ value: NaN })).toThrow(
        ValidationError,
      );
    });
  });

  describe('clamp', () => {
    it('should clamp numbers within the range', () => {
      expect(NumberUtils.clamp({ value: 15, min: 0, max: 10 })).toBe(10);
      expect(NumberUtils.clamp({ value: -5, min: 0, max: 10 })).toBe(0);
      expect(NumberUtils.clamp({ value: 5, min: 0, max: 10 })).toBe(5);
    });

    it('should swap min and max if min is greater than max', () => {
      expect(NumberUtils.clamp({ value: 5, min: 10, max: 0 })).toBe(5);
      expect(NumberUtils.clamp({ value: 15, min: 10, max: 0 })).toBe(10);
      expect(NumberUtils.clamp({ value: -5, min: 10, max: 0 })).toBe(0);
    });
  });

  describe('isPrime', () => {
    it('should identify prime numbers', () => {
      expect(MathUtils.isPrime({ value: 2 })).toBe(true);
      expect(MathUtils.isPrime({ value: 3 })).toBe(true);
      expect(MathUtils.isPrime({ value: 5 })).toBe(true);
      expect(MathUtils.isPrime({ value: 7 })).toBe(true);
      expect(MathUtils.isPrime({ value: 11 })).toBe(true);
    });

    it('should identify non-prime numbers', () => {
      expect(MathUtils.isPrime({ value: 1 })).toBe(false);
      expect(MathUtils.isPrime({ value: 4 })).toBe(false);
      expect(MathUtils.isPrime({ value: 6 })).toBe(false);
      expect(MathUtils.isPrime({ value: 8 })).toBe(false);
      expect(MathUtils.isPrime({ value: 9 })).toBe(false);
    });

    it('should identify negative numbers as non-prime', () => {
      expect(MathUtils.isPrime({ value: -2 })).toBe(false);
      expect(MathUtils.isPrime({ value: -3 })).toBe(false);
      expect(MathUtils.isPrime({ value: -5 })).toBe(false);
    });
  });

  describe('isEven', () => {
    it('should identify even numbers', () => {
      expect(NumberUtils.isEven({ value: 2 })).toBe(true);
      expect(NumberUtils.isEven({ value: 4 })).toBe(true);
      expect(NumberUtils.isEven({ value: 0 })).toBe(true);
      expect(NumberUtils.isEven({ value: -2 })).toBe(true);
    });

    it('should identify odd numbers', () => {
      expect(NumberUtils.isEven({ value: 1 })).toBe(false);
      expect(NumberUtils.isEven({ value: 3 })).toBe(false);
      expect(NumberUtils.isEven({ value: -1 })).toBe(false);
      expect(NumberUtils.isEven({ value: -3 })).toBe(false);
    });

    it('should throw a ValidationError for non-integer input', () => {
      expect(() => NumberUtils.isEven({ value: 2.5 })).toThrow(ValidationError);
      expect(() => NumberUtils.isEven({ value: NaN })).toThrow(ValidationError);
      expect(() => NumberUtils.isEven({ value: Infinity })).toThrow(
        ValidationError,
      );
    });
  });

  describe('isOdd', () => {
    it('should identify odd numbers', () => {
      expect(NumberUtils.isOdd({ value: 1 })).toBe(true);
      expect(NumberUtils.isOdd({ value: 3 })).toBe(true);
      expect(NumberUtils.isOdd({ value: -1 })).toBe(true);
      expect(NumberUtils.isOdd({ value: -3 })).toBe(true);
    });

    it('should identify even numbers', () => {
      expect(NumberUtils.isOdd({ value: 2 })).toBe(false);
      expect(NumberUtils.isOdd({ value: 4 })).toBe(false);
      expect(NumberUtils.isOdd({ value: 0 })).toBe(false);
      expect(NumberUtils.isOdd({ value: -2 })).toBe(false);
    });

    it('should throw a ValidationError for non-integer input', () => {
      expect(() => NumberUtils.isOdd({ value: 3.5 })).toThrow(ValidationError);
      expect(() => NumberUtils.isOdd({ value: NaN })).toThrow(ValidationError);
      expect(() => NumberUtils.isOdd({ value: Infinity })).toThrow(
        ValidationError,
      );
    });
  });

  describe('isPrime - second divisor branch', () => {
    it('should detect composites divisible only by i + 2 in the loop', () => {
      // 49 = 7 * 7: 49 % 5 !== 0 but 49 % 7 === 0, exercising the second
      // operand of the loop condition.
      expect(MathUtils.isPrime({ value: 49 })).toBe(false);
      // 25 = 5 * 5 keeps a true prime nearby valid.
      expect(MathUtils.isPrime({ value: 23 })).toBe(true);
    });
  });
});