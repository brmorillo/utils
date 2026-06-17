import { ConvertUtils } from '../../src/services/convert.service';

/**
 * Unit tests for the ConvertUtils class.
 */
describe('ConvertUtils', () => {
  describe('space', () => {
    it('should convert meters to kilometers correctly', () => {
      const result = ConvertUtils.space({
        value: 1000,
        fromType: 'meters',
        toType: 'kilometers',
      });
      expect(result).toBe(1);
    });

    it('should convert kilometers to meters correctly', () => {
      const result = ConvertUtils.space({
        value: 1,
        fromType: 'kilometers',
        toType: 'meters',
      });
      expect(result).toBe(1000);
    });

    it('should convert meters to miles correctly', () => {
      const result = ConvertUtils.space({
        value: 1609.344,
        fromType: 'meters',
        toType: 'miles',
      });
      expect(result).toBeCloseTo(1, 5);
    });

    it('should convert feet to meters correctly', () => {
      const result = ConvertUtils.space({
        value: 3.28084,
        fromType: 'feet',
        toType: 'meters',
      });
      expect(result).toBeCloseTo(1, 5);
    });
  });

  describe('weight', () => {
    it('should convert kilograms to pounds correctly', () => {
      const result = ConvertUtils.weight({
        value: 1,
        fromType: 'kilograms',
        toType: 'pounds',
      });
      expect(result).toBeCloseTo(2.20462, 5);
    });

    it('should convert pounds to kilograms correctly', () => {
      const result = ConvertUtils.weight({
        value: 2.20462,
        fromType: 'pounds',
        toType: 'kilograms',
      });
      expect(result).toBeCloseTo(1, 5);
    });

    it('should convert kilograms to grams correctly', () => {
      const result = ConvertUtils.weight({
        value: 1,
        fromType: 'kilograms',
        toType: 'grams',
      });
      expect(result).toBe(1000);
    });

    it('should convert ounces to grams correctly', () => {
      const result = ConvertUtils.weight({
        value: 1,
        fromType: 'ounces',
        toType: 'grams',
      });
      expect(result).toBeCloseTo(28.3495, 4);
    });
  });

  describe('volume', () => {
    it('should convert liters to gallons correctly', () => {
      const result = ConvertUtils.volume({
        value: 1,
        fromType: 'liters',
        toType: 'gallons',
      });
      expect(result).toBeCloseTo(0.264172, 6);
    });

    it('should convert gallons to liters correctly', () => {
      const result = ConvertUtils.volume({
        value: 1,
        fromType: 'gallons',
        toType: 'liters',
      });
      expect(result).toBeCloseTo(3.78541, 5);
    });

    it('should convert liters to milliliters correctly', () => {
      const result = ConvertUtils.volume({
        value: 1,
        fromType: 'liters',
        toType: 'milliliters',
      });
      expect(result).toBe(1000);
    });

    it('should convert cubic meters to liters correctly', () => {
      const result = ConvertUtils.volume({
        value: 1,
        fromType: 'cubicMeters',
        toType: 'liters',
      });
      expect(result).toBe(1000);
    });
  });

  describe('value', () => {
    it('should convert string to number correctly', () => {
      const result = ConvertUtils.value({
        value: '42.5',
        toType: 'number',
      });
      expect(result).toBe(42.5);
    });

    it('should convert string to integer correctly', () => {
      const result = ConvertUtils.value({
        value: '42.5',
        toType: 'integer',
      });
      expect(result).toBe(42);
    });

    it('should convert number to integer by truncating', () => {
      expect(ConvertUtils.value({ value: 42.9, toType: 'integer' })).toBe(42);
      expect(ConvertUtils.value({ value: -42.9, toType: 'integer' })).toBe(-42);
    });

    it('should return null when converting null/undefined to string', () => {
      expect(ConvertUtils.value({ value: null, toType: 'string' })).toBeNull();
      expect(
        ConvertUtils.value({ value: undefined, toType: 'string' }),
      ).toBeNull();
    });

    it('should throw when converting a value above the Roman range', () => {
      expect(() => {
        ConvertUtils.value({ value: 4000, toType: 'roman' });
      }).toThrow('classic Roman numeral range');
    });

    it('should convert the maximum Roman value (3999) correctly', () => {
      expect(ConvertUtils.value({ value: 3999, toType: 'roman' })).toBe(
        'MMMCMXCIX',
      );
    });

    it('should convert number to string correctly', () => {
      const result = ConvertUtils.value({
        value: 42.5,
        toType: 'string',
      });
      expect(result).toBe('42.5');
    });

    it('should convert number to bigint correctly', () => {
      const result = ConvertUtils.value({
        value: 42.5,
        toType: 'bigint',
      });
      expect(result).toBe(42n);
    });

    it('should convert string to bigint correctly', () => {
      const result = ConvertUtils.value({
        value: '42',
        toType: 'bigint',
      });
      expect(result).toBe(42n);
    });

    it('should convert number to roman correctly', () => {
      const result = ConvertUtils.value({
        value: 42,
        toType: 'roman',
      });
      expect(result).toBe('XLII');
    });

    it('should return null for an invalid string to number conversion', () => {
      const result = ConvertUtils.value({
        value: 'abc',
        toType: 'number',
      });
      expect(result).toBeNull();
    });

    it('should return null for an invalid string to integer conversion', () => {
      const result = ConvertUtils.value({
        value: 'abc',
        toType: 'integer',
      });
      expect(result).toBeNull();
    });

    it('should return null for an invalid string to bigint conversion', () => {
      const result = ConvertUtils.value({
        value: 'abc',
        toType: 'bigint',
      });
      expect(result).toBeNull();
    });

    it('should throw an error when converting a negative number to roman', () => {
      expect(() => {
        ConvertUtils.value({
          value: -1,
          toType: 'roman',
        });
      }).toThrow('Value must be a positive integer');
    });

    it('should throw an error when converting a decimal number to roman', () => {
      expect(() => {
        ConvertUtils.value({
          value: 1.5,
          toType: 'roman',
        });
      }).toThrow('Value must be a positive integer');
    });

    it('should return the same value when the input type is already the desired type', () => {
      const value = 42;
      const result = ConvertUtils.value({
        value,
        toType: 'number',
      });
      expect(result).toBe(value);
    });

    it('should return null when the source type cannot be converted to the target', () => {
      // A boolean does not match any of the integer/number/bigint guarded
      // branches, so the method falls through to the final `return null`.
      expect(ConvertUtils.value({ value: true, toType: 'integer' })).toBeNull();
      expect(ConvertUtils.value({ value: true, toType: 'number' })).toBeNull();
      expect(ConvertUtils.value({ value: true, toType: 'bigint' })).toBeNull();
    });
  });
});
