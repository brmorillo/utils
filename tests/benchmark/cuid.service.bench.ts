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

  describe('Geração de CUIDs em massa', () => {
    it('deve gerar 10.000 CUIDs em tempo razoável', () => {
      const count = 10000;
      const ids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ids.push(CuidUtils.generate());
        }
      });

      console.log(
        `Tempo para gerar ${count} CUIDs: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se temos IDs únicos
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(count);

      // O tempo médio por ID deve ser menor que 0.1ms
      const avgTimePerID = executionTime / count;
      expect(avgTimePerID).toBeLessThan(0.1);
    });

    it('deve gerar 10.000 CUIDs com comprimento personalizado em tempo razoável', () => {
      const count = 10000;
      const customLength = 10;
      const ids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ids.push(CuidUtils.generate({ length: customLength }));
        }
      });

      console.log(
        `Tempo para gerar ${count} CUIDs com comprimento ${customLength}: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se temos IDs únicos
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(count);

      // Verifica se todos os IDs têm o comprimento especificado
      expect(ids.every(id => id.length === customLength)).toBe(true);

      // O tempo médio por ID deve ser menor que 0.1ms
      const avgTimePerID = executionTime / count;
      expect(avgTimePerID).toBeLessThan(0.1);
    });

    it('deve comparar o desempenho de geração com diferentes comprimentos', () => {
      const count = 5000;
      const lengths = [8, 16, 24, 32];
      const results: Record<number, number> = {};

      for (const length of lengths) {
        const executionTime = measureExecutionTime(() => {
          for (let i = 0; i < count; i++) {
            CuidUtils.generate({ length });
          }
        });
        results[length] = executionTime;
        console.log(
          `Tempo para gerar ${count} CUIDs com comprimento ${length}: ${executionTime.toFixed(2)}ms`,
        );
      }

      // Verifica se o tempo de execução aumenta com o comprimento
      // (pode não ser sempre verdadeiro, mas geralmente é uma tendência)
      console.log('Comparação de desempenho por comprimento:');
      for (let i = 0; i < lengths.length - 1; i++) {
        const ratio = results[lengths[i + 1]] / results[lengths[i]];
        console.log(
          `Proporção de tempo entre comprimento ${lengths[i + 1]} e ${lengths[i]}: ${ratio.toFixed(2)}x`,
        );
      }

      // Não fazemos asserções específicas aqui, pois o desempenho pode variar
      // O objetivo é apenas coletar dados para análise
    });
  });

  describe('Validação de CUIDs em massa', () => {
    it('deve validar 10.000 CUIDs válidos em tempo razoável', () => {
      const count = 10000;

      // Gera um CUID para validar repetidamente
      const validId = CuidUtils.generate();

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CuidUtils.isValid({ id: validId });
        }
      });

      console.log(
        `Tempo para validar ${count} CUIDs válidos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por validação deve ser menor que 0.01ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.01);
    });

    it('deve validar 10.000 strings inválidas em tempo razoável', () => {
      const count = 10000;

      // String inválida para validar repetidamente
      const invalidId = 'invalid-cuid-string';

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          CuidUtils.isValid({ id: invalidId });
        }
      });

      console.log(
        `Tempo para validar ${count} strings inválidas: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por validação deve ser menor que 0.01ms
      const avgTimePerValidation = executionTime / count;
      expect(avgTimePerValidation).toBeLessThan(0.01);
    });
  });

  describe('Geração e validação combinadas', () => {
    it('deve gerar e validar 5.000 CUIDs em tempo razoável', () => {
      const count = 5000;
      const ids: string[] = [];

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const id = CuidUtils.generate();
          ids.push(id);
          const isValid = CuidUtils.isValid({ id });
          expect(isValid).toBe(true);
        }
      });

      console.log(
        `Tempo para gerar e validar ${count} CUIDs: ${executionTime.toFixed(2)}ms`,
      );

      // Verifica se temos IDs únicos
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(count);

      // O tempo médio por operação combinada deve ser menor que 0.2ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.2);
    });
  });

  describe('Desempenho com diferentes comprimentos', () => {
    it('deve medir o desempenho de validação com diferentes comprimentos', () => {
      const count = 1000;
      const lengths = [8, 16, 24, 32];

      for (const length of lengths) {
        // Gera um conjunto de IDs com o comprimento especificado
        const ids = Array.from({ length: 10 }, () =>
          CuidUtils.generate({ length }),
        );

        const executionTime = measureExecutionTime(() => {
          for (let i = 0; i < count; i++) {
            // Usa um ID aleatório do conjunto para cada validação
            const id = ids[i % ids.length];
            CuidUtils.isValid({ id });
          }
        });

        console.log(
          `Tempo para validar ${count} CUIDs de comprimento ${length}: ${executionTime.toFixed(2)}ms`,
        );

        // O tempo médio por validação deve ser menor que 0.01ms
        const avgTimePerValidation = executionTime / count;
        expect(avgTimePerValidation).toBeLessThan(0.01);
      }
    });
  });
});
