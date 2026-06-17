import { NumberUtils } from '../../src/services/number.service';
import { MathUtils } from '../../src/services/math.service';

/**
 * Integration tests for the NumberUtils class.
 * These tests verify more complex scenarios involving multiple methods.
 */
describe('NumberUtils - Integration Tests', () => {
  describe('Chained operations', () => {
    it('should correctly process a sequence of numeric operations', () => {
      // Scenario: Process a value through multiple operations
      // 1. Start with a negative value
      const initialValue = -15.7;

      // 2. Normalize the value (convert -0 to 0, but does not affect other values)
      const normalizedValue = NumberUtils.normalize({ value: initialValue });

      // 3. Check whether it is positive (should be false for a negative value)
      const isPositive = NumberUtils.isPositive({ value: normalizedValue });

      // 4. Get the absolute value using Math.abs
      const absoluteValue = Math.abs(normalizedValue);

      // 5. Round to the nearest integer
      const roundedValue = NumberUtils.roundToNearest({
        value: absoluteValue,
      });

      // 6. Check whether it is even
      const isEven = NumberUtils.isValidEven({ value: roundedValue });

      // Assertions
      expect(normalizedValue).toBe(-15.7); // Normalization does not affect values other than -0
      expect(isPositive).toBe(false); // Value is negative
      expect(absoluteValue).toBe(15.7); // Absolute value
      expect(roundedValue).toBe(16); // Rounded to the nearest integer
      expect(isEven).toBe(true); // 16 is even
    });

    it('should perform financial calculations with precision', () => {
      // Scenario: Calculate financial values with proper rounding
      // 1. Base value
      const baseValue = 99.99;

      // 2. Apply a 15% discount
      const discountedValue = baseValue * 0.85;

      // 3. Round to 2 decimal places
      const roundedValue = NumberUtils.roundToDecimals({
        value: discountedValue,
        decimals: 2,
      });

      // 4. Convert to cents (integer)
      const valueInCents = NumberUtils.toCents({ value: roundedValue });

      // 5. Format with 2 decimal places
      const formattedValue = NumberUtils.addDecimalPlaces({
        value: roundedValue,
        decimalPlaces: 2,
      });

      // Assertions
      expect(discountedValue).toBeCloseTo(84.9915); // Discounted value
      expect(roundedValue).toBe(84.99); // Rounded to 2 decimal places
      expect(valueInCents).toBe(8499); // Converted to cents
      expect(formattedValue).toBe('84.99'); // Formatted with 2 decimal places
    });

    it('should correctly handle bounds and constraints', () => {
      // Scenario: Process values with bounds and constraints
      // 1. Generate a random number between 0 and 100
      const randomValue = NumberUtils.randomIntegerInRange({
        min: 0,
        max: 100,
      });

      // 2. Clamp the value between 10 and 90
      const clampedValue = NumberUtils.clamp({
        value: randomValue,
        min: 10,
        max: 90,
      });

      // 3. Check whether it is prime
      const isPrime = MathUtils.isValidPrime({ value: clampedValue });

      // 4. Calculate the factorial if it is less than 10, or 0 otherwise
      const factorial =
        clampedValue < 10
          ? NumberUtils.factorial({ value: clampedValue })
          : 0;

      // Assertions
      expect(randomValue).toBeGreaterThanOrEqual(0);
      expect(randomValue).toBeLessThanOrEqual(100);
      expect(clampedValue).toBeGreaterThanOrEqual(10);
      expect(clampedValue).toBeLessThanOrEqual(90);
      // We cannot check isPrime or factorial directly because they depend on the random value
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should correctly calculate installment values', () => {
      // Scenario: Calculate the installments of a loan
      // 1. Total amount
      const totalValue = 1200;

      // 2. Number of installments
      const installmentCount = 5;

      // 3. Calculate the installment value
      const installmentValue = totalValue / installmentCount;

      // 4. Round to 2 decimal places
      const roundedInstallmentValue = NumberUtils.roundToDecimals({
        value: installmentValue,
        decimals: 2,
      });

      // 5. Calculate the total amount after rounding
      const recalculatedTotalValue = roundedInstallmentValue * installmentCount;

      // 6. Calculate the difference due to rounding
      const difference = NumberUtils.roundToDecimals({
        value: totalValue - recalculatedTotalValue,
        decimals: 2,
      });

      // Assertions
      expect(installmentValue).toBe(240);
      expect(roundedInstallmentValue).toBe(240);
      expect(recalculatedTotalValue).toBe(1200);
      expect(difference).toBe(0);
    });

    it('should correctly calculate statistics for a sample', () => {
      // Scenario: Calculate basic statistics for a data sample
      // 1. Data sample
      const sample = [15.7, 22.3, 18.9, 24.5, 19.2];

      // 2. Calculate the mean
      const sum = sample.reduce((acc, val) => acc + val, 0);
      const mean = sum / sample.length;

      // 3. Round the mean to 1 decimal place
      const roundedMean = NumberUtils.roundToDecimals({
        value: mean,
        decimals: 1,
      });

      // 4. Find the minimum and maximum value
      const minimum = Math.min(...sample);
      const maximum = Math.max(...sample);

      // 5. Calculate the range
      const range = maximum - minimum;

      // Assertions
      expect(roundedMean).toBe(20.1);
      expect(minimum).toBe(15.7);
      expect(maximum).toBe(24.5);
      expect(range).toBe(8.8);
    });

    it('should correctly convert between different units', () => {
      // Scenario: Convert values between different units
      // 1. Value in meters
      const valueInMeters = 5280;

      // 2. Convert to kilometers (divide by 1000)
      const valueInKilometers = valueInMeters / 1000;

      // 3. Convert to miles (multiply by 0.621371)
      const valueInMiles = valueInKilometers * 0.621371;

      // 4. Round to 2 decimal places
      const roundedValueInMiles = NumberUtils.roundToDecimals({
        value: valueInMiles,
        decimals: 2,
      });

      // 5. Convert back to meters
      const recalculatedValueInMeters = (roundedValueInMiles / 0.621371) * 1000;

      // 6. Calculate the difference due to rounding
      const percentageDifference =
        Math.abs(valueInMeters - recalculatedValueInMeters) / valueInMeters;

      // Assertions
      expect(valueInKilometers).toBe(5.28);
      expect(roundedValueInMiles).toBe(3.28);
      expect(recalculatedValueInMeters).toBeCloseTo(5280, -1); // Larger tolerance due to conversions
      expect(percentageDifference).toBeLessThan(0.01); // Difference less than 1%
    });
  });
});