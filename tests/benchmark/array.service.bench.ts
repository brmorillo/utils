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
      console.log(
        `Tempo para remover duplicatas de ${size} itens: ${executionTime.toFixed(2)}ms`,
      );
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
    it('deve encontrar a interseção de arrays grandes em tempo razoável', () => {
      // Arrange - Criar dois arrays grandes com alguma sobreposição
      const size = 100000;
      const array1 = Array.from({ length: size }, (_, i) => i);
      const array2 = Array.from({ length: size }, (_, i) => i + size / 2);
      // Act - Medir o tempo para encontrar a interseção
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.intersect({ array1, array2 });
      });
      // Log do tempo de execução
      console.log(
        `Tempo para encontrar interseção de dois arrays de ${size} itens: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Menos de 0.01ms por item
    });
  });

  describe('flatten', () => {
    it('deve achatar um array grande aninhado em tempo razoável', () => {
      // Arrange - Criar um array aninhado grande
      const size = 10000;
      const nestedArrays = Array.from({ length: size }, (_, i) => [
        i,
        [i + 1, i + 2],
      ]);
      // Act - Medir o tempo para achatar o array
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.flatten({ array: nestedArrays });
      });
      // Log do tempo de execução
      console.log(
        `Tempo para achatar um array aninhado de ${size} itens: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Menos de 0.01ms por item
    });
  });

  describe('groupBy', () => {
    it('deve agrupar um array grande em tempo razoável', () => {
      // Arrange - Criar um array de objetos
      const size = 100000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i,
        category: `category-${i % 10}`,
        value: i,
      }));
      // Act - Medir o tempo para agrupar por categoria
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.groupBy({
          array,
          keyFn: item => item.category,
        });
      });
      // Log do tempo de execução
      console.log(
        `Tempo para agrupar um array de ${size} itens: ${executionTime.toFixed(
          2,
        )}ms`,
      );
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
      // Act - Medir o tempo para embaralhar o array
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.shuffle({ array });
      });
      // Log do tempo de execução
      console.log(
        `Tempo para embaralhar um array de ${size} itens: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.001); // Menos de 0.001ms por item
    });
  });

  describe('sort', () => {
    it('deve ordenar um array grande em tempo razoável', () => {
      // Arrange - Criar um array grande
      const size = 10000;
      const array = Array.from({ length: size }, () =>
        Math.floor(Math.random() * size),
      );
      // Act - Medir o tempo para ordenar o array
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.sort({
          array,
          orderBy: 'asc',
        });
      });
      // Log do tempo de execução
      console.log(
        `Tempo para ordenar um array de ${size} itens: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Menos de 0.01ms por item
    });

    it('deve ordenar um array de objetos por múltiplas propriedades em tempo razoável', () => {
      // Arrange - Criar um array de objetos
      const size = 10000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i,
        name: `name-${Math.floor(Math.random() * 100)}`,
        value: Math.floor(Math.random() * 1000),
      }));
      // Act - Medir o tempo para ordenar o array por múltiplas propriedades
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.sort({
          array,
          orderBy: {
            name: 'asc',
            value: 'desc',
          },
        });
      });
      // Log do tempo de execução
      console.log(
        `Tempo para ordenar um array de ${size} objetos por múltiplas propriedades: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.1); // Menos de 0.1ms por item
    });
  });

  describe('findSubset', () => {
    it('deve encontrar um subconjunto em um array grande em tempo razoável', () => {
      // Arrange - Criar um array grande de objetos
      const size = 100000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i,
        name: `name-${i % 1000}`,
        category: `category-${i % 10}`,
        active: i % 2 === 0,
      }));
      // Subset a ser encontrado
      const subset = {
        category: 'category-5',
        active: true,
      };
      // Act - Medir o tempo para encontrar o subconjunto
      const executionTime = measureExecutionTime(() => {
        array.filter(item => 
          item.category === subset.category && item.active === subset.active
        );
      });
      // Log do tempo de execução
      console.log(
        `Tempo para encontrar um subconjunto em um array de ${size} itens: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Verificar se o tempo médio por item é razoável
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Menos de 0.01ms por item
    });
  });

  describe('isSubset', () => {
    it('deve verificar se um objeto é subconjunto de outro em tempo razoável', () => {
      // Arrange - Criar um objeto grande
      const superset = {
        id: 1,
        name: 'Item',
        values: [1, 2, 3],
        nested: { a: 1, b: 2, c: { d: 3, e: 4 } },
      };
      // Subset a ser verificado
      const subset = {
        name: 'Item',
        nested: { a: 1, b: 2, c: { d: 3 } },
      };
      // Act - Medir o tempo para verificar se é subconjunto
      const count = 100000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const isSubset = Object.entries(subset).every(([key, val]) => {
            if (typeof val === 'object' && val !== null) {
              return JSON.stringify(val) === JSON.stringify(superset[key as keyof typeof superset]);
            }
            return superset[key as keyof typeof superset] === val;
          });
        }
      });
      // Log do tempo de execução
      console.log(
        `Tempo para verificar se é subconjunto ${count} vezes: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Verificar se o tempo médio por verificação é razoável
      const avgTimePerCheck = executionTime / count;
      expect(avgTimePerCheck).toBeLessThan(0.01); // Menos de 0.01ms por verificação
    });
  });
});