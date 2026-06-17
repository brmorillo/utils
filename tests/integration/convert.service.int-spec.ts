import { ConvertUtils } from '../../src/services/convert.service';

/**
 * Integration tests for the ConvertUtils class.
 * These tests verify the behavior of the class in more complex scenarios
 * and with interactions between different methods.
 */
describe('ConvertUtils - Integration Tests', () => {
  describe('Chained conversions', () => {
    it('should convert correctly in a chain of space conversions', () => {
      // Convert from meters to kilometers and then to miles
      const metersToKm = ConvertUtils.space({
        value: 1000,
        fromType: 'meters',
        toType: 'kilometers',
      });

      const kmToMiles = ConvertUtils.space({
        value: metersToKm,
        fromType: 'kilometers',
        toType: 'miles',
      });

      // Verify that the result is approximately equal to the direct conversion
      const directConversion = ConvertUtils.space({
        value: 1000,
        fromType: 'meters',
        toType: 'miles',
      });

      expect(kmToMiles).toBeCloseTo(directConversion, 10);
    });

    it('should convert correctly in a chain of weight conversions', () => {
      // Convert from kilograms to grams and then to ounces
      const kgToGrams = ConvertUtils.weight({
        value: 1,
        fromType: 'kilograms',
        toType: 'grams',
      });

      const gramsToOunces = ConvertUtils.weight({
        value: kgToGrams,
        fromType: 'grams',
        toType: 'ounces',
      });

      // Verify that the result is approximately equal to the direct conversion
      const directConversion = ConvertUtils.weight({
        value: 1,
        fromType: 'kilograms',
        toType: 'ounces',
      });

      expect(gramsToOunces).toBeCloseTo(directConversion, 10);
    });
  });

  describe('Conversions between different systems', () => {
    it('should convert values between different measurement systems with precision', () => {
      // Scenario: Convert a volume of water (1 liter) to its weight in kilograms
      // 1 liter of water = 1 kg

      // First, convert liters to milliliters
      const litersToMilliliters = ConvertUtils.volume({
        value: 1,
        fromType: 'liters',
        toType: 'milliliters',
      });

      // Then, convert milliliters to grams (1ml of water = 1g)
      // Here we are simulating a conversion between different systems
      const gramsEquivalent = litersToMilliliters; // 1000 ml = 1000 g

      // Finally, convert grams to kilograms
      const gramsToKilograms = ConvertUtils.weight({
        value: gramsEquivalent,
        fromType: 'grams',
        toType: 'kilograms',
      });

      // 1 liter of water should weigh 1 kg
      expect(gramsToKilograms).toBe(1);
    });
  });

  describe('Value conversions with different types', () => {
    it('should convert between different data types correctly', () => {
      // Convert number to string
      const numberToString = ConvertUtils.value({
        value: 42,
        toType: 'string',
      });

      // Convert string back to number
      const stringToNumber = ConvertUtils.value({
        value: numberToString,
        toType: 'number',
      });

      // Convert number to roman
      const numberToRoman = ConvertUtils.value({
        value: stringToNumber,
        toType: 'roman',
      });

      // Verify results
      expect(numberToString).toBe('42');
      expect(stringToNumber).toBe(42);
      expect(numberToRoman).toBe('XLII');
    });

    it('should handle complex conversions between types', () => {
      // Convert number to roman
      const numberToRoman = ConvertUtils.value({
        value: 1984,
        toType: 'roman',
      });

      // Verify roman result
      expect(numberToRoman).toBe('MCMLXXXIV');

      // Convert number to string
      const numberToString = ConvertUtils.value({
        value: 1984,
        toType: 'string',
      });

      // Convert string to bigint
      const stringToBigint = ConvertUtils.value({
        value: numberToString,
        toType: 'bigint',
      });

      // Verify results
      expect(numberToString).toBe('1984');
      expect(stringToBigint).toBe(1984n);
    });
  });
});
