import { ConvertUtils } from './convert.service';

describe('ConvertUtils', () => {
  describe('convertSpace', () => {
    it('should convert meters to kilometers', () => {
      expect(
        ConvertUtils.space({
          value: 1000,
          fromType: 'meters',
          toType: 'kilometers',
        }),
      ).toBe(1);
    });

    it('should convert miles to meters', () => {
      expect(
        ConvertUtils.space({
          value: 1,
          fromType: 'miles',
          toType: 'meters',
        }),
      ).toBeCloseTo(1609.34, 2);
    });

    it('should handle conversions with the same units', () => {
      expect(
        ConvertUtils.space({
          value: 42,
          fromType: 'meters',
          toType: 'meters',
        }),
      ).toBe(42);
    });
  });

  describe('convertWeight', () => {
    it('should convert kilograms to pounds', () => {
      expect(
        ConvertUtils.weight({
          value: 1,
          fromType: 'kilograms',
          toType: 'pounds',
        }),
      ).toBeCloseTo(2.20462, 5);
    });

    it('should convert grams to ounces', () => {
      expect(
        ConvertUtils.weight({
          value: 1000,
          fromType: 'grams',
          toType: 'ounces',
        }),
      ).toBeCloseTo(35.274, 3);
    });

    it('should handle conversions with the same units', () => {
      expect(
        ConvertUtils.weight({
          value: 5,
          fromType: 'kilograms',
          toType: 'kilograms',
        }),
      ).toBe(5);
    });
  });

  describe('convertVolume', () => {
    it('should convert liters to gallons', () => {
      expect(
        ConvertUtils.volume({
          value: 1,
          fromType: 'liters',
          toType: 'gallons',
        }),
      ).toBeCloseTo(0.264172, 5);
    });

    it('should convert milliliters to liters', () => {
      expect(
        ConvertUtils.volume({
          value: 1000,
          fromType: 'milliliters',
          toType: 'liters',
        }),
      ).toBe(1);
    });

    it('should handle conversions with the same units', () => {
      expect(
        ConvertUtils.volume({
          value: 10,
          fromType: 'liters',
          toType: 'liters',
        }),
      ).toBe(10);
    });
  });

  describe('convertValue', () => {
    it('should convert a string to a number', () => {
      expect(ConvertUtils.value({ value: '42', toType: 'number' })).toBe(42);
    });

    it('should convert a number to a string', () => {
      expect(ConvertUtils.value({ value: 42, toType: 'string' })).toBe('42');
    });

    it('should convert a string to a bigint', () => {
      expect(ConvertUtils.value({ value: '42', toType: 'bigint' })).toBe(42n);
    });

    it('should return null for invalid conversions', () => {
      expect(
        ConvertUtils.value({ value: 'invalid', toType: 'number' }),
      ).toBeNull();
    });

    it('should handle roman numeral conversions', () => {
      expect(ConvertUtils.value({ value: 42, toType: 'roman' })).toBe('XLII');
    });
  });
});
