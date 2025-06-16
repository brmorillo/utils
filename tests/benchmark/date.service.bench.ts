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

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.createInterval({ startDate, endDate });
        }
      });

      console.log(
        `Tempo para criar ${count} intervalos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.5ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.5);
    });
  });

  describe('Adição de tempo em massa', () => {
    it('deve adicionar tempo a 10.000 datas em tempo razoável', () => {
      const count = 10000;
      const date = DateTime.fromISO('2023-01-01');
      const timeToAdd = { days: 5, hours: 6 };

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.addTime({ date, timeToAdd });
        }
      });

      console.log(
        `Tempo para adicionar tempo a ${count} datas: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.2ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.2);
    });
  });

  describe('Remoção de tempo em massa', () => {
    it('deve remover tempo de 10.000 datas em tempo razoável', () => {
      const count = 10000;
      const date = DateTime.fromISO('2023-01-01');
      const timeToRemove = { days: 5, hours: 6 };

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.removeTime({ date, timeToRemove });
        }
      });

      console.log(
        `Tempo para remover tempo de ${count} datas: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.2ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.2);
    });
  });

  describe('Cálculo de diferenças em massa', () => {
    it('deve calcular diferenças entre 10.000 pares de datas em tempo razoável', () => {
      const count = 10000;
      const startDate = DateTime.fromISO('2023-01-01');
      const endDate = DateTime.fromISO('2023-12-31');
      const units = ['days', 'hours', 'minutes'] as const;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.diffBetween({ startDate, endDate, units });
        }
      });

      console.log(
        `Tempo para calcular ${count} diferenças: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.2ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.2);
    });
  });

  describe('Conversão para UTC em massa', () => {
    it('deve converter 10.000 datas para UTC em tempo razoável', () => {
      const count = 10000;
      const date = DateTime.fromISO('2023-01-01T12:00:00+02:00');

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.toUTC({ date });
        }
      });

      console.log(
        `Tempo para converter ${count} datas para UTC: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('Conversão para fuso horário em massa', () => {
    it('deve converter 10.000 datas para um fuso horário específico em tempo razoável', () => {
      const count = 10000;
      const date = DateTime.fromISO('2023-01-01T12:00:00Z');
      const timeZone = 'America/New_York';

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.toTimeZone({ date, timeZone });
        }
      });

      console.log(
        `Tempo para converter ${count} datas para ${timeZone}: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por operação deve ser menor que 0.2ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.2);
    });
  });

  describe('Comparação de desempenho entre operações', () => {
    it('deve comparar o desempenho de diferentes operações de data', () => {
      const count = 5000;
      const results: Record<string, number> = {};

      // Teste now()
      results.now = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.now();
        }
      });

      // Teste now({ utc: true })
      results.nowUtc = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.now({ utc: true });
        }
      });

      // Teste createInterval
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      results.createInterval = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.createInterval({ startDate, endDate });
        }
      });

      // Teste addTime
      const date = DateTime.fromISO('2023-01-01');
      const timeToAdd = { days: 5 };
      results.addTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.addTime({ date, timeToAdd });
        }
      });

      // Teste diffBetween
      const start = DateTime.fromISO('2023-01-01');
      const end = DateTime.fromISO('2023-12-31');
      const units = ['days'] as const;
      results.diffBetween = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.diffBetween({ startDate: start, endDate: end, units });
        }
      });

      // Exibe os resultados
      console.log('Comparação de desempenho para diferentes operações:');
      Object.entries(results).forEach(([operation, time]) => {
        console.log(
          `${operation}: ${time.toFixed(2)}ms (${(time / count).toFixed(3)}ms por operação)`,
        );
      });

      // Não fazemos asserções específicas aqui, pois o objetivo é apenas coletar dados para análise
    });
  });

  describe('Desempenho com diferentes formatos de entrada', () => {
    it('deve comparar o desempenho entre usar DateTime e string como entrada', () => {
      const count = 5000;
      const dateTimeObj = DateTime.fromISO('2023-01-01T12:00:00Z');
      const dateString = '2023-01-01T12:00:00Z';

      // Teste toUTC com DateTime
      const timeWithDateTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.toUTC({ date: dateTimeObj });
        }
      });

      // Teste toUTC com string
      const timeWithString = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          DateUtils.toUTC({ date: dateString });
        }
      });

      console.log(
        `Tempo para converter ${count} datas para UTC (DateTime): ${timeWithDateTime.toFixed(2)}ms`,
      );
      console.log(
        `Tempo para converter ${count} datas para UTC (string): ${timeWithString.toFixed(2)}ms`,
      );
      console.log(
        `Proporção: ${(timeWithString / timeWithDateTime).toFixed(2)}x`,
      );

      // Espera-se que usar string seja mais lento devido à necessidade de parsing
      expect(timeWithString).toBeGreaterThan(timeWithDateTime);
    });
  });
});
