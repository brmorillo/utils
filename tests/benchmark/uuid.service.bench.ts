import { UUIDUtils } from '../../src/services/uuid.service';

/**
 * Testes de benchmark para a classe UUIDUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('UUIDUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('uuidV1Generate', () => {
    it('deve gerar 100.000 UUIDs v1 em tempo razoável', () => {
      const count = 100000;
      const uuids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          uuids.push(UUIDUtils.uuidV1Generate());
        }
      });

      console.log(
        `Tempo para gerar ${count} UUIDs v1: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se temos UUIDs únicos
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(count);

      // O tempo médio por UUID deve ser menor que 0.01ms
      const avgTimePerUuid = executionTime / count;
      expect(avgTimePerUuid).toBeLessThan(0.01);
    });
  });

  describe('uuidV4Generate', () => {
    it('deve gerar 100.000 UUIDs v4 em tempo razoável', () => {
      const count = 100000;
      const uuids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          uuids.push(UUIDUtils.uuidV4Generate());
        }
      });

      console.log(
        `Tempo para gerar ${count} UUIDs v4: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se temos UUIDs únicos (pode haver colisões teóricas, mas extremamente improváveis)
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(count);

      // O tempo médio por UUID deve ser menor que 0.01ms
      const avgTimePerUuid = executionTime / count;
      expect(avgTimePerUuid).toBeLessThan(0.01);
    });
  });

  describe('uuidV5Generate', () => {
    it('deve gerar 100.000 UUIDs v5 em tempo razoável', () => {
      const count = 100000;
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const uuids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Usa um nome diferente para cada UUID para garantir unicidade
          uuids.push(
            UUIDUtils.uuidV5Generate({
              namespace,
              name: `test-${i}`,
            }),
          );
        }
      });

      console.log(
        `Tempo para gerar ${count} UUIDs v5: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se temos UUIDs únicos
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(count);

      // O tempo médio por UUID deve ser menor que 0.01ms
      const avgTimePerUuid = executionTime / count;
      expect(avgTimePerUuid).toBeLessThan(0.01);
    });

    it('deve gerar 100.000 UUIDs v5 com namespace automático em tempo razoável', () => {
      const count = 100000;
      const uuids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Usa um nome diferente para cada UUID para garantir unicidade
          uuids.push(
            UUIDUtils.uuidV5Generate({
              name: `test-${i}`,
            }),
          );
        }
      });

      console.log(
        `Tempo para gerar ${count} UUIDs v5 com namespace automático: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se temos UUIDs únicos
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(count);

      // O tempo médio por UUID deve ser menor que 0.02ms (mais lento devido à geração do namespace)
      const avgTimePerUuid = executionTime / count;
      expect(avgTimePerUuid).toBeLessThan(0.02);
    });
  });

  describe('isValidUuid', () => {
    it('deve validar 100.000 UUIDs válidos em tempo razoável', () => {
      const count = 100000;

      // Gera um UUID para validar repetidamente
      const uuid = UUIDUtils.uuidV4Generate();

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.isValidUuid({ id: uuid });
        }
      });

      console.log(
        `Tempo para validar ${count} UUIDs válidos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por validação deve ser menor que 0.005ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.005);
    });

    it('deve validar 100.000 strings inválidas em tempo razoável', () => {
      const count = 100000;

      // String inválida para validar repetidamente
      const invalidUuid = 'not-a-uuid';

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.isValidUuid({ id: invalidUuid });
        }
      });

      console.log(
        `Tempo para validar ${count} strings inválidas: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por validação deve ser menor que 0.005ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.005);
    });
  });

  describe('Comparação de desempenho', () => {
    it('deve comparar o desempenho de geração entre diferentes versões de UUID', () => {
      const count = 10000;

      // Mede o tempo para gerar UUIDs v1
      const v1Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.uuidV1Generate();
        }
      });

      // Mede o tempo para gerar UUIDs v4
      const v4Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.uuidV4Generate();
        }
      });

      // Mede o tempo para gerar UUIDs v5 com namespace fixo
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const v5Time = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          UUIDUtils.uuidV5Generate({
            namespace,
            name: `test-${i}`,
          });
        }
      });

      console.log(`Comparação de desempenho para ${count} UUIDs:`);
      console.log(
        `- UUID v1: ${v1Time.toFixed(2)}ms (${(v1Time / count).toFixed(5)}ms por UUID)`,
      );
      console.log(
        `- UUID v4: ${v4Time.toFixed(2)}ms (${(v4Time / count).toFixed(5)}ms por UUID)`,
      );
      console.log(
        `- UUID v5: ${v5Time.toFixed(2)}ms (${(v5Time / count).toFixed(5)}ms por UUID)`,
      );

      // Não fazemos asserções específicas aqui, pois estamos apenas comparando o desempenho
    });
  });
});
