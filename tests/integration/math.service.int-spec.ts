import { MathUtils } from '../../src/services/math.service';

/**
 * Integration tests for the MathUtils class.
 * These tests verify the class's behavior in more complex scenarios
 * and with interactions between different methods.
 */
describe('MathUtils - Integration Tests', () => {
  describe('Financial calculations', () => {
    it('should calculate and round percentages correctly', () => {
      // Simulates a discount calculation
      const originalPrice = 199.99;
      const discountedPrice = 149.99;

      // Calculates the discount percentage
      const discountPercentage = MathUtils.percentage({
        total: originalPrice,
        part: originalPrice - discountedPrice,
      });

      // Rounds to 2 decimal places
      const roundedPercentage = MathUtils.roundToDecimals({
        value: discountPercentage,
        decimals: 2,
      });

      // Verifies that the result is correct (25% discount)
      expect(roundedPercentage).toBeCloseTo(25.0);
    });
  });

  describe('Statistical calculations', () => {
    it('should calculate mean and deviation within bounds', () => {
      // Simulates a series of measurements
      const measurements = [10.2, 9.8, 10.4, 10.1, 9.9, 10.3, 10.0];

      // Calculates the mean
      const sum = measurements.reduce((acc, val) => acc + val, 0);
      const mean = sum / measurements.length;

      // Rounds the mean
      const roundedMean = MathUtils.roundToDecimals({
        value: mean,
        decimals: 2,
      });

      // Calculates the maximum deviation
      const maxDeviation = Math.max(...measurements.map(m => Math.abs(m - mean)));

      // Clamps the deviation to a maximum acceptable value
      const clampedDeviation = MathUtils.clamp({
        value: maxDeviation,
        min: 0,
        max: 0.5,
      });

      // Verifies the results
      expect(roundedMean).toBe(10.1);
      expect(clampedDeviation).toBeLessThanOrEqual(0.5);
    });
  });

  describe('Operations with fractions', () => {
    it('should simplify fractions using GCD', () => {
      // Simulates a fraction
      const numerator = 24;
      const denominator = 36;

      // Calculates the GCD to simplify the fraction
      const commonDivisor = MathUtils.gcd({
        a: numerator,
        b: denominator,
      });

      // Simplifies the fraction
      const simplifiedNumerator = numerator / commonDivisor;
      const simplifiedDenominator = denominator / commonDivisor;

      // Verifies that the fraction was simplified correctly (24/36 = 2/3)
      expect(simplifiedNumerator).toBe(2);
      expect(simplifiedDenominator).toBe(3);
    });

    it('should calculate the common denominator using LCM', () => {
      // Simulates two fractions
      const fraction1 = { numerator: 1, denominator: 4 };
      const fraction2 = { numerator: 2, denominator: 6 };

      // Calculates the LCM of the denominators
      const commonDenominator = MathUtils.lcm({
        a: fraction1.denominator,
        b: fraction2.denominator,
      });

      // Adjusts the numerators to the common denominator
      const adjustedNumerator1 =
        fraction1.numerator * (commonDenominator / fraction1.denominator);
      const adjustedNumerator2 =
        fraction2.numerator * (commonDenominator / fraction2.denominator);

      // Adds the fractions
      const numeratorSum = adjustedNumerator1 + adjustedNumerator2;

      // Verifies that the result is correct (1/4 + 2/6 = 3/12 + 4/12 = 7/12)
      expect(commonDenominator).toBe(12);
      expect(adjustedNumerator1).toBe(3);
      expect(adjustedNumerator2).toBe(4);
      expect(numeratorSum).toBe(7);
    });
  });

  describe('Random number generation with constraints', () => {
    it('should generate and clamp random numbers', () => {
      // Generates 10 random numbers and verifies they are within bounds
      for (let i = 0; i < 10; i++) {
        // Generates a random number between -100 and 100
        const randomNumber = MathUtils.randomInRange({
          min: -100,
          max: 100,
        });

        // Clamps the number to the range [-50, 50]
        const clampedNumber = MathUtils.clamp({
          value: randomNumber,
          min: -50,
          max: 50,
        });

        // Verifies that the clamped number is within the range
        expect(clampedNumber).toBeGreaterThanOrEqual(-50);
        expect(clampedNumber).toBeLessThanOrEqual(50);
      }
    });
  });

  describe('Verification of mathematical properties', () => {
    it('should verify whether numbers are prime and calculate the GCD', () => {
      // Tests whether the GCD of two prime numbers is 1
      const primes = [11, 13, 17, 19, 23, 29, 31];

      for (let i = 0; i < primes.length; i++) {
        for (let j = i + 1; j < primes.length; j++) {
          const prime1 = primes[i];
          const prime2 = primes[j];

          // Verifies that both are prime
          const isPrime1 = MathUtils.isPrime({ value: prime1 });
          const isPrime2 = MathUtils.isPrime({ value: prime2 });

          // Calculates the GCD
          const gcd = MathUtils.gcd({ a: prime1, b: prime2 });

          // Verifies the results
          expect(isPrime1).toBe(true);
          expect(isPrime2).toBe(true);
          expect(gcd).toBe(1); // The GCD of two distinct primes is always 1
        }
      }
    });
  });
});
