import { ObjectUtils } from '../../src/services/object.service';
/**
 * Testes de benchmark para a classe ObjectUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('ObjectUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  describe('deepClone', () => {
    it('deve clonar 100.000 objetos simples em tempo razoável', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const count = 100000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepClone({ obj });
        }
      });
      console.log(
        `Tempo para clonar ${count} objetos simples: ${executionTime.toFixed(2)}ms`,
      );
      // O tempo médio por clonagem deve ser menor que 0.01ms
      const avgTimePerClone = executionTime / count;
      expect(avgTimePerClone).toBeLessThan(0.01);
    });

    it('deve clonar 10.000 objetos complexos em tempo razoável', () => {
      const obj = {
        a: { b: { c: { d: 1, e: 2, f: 3 } } },
        g: [1, 2, 3, { h: 4, i: [5, 6, 7] }],
        j: 'string',
        k: true,
        l: null,
      };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepClone({ obj });
        }
      });
      console.log(
        `Tempo para clonar ${count} objetos complexos: ${executionTime.toFixed(2)}ms`,
      );
      // O tempo médio por clonagem deve ser menor que 0.05ms
      const avgTimePerClone = executionTime / count;
      expect(avgTimePerClone).toBeLessThan(0.05);
    });
  });

  describe('pick', () => {
    it('deve selecionar chaves de 100.000 objetos em tempo razoável', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const keys = ['a', 'c', 'e'] as ('a' | 'b' | 'c' | 'd' | 'e')[];
      const count = 100000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.pick({ obj, keys });
        }
      });
      console.log(
        `Tempo para selecionar chaves de ${count} objetos: ${executionTime.toFixed(2)}ms`,
      );
      // O tempo médio por seleção deve ser menor que 0.01ms
      const avgTimePerPick = executionTime / count;
      expect(avgTimePerPick).toBeLessThan(0.01);
    });
  });

  describe('omit', () => {
    it('deve omitir chaves de 100.000 objetos em tempo razoável', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const keys = ['b', 'd'] as ('a' | 'b' | 'c' | 'd' | 'e')[];
      const count = 100000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.omit({ obj, keys });
        }
      });
      console.log(
        `Tempo para omitir chaves de ${count} objetos: ${executionTime.toFixed(2)}ms`,
      );
      // O tempo médio por omissão deve ser menor que 0.01ms
      const avgTimePerOmit = executionTime / count;
      expect(avgTimePerOmit).toBeLessThan(0.01);
    });
  });

  describe('flattenObject', () => {
    it('deve achatar 10.000 objetos simples em tempo razoável', () => {
      const obj = { a: 1, b: { c: 2, d: 3 }, e: { f: { g: 4 } } };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.flattenObject({ obj });
        }
      });
      console.log(
        `Tempo para achatar ${count} objetos simples: ${executionTime.toFixed(2)}ms`,
      );
      // O tempo médio por achatamento deve ser menor que 0.05ms
      const avgTimePerFlatten = executionTime / count;
      expect(avgTimePerFlatten).toBeLessThan(0.05);
    });

    it('deve achatar 1.000 objetos complexos em tempo razoável', () => {
      // Cria um objeto com muitos níveis de aninhamento
      const createNestedObject = (depth: number, breadth: number): any => {
        if (depth === 0) return 'value';
        const obj: Record<string, any> = {};
        for (let i = 0; i < breadth; i++) {
          obj[`key${i}`] = createNestedObject(depth - 1, breadth);
        }
        return obj;
      };

      const obj = createNestedObject(5, 3);
      const count = 1000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.flattenObject({ obj });
        }
      });
      console.log(
        `Tempo para achatar ${count} objetos complexos: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por achatamento deve ser menor que 0.5ms
      const avgTimePerFlatten = executionTime / count;
      expect(avgTimePerFlatten).toBeLessThan(0.5);
    });
  });

  describe('unflattenObject', () => {
    it('deve desachatar 10.000 objetos simples em tempo razoável', () => {
      const obj = {};
      const path = 'a.b.c';
      const value = 42;
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.unflattenObject({ obj: { ...obj }, path, value });
        }
      });
      console.log(
        `Tempo para desachatar ${count} objetos simples: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por desachatamento deve ser menor que 0.05ms
      const avgTimePerUnflatten = executionTime / count;
      expect(avgTimePerUnflatten).toBeLessThan(0.05);
    });

    it('deve desachatar 10.000 objetos com caminhos complexos em tempo razoável', () => {
      const obj = {};
      const paths = [
        'a.b.c.d.e',
        'a.b.c.d.f',
        'a.b.c.g',
        'a.b.h',
        'a.i',
        'j',
      ];
      const count = 10000 / paths.length;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          for (const path of paths) {
            ObjectUtils.unflattenObject({
              obj: { ...obj },
              path,
              value: `value-${i}-${path}`,
            });
          }
        }
      });
      console.log(
        `Tempo para desachatar ${
          count * paths.length
        } objetos com caminhos complexos: ${executionTime.toFixed(2)}ms`,
      );
      // O tempo médio por desachatamento deve ser menor que 0.05ms
      const avgTimePerUnflatten = executionTime / (count * paths.length);
      expect(avgTimePerUnflatten).toBeLessThan(0.05);
    });
  });

  describe('deepMerge', () => {
    it('deve mesclar 10.000 objetos simples em tempo razoável', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepMerge({ target, source });
        }
      });
      console.log(
        `Tempo para mesclar ${count} objetos simples: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por mesclagem deve ser menor que 0.05ms
      const avgTimePerMerge = executionTime / count;
      expect(avgTimePerMerge).toBeLessThan(0.05);
    });

    it('deve mesclar 1.000 objetos complexos em tempo razoável', () => {
      const target = {
        a: { b: { c: 1, d: 2 }, e: [1, 2] },
        f: { g: 3 },
      };
      const source = {
        a: { b: { d: 3, h: 4 }, e: [3, 4] },
        i: { j: 5 },
      };
      const count = 1000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepMerge({ target, source });
        }
      });
      console.log(
        `Tempo para mesclar ${count} objetos complexos: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por mesclagem deve ser menor que 0.5ms
      const avgTimePerMerge = executionTime / count;
      expect(avgTimePerMerge).toBeLessThan(0.5);
    });
  });

  describe('compare', () => {
    it('deve comparar 10.000 objetos simples em tempo razoável', () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { a: 1, b: 2, c: 3 };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.compare({ obj1, obj2 });
        }
      });
      console.log(
        `Tempo para comparar ${count} objetos simples: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por comparação deve ser menor que 0.01ms
      const avgTimePerCompare = executionTime / count;
      expect(avgTimePerCompare).toBeLessThan(0.01);
    });

    it('deve comparar 1.000 objetos complexos em tempo razoável', () => {
      const obj1 = {
        a: { b: { c: 1, d: 2 }, e: [1, 2] },
        f: { g: 3 },
        h: 'string',
        i: true,
        j: null,
      };
      const obj2 = {
        a: { b: { c: 1, d: 2 }, e: [1, 2] },
        f: { g: 3 },
        h: 'string',
        i: true,
        j: null,
      };
      const count = 1000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.compare({ obj1, obj2 });
        }
      });
      console.log(
        `Tempo para comparar ${count} objetos complexos: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por comparação deve ser menor que 0.1ms
      const avgTimePerCompare = executionTime / count;
      expect(avgTimePerCompare).toBeLessThan(0.1);
    });
  });

  describe('diff', () => {
    it('deve encontrar diferenças entre 10.000 pares de objetos em tempo razoável', () => {
      const obj1 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const obj2 = { a: 1, b: 3, c: 3, d: 5, e: 5 };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.diff({ obj1, obj2 });
        }
      });
      console.log(
        `Tempo para encontrar diferenças entre ${count} pares de objetos: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por operação diff deve ser menor que 0.01ms
      const avgTimePerDiff = executionTime / count;
      expect(avgTimePerDiff).toBeLessThan(0.01);
    });
  });

  describe('findSubsetObjects', () => {
    it('deve encontrar subconjuntos em 10.000 objetos em tempo razoável', () => {
      const array = [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        { id: 3, name: 'Item 3', value: 300 },
        { id: 4, name: 'Item 4', value: 400 },
        { id: 5, name: 'Item 5', value: 500 },
      ];
      const subset = { name: 'Item 3' };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.findSubsetObjects({ array, subset });
        }
      });
      console.log(
        `Tempo para encontrar subconjuntos em ${count} objetos: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por busca de subconjunto deve ser menor que 0.01ms
      const avgTimePerFindSubset = executionTime / count;
      expect(avgTimePerFindSubset).toBeLessThan(0.01);
    });
  });

  describe('isSubsetObject', () => {
    it('deve verificar se um objeto é subconjunto de outro 10.000 vezes em tempo razoável', () => {
      const superset = {
        id: 1,
        name: 'Item',
        values: [1, 2, 3],
        nested: { a: 1, b: 2, c: { d: 3, e: 4 } },
      };
      const subset = {
        name: 'Item',
        nested: { a: 1, b: 2, c: { d: 3, e: 4 } },
      };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.isSubsetObject({ superset, subset });
        }
      });
      console.log(
        `Tempo para verificar subconjuntos ${count} vezes: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // O tempo médio por verificação de subconjunto deve ser menor que 0.01ms
      const avgTimePerIsSubset = executionTime / count;
      expect(avgTimePerIsSubset).toBeLessThan(0.01);
    });
  });

  describe('compressObject e decompressObject', () => {
    it('deve comprimir e descomprimir 10.000 objetos em tempo razoável', () => {
      const json = {
        id: 1,
        name: 'Test Object',
        description: 'This is a test object for compression benchmark',
        nested: {
          a: 1,
          b: 2,
          c: [1, 2, 3, 4, 5],
        },
        tags: ['test', 'benchmark', 'compression'],
      };
      const count = 10000;
      let compressed: string;
      const compressionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          compressed = ObjectUtils.compressObject({ json });
        }
      });
      console.log(
        `Tempo para comprimir ${count} objetos: ${compressionTime.toFixed(2)}ms`,
      );

      const decompressionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.decompressObject({ jsonString: compressed! });
        }
      });
      console.log(
        `Tempo para descomprimir ${count} objetos: ${decompressionTime.toFixed(
          2,
        )}ms`,
      );

      // O tempo médio por compressão deve ser menor que 0.05ms
      const avgTimePerCompression = compressionTime / count;
      expect(avgTimePerCompression).toBeLessThan(0.05);

      // O tempo médio por descompressão deve ser menor que 0.05ms
      const avgTimePerDecompression = decompressionTime / count;
      expect(avgTimePerDecompression).toBeLessThan(0.05);
    });
  });
});