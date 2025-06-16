import { SnowflakeUtils } from '../../src/services/snowflake.service';

/**
 * Testes de integração para a classe SnowflakeUtils.
 * Estes testes verificam o comportamento da classe em cenários mais complexos
 * e com interações entre diferentes métodos.
 */
describe('SnowflakeUtils - Testes de Integração', () => {
  const testEpoch = new Date('2023-01-01T00:00:00.000Z');

  describe('Fluxo completo de geração e decodificação', () => {
    it('deve gerar um ID e decodificá-lo corretamente', () => {
      // Gera um ID com parâmetros específicos
      const workerId = 5n;
      const processId = 10n;

      const id = SnowflakeUtils.generate({
        epoch: testEpoch,
        workerId,
        processId,
      });

      // Decodifica o ID
      const components = SnowflakeUtils.decode({
        snowflakeId: id,
        epoch: testEpoch,
      });

      // Verifica se os componentes correspondem aos valores originais
      expect(components.workerId).toBe(workerId);
      expect(components.processId).toBe(processId);

      // Extrai o timestamp
      const timestamp = SnowflakeUtils.getTimestamp({
        snowflakeId: id,
        epoch: testEpoch,
      });

      // Verifica se o timestamp está próximo ao momento atual
      const now = new Date();
      const diff = Math.abs(timestamp.getTime() - now.getTime());
      expect(diff).toBeLessThan(5000); // Dentro de 5 segundos
    });
  });

  describe('Ordenação de IDs Snowflake', () => {
    it('deve gerar IDs que podem ser ordenados cronologicamente', () => {
      // Cria uma série de IDs com timestamps específicos
      const timestamps = [
        new Date('2023-01-01T12:00:00.000Z'),
        new Date('2023-01-02T12:00:00.000Z'),
        new Date('2023-01-03T12:00:00.000Z'),
        new Date('2023-01-04T12:00:00.000Z'),
        new Date('2023-01-05T12:00:00.000Z'),
      ];

      // Gera IDs para cada timestamp (em ordem aleatória)
      const ids = [
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[2],
          epoch: testEpoch,
        }),
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[0],
          epoch: testEpoch,
        }),
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[4],
          epoch: testEpoch,
        }),
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[1],
          epoch: testEpoch,
        }),
        SnowflakeUtils.fromTimestamp({
          timestamp: timestamps[3],
          epoch: testEpoch,
        }),
      ];

      // Ordena os IDs
      const sortedIds = [...ids].sort((a, b) => {
        return SnowflakeUtils.compare({ first: a, second: b });
      });

      // Extrai os timestamps dos IDs ordenados
      const sortedTimestamps = sortedIds.map(id =>
        SnowflakeUtils.getTimestamp({ snowflakeId: id, epoch: testEpoch }),
      );

      // Verifica se os timestamps estão em ordem cronológica
      for (let i = 1; i < sortedTimestamps.length; i++) {
        expect(sortedTimestamps[i].getTime()).toBeGreaterThan(
          sortedTimestamps[i - 1].getTime(),
        );
      }

      // Verifica se o primeiro timestamp corresponde ao timestamp mais antigo
      expect(sortedTimestamps[0].getDate()).toBe(timestamps[0].getDate());

      // Verifica se o último timestamp corresponde ao timestamp mais recente
      expect(sortedTimestamps[4].getDate()).toBe(timestamps[4].getDate());
    });
  });

  describe('Validação e comparação de IDs', () => {
    it('deve validar e comparar IDs corretamente', () => {
      // Gera dois IDs com timestamps diferentes para garantir a ordem
      const timestamp1 = new Date('2023-01-01T12:00:00.000Z');
      const timestamp2 = new Date('2023-01-02T12:00:00.000Z');

      const id1 = SnowflakeUtils.fromTimestamp({
        timestamp: timestamp1,
        epoch: testEpoch,
      });
      const id2 = SnowflakeUtils.fromTimestamp({
        timestamp: timestamp2,
        epoch: testEpoch,
      });

      // Valida os IDs
      expect(
        SnowflakeUtils.isValidSnowflake({ snowflakeId: id1.toString() }),
      ).toBe(true);
      expect(
        SnowflakeUtils.isValidSnowflake({ snowflakeId: id2.toString() }),
      ).toBe(true);

      // Compara os IDs - id2 deve ser maior (mais recente) que id1
      const comparisonResult = SnowflakeUtils.compare({
        first: id2,
        second: id1,
      });
      expect(comparisonResult).toBe(1);

      // Verifica a comparação inversa
      expect(SnowflakeUtils.compare({ first: id1, second: id2 })).toBe(-1);

      // Verifica se os timestamps confirmam a ordem
      const extractedTimestamp1 = SnowflakeUtils.getTimestamp({
        snowflakeId: id1,
        epoch: testEpoch,
      });
      const extractedTimestamp2 = SnowflakeUtils.getTimestamp({
        snowflakeId: id2,
        epoch: testEpoch,
      });

      expect(extractedTimestamp2.getTime()).toBeGreaterThan(
        extractedTimestamp1.getTime(),
      );
    });
  });

  describe('Compatibilidade entre diferentes formatos', () => {
    it('deve manter compatibilidade entre string e bigint', () => {
      // Gera um ID
      const id = SnowflakeUtils.generate({ epoch: testEpoch });

      // Converte para string
      const idString = id.toString();

      // Decodifica usando ambos os formatos
      const componentsBigint = SnowflakeUtils.decode({
        snowflakeId: id,
        epoch: testEpoch,
      });

      const componentsString = SnowflakeUtils.decode({
        snowflakeId: idString,
        epoch: testEpoch,
      });

      // Verifica se os componentes são idênticos
      expect(componentsBigint.timestamp).toEqual(componentsString.timestamp);
      expect(componentsBigint.workerId).toEqual(componentsString.workerId);
      expect(componentsBigint.processId).toEqual(componentsString.processId);
      expect(componentsBigint.increment).toEqual(componentsString.increment);
    });
  });
});