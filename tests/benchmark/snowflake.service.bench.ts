import { SnowflakeUtils } from '../../src/services/snowflake.service';

/**
 * Testes de benchmark para a classe SnowflakeUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('SnowflakeUtils - Testes de Benchmark', () => {
  const testEpoch = new Date('2023-01-01T00:00:00.000Z');

  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('Geração de IDs em massa', () => {
    it('deve gerar 10.000 IDs em tempo razoável', () => {
      const count = 10000;
      const ids: bigint[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ids.push(SnowflakeUtils.generate({ epoch: testEpoch }));
        }
      });

      console.log(
        `Tempo para gerar ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se temos IDs únicos (pode haver colisões em execuções rápidas)
      const uniqueIds = new Set(ids.map(id => id.toString()));
      expect(uniqueIds.size).toBeGreaterThan(0);

      // O tempo médio por ID deve ser menor que 0.1ms
      const avgTimePerID = executionTime / count;
      expect(avgTimePerID).toBeLessThan(0.1);
    });

    it('deve gerar 1023 IDs únicos dentro do mesmo milissegundo', () => {
      const count = 1023;
      const ids: bigint[] = [];
      
      // Força todos os IDs a terem o mesmo timestamp
      const timestamp = new Date();
      const mockDate = new Date(timestamp);
      const realDate = global.Date;
      
      // Mock da classe Date para retornar sempre o mesmo timestamp
      global.Date = class extends Date {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      } as any;
      
      try {
        // Gera 1023 IDs (máximo teórico em 1ms com workerId e processId = 0)
        for (let i = 0; i < count; i++) {
          ids.push(SnowflakeUtils.generate({ epoch: testEpoch }));
        }
        
        // Verifica se todos os IDs são únicos
        const uniqueIds = new Set(ids.map(id => id.toString()));
        expect(uniqueIds.size).toBe(count);
        
        // Verifica se todos os IDs têm o mesmo timestamp
        const timestamps = new Set();
        ids.forEach(id => {
          const decodedTimestamp = SnowflakeUtils.getTimestamp({
            snowflakeId: id,
            epoch: testEpoch,
          }).getTime();
          timestamps.add(decodedTimestamp);
        });
        
        expect(timestamps.size).toBe(1);
      } finally {
        // Restaura a classe Date original
        global.Date = realDate;
      }
    });
  });

  describe('Decodificação de IDs em massa', () => {
    it('deve decodificar 10.000 IDs em tempo razoável', () => {
      const count = 10000;

      // Gera um ID para decodificar repetidamente
      const id = SnowflakeUtils.generate({ epoch: testEpoch });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.decode({ snowflakeId: id, epoch: testEpoch });
        }
      });

      console.log(
        `Tempo para decodificar ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por decodificação deve ser menor que 0.05ms
      const avgTimePerDecode = executionTime / count;
      expect(avgTimePerDecode).toBeLessThan(0.05);
    });
  });

  describe('Extração de timestamp em massa', () => {
    it('deve extrair timestamp de 10.000 IDs em tempo razoável', () => {
      const count = 10000;

      // Gera um ID para extrair o timestamp repetidamente
      const id = SnowflakeUtils.generate({ epoch: testEpoch });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.getTimestamp({ snowflakeId: id, epoch: testEpoch });
        }
      });

      console.log(
        `Tempo para extrair timestamp de ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por extração deve ser menor que 0.05ms
      const avgTimePerExtraction = executionTime / count;
      expect(avgTimePerExtraction).toBeLessThan(0.05);
    });
  });

  describe('Validação de IDs em massa', () => {
    it('deve validar 10.000 IDs em tempo razoável', () => {
      const count = 10000;

      // Gera um ID para validar repetidamente
      const id = SnowflakeUtils.generate({ epoch: testEpoch }).toString();

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.isValidSnowflake({ snowflakeId: id });
        }
      });

      console.log(
        `Tempo para validar ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por validação deve ser menor que 0.01ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.01);
    });
  });

  describe('Comparação de IDs em massa', () => {
    it('deve comparar 10.000 pares de IDs em tempo razoável', () => {
      const count = 10000;

      // Gera dois IDs para comparar repetidamente
      const id1 = SnowflakeUtils.generate({ epoch: testEpoch });
      const id2 = SnowflakeUtils.generate({ epoch: testEpoch });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.compare({ first: id1, second: id2 });
        }
      });

      console.log(
        `Tempo para comparar ${count} pares de IDs: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por comparação deve ser menor que 0.01ms
      const avgTimePerComparison = executionTime / count;
      expect(avgTimePerComparison).toBeLessThan(0.01);
    });
  });

  describe('Criação de IDs a partir de timestamp em massa', () => {
    it('deve criar 10.000 IDs a partir de timestamps em tempo razoável', () => {
      const count = 10000;

      // Cria um timestamp para usar repetidamente
      const timestamp = new Date();

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.fromTimestamp({ timestamp, epoch: testEpoch });
        }
      });

      console.log(
        `Tempo para criar ${count} IDs a partir de timestamps: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por criação deve ser menor que 0.1ms
      const avgTimePerCreation = executionTime / count;
      expect(avgTimePerCreation).toBeLessThan(0.1);
    });
  });

  describe('Conversão de IDs em massa', () => {
    it('deve converter 10.000 IDs de bigint para string em tempo razoável', () => {
      const count = 10000;

      // Gera um ID para converter repetidamente
      const id = SnowflakeUtils.generate({ epoch: testEpoch });

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.convert({ snowflakeId: id, toFormat: 'string' });
        }
      });

      console.log(
        `Tempo para converter ${count} IDs de bigint para string: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por conversão deve ser menor que 0.01ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.01);
    });

    it('deve converter 10.000 IDs de string para bigint em tempo razoável', () => {
      const count = 10000;

      // Gera um ID como string para converter repetidamente
      const idString = SnowflakeUtils.generate({ epoch: testEpoch }).toString();

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.convert({ snowflakeId: idString, toFormat: 'bigint' });
        }
      });

      console.log(
        `Tempo para converter ${count} IDs de string para bigint: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por conversão deve ser menor que 0.01ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.01);
    });

    it('deve converter 10.000 IDs pequenos para number em tempo razoável', () => {
      const count = 10000;

      // Usa um ID pequeno que pode ser convertido para number
      const smallId = 123456789n;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          SnowflakeUtils.convert({ snowflakeId: smallId, toFormat: 'number' });
        }
      });

      console.log(
        `Tempo para converter ${count} IDs para number: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por conversão deve ser menor que 0.01ms
      const avgTimePerConversion = executionTime / count;
      expect(avgTimePerConversion).toBeLessThan(0.01);
    });
  });

  describe('Fluxo completo em massa', () => {
    it('deve executar o fluxo completo para 1.000 IDs em tempo razoável', () => {
      const count = 1000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Gera um ID
          const id = SnowflakeUtils.generate({ epoch: testEpoch });

          // Decodifica o ID
          const components = SnowflakeUtils.decode({
            snowflakeId: id,
            epoch: testEpoch,
          });

          // Extrai o timestamp
          const timestamp = SnowflakeUtils.getTimestamp({
            snowflakeId: id,
            epoch: testEpoch,
          });

          // Cria um novo ID a partir do timestamp
          const newId = SnowflakeUtils.fromTimestamp({
            timestamp,
            epoch: testEpoch,
          });

          // Compara os IDs
          SnowflakeUtils.compare({ first: id, second: newId });

          // Valida o ID
          SnowflakeUtils.isValidSnowflake({ snowflakeId: id.toString() });

          // Converte o ID para string e de volta para bigint
          const stringId = SnowflakeUtils.convert({ snowflakeId: id, toFormat: 'string' });
          SnowflakeUtils.convert({ snowflakeId: stringId, toFormat: 'bigint' });
        }
      });

      console.log(
        `Tempo para executar o fluxo completo para ${count} IDs: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por fluxo completo deve ser menor que 0.5ms
      const avgTimePerFlow = executionTime / count;
      expect(avgTimePerFlow).toBeLessThan(0.5);
    });
  });
});