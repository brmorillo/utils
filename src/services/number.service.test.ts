import { NumberUtils } from './number.service';

const testRandomValues = (
  fn: (...args: any[]) => number,
  min: number,
  max: number,
  iterations = 100,
) => {
  for (let i = 0; i < iterations; i++) {
    const result = fn({ min, max });
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  }
};

describe('NumberUtils.isEven', () => {
  it('should return true for even numbers', () => {
    expect(NumberUtils.isEven({ value: 2 })).toBe(true);
    expect(NumberUtils.isEven({ value: 0 })).toBe(true); // Zero is even
    expect(NumberUtils.isEven({ value: -4 })).toBe(true); // Negative even
  });

  it('should return false for odd numbers', () => {
    expect(NumberUtils.isEven({ value: 1 })).toBe(false);
    expect(NumberUtils.isEven({ value: -3 })).toBe(false); // Negative odd
  });

  it('should handle edge cases correctly', () => {
    expect(NumberUtils.isEven({ value: Number.MAX_SAFE_INTEGER })).toBe(false); // Large odd
    expect(NumberUtils.isEven({ value: Number.MIN_SAFE_INTEGER })).toBe(false); // Large odd
  });
});

describe('NumberUtils.isOdd', () => {
  it('should return true for odd numbers', () => {
    expect(NumberUtils.isOdd({ value: 1 })).toBe(true);
    expect(NumberUtils.isOdd({ value: -3 })).toBe(true); // Negative odd
    expect(NumberUtils.isOdd({ value: Number.MAX_SAFE_INTEGER })).toBe(true); // Large odd
  });

  it('should return false for even numbers', () => {
    expect(NumberUtils.isOdd({ value: 0 })).toBe(false); // Zero is even
    expect(NumberUtils.isOdd({ value: 4 })).toBe(false);
    expect(NumberUtils.isOdd({ value: -6 })).toBe(false); // Negative even
  });
});

describe('NumberUtils.isPositive', () => {
  it('should return true for positive numbers', () => {
    expect(NumberUtils.isPositive({ value: 5 })).toBe(true);
    expect(NumberUtils.isPositive({ value: 0.1 })).toBe(true); // Small positive
    expect(NumberUtils.isPositive({ value: Number.MAX_SAFE_INTEGER })).toBe(
      true,
    ); // Large positive
  });

  it('should return false for zero and negative numbers', () => {
    expect(NumberUtils.isPositive({ value: 0 })).toBe(false); // Zero is not positive
    expect(NumberUtils.isPositive({ value: -1 })).toBe(false); // Negative number
    expect(NumberUtils.isPositive({ value: Number.MIN_SAFE_INTEGER })).toBe(
      false,
    ); // Large negative
  });
});

describe('NumberUtils.roundDown', () => {
  it('should round numbers down to the nearest integer', () => {
    expect(NumberUtils.roundDown({ value: 4.9 })).toBe(4);
    expect(NumberUtils.roundDown({ value: -4.9 })).toBe(-5); // Negative rounding
    expect(NumberUtils.roundDown({ value: 0.1 })).toBe(0); // Small positive
    expect(NumberUtils.roundDown({ value: -0.1 })).toBe(-1); // Small negative
  });

  it('should handle integers correctly', () => {
    expect(NumberUtils.roundDown({ value: 5 })).toBe(5); // Already an integer
    expect(NumberUtils.roundDown({ value: -5 })).toBe(-5); // Negative integer
  });

  it('should handle edge cases correctly', () => {
    expect(NumberUtils.roundDown({ value: Number.MAX_SAFE_INTEGER })).toBe(
      Number.MAX_SAFE_INTEGER,
    ); // Large positive
    expect(NumberUtils.roundDown({ value: Number.MIN_SAFE_INTEGER })).toBe(
      Number.MIN_SAFE_INTEGER,
    ); // Large negative
  });
});

describe('NumberUtils.roundUp', () => {
  it('should round numbers up to the nearest integer', () => {
    expect(NumberUtils.roundUp({ value: 4.1 })).toBe(5);
    expect(NumberUtils.roundUp({ value: -4.1 })).toBe(-4); // Negative rounding
    expect(NumberUtils.roundUp({ value: 0.1 })).toBe(1); // Small positive
    expect(NumberUtils.roundUp({ value: -0.1 })).toBe(0); // Small negative
  });

  it('should handle integers correctly', () => {
    expect(NumberUtils.roundUp({ value: 5 })).toBe(5); // Already an integer
    expect(NumberUtils.roundUp({ value: -5 })).toBe(-5); // Negative integer
  });
});

describe('NumberUtils.roundToNearest', () => {
  it('should round numbers to the nearest integer', () => {
    expect(NumberUtils.roundToNearest({ value: 4.5 })).toBe(5);
    expect(NumberUtils.roundToNearest({ value: 4.4 })).toBe(4);
    expect(NumberUtils.roundToNearest({ value: -4.5 })).toBe(-4); // Negative rounding
    expect(NumberUtils.roundToNearest({ value: -4.6 })).toBe(-5);
  });

  it('should handle integers correctly', () => {
    expect(NumberUtils.roundToNearest({ value: 5 })).toBe(5); // Already an integer
    expect(NumberUtils.roundToNearest({ value: -5 })).toBe(-5); // Negative integer
  });
});

describe('NumberUtils.toCents', () => {
  it('should convert numbers to cents (remove decimal places)', () => {
    expect(NumberUtils.toCents({ value: 10.56 })).toBe(1056);
    expect(NumberUtils.toCents({ value: -10.56 })).toBe(-1056); // Negative value
    expect(NumberUtils.toCents({ value: 0 })).toBe(0); // Zero
  });

  it('should handle edge cases', () => {
    expect(NumberUtils.toCents({ value: Number.MAX_SAFE_INTEGER })).toBeCloseTo(
      Number.MAX_SAFE_INTEGER * 100,
    );
    expect(NumberUtils.toCents({ value: Number.MIN_SAFE_INTEGER })).toBeCloseTo(
      Number.MIN_SAFE_INTEGER * 100,
    );
  });
});

describe('NumberUtils.addDecimalPlaces', () => {
  it('should add decimal places to a number', () => {
    expect(
      NumberUtils.addDecimalPlaces({ value: 10.5, decimalPlaces: 3 }),
    ).toBe('10.500');
    expect(NumberUtils.addDecimalPlaces({ value: 1, decimalPlaces: 2 })).toBe(
      '1.00',
    ); // Integer
    expect(
      NumberUtils.addDecimalPlaces({ value: -1.234, decimalPlaces: 5 }),
    ).toBe('-1.23400'); // Negative
  });
  it('should add decimal places to edge cases', () => {
    expect(NumberUtils.addDecimalPlaces({ value: 0, decimalPlaces: 5 })).toBe(
      '0.00000',
    );
    expect(NumberUtils.addDecimalPlaces({ value: -0, decimalPlaces: 3 })).toBe(
      '0.000',
    ); // Handle -0
    expect(
      NumberUtils.addDecimalPlaces({
        value: Number.MAX_SAFE_INTEGER,
        decimalPlaces: 2,
      }),
    ).toBe(`${Number.MAX_SAFE_INTEGER.toFixed(2)}`);
  });
});

describe('NumberUtils.removeDecimalPlaces', () => {
  it('should remove all decimal places from a number', () => {
    expect(NumberUtils.removeDecimalPlaces({ value: 10.56 })).toBe(10);
    expect(NumberUtils.removeDecimalPlaces({ value: -10.56 })).toBe(-10); // Negative value
    expect(NumberUtils.removeDecimalPlaces({ value: 0 })).toBe(0); // Zero
  });

  it('should handle integers correctly', () => {
    expect(NumberUtils.removeDecimalPlaces({ value: 5 })).toBe(5); // Already an integer
    expect(NumberUtils.removeDecimalPlaces({ value: -5 })).toBe(-5); // Negative integer
  });
});

