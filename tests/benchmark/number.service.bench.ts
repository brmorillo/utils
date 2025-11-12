import { NumberUtils } from '../../src/services/number.service';

/**
 * Testes de benchmark para a classe NumberUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('NumberUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('isValidEven e isOdd em massa', () => {
    it('deve verificar 1.000.000 números pares/ímpares em tempo razoável', () => {
      const count = 1000000;
      const results: boolean[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.isValidEven({ value: i }));
        }
      });

      console.log(
        `Tempo para verificar ${count} números pares: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('normalize em massa', () => {
    it('deve normalizar 1.000.000 números em tempo razoável', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.normalize({ value: i % 2 === 0 ? 0 : -0 }));
        }
      });

      console.log(
        `Tempo para normalizar ${count} números: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('roundDown, roundUp e roundToNearest em massa', () => {
    it('deve arredondar 1.000.000 números em tempo razoável', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.roundToNearest({ value: i + 0.5 }));
        }
      });

      console.log(
        `Tempo para arredondar ${count} números: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('roundToDecimals em massa', () => {
    it('deve arredondar 1.000.000 números para decimais em tempo razoável', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(
            NumberUtils.roundToDecimals({
              value: Math.PI + i * 0.0001,
              decimals: 2,
            }),
          );
        }
      });

      console.log(
        `Tempo para arredondar ${count} números para decimais: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('toCents em massa', () => {
    it('deve converter 1.000.000 números para centavos em tempo razoável', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.toCents({ value: i * 0.01 }));
        }
      });

      console.log(
        `Tempo para converter ${count} números para centavos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('addDecimalPlaces em massa', () => {
    it('deve adicionar casas decimais a 1.000.000 números em tempo razoável', () => {
      const count = 1000000;
      const results: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(
            NumberUtils.addDecimalPlaces({ value: i, decimalPlaces: 2 }),
          );
        }
      });

      console.log(
        `Tempo para adicionar casas decimais a ${count} números: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('removeDecimalPlaces em massa', () => {
    it('deve remover casas decimais de 1.000.000 números em tempo razoável', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.removeDecimalPlaces({ value: i + 0.123 }));
        }
      });

      console.log(
        `Tempo para remover casas decimais de ${count} números: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('randomIntegerInRange em massa', () => {
    it('deve gerar 1.000.000 números aleatórios inteiros em tempo razoável', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.randomIntegerInRange({ min: 1, max: 100 }));
        }
      });

      console.log(
        `Tempo para gerar ${count} números aleatórios inteiros: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('randomFloatInRange em massa', () => {
    it('deve gerar 1.000.000 números aleatórios decimais em tempo razoável', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(
            NumberUtils.randomFloatInRange({ min: 1, max: 100, decimals: 2 }),
          );
        }
      });

      console.log(
        `Tempo para gerar ${count} números aleatórios decimais: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('factorial em massa', () => {
    it('deve calcular o fatorial de 100.000 números pequenos em tempo razoável', () => {
      const count = 100000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.factorial({ value: i % 10 })); // Usa números de 0 a 9
        }
      });

      console.log(
        `Tempo para calcular o fatorial de ${count} números: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('clamp em massa', () => {
    it('deve limitar 1.000.000 números em tempo razoável', () => {
      const count = 1000000;
      const results: number[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.clamp({ value: i, min: 0, max: 100 }));
        }
      });

      console.log(
        `Tempo para limitar ${count} números: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('isValidPrime em massa', () => {
    it('deve verificar se 100.000 números são primos em tempo razoável', () => {
      const count = 100000;
      const results: boolean[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(NumberUtils.isValidPrime({ value: i }));
        }
      });

      console.log(
        `Tempo para verificar se ${count} números são primos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('Comparação de desempenho entre métodos', () => {
    it('deve comparar o desempenho de diferentes métodos', () => {
      const count = 100000;
      const results: Record<string, number> = {};

      // Teste isValidEven
      results.isValidEven = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          NumberUtils.isValidEven({ value: i });
        }
      });

      // Teste isOdd
      results.isOdd = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          NumberUtils.isOdd({ value: i });
        }
      });

      // Teste roundToDecimals
      results.roundToDecimals = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          NumberUtils.roundToDecimals({ value: Math.PI, decimals: 2 });
        }
      });

      // Teste isValidPrime
      results.isValidPrime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          NumberUtils.isValidPrime({ value: i % 100 });
        }
      });

      // Exibe os resultados
      console.log('Comparação de desempenho para diferentes métodos:');
      Object.entries(results).forEach(([method, time]) => {
        console.log(
          `${method}: ${time.toFixed(2)}ms (${(time / count).toFixed(6)}ms por operação)`,
        );
      });

      // Não fazemos asserções específicas aqui, pois o objetivo é apenas coletar dados para análise
    });
  });

  describe('Desempenho com diferentes entradas', () => {
    it('deve medir o desempenho de isValidPrime com números de diferentes tamanhos', () => {
      const count = 1000;
      const numbers = [2, 101, 997, 9973, 99991];
      const results: Record<number, number> = {};

      for (const num of numbers) {
        results[num] = measureExecutionTime(() => {
          for (let i = 0; i < count; i++) {
            NumberUtils.isValidPrime({ value: num });
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
