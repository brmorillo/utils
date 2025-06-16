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

  describe('deepMerge', () => {
    it('deve mesclar 10.000 pares de objetos simples em tempo razoável', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepMerge({ target, source });
        }
      });

      console.log(
        `Tempo para mesclar ${count} pares de objetos simples: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por mesclagem deve ser menor que 0.05ms
      const avgTimePerMerge = executionTime / count;
      expect(avgTimePerMerge).toBeLessThan(0.05);
    });

    it('deve mesclar 1.000 pares de objetos complexos em tempo razoável', () => {
      const target = {
        a: { b: 1, c: { d: 2 } },
        e: [1, 2, 3],
        f: 'target',
      };
      const source = {
        a: { c: { d: 3, e: 4 }, f: 5 },
        e: [4, 5],
        g: 'source',
      };
      const count = 1000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepMerge({ target, source });
        }
      });

      console.log(
        `Tempo para mesclar ${count} pares de objetos complexos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por mesclagem deve ser menor que 0.5ms
      const avgTimePerMerge = executionTime / count;
      expect(avgTimePerMerge).toBeLessThan(0.5);
    });
  });

  describe('pick', () => {
    it('deve selecionar chaves de 100.000 objetos em tempo razoável', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const keys = ['a', 'c', 'e'];
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
      const keys = ['b', 'd'];
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

      const obj = createNestedObject(5, 3); // 5 níveis de profundidade, 3 chaves por nível
      const count = 1000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.flattenObject({ obj });
        }
      });

      console.log(
        `Tempo para achatar ${count} objetos complexos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por achatamento deve ser menor que 1ms
      const avgTimePerFlatten = executionTime / count;
      expect(avgTimePerFlatten).toBeLessThan(1);
    });
  });

  describe('compare', () => {
    it('deve comparar 10.000 pares de objetos simples em tempo razoável', () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { a: 1, b: 2, c: 3 };
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.compare({ obj1, obj2 });
        }
      });

      console.log(
        `Tempo para comparar ${count} pares de objetos simples: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por comparação deve ser menor que 0.01ms
      const avgTimePerCompare = executionTime / count;
      expect(avgTimePerCompare).toBeLessThan(0.01);
    });

    it('deve comparar 1.000 pares de objetos complexos em tempo razoável', () => {
      const obj1 = {
        a: { b: { c: 1, d: 2 }, e: [1, 2, 3] },
        f: { g: { h: { i: 3 } } },
        j: [{ k: 4 }, { l: 5 }],
      };
      const obj2 = {
        a: { b: { c: 1, d: 2 }, e: [1, 2, 3] },
        f: { g: { h: { i: 3 } } },
        j: [{ k: 4 }, { l: 5 }],
      };
      const count = 1000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.compare({ obj1, obj2 });
        }
      });

      console.log(
        `Tempo para comparar ${count} pares de objetos complexos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por comparação deve ser menor que 0.5ms
      const avgTimePerCompare = executionTime / count;
      expect(avgTimePerCompare).toBeLessThan(0.5);
    });
  });

  describe('findValue', () => {
    it('deve encontrar 100.000 valores em objetos em tempo razoável', () => {
      const obj = {
        user: {
          profile: {
            name: 'John',
            address: {
              city: 'New York',
              country: 'USA',
            },
          },
        },
      };
      const path = 'user.profile.address.city';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.findValue({ obj, path });
        }
      });

      console.log(
        `Tempo para encontrar ${count} valores em objetos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por busca deve ser menor que 0.01ms
      const avgTimePerFind = executionTime / count;
      expect(avgTimePerFind).toBeLessThan(0.01);
    });
  });

  describe('unflattenObject', () => {
    it('deve desachatar 10.000 objetos em tempo razoável', () => {
      const obj = {};
      const path = 'a.b.c.d.e';
      const value = 42;
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Cria um novo objeto para cada iteração para evitar modificações acumulativas
          ObjectUtils.unflattenObject({ obj: {}, path, value });
        }
      });

      console.log(
        `Tempo para desachatar ${count} objetos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por desachatamento deve ser menor que 0.05ms
      const avgTimePerUnflatten = executionTime / count;
      expect(avgTimePerUnflatten).toBeLessThan(0.05);
    });
  });

  describe('compressObject e decompressObject', () => {
    it('deve comprimir e descomprimir 10.000 objetos em tempo razoável', () => {
      const json = {
        id: 123456,
        name: 'Test Object',
        properties: {
          color: 'blue',
          size: 'medium',
          features: ['feature1', 'feature2', 'feature3'],
        },
        metadata: {
          created: '2023-01-01',
          modified: '2023-02-15',
          version: 2.1,
        },
      };
      const count = 10000;

      let compressedString = '';

      // Teste de compressão
      const compressionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          compressedString = ObjectUtils.compressObject({ json });
        }
      });

      console.log(
        `Tempo para comprimir ${count} objetos: ${compressionTime.toFixed(2)}ms`,
      );

      // Teste de descompressão
      const decompressionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.decompressObject({ jsonString: compressedString });
        }
      });

      console.log(
        `Tempo para descomprimir ${count} objetos: ${decompressionTime.toFixed(2)}ms`,
      );

      // O tempo médio por compressão deve ser menor que 0.05ms
      const avgTimePerCompression = compressionTime / count;
      expect(avgTimePerCompression).toBeLessThan(0.05);

      // O tempo médio por descompressão deve ser menor que 0.05ms
      const avgTimePerDecompression = decompressionTime / count;
      expect(avgTimePerDecompression).toBeLessThan(0.05);
    });
  });

  describe('compressObjectToBase64 e decompressBase64ToObject', () => {
    it('deve comprimir para Base64 e descomprimir 1.000 objetos em tempo razoável', () => {
      const json = {
        id: 123456,
        name: 'Test Object',
        properties: {
          color: 'blue',
          size: 'medium',
          features: ['feature1', 'feature2', 'feature3'],
        },
        metadata: {
          created: '2023-01-01',
          modified: '2023-02-15',
          version: 2.1,
        },
      };
      const count = 1000;

      let base64String = '';

      // Teste de compressão para Base64
      const compressionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          base64String = ObjectUtils.compressObjectToBase64({
            json,
            urlSafe: false,
          });
        }
      });

      console.log(
        `Tempo para comprimir ${count} objetos para Base64: ${compressionTime.toFixed(2)}ms`,
      );

      // Teste de descompressão de Base64
      const decompressionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.decompressBase64ToObject({ base64String });
        }
      });

      console.log(
        `Tempo para descomprimir ${count} objetos de Base64: ${decompressionTime.toFixed(2)}ms`,
      );

      // O tempo médio por compressão para Base64 deve ser menor que 0.5ms
      const avgTimePerCompression = compressionTime / count;
      expect(avgTimePerCompression).toBeLessThan(0.5);

      // O tempo médio por descompressão de Base64 deve ser menor que 0.5ms
      const avgTimePerDecompression = decompressionTime / count;
      expect(avgTimePerDecompression).toBeLessThan(0.5);
    });
  });

  describe('groupBy', () => {
    it('deve agrupar 10.000 objetos em tempo razoável', () => {
      // Cria um objeto com muitas entradas para agrupar
      const createLargeObject = (size: number): Record<string, number> => {
        const obj: Record<string, number> = {};
        for (let i = 0; i < size; i++) {
          obj[`key${i}`] = i % 5; // Cria 5 grupos diferentes
        }
        return obj;
      };

      const obj = createLargeObject(100); // 100 entradas
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.groupBy({
            obj,
            callback: value => value,
          });
        }
      });

      console.log(
        `Tempo para agrupar ${count} objetos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por agrupamento deve ser menor que 0.1ms
      const avgTimePerGroupBy = executionTime / count;
      expect(avgTimePerGroupBy).toBeLessThan(0.1);
    });
  });

  describe('diff', () => {
    it('deve encontrar diferenças entre 10.000 pares de objetos em tempo razoável', () => {
      const obj1 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const obj2 = { a: 1, b: 3, c: 3, d: 5, f: 6 };
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.diff({ obj1, obj2 });
        }
      });

      console.log(
        `Tempo para encontrar diferenças entre ${count} pares de objetos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por diferenciação deve ser menor que 0.05ms
      const avgTimePerDiff = executionTime / count;
      expect(avgTimePerDiff).toBeLessThan(0.05);
    });
  });

  describe('invert', () => {
    it('deve inverter 10.000 objetos em tempo razoável', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.invert({ obj });
        }
      });

      console.log(
        `Tempo para inverter ${count} objetos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por inversão deve ser menor que 0.05ms
      const avgTimePerInvert = executionTime / count;
      expect(avgTimePerInvert).toBeLessThan(0.05);
    });
  });

  describe('deepFreeze', () => {
    it('deve congelar profundamente 10.000 objetos em tempo razoável', () => {
      const obj = {
        a: 1,
        b: { c: 2, d: { e: 3 } },
        f: [1, 2, { g: 4 }],
      };
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Cria uma cópia para cada iteração para evitar tentar congelar um objeto já congelado
          ObjectUtils.deepFreeze({ obj: ObjectUtils.deepClone({ obj }) });
        }
      });

      console.log(
        `Tempo para congelar profundamente ${count} objetos: ${executionTime.toFixed(2)}ms`,
      );

      // O tempo médio por congelamento deve ser menor que 0.1ms
      const avgTimePerFreeze = executionTime / count;
      expect(avgTimePerFreeze).toBeLessThan(0.1);
    });
  });
});