describe('NumberUtils.randomIntegerInRange', () => {
  it('should generate random integers within the specified range', () => {
    const min = 1;
    const max = 10;
    for (let i = 0; i < 100; i++) {
      const result = NumberUtils.randomIntegerInRange({ min, max });
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it('should handle edge cases', () => {
    expect(NumberUtils.randomIntegerInRange({ min: 5, max: 5 })).toBe(5); // Single value range
  });

  it('should handle cases where min equals max', () => {
    const result = NumberUtils.randomIntegerInRange({ min: 5, max: 5 });
    expect(result).toBe(5); // Only possible value
  });
});

describe('NumberUtils.randomFloatInRange', () => {
  it('should generate random floats within the specified range', () => {
    const min = 1,
      max = 10,
      decimals = 3;
    for (let i = 0; i < 100; i++) {
      const result = NumberUtils.randomFloatInRange({ min, max, decimals });
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThan(max); // Exclusive upper bound
      expect(Number(result.toFixed(decimals)) === result).toBe(true); // Validate decimal precision
    }
  });

  it('should handle default decimals', () => {
    const decimals = 2;
    const result = NumberUtils.randomFloatInRange({ min: 0, max: 1 });
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
    expect(Number(result.toFixed(decimals)) === result).toBe(true); // Validate decimal precision
  });
});

describe('NumberUtils.factorial', () => {
  it('should return the correct factorial for positive integers', () => {
    expect(NumberUtils.factorial({ value: 0 })).toBe(1); // 0! = 1
    expect(NumberUtils.factorial({ value: 1 })).toBe(1); // 1! = 1
    expect(NumberUtils.factorial({ value: 5 })).toBe(120); // 5! = 120
  });

  it('should return 0 for negative values', () => {
    expect(NumberUtils.factorial({ value: -1 })).toBe(0);
    expect(NumberUtils.factorial({ value: -10 })).toBe(0);
  });

  it('should handle large values correctly', () => {
    expect(NumberUtils.factorial({ value: 10 })).toBe(3628800); // 10! = 3628800
  });

  it('should handle very large numbers gracefully', () => {
    const result = NumberUtils.factorial({ value: 20 });
    expect(result).toBe(2432902008176640000); // 20!
  });
});

describe('NumberUtils.clamp', () => {
  it('should clamp values within the specified range', () => {
    expect(NumberUtils.clamp({ value: 5, min: 0, max: 10 })).toBe(5); // Within range
    expect(NumberUtils.clamp({ value: -5, min: 0, max: 10 })).toBe(0); // Below range
    expect(NumberUtils.clamp({ value: 15, min: 0, max: 10 })).toBe(10); // Above range
  });

  it('should return the value if it is within the range', () => {
    expect(NumberUtils.clamp({ value: 0, min: 0, max: 10 })).toBe(0);
    expect(NumberUtils.clamp({ value: 10, min: 0, max: 10 })).toBe(10);
  });

  it('should handle edge cases', () => {
    expect(
      NumberUtils.clamp({ value: Number.MAX_SAFE_INTEGER, min: 0, max: 10 }),
    ).toBe(10);
    expect(
      NumberUtils.clamp({ value: Number.MIN_SAFE_INTEGER, min: 0, max: 10 }),
    ).toBe(0);
  });

  it('should swap min and max if min is greater than max', () => {
    const result = NumberUtils.clamp({ value: 5, min: 10, max: 0 });
    expect(result).toBe(5); // Now within the corrected range [0, 10]
  });

  it('should clamp the value to the corrected range', () => {
    expect(NumberUtils.clamp({ value: -5, min: 10, max: 0 })).toBe(0); // Clamped to min (corrected)
    expect(NumberUtils.clamp({ value: 15, min: 10, max: 0 })).toBe(10); // Clamped to max (corrected)
  });
});

describe('NumberUtils.isPrime', () => {
  it('should return true for prime numbers', () => {
    expect(NumberUtils.isPrime({ value: 2 })).toBe(true); // Prime
    expect(NumberUtils.isPrime({ value: 3 })).toBe(true); // Prime
    expect(NumberUtils.isPrime({ value: 7 })).toBe(true); // Prime
    expect(NumberUtils.isPrime({ value: 11 })).toBe(true); // Prime
  });

  it('should return false for non-prime numbers', () => {
    expect(NumberUtils.isPrime({ value: 1 })).toBe(false); // Not prime
    expect(NumberUtils.isPrime({ value: 4 })).toBe(false); // Not prime
    expect(NumberUtils.isPrime({ value: 9 })).toBe(false); // Not prime
    expect(NumberUtils.isPrime({ value: 0 })).toBe(false); // Not prime
  });

  it('should return false for negative numbers', () => {
    expect(NumberUtils.isPrime({ value: -1 })).toBe(false);
    expect(NumberUtils.isPrime({ value: -7 })).toBe(false);
  });

  it('should handle large prime and non-prime numbers', () => {
    expect(NumberUtils.isPrime({ value: 101 })).toBe(true); // Prime
    expect(NumberUtils.isPrime({ value: 100 })).toBe(false); // Not prime
  });
});
