import { DateUtils } from '../../src/services/date.service';
import { DateTime } from 'luxon';
/**
 * Testes de benchmark para a classe DateUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('DateUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('Obtenção de data atual em massa', () => {
    it('deve obter 10.000 datas atuais em tempo razoável', () => {
      const count = 10000;
      const dates: DateTime[] = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          dates.push(DateUtils.now());
        }
      });
      console.log(
        `Tempo para obter ${count} datas atuais: ${executionTime.toFixed(2)}ms`,
      );
      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
    it('deve obter 10.000 datas UTC em tempo razoável', () => {
      const count = 10000;
      const dates: DateTime[] = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          dates.push(DateUtils.now({ utc: true }));
        }
      });
      console.log(
        `Tempo para obter ${count} datas UTC: ${executionTime.toFixed(2)}ms`,
      );
      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Criação de intervalos em massa', () => {
    it('deve criar 10.000 intervalos em tempo razoável', () => {
      const count = 10000;
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const intervals = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          intervals.push(
            DateUtils.createInterval({ startDate, endDate }),
          );
        }
      });
      console.log(
        `Tempo para criar ${count} intervalos: ${executionTime.toFixed(2)}ms`,
      );
      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Adição de tempo em massa', () => {
    it('deve adicionar tempo a 10.000 datas em tempo razoável', () => {
      const count = 10000;
      const date = '2023-01-01';
      const timeToAdd = { days: 5 };
      const results = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(DateUtils.addTime({ date, timeToAdd }));
        }
      });
      console.log(
        `Tempo para adicionar tempo a ${count} datas: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Cálculo de diferença entre datas em massa', () => {
    it('deve calcular a diferença entre 10.000 pares de datas em tempo razoável', () => {
      const count = 10000;
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const units = ['days', 'hours', 'minutes'] as const;
      const results = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(
            DateUtils.diffBetween({ startDate, endDate, units: [...units] }),
          );
        }
      });
      console.log(
        `Tempo para calcular diferença entre ${count} pares de datas: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Conversão de timezone em massa', () => {
    it('deve converter 10.000 datas para UTC em tempo razoável', () => {
      const count = 10000;
      const date = DateTime.local();
      const results = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(DateUtils.toUTC({ date }));
        }
      });
      console.log(
        `Tempo para converter ${count} datas para UTC: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });

    it('deve converter 10.000 datas para um timezone específico em tempo razoável', () => {
      const count = 10000;
      const date = DateTime.utc();
      const timeZone = 'America/New_York';
      const results = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          results.push(DateUtils.toTimeZone({ date, timeZone }));
        }
      });
      console.log(
        `Tempo para converter ${count} datas para ${timeZone}: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Comparação de desempenho entre operações', () => {
    it('deve comparar o desempenho de diferentes operações de data', () => {
      const count = 1000;
      const results: Record<string, number> = {};

      // Teste now
      results.now = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.now();
        }
      });

      // Teste createInterval
      const start = '2023-01-01';
      const end = '2023-12-31';
      results.createInterval = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.createInterval({ startDate: start, endDate: end });
        }
      });

      // Teste addTime
      results.addTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.addTime({
            date: start,
            timeToAdd: { days: i % 30 },
          });
        }
      });

      // Teste diffBetween
      const units = ['days'] as const;
      results.diffBetween = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.diffBetween({
            startDate: start,
            endDate: end,
            units: [...units],
          });
        }
      });

      // Exibe os resultados
      console.log('Comparação de desempenho para diferentes operações de data:');
      Object.entries(results).forEach(([operation, time]) => {
        console.log(
          `${operation}: ${time.toFixed(2)}ms (${(time / count).toFixed(
            3,
          )}ms por operação)`,
        );
      });

      // Não fazemos asserções específicas aqui, pois o objetivo é apenas coletar dados para análise
    });
  });
});