import { MathUtils } from '../../src/services/math.service';

/**
 * Testes unitários para a classe MathUtils.
 */
describe('MathUtils', () => {
  describe('roundToDecimals', () => {
    it('deve arredondar para 2 casas decimais por padrão', () => {
      const result = MathUtils.roundToDecimals({ value: 3.14159 });
      expect(result).toBe(3.14);
    });

    it('deve arredondar para o número especificado de casas decimais', () => {
      const result = MathUtils.roundToDecimals({ value: 3.14159, decimals: 3 });
      expect(result).toBe(3.142);
    });

    it('deve arredondar para cima quando o próximo dígito é >= 5', () => {
      const result = MathUtils.roundToDecimals({ value: 3.145, decimals: 2 });
      expect(result).toBe(3.15);
    });

    it('deve arredondar para baixo quando o próximo dígito é < 5', () => {
      const result = MathUtils.roundToDecimals({ value: 3.144, decimals: 2 });
      expect(result).toBe(3.14);
    });

    it('deve lidar com números negativos corretamente', () => {
      const result = MathUtils.roundToDecimals({
        value: -3.14159,
        decimals: 2,
      });
      expect(result).toBe(-3.14);
    });

    it('deve lidar com zero casas decimais', () => {
      const result = MathUtils.roundToDecimals({ value: 3.14159, decimals: 0 });
      expect(result).toBe(3);
    });
  });

  describe('percentage', () => {
    it('deve calcular a porcentagem corretamente', () => {
      const result = MathUtils.percentage({ total: 200, part: 50 });
      expect(result).toBe(25);
    });

    it('deve lidar com números decimais', () => {
      const result = MathUtils.percentage({ total: 200, part: 33.3 });
      expect(result).toBeCloseTo(16.65);
    });

    it('deve retornar 100 quando part e total são iguais', () => {
      const result = MathUtils.percentage({ total: 50, part: 50 });
      expect(result).toBe(100);
    });

    it('deve retornar 0 quando part é 0', () => {
      const result = MathUtils.percentage({ total: 50, part: 0 });
      expect(result).toBe(0);
    });

    it('deve lançar erro quando total é 0', () => {
      expect(() => {
        MathUtils.percentage({ total: 0, part: 50 });
      }).toThrow('Total cannot be zero');
    });
  });

  describe('randomInRange', () => {
    it('deve gerar um número dentro do intervalo especificado', () => {
      const min = 10;
      const max = 20;

      // Executa várias vezes para aumentar a confiança
      for (let i = 0; i < 100; i++) {
        const result = MathUtils.randomInRange({ min, max });
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
      }
    });

    it('deve funcionar com números negativos', () => {
      const min = -20;
      const max = -10;

      const result = MathUtils.randomInRange({ min, max });
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    it('deve funcionar quando min e max são iguais', () => {
      const min = 10;
      const max = 10;

      const result = MathUtils.randomInRange({ min, max });
      expect(result).toBe(10);
    });

    it('deve lançar erro quando min é maior que max', () => {
      expect(() => {
        MathUtils.randomInRange({ min: 20, max: 10 });
      }).toThrow('Min cannot be greater than max');
    });
  });

  describe('gcd', () => {
    it('deve calcular o MDC de dois números positivos', () => {
      const result = MathUtils.gcd({ a: 24, b: 36 });
      expect(result).toBe(12);
    });

    it('deve retornar o próprio número quando o outro é zero', () => {
      expect(MathUtils.gcd({ a: 24, b: 0 })).toBe(24);
      expect(MathUtils.gcd({ a: 0, b: 36 })).toBe(36);
    });

    it('deve funcionar com números primos entre si', () => {
      const result = MathUtils.gcd({ a: 17, b: 13 });
      expect(result).toBe(1);
    });

    it('deve funcionar com números iguais', () => {
      const result = MathUtils.gcd({ a: 24, b: 24 });
      expect(result).toBe(24);
    });
  });

  describe('lcm', () => {
    it('deve calcular o MMC de dois números positivos', () => {
      const result = MathUtils.lcm({ a: 4, b: 6 });
      expect(result).toBe(12);
    });

    it('deve retornar zero quando um dos números é zero', () => {
      expect(MathUtils.lcm({ a: 4, b: 0 })).toBe(0);
      expect(MathUtils.lcm({ a: 0, b: 6 })).toBe(0);
    });

    it('deve funcionar com números primos entre si', () => {
      const result = MathUtils.lcm({ a: 17, b: 13 });
      expect(result).toBe(17 * 13);
    });

    it('deve funcionar com números iguais', () => {
      const result = MathUtils.lcm({ a: 24, b: 24 });
      expect(result).toBe(24);
    });
  });

  describe('clamp', () => {
    it('deve retornar o valor quando está dentro do intervalo', () => {
      const result = MathUtils.clamp({ value: 5, min: 0, max: 10 });
      expect(result).toBe(5);
    });

    it('deve retornar o valor mínimo quando o valor é menor', () => {
      const result = MathUtils.clamp({ value: -5, min: 0, max: 10 });
      expect(result).toBe(0);
    });

    it('deve retornar o valor máximo quando o valor é maior', () => {
      const result = MathUtils.clamp({ value: 15, min: 0, max: 10 });
      expect(result).toBe(10);
    });

    it('deve funcionar quando min e max são iguais', () => {
      const result = MathUtils.clamp({ value: 15, min: 10, max: 10 });
      expect(result).toBe(10);
    });
  });

  describe('isValidPrime', () => {
    it('deve identificar números primos corretamente', () => {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

      primes.forEach(prime => {
        expect(MathUtils.isValidPrime({ value: prime })).toBe(true);
      });
    });

    it('deve identificar números não-primos corretamente', () => {
      const nonPrimes = [1, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];

      nonPrimes.forEach(nonPrime => {
        expect(MathUtils.isValidPrime({ value: nonPrime })).toBe(false);
      });
    });

    it('deve retornar false para números negativos', () => {
      expect(MathUtils.isValidPrime({ value: -7 })).toBe(false);
    });

    it('deve retornar false para zero', () => {
      expect(MathUtils.isValidPrime({ value: 0 })).toBe(false);
    });

    it('deve retornar false para um', () => {
      expect(MathUtils.isValidPrime({ value: 1 })).toBe(false);
    });
  });
});
