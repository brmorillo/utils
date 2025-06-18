import { NumberUtils } from '../../src/services/number.service';

describe('NumberUtils', () => {
  describe('normalize', () => {
    it('deve converter -0 para 0', () => {
      expect(NumberUtils.normalize({ value: -0 })).toBe(0);
    });

    it('deve manter outros números inalterados', () => {
      expect(NumberUtils.normalize({ value: 5 })).toBe(5);
      expect(NumberUtils.normalize({ value: -5 })).toBe(-5);
      expect(NumberUtils.normalize({ value: 0 })).toBe(0);
    });
  });

  describe('roundDown', () => {
    it('deve arredondar números para baixo', () => {
      expect(NumberUtils.roundDown({ value: 4.7 })).toBe(4);
      expect(NumberUtils.roundDown({ value: 4.2 })).toBe(4);
      expect(NumberUtils.roundDown({ value: 4.0 })).toBe(4);
    });

    it('deve arredondar números negativos para baixo', () => {
      expect(NumberUtils.roundDown({ value: -4.7 })).toBe(-5);
      expect(NumberUtils.roundDown({ value: -4.2 })).toBe(-5);
      expect(NumberUtils.roundDown({ value: -4.0 })).toBe(-4);
    });
  });

  describe('isPositive', () => {
    it('deve identificar números positivos', () => {
      expect(NumberUtils.isPositive({ value: 5 })).toBe(true);
      expect(NumberUtils.isPositive({ value: 0.1 })).toBe(true);
    });

    it('deve identificar números não positivos', () => {
      expect(NumberUtils.isPositive({ value: 0 })).toBe(false);
      expect(NumberUtils.isPositive({ value: -5 })).toBe(false);
    });

    it('deve lidar com zero positivo e negativo', () => {
      expect(NumberUtils.isPositive({ value: 0 })).toBe(false);
      expect(NumberUtils.isPositive({ value: -0 })).toBe(false);
    });
  });

  describe('roundUp', () => {
    it('deve arredondar números para cima', () => {
      expect(NumberUtils.roundUp({ value: 4.3 })).toBe(5);
      expect(NumberUtils.roundUp({ value: 4.7 })).toBe(5);
      expect(NumberUtils.roundUp({ value: 4.0 })).toBe(4);
    });

    it('deve arredondar números negativos para cima', () => {
      expect(NumberUtils.roundUp({ value: -4.3 })).toBe(-4);
      expect(NumberUtils.roundUp({ value: -4.7 })).toBe(-4);
      expect(NumberUtils.roundUp({ value: -4.0 })).toBe(-4);
    });
  });

  describe('roundToNearest', () => {
    it('deve arredondar números para o inteiro mais próximo', () => {
      expect(NumberUtils.roundToNearest({ value: 4.4 })).toBe(4);
      expect(NumberUtils.roundToNearest({ value: 4.5 })).toBe(5);
      expect(NumberUtils.roundToNearest({ value: 4.6 })).toBe(5);
    });

    it('deve arredondar números negativos para o inteiro mais próximo', () => {
      expect(NumberUtils.roundToNearest({ value: -4.4 })).toBe(-4);
      expect(NumberUtils.roundToNearest({ value: -4.5 })).toBe(-4);
      expect(NumberUtils.roundToNearest({ value: -4.6 })).toBe(-5);
    });
  });

  describe('roundToDecimals', () => {
    it('deve arredondar para o número especificado de casas decimais', () => {
      expect(NumberUtils.roundToDecimals({ value: 3.14159, decimals: 2 })).toBe(
        3.14,
      );
      expect(NumberUtils.roundToDecimals({ value: 3.14159, decimals: 3 })).toBe(
        3.142,
      );
    });

    it('deve usar 2 casas decimais por padrão', () => {
      expect(NumberUtils.roundToDecimals({ value: 3.14159 })).toBe(3.14);
    });

    it('deve lidar com números negativos', () => {
      expect(NumberUtils.roundToDecimals({ value: -3.14159, decimals: 2 })).toBe(
        -3.14,
      );
    });
  });

  describe('toCents', () => {
    it('deve converter números para centavos', () => {
      expect(NumberUtils.toCents({ value: 10.56 })).toBe(1056);
      expect(NumberUtils.toCents({ value: 0.99 })).toBe(99);
      expect(NumberUtils.toCents({ value: 0.01 })).toBe(1);
    });

    it('deve lidar com números sem casas decimais', () => {
      expect(NumberUtils.toCents({ value: 10 })).toBe(1000);
      expect(NumberUtils.toCents({ value: 0 })).toBe(0);
    });

    it('deve arredondar para o centavo mais próximo', () => {
      expect(NumberUtils.toCents({ value: 10.567 })).toBe(1057);
      expect(NumberUtils.toCents({ value: 10.562 })).toBe(1056);
    });
  });

  describe('addDecimalPlaces', () => {
    it('deve adicionar casas decimais a um número', () => {
      expect(NumberUtils.addDecimalPlaces({ value: 10, decimalPlaces: 2 })).toBe(
        '10.00',
      );
      expect(NumberUtils.addDecimalPlaces({ value: 10.5, decimalPlaces: 3 })).toBe(
        '10.500',
      );
    });

    it('deve lidar com números negativos', () => {
      expect(
        NumberUtils.addDecimalPlaces({ value: -10, decimalPlaces: 2 }),
      ).toBe('-10.00');
    });

    it('deve lançar erro para valores inválidos', () => {
      expect(() =>
        NumberUtils.addDecimalPlaces({ value: NaN, decimalPlaces: 2 }),
      ).toThrow();
      expect(() =>
        NumberUtils.addDecimalPlaces({ value: 10, decimalPlaces: -1 }),
      ).toThrow();
    });
  });

  describe('removeDecimalPlaces', () => {
    it('deve remover todas as casas decimais', () => {
      expect(NumberUtils.removeDecimalPlaces({ value: 10.56 })).toBe(10);
      expect(NumberUtils.removeDecimalPlaces({ value: 10.99 })).toBe(10);
    });

    it('deve lidar com números negativos', () => {
      expect(NumberUtils.removeDecimalPlaces({ value: -10.56 })).toBe(-10);
    });

    it('deve manter números sem casas decimais inalterados', () => {
      expect(NumberUtils.removeDecimalPlaces({ value: 10 })).toBe(10);
      expect(NumberUtils.removeDecimalPlaces({ value: -10 })).toBe(-10);
    });
  });

  describe('randomIntegerInRange', () => {
    it('deve gerar números dentro do intervalo especificado', () => {
      const min = 1;
      const max = 10;
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomIntegerInRange({ min, max });
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('deve lançar erro se min for maior que max', () => {
      expect(() =>
        NumberUtils.randomIntegerInRange({ min: 10, max: 1 }),
      ).toThrow();
    });
  });

  describe('randomFloatInRange', () => {
    it('deve gerar números dentro do intervalo especificado', () => {
      const min = 1;
      const max = 10;
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomFloatInRange({ min, max });
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThan(max);
      }
    });

    it('deve respeitar o número de casas decimais', () => {
      const result = NumberUtils.randomFloatInRange({
        min: 1,
        max: 10,
        decimals: 3,
      });
      expect(result.toString()).toMatch(/^\d+\.\d{1,3}$/);
    });

    it('deve lançar erro se min for maior que max', () => {
      expect(() =>
        NumberUtils.randomFloatInRange({ min: 10, max: 1 }),
      ).toThrow();
    });
  });

  describe('factorial', () => {
    it('deve calcular o fatorial corretamente', () => {
      expect(NumberUtils.factorial({ value: 0 })).toBe(1);
      expect(NumberUtils.factorial({ value: 1 })).toBe(1);
      expect(NumberUtils.factorial({ value: 5 })).toBe(120);
    });

    it('deve retornar 0 para números negativos', () => {
      expect(NumberUtils.factorial({ value: -1 })).toBe(0);
      expect(NumberUtils.factorial({ value: -5 })).toBe(0);
    });
  });

  describe('clamp', () => {
    it('deve limitar números dentro do intervalo', () => {
      expect(NumberUtils.clamp({ value: 15, min: 0, max: 10 })).toBe(10);
      expect(NumberUtils.clamp({ value: -5, min: 0, max: 10 })).toBe(0);
      expect(NumberUtils.clamp({ value: 5, min: 0, max: 10 })).toBe(5);
    });

    it('deve trocar min e max se min for maior que max', () => {
      expect(NumberUtils.clamp({ value: 5, min: 10, max: 0 })).toBe(5);
      expect(NumberUtils.clamp({ value: 15, min: 10, max: 0 })).toBe(10);
      expect(NumberUtils.clamp({ value: -5, min: 10, max: 0 })).toBe(0);
    });
  });

  describe('isValidPrime', () => {
    it('deve identificar números primos', () => {
      expect(NumberUtils.isValidPrime({ value: 2 })).toBe(true);
      expect(NumberUtils.isValidPrime({ value: 3 })).toBe(true);
      expect(NumberUtils.isValidPrime({ value: 5 })).toBe(true);
      expect(NumberUtils.isValidPrime({ value: 7 })).toBe(true);
      expect(NumberUtils.isValidPrime({ value: 11 })).toBe(true);
    });

    it('deve identificar números não primos', () => {
      expect(NumberUtils.isValidPrime({ value: 1 })).toBe(false);
      expect(NumberUtils.isValidPrime({ value: 4 })).toBe(false);
      expect(NumberUtils.isValidPrime({ value: 6 })).toBe(false);
      expect(NumberUtils.isValidPrime({ value: 8 })).toBe(false);
      expect(NumberUtils.isValidPrime({ value: 9 })).toBe(false);
    });

    it('deve identificar números negativos como não primos', () => {
      expect(NumberUtils.isValidPrime({ value: -2 })).toBe(false);
      expect(NumberUtils.isValidPrime({ value: -3 })).toBe(false);
      expect(NumberUtils.isValidPrime({ value: -5 })).toBe(false);
    });
  });

  describe('isValidEven', () => {
    it('deve identificar números pares', () => {
      expect(NumberUtils.isValidEven({ value: 2 })).toBe(true);
      expect(NumberUtils.isValidEven({ value: 4 })).toBe(true);
      expect(NumberUtils.isValidEven({ value: 0 })).toBe(true);
      expect(NumberUtils.isValidEven({ value: -2 })).toBe(true);
    });

    it('deve identificar números ímpares', () => {
      expect(NumberUtils.isValidEven({ value: 1 })).toBe(false);
      expect(NumberUtils.isValidEven({ value: 3 })).toBe(false);
      expect(NumberUtils.isValidEven({ value: -1 })).toBe(false);
      expect(NumberUtils.isValidEven({ value: -3 })).toBe(false);
    });
  });

  describe('isValidOdd', () => {
    it('deve identificar números ímpares', () => {
      expect(NumberUtils.isValidOdd({ value: 1 })).toBe(true);
      expect(NumberUtils.isValidOdd({ value: 3 })).toBe(true);
      expect(NumberUtils.isValidOdd({ value: -1 })).toBe(true);
      expect(NumberUtils.isValidOdd({ value: -3 })).toBe(true);
    });

    it('deve identificar números pares', () => {
      expect(NumberUtils.isValidOdd({ value: 2 })).toBe(false);
      expect(NumberUtils.isValidOdd({ value: 4 })).toBe(false);
      expect(NumberUtils.isValidOdd({ value: 0 })).toBe(false);
      expect(NumberUtils.isValidOdd({ value: -2 })).toBe(false);
    });
  });
});