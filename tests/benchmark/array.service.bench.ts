import { ArrayUtils } from '../../src/services/array.service';

/**
 * Testes de benchmark para a classe ArrayUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('ArrayUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('removeDuplicates', () => {
    it('deve processar 100.000 itens em tempo razoável', () => {
      // Arrange - Criar um array grande com muitas duplicatas
      const size = 100000;
      const array = Array.from({ length: size }, (_, i) => i % 1000); // Muitas duplicatas

      // Act - Medir o tempo para remover duplicatas
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.removeDuplicates({ array });
      });

      // Log do tempo de execução
      console.log(`Tempo para remover duplicatas de ${size} itens: ${executionTime.toFixed(2)}ms`);

      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.001); // Menos de 0.001ms por item (1 microssegundo)
    });

    it('deve processar objetos com função de chave em tempo razoável', () => {
      // Arrange - Criar um array de objetos
      const size = 10000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i % 1000, // Muitas duplicatas
        value: `value-${i}`,
      }));

      // Act - Medir o tempo para remover duplicatas com função de chave
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.removeDuplicates({
          array,
          keyFn: item => item.id,
        });
      });

      // Log do tempo de execução
      console.log(
        `Tempo para remover duplicatas de ${size} objetos com keyFn: ${executionTime.toFixed(2)}ms`,
      );

      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Menos de 0.01ms por item
    });
  });

  describe('intersect', () => {
    it('deve calcular interseção de arrays grandes em tempo razoável', () => {
      // Arrange - Criar dois arrays grandes
      const size = 50000;
      const array1 = Array.from({ length: size }, (_, i) => i);
      const array2 = Array.from({ length: size }, (_, i) => i + size / 2); // 50% de sobreposição

      // Act - Medir o tempo para calcular a interseção
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.intersect({ array1, array2 });
      });

      // Log do tempo de execução
      console.log(`Tempo para calcular interseção de dois arrays de ${size} itens: ${executionTime.toFixed(2)}ms`);

      // Assert - Verificar se o tempo é razoável
      expect(executionTime).toBeLessThan(500); // Menos de 500ms
    });
  });

  describe('flatten', () => {
    it('deve achatar um array profundamente aninhado em tempo razoável', () => {
      // Arrange - Criar um array profundamente aninhado
      const createNestedArray = (depth: number, size: number): any[] => {
        if (depth <= 0) return Array.from({ length: size }, (_, i) => i);
        return Array.from({ length: size / depth }, (_, i) => createNestedArray(depth - 1, size / depth));
      };

      const nestedArray = createNestedArray(5, 10000); // 5 níveis de aninhamento

      // Act - Medir o tempo para achatar o array
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.flatten({ array: nestedArray });
      });

      // Log do tempo de execução
      console.log(`Tempo para achatar um array profundamente aninhado: ${executionTime.toFixed(2)}ms`);

      // Assert - Verificar se o tempo é razoável
      expect(executionTime).toBeLessThan(500); // Menos de 500ms
    });
  });

  describe('groupBy', () => {
    it('deve agrupar um array grande em tempo razoável', () => {
      // Arrange - Criar um array grande de objetos
      const size = 50000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i,
        category: `category-${i % 10}`, // 10 categorias diferentes
      }));

      // Act - Medir o tempo para agrupar
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.groupBy({
          array,
          keyFn: item => item.category,
        });
      });

      // Log do tempo de execução
      console.log(`Tempo para agrupar ${size} itens: ${executionTime.toFixed(2)}ms`);

      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Menos de 0.01ms por item
    });
  });

  describe('shuffle', () => {
    it('deve embaralhar um array grande em tempo razoável', () => {
      // Arrange - Criar um array grande
      const size = 100000;
      const array = Array.from({ length: size }, (_, i) => i);

      // Act - Medir o tempo para embaralhar
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.shuffle({ array });
      });

      // Log do tempo de execução
      console.log(`Tempo para embaralhar ${size} itens: ${executionTime.toFixed(2)}ms`);

      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.001); // Menos de 0.001ms por item
    });
  });

  describe('sort', () => {
    it('deve ordenar um array grande de primitivos em tempo razoável', () => {
      // Arrange - Criar um array grande desordenado
      const size = 100000;
      const array = Array.from({ length: size }, () => Math.random() * size);

      // Act - Medir o tempo para ordenar
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.sort({ array, orderBy: 'asc' });
      });

      // Log do tempo de execução
      console.log(`Tempo para ordenar ${size} números: ${executionTime.toFixed(2)}ms`);

      // Assert - Verificar se o tempo é razoável
      // A ordenação é O(n log n), então permitimos um tempo maior
      expect(executionTime).toBeLessThan(1000); // Menos de 1 segundo
    });

    it('deve ordenar um array de objetos por múltiplas propriedades em tempo razoável', () => {
      // Arrange - Criar um array de objetos
      const size = 10000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i,
        name: `name-${Math.floor(Math.random() * 100)}`,
        value: Math.random() * 1000,
      }));

      // Act - Medir o tempo para ordenar por múltiplas propriedades
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.sort({
          array,
          orderBy: { name: 'asc', value: 'desc' },
        });
      });

      // Log do tempo de execução
      console.log(
        `Tempo para ordenar ${size} objetos por múltiplas propriedades: ${executionTime.toFixed(2)}ms`,
      );

      // Assert - Verificar se o tempo é razoável
      expect(executionTime).toBeLessThan(500); // Menos de 500ms
    });
  });

  describe('findSubset', () => {
    it('deve encontrar um subconjunto em um array grande em tempo razoável', () => {
      // Arrange - Criar um array grande de objetos
      const size = 100000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i,
        name: `name-${i % 1000}`,
        tags: [`tag-${i % 10}`, `tag-${i % 20}`],
      }));

      // Act - Medir o tempo para encontrar um subconjunto
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.findSubset({
          array,
          subset: { name: 'name-999', tags: ['tag-9'] },
        });
      });

      // Log do tempo de execução
      console.log(`Tempo para encontrar um subconjunto em ${size} itens: ${executionTime.toFixed(2)}ms`);

      // Assert - Verificar se o tempo é razoável
      expect(executionTime).toBeLessThan(500); // Menos de 500ms
    });
  });

  describe('isSubset', () => {
    it('deve verificar se um objeto é subconjunto em tempo razoável', () => {
      // Arrange - Criar um objeto grande
      const superset = {
        id: 1,
        name: 'test',
        values: Array.from({ length: 1000 }, (_, i) => i),
        nested: {
          a: 1,
          b: 2,
          c: { d: 3, e: 4 },
        },
      };

      // O subset deve ser um subconjunto válido do superset
      const subset = {
        name: 'test',
        values: [5, 10, 15],
        nested: { a: 1, c: { d: 3 } },
      };

      // Act - Medir o tempo para verificar subconjunto
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < 10000; i++) {
          ArrayUtils.isSubset({ superset, subset });
        }
      });

      // Log do tempo de execução
      console.log(`Tempo para verificar subconjunto 10.000 vezes: ${executionTime.toFixed(2)}ms`);

      // Assert - Verificar se o tempo médio por verificação é razoável
      const avgTimePerCheck = executionTime / 10000;
      expect(avgTimePerCheck).toBeLessThan(0.1); // Menos de 0.1ms por verificação
    });
  });

  describe('Fluxo completo', () => {
    it('deve executar um fluxo completo de processamento em tempo razoável', () => {
      // Arrange - Criar dados para processamento
      const size = 10000;
      const data = Array.from({ length: size }, (_, i) => ({
        id: i,
        category: `category-${i % 5}`,
        name: `name-${i % 100}`,
        value: Math.random() * 1000,
        tags: [`tag-${i % 10}`, `tag-${i % 20}`],
      }));

      // Act - Medir o tempo para o fluxo completo
      const executionTime = measureExecutionTime(() => {
        // 1. Remover duplicatas por nome
        const uniqueByName = ArrayUtils.removeDuplicates({
          array: data,
          keyFn: item => item.name,
        });

        // 2. Agrupar por categoria
        const grouped = ArrayUtils.groupBy({
          array: uniqueByName,
          keyFn: item => item.category,
        });

        // 3. Para cada grupo, ordenar por valor
        Object.keys(grouped).forEach(key => {
          ArrayUtils.sort({
            array: grouped[key],
            orderBy: { value: 'desc' },
          });
        });

        // 4. Encontrar itens com tags específicas
        Object.keys(grouped).forEach(key => {
          ArrayUtils.findSubset({
            array: grouped[key],
            subset: { tags: ['tag-5'] },
          });
        });
      });

      // Log do tempo de execução
      console.log(`Tempo para executar fluxo completo com ${size} itens: ${executionTime.toFixed(2)}ms`);

      // Assert - Verificar se o tempo é razoável
      expect(executionTime).toBeLessThan(1000); // Menos de 1 segundo
    });
  });
});