import { MathUtils } from '../../src/services/math.service';

/**
 * Testes de benchmark para a classe MathUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('MathUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('roundToDecimals em massa', () => {
    it('deve arredondar 100.000 números em tempo razoável', () => {
      const count = 100000;
      const value = Math.PI;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.roundToDecimals({ value, decimals: 2 }));
        }
      });

      console.log(
        `Tempo para arredondar ${count} números: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se o resultado está correto
      expect(results[0]).toBe(3.14);

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('percentage em massa', () => {
    it('deve calcular 100.000 porcentagens em tempo razoável', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.percentage({ total: 200, part: 50 }));
        }
      });

      console.log(
        `Tempo para calcular ${count} porcentagens: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se o resultado está correto
      expect(results[0]).toBe(25);

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('randomInRange em massa', () => {
    it('deve gerar 100.000 números aleatórios em tempo razoável', () => {
      const count = 100000;
      const min = 1;
      const max = 100;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.randomInRange({ min, max }));
        }
      });

      console.log(
        `Tempo para gerar ${count} números aleatórios: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se os resultados estão dentro do intervalo
      const allInRange = results.every(r => r >= min && r <= max);
      expect(allInRange).toBe(true);

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('gcd em massa', () => {
    it('deve calcular 100.000 MDCs em tempo razoável', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.gcd({ a: 24, b: 36 }));
        }
      });

      console.log(
        `Tempo para calcular ${count} MDCs: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se o resultado está correto
      expect(results[0]).toBe(12);

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('lcm em massa', () => {
    it('deve calcular 100.000 MMCs em tempo razoável', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.lcm({ a: 4, b: 6 }));
        }
      });

      console.log(
        `Tempo para calcular ${count} MMCs: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se o resultado está correto
      expect(results[0]).toBe(12);

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('clamp em massa', () => {
    it('deve limitar 100.000 valores em tempo razoável', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.clamp({ value: 15, min: 0, max: 10 }));
        }
      });

      console.log(
        `Tempo para limitar ${count} valores: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se o resultado está correto
      expect(results[0]).toBe(10);

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('isPrime em massa', () => {
    it('deve verificar 10.000 números primos em tempo razoável', () => {
      const count = 10000;
      const results: boolean[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.isPrime({ value: 997 })); // Um número primo grande
        }
      });

      console.log(
        `Tempo para verificar ${count} números primos: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se o resultado está correto
      expect(results[0]).toBe(true);

      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });

    it('deve verificar 10.000 números não-primos em tempo razoável', () => {
      const count = 10000;
      const results: boolean[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(MathUtils.isPrime({ value: 996 })); // Um número não-primo grande
        }
      });

      console.log(
        `Tempo para verificar ${count} números não-primos: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se o resultado está correto
      expect(results[0]).toBe(false);

      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Comparação de desempenho entre métodos', () => {
    it('deve comparar o desempenho de diferentes métodos', () => {
      const count = 10000;
      const results: Record<string, number> = {};

      // Teste roundToDecimals
      results.roundToDecimals = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.roundToDecimals({ value: Math.PI, decimals: 2 });
        }
      });

      // Teste percentage
      results.percentage = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.percentage({ total: 200, part: 50 });
        }
      });

      // Teste randomInRange
      results.randomInRange = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.randomInRange({ min: 1, max: 100 });
        }
      });

      // Teste gcd
      results.gcd = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.gcd({ a: 24, b: 36 });
        }
      });

      // Teste lcm
      results.lcm = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.lcm({ a: 4, b: 6 });
        }
      });

      // Teste clamp
      results.clamp = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.clamp({ value: 15, min: 0, max: 10 });
        }
      });

      // Teste isPrime
      results.isPrime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          MathUtils.isPrime({ value: 997 });
        }
      });

      // Exibe os resultados
      console.log('Comparação de desempenho para diferentes métodos:');
      Object.entries(results).forEach(([method, time]) => {
        console.log(
          `${method}: ${time.toFixed(2)}ms (${(time / count).toFixed(3)}ms por operação)`,
        );
      });

      // Não fazemos asserções específicas aqui, pois o objetivo é apenas coletar dados para análise
    });
  });

  describe('Desempenho com diferentes entradas', () => {
    it('deve medir o desempenho de isPrime com números de diferentes tamanhos', () => {
      const count = 1000;
      const numbers = [2, 101, 997, 9973, 99991];
      const results: Record<number, number> = {};

      for (const num of numbers) {
        results[num] = measureExecutionTime(() => {
          for (let i = 0; i < count; i++) {
            MathUtils.isPrime({ value: num });
          }
        });

        console.log(
          `Tempo para verificar ${count} vezes se ${num} é primo: ${results[num].toFixed(2)}ms`,
        );
      }

      // Espera-se que números maiores levem mais tempo
      // Mas não fazemos asserções específicas, pois o desempenho pode variar
    });
  });
});
