import { NumberUtils } from '../../src/services/number.service';

/**
 * Testes unitários para a classe NumberUtils.
 */
describe('NumberUtils', () => {
  describe('isEven', () => {
    it('deve retornar true para números pares', () => {
      expect(NumberUtils.isEven({ value: 2 })).toBe(true);
      expect(NumberUtils.isEven({ value: 4 })).toBe(true);
      expect(NumberUtils.isEven({ value: 0 })).toBe(true);
      expect(NumberUtils.isEven({ value: -2 })).toBe(true);
    });

    it('deve retornar false para números ímpares', () => {
      expect(NumberUtils.isEven({ value: 1 })).toBe(false);
      expect(NumberUtils.isEven({ value: 3 })).toBe(false);
      expect(NumberUtils.isEven({ value: -1 })).toBe(false);
    });
  });

  describe('isOdd', () => {
    it('deve retornar true para números ímpares', () => {
      expect(NumberUtils.isOdd({ value: 1 })).toBe(true);
      expect(NumberUtils.isOdd({ value: 3 })).toBe(true);
      expect(NumberUtils.isOdd({ value: -1 })).toBe(true);
    });

    it('deve retornar false para números pares', () => {
      expect(NumberUtils.isOdd({ value: 2 })).toBe(false);
      expect(NumberUtils.isOdd({ value: 4 })).toBe(false);
      expect(NumberUtils.isOdd({ value: 0 })).toBe(false);
      expect(NumberUtils.isOdd({ value: -2 })).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('deve retornar true para números positivos', () => {
      expect(NumberUtils.isPositive({ value: 1 })).toBe(true);
      expect(NumberUtils.isPositive({ value: 0.1 })).toBe(true);
    });

    it('deve retornar false para zero', () => {
      expect(NumberUtils.isPositive({ value: 0 })).toBe(false);
    });

    it('deve retornar false para números negativos', () => {
      expect(NumberUtils.isPositive({ value: -1 })).toBe(false);
      expect(NumberUtils.isPositive({ value: -0.1 })).toBe(false);
    });
  });

  describe('normalize', () => {
    it('deve converter -0 para 0', () => {
      const negativeZero = -0;
      expect(Object.is(negativeZero, -0)).toBe(true); // Confirma que é -0

      const result = NumberUtils.normalize({ value: negativeZero });
      expect(Object.is(result, 0)).toBe(true); // Confirma que é 0 positivo
    });

    it('deve manter outros números inalterados', () => {
      expect(NumberUtils.normalize({ value: 5 })).toBe(5);
      expect(NumberUtils.normalize({ value: -5 })).toBe(-5);
      expect(NumberUtils.normalize({ value: 0 })).toBe(0);
    });
  });

  describe('roundDown', () => {
    it('deve arredondar para baixo números positivos', () => {
      expect(NumberUtils.roundDown({ value: 4.7 })).toBe(4);
      expect(NumberUtils.roundDown({ value: 4.2 })).toBe(4);
      expect(NumberUtils.roundDown({ value: 4 })).toBe(4);
    });

    it('deve arredondar para baixo números negativos', () => {
      expect(NumberUtils.roundDown({ value: -4.7 })).toBe(-5);
      expect(NumberUtils.roundDown({ value: -4.2 })).toBe(-5);
      expect(NumberUtils.roundDown({ value: -4 })).toBe(-4);
    });

    it('deve normalizar -0 para 0', () => {
      const result = NumberUtils.roundDown({ value: -0 });
      expect(Object.is(result, 0)).toBe(true);
    });
  });

  describe('roundUp', () => {
    it('deve arredondar para cima números positivos', () => {
      expect(NumberUtils.roundUp({ value: 4.7 })).toBe(5);
      expect(NumberUtils.roundUp({ value: 4.2 })).toBe(5);
      expect(NumberUtils.roundUp({ value: 4 })).toBe(4);
    });

    it('deve arredondar para cima números negativos', () => {
      expect(NumberUtils.roundUp({ value: -4.7 })).toBe(-4);
      expect(NumberUtils.roundUp({ value: -4.2 })).toBe(-4);
      expect(NumberUtils.roundUp({ value: -4 })).toBe(-4);
    });

    it('deve normalizar -0 para 0', () => {
      const result = NumberUtils.roundUp({ value: -0 });
      expect(Object.is(result, 0)).toBe(true);
    });
  });

  describe('roundToNearest', () => {
    it('deve arredondar para o inteiro mais próximo', () => {
      expect(NumberUtils.roundToNearest({ value: 4.5 })).toBe(5);
      expect(NumberUtils.roundToNearest({ value: 4.4 })).toBe(4);
      expect(NumberUtils.roundToNearest({ value: -4.5 })).toBe(-4);
      expect(NumberUtils.roundToNearest({ value: -4.6 })).toBe(-5);
    });

    it('deve normalizar -0 para 0', () => {
      const result = NumberUtils.roundToNearest({ value: -0 });
      expect(Object.is(result, 0)).toBe(true);
    });
  });

  describe('roundToDecimals', () => {
    it('deve arredondar para 2 casas decimais por padrão', () => {
      expect(NumberUtils.roundToDecimals({ value: 3.14159 })).toBe(3.14);
      expect(NumberUtils.roundToDecimals({ value: 3.145 })).toBe(3.15);
    });

    it('deve arredondar para o número especificado de casas decimais', () => {
      expect(NumberUtils.roundToDecimals({ value: 3.14159, decimals: 3 })).toBe(
        3.142,
      );
      expect(NumberUtils.roundToDecimals({ value: 3.14159, decimals: 0 })).toBe(
        3,
      );
    });

    it('deve normalizar -0 para 0', () => {
      const result = NumberUtils.roundToDecimals({ value: -0 });
      expect(Object.is(result, 0)).toBe(true);
    });
  });

  describe('toCents', () => {
    it('deve converter valores monetários para centavos', () => {
      expect(NumberUtils.toCents({ value: 10.56 })).toBe(1056);
      expect(NumberUtils.toCents({ value: 0.99 })).toBe(99);
      expect(NumberUtils.toCents({ value: 0 })).toBe(0);
    });

    it('deve arredondar para o inteiro mais próximo', () => {
      expect(NumberUtils.toCents({ value: 10.567 })).toBe(1057);
      expect(NumberUtils.toCents({ value: 10.563 })).toBe(1056);
    });
  });

  describe('addDecimalPlaces', () => {
    it('deve adicionar casas decimais ao número', () => {
      expect(
        NumberUtils.addDecimalPlaces({ value: 10.5, decimalPlaces: 3 }),
      ).toBe('10.500');
      expect(
        NumberUtils.addDecimalPlaces({ value: 10, decimalPlaces: 2 }),
      ).toBe('10.00');
    });

    it('deve normalizar -0 para 0', () => {
      expect(
        NumberUtils.addDecimalPlaces({ value: -0, decimalPlaces: 2 }),
      ).toBe('0.00');
    });

    it('deve lançar erro para valores inválidos', () => {
      expect(() => {
        NumberUtils.addDecimalPlaces({ value: NaN, decimalPlaces: 2 });
      }).toThrow('Invalid number');

      expect(() => {
        NumberUtils.addDecimalPlaces({ value: 10, decimalPlaces: -1 });
      }).toThrow('Invalid number or decimal places');
    });
  });

  describe('removeDecimalPlaces', () => {
    it('deve remover todas as casas decimais', () => {
      expect(NumberUtils.removeDecimalPlaces({ value: 10.56 })).toBe(10);
      expect(NumberUtils.removeDecimalPlaces({ value: -10.56 })).toBe(-10);
    });

    it('deve manter números inteiros inalterados', () => {
      expect(NumberUtils.removeDecimalPlaces({ value: 10 })).toBe(10);
      expect(NumberUtils.removeDecimalPlaces({ value: -10 })).toBe(-10);
    });

    it('deve normalizar -0 para 0', () => {
      const result = NumberUtils.removeDecimalPlaces({ value: -0 });
      expect(Object.is(result, 0)).toBe(true);
    });
  });

  describe('randomIntegerInRange', () => {
    it('deve gerar um número inteiro dentro do intervalo especificado', () => {
      const min = 1;
      const max = 10;

      // Executa várias vezes para aumentar a confiança
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomIntegerInRange({ min, max });
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('deve funcionar com números negativos', () => {
      const min = -10;
      const max = -1;

      const result = NumberUtils.randomIntegerInRange({ min, max });
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('deve retornar o mesmo número quando min e max são iguais', () => {
      expect(NumberUtils.randomIntegerInRange({ min: 5, max: 5 })).toBe(5);
    });

    it('deve lançar erro quando min é maior que max', () => {
      expect(() => {
        NumberUtils.randomIntegerInRange({ min: 10, max: 1 });
      }).toThrow('Minimum value 10 is greater than maximum value 1');
    });
  });

  describe('randomFloatInRange', () => {
    it('deve gerar um número decimal dentro do intervalo especificado', () => {
      const min = 1;
      const max = 10;

      // Executa várias vezes para aumentar a confiança
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomFloatInRange({ min, max });
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThan(max);
      }
    });

    it('deve respeitar o número de casas decimais especificado', () => {
      const result = NumberUtils.randomFloatInRange({
        min: 1,
        max: 10,
        decimals: 3,
      });
      const decimalPart = result.toString().split('.')[1] || '';
      expect(decimalPart.length).toBeLessThanOrEqual(3);
    });

    it('deve usar 2 casas decimais por padrão', () => {
      const result = NumberUtils.randomFloatInRange({ min: 1, max: 10 });
      const decimalPart = result.toString().split('.')[1] || '';
      expect(decimalPart.length).toBeLessThanOrEqual(2);
    });
  });

  describe('factorial', () => {
    it('deve calcular o fatorial corretamente', () => {
      expect(NumberUtils.factorial({ value: 0 })).toBe(1);
      expect(NumberUtils.factorial({ value: 1 })).toBe(1);
      expect(NumberUtils.factorial({ value: 2 })).toBe(2);
      expect(NumberUtils.factorial({ value: 3 })).toBe(6);
      expect(NumberUtils.factorial({ value: 4 })).toBe(24);
      expect(NumberUtils.factorial({ value: 5 })).toBe(120);
    });

    it('deve retornar 0 para números negativos', () => {
      expect(NumberUtils.factorial({ value: -1 })).toBe(0);
      expect(NumberUtils.factorial({ value: -5 })).toBe(0);
    });
  });

  describe('clamp', () => {
    it('deve limitar um valor ao intervalo especificado', () => {
      expect(NumberUtils.clamp({ value: 15, min: 0, max: 10 })).toBe(10);
      expect(NumberUtils.clamp({ value: -5, min: 0, max: 10 })).toBe(0);
      expect(NumberUtils.clamp({ value: 5, min: 0, max: 10 })).toBe(5);
    });

    it('deve trocar min e max se min for maior que max', () => {
      expect(NumberUtils.clamp({ value: 15, min: 10, max: 0 })).toBe(10);
      expect(NumberUtils.clamp({ value: -5, min: 10, max: 0 })).toBe(0);
    });

    it('deve normalizar -0 para 0', () => {
      const result = NumberUtils.clamp({ value: -0, min: -10, max: 10 });
      expect(Object.is(result, 0)).toBe(true);
    });
  });

  describe('isPrime', () => {
    it('deve identificar números primos corretamente', () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

      primes.forEach(prime => {
        expect(NumberUtils.isPrime({ value: prime })).toBe(true);
      });
    });

    it('deve identificar números não-primos corretamente', () => {
      const nonPrimes = [1, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];

      nonPrimes.forEach(nonPrime => {
        expect(NumberUtils.isPrime({ value: nonPrime })).toBe(false);
      });
    });

    it('deve retornar false para números negativos e zero', () => {
      expect(NumberUtils.isPrime({ value: 0 })).toBe(false);
      expect(NumberUtils.isPrime({ value: -1 })).toBe(false);
      expect(NumberUtils.isPrime({ value: -7 })).toBe(false);
    });
  });
});
