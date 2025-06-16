import { ConvertUtils } from '../../src/services/convert.service';

/**
 * Testes unitários para a classe ConvertUtils.
 */
describe('ConvertUtils', () => {
  describe('space', () => {
    it('deve converter metros para quilômetros corretamente', () => {
      const result = ConvertUtils.space({
        value: 1000,
        fromType: 'meters',
        toType: 'kilometers',
      });
      expect(result).toBe(1);
    });

    it('deve converter quilômetros para metros corretamente', () => {
      const result = ConvertUtils.space({
        value: 1,
        fromType: 'kilometers',
        toType: 'meters',
      });
      expect(result).toBe(1000);
    });

    it('deve converter metros para milhas corretamente', () => {
      const result = ConvertUtils.space({
        value: 1609.344,
        fromType: 'meters',
        toType: 'miles',
      });
      expect(result).toBeCloseTo(1, 5);
    });

    it('deve converter pés para metros corretamente', () => {
      const result = ConvertUtils.space({
        value: 3.28084,
        fromType: 'feet',
        toType: 'meters',
      });
      expect(result).toBeCloseTo(1, 5);
    });
  });

  describe('weight', () => {
    it('deve converter quilogramas para libras corretamente', () => {
      const result = ConvertUtils.weight({
        value: 1,
        fromType: 'kilograms',
        toType: 'pounds',
      });
      expect(result).toBeCloseTo(2.20462, 5);
    });

    it('deve converter libras para quilogramas corretamente', () => {
      const result = ConvertUtils.weight({
        value: 2.20462,
        fromType: 'pounds',
        toType: 'kilograms',
      });
      expect(result).toBeCloseTo(1, 5);
    });

    it('deve converter quilogramas para gramas corretamente', () => {
      const result = ConvertUtils.weight({
        value: 1,
        fromType: 'kilograms',
        toType: 'grams',
      });
      expect(result).toBe(1000);
    });

    it('deve converter onças para gramas corretamente', () => {
      const result = ConvertUtils.weight({
        value: 1,
        fromType: 'ounces',
        toType: 'grams',
      });
      expect(result).toBeCloseTo(28.3495, 4);
    });
  });

  describe('volume', () => {
    it('deve converter litros para galões corretamente', () => {
      const result = ConvertUtils.volume({
        value: 1,
        fromType: 'liters',
        toType: 'gallons',
      });
      expect(result).toBeCloseTo(0.264172, 6);
    });

    it('deve converter galões para litros corretamente', () => {
      const result = ConvertUtils.volume({
        value: 1,
        fromType: 'gallons',
        toType: 'liters',
      });
      expect(result).toBeCloseTo(3.78541, 5);
    });

    it('deve converter litros para mililitros corretamente', () => {
      const result = ConvertUtils.volume({
        value: 1,
        fromType: 'liters',
        toType: 'milliliters',
      });
      expect(result).toBe(1000);
    });

    it('deve converter metros cúbicos para litros corretamente', () => {
      const result = ConvertUtils.volume({
        value: 1,
        fromType: 'cubicMeters',
        toType: 'liters',
      });
      expect(result).toBe(1000);
    });
  });

  describe('value', () => {
    it('deve converter string para number corretamente', () => {
      const result = ConvertUtils.value({
        value: '42.5',
        toType: 'number',
      });
      expect(result).toBe(42.5);
    });

    it('deve converter string para integer corretamente', () => {
      const result = ConvertUtils.value({
        value: '42.5',
        toType: 'integer',
      });
      expect(result).toBe(42);
    });

    it('deve converter number para string corretamente', () => {
      const result = ConvertUtils.value({
        value: 42.5,
        toType: 'string',
      });
      expect(result).toBe('42.5');
    });

    it('deve converter number para bigint corretamente', () => {
      const result = ConvertUtils.value({
        value: 42.5,
        toType: 'bigint',
      });
      expect(result).toBe(42n);
    });

    it('deve converter string para bigint corretamente', () => {
      const result = ConvertUtils.value({
        value: '42',
        toType: 'bigint',
      });
      expect(result).toBe(42n);
    });

    it('deve converter number para roman corretamente', () => {
      const result = ConvertUtils.value({
        value: 42,
        toType: 'roman',
      });
      expect(result).toBe('XLII');
    });

    it('deve retornar null para conversão inválida de string para number', () => {
      const result = ConvertUtils.value({
        value: 'abc',
        toType: 'number',
      });
      expect(result).toBeNull();
    });

    it('deve retornar null para conversão inválida de string para integer', () => {
      const result = ConvertUtils.value({
        value: 'abc',
        toType: 'integer',
      });
      expect(result).toBeNull();
    });

    it('deve retornar null para conversão inválida de string para bigint', () => {
      const result = ConvertUtils.value({
        value: 'abc',
        toType: 'bigint',
      });
      expect(result).toBeNull();
    });

    it('deve lançar erro ao converter número negativo para roman', () => {
      expect(() => {
        ConvertUtils.value({
          value: -1,
          toType: 'roman',
        });
      }).toThrow('Value must be a positive integer');
    });

    it('deve lançar erro ao converter número decimal para roman', () => {
      expect(() => {
        ConvertUtils.value({
          value: 1.5,
          toType: 'roman',
        });
      }).toThrow('Value must be a positive integer');
    });

    it('deve retornar o mesmo valor quando o tipo de entrada já é o tipo desejado', () => {
      const value = 42;
      const result = ConvertUtils.value({
        value,
        toType: 'number',
      });
      expect(result).toBe(value);
    });
  });
});