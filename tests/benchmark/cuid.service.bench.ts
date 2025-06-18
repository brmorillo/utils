import { CuidUtils } from '../../src/services/cuid.service';

/**
 * Testes de benchmark para a classe CuidUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('CuidUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('generate', () => {
    it('deve gerar 100.000 CUIDs em tempo razoável', () => {
      const count = 100000;
      const cuids: string[] = [];
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          cuids.push(CuidUtils.generate());
        }
      });
      console.log(
        `Tempo para gerar ${count} CUIDs: ${executionTime.toFixed(2)}ms`,
      );
      // Verifica se temos CUIDs únicos
      const uniqueCuids = new Set(cuids);
      expect(uniqueCuids.size).toBe(count);
      // O tempo médio por CUID deve ser menor que 0.01ms
      const avgTimePerCuid = executionTime / count;
      expect(avgTimePerCuid).toBeLessThan(0.01);
    });

    it('deve gerar CUIDs com comprimentos personalizados', () => {
      const count = 10000;
      const lengths = [10, 20, 30];
      const results: Record<number, number> = {};

      for (const length of lengths) {
        const executionTime = measureExecutionTime(() => {
          for (let i = 0; i < count; i++) {
            CuidUtils.generate({ length });
          }
        });
        results[length] = executionTime;
        console.log(
          `Tempo para gerar ${count} CUIDs de comprimento ${length}: ${executionTime.toFixed(
            2,
          )}ms`,
        );
      }

      // Verifica se o tempo de execução aumenta com o comprimento
      // (pode não ser sempre verdade devido a otimizações, mas é uma verificação razoável)
      expect(results[30]).toBeGreaterThanOrEqual(results[10] * 0.8);
    });
  });

  describe('isValidCuid', () => {
    it('deve validar 100.000 CUIDs válidos em tempo razoável', () => {
      const count = 100000;
      // Gera um CUID para validar repetidamente
      const validId = CuidUtils.generate();
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CuidUtils.isValidCuid({ id: validId });
        }
      });
      console.log(
        `Tempo para validar ${count} CUIDs válidos: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por validação deve ser menor que 0.005ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.005);
    });

    it('deve validar 100.000 strings inválidas em tempo razoável', () => {
      const count = 100000;
      // String inválida para validar repetidamente
      const invalidId = 'not-a-cuid';
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CuidUtils.isValidCuid({ id: invalidId });
        }
      });
      console.log(
        `Tempo para validar ${count} strings inválidas: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por validação deve ser menor que 0.005ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.005);
    });
  });

  describe('Comparação de desempenho', () => {
    it('deve comparar o desempenho de geração e validação', () => {
      const count = 10000;
      const ids: string[] = [];

      // Mede o tempo para gerar CUIDs
      const generateTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ids.push(CuidUtils.generate());
        }
      });

      // Mede o tempo para validar CUIDs
      const validateTime = measureExecutionTime(() => {
        for (const id of ids) {
          CuidUtils.isValidCuid({ id });
        }
      });

      console.log(
        `Tempo para gerar ${count} CUIDs: ${generateTime.toFixed(2)}ms`,
      );
      console.log(
        `Tempo para validar ${count} CUIDs: ${validateTime.toFixed(2)}ms`,
      );
      console.log(
        `Proporção validação/geração: ${(validateTime / generateTime).toFixed(
          2,
        )}`,
      );

      // A validação geralmente deve ser mais rápida que a geração
      expect(validateTime).toBeLessThan(generateTime * 2);
    });
  });
});