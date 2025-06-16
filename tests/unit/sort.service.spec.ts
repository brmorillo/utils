import { SortUtils } from '../../src/services/sort.service';

/**
 * Testes unitários para a classe SortUtils.
 * Estes testes verificam o comportamento de cada método individualmente.
 */
describe('SortUtils - Testes Unitários', () => {
  // Arrays de teste
  const unsortedArray = [5, 3, 8, 4, 2];
  const sortedArray = [2, 3, 4, 5, 8];
  const emptyArray: number[] = [];
  const singleElementArray = [42];
  const duplicatesArray = [3, 1, 4, 1, 5, 9, 2, 6, 5];
  const sortedDuplicatesArray = [1, 1, 2, 3, 4, 5, 5, 6, 9];
  const negativeArray = [-5, -3, -8, -4, -2];
  const sortedNegativeArray = [-8, -5, -4, -3, -2];
  const mixedArray = [5, -3, 8, -4, 2, 0];
  const sortedMixedArray = [-4, -3, 0, 2, 5, 8];

  describe('bubbleSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.bubbleSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve manter um array já ordenado', () => {
      expect(SortUtils.bubbleSort(sortedArray)).toEqual(sortedArray);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.bubbleSort(emptyArray)).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.bubbleSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('deve ordenar um array com elementos duplicados', () => {
      expect(SortUtils.bubbleSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('deve ordenar um array com números negativos', () => {
      expect(SortUtils.bubbleSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('deve ordenar um array com números mistos', () => {
      expect(SortUtils.bubbleSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.bubbleSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('mergeSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.mergeSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve manter um array já ordenado', () => {
      expect(SortUtils.mergeSort(sortedArray)).toEqual(sortedArray);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.mergeSort(emptyArray)).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.mergeSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('deve ordenar um array com elementos duplicados', () => {
      expect(SortUtils.mergeSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('deve ordenar um array com números negativos', () => {
      expect(SortUtils.mergeSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('deve ordenar um array com números mistos', () => {
      expect(SortUtils.mergeSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.mergeSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('quickSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.quickSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve manter um array já ordenado', () => {
      expect(SortUtils.quickSort(sortedArray)).toEqual(sortedArray);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.quickSort(emptyArray)).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.quickSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('deve ordenar um array com elementos duplicados', () => {
      expect(SortUtils.quickSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('deve ordenar um array com números negativos', () => {
      expect(SortUtils.quickSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('deve ordenar um array com números mistos', () => {
      expect(SortUtils.quickSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.quickSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('heapSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.heapSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve manter um array já ordenado', () => {
      expect(SortUtils.heapSort(sortedArray)).toEqual(sortedArray);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.heapSort(emptyArray)).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.heapSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('deve ordenar um array com elementos duplicados', () => {
      expect(SortUtils.heapSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('deve ordenar um array com números negativos', () => {
      expect(SortUtils.heapSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('deve ordenar um array com números mistos', () => {
      expect(SortUtils.heapSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.heapSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('selectionSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.selectionSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve manter um array já ordenado', () => {
      expect(SortUtils.selectionSort(sortedArray)).toEqual(sortedArray);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.selectionSort(emptyArray)).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.selectionSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('deve ordenar um array com elementos duplicados', () => {
      expect(SortUtils.selectionSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('deve ordenar um array com números negativos', () => {
      expect(SortUtils.selectionSort(negativeArray)).toEqual(
        sortedNegativeArray,
      );
    });

    it('deve ordenar um array com números mistos', () => {
      expect(SortUtils.selectionSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.selectionSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('insertionSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.insertionSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve manter um array já ordenado', () => {
      expect(SortUtils.insertionSort(sortedArray)).toEqual(sortedArray);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.insertionSort(emptyArray)).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.insertionSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('deve ordenar um array com elementos duplicados', () => {
      expect(SortUtils.insertionSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('deve ordenar um array com números negativos', () => {
      expect(SortUtils.insertionSort(negativeArray)).toEqual(
        sortedNegativeArray,
      );
    });

    it('deve ordenar um array com números mistos', () => {
      expect(SortUtils.insertionSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.insertionSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('shellSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.shellSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve manter um array já ordenado', () => {
      expect(SortUtils.shellSort(sortedArray)).toEqual(sortedArray);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.shellSort(emptyArray)).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.shellSort(singleElementArray)).toEqual(
        singleElementArray,
      );
    });

    it('deve ordenar um array com elementos duplicados', () => {
      expect(SortUtils.shellSort(duplicatesArray)).toEqual(
        sortedDuplicatesArray,
      );
    });

    it('deve ordenar um array com números negativos', () => {
      expect(SortUtils.shellSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('deve ordenar um array com números mistos', () => {
      expect(SortUtils.shellSort(mixedArray)).toEqual(sortedMixedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.shellSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('countingSort', () => {
    it('deve ordenar um array de números não negativos', () => {
      const unsortedPositive = [5, 3, 8, 4, 2];
      const sortedPositive = [2, 3, 4, 5, 8];
      expect(SortUtils.countingSort(unsortedPositive, 8)).toEqual(
        sortedPositive,
      );
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.countingSort([], 0)).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.countingSort([42], 42)).toEqual([42]);
    });

    it('deve ordenar um array com elementos duplicados', () => {
      const unsortedDuplicates = [3, 1, 4, 1, 5, 9, 2, 6, 5];
      const sortedDuplicates = [1, 1, 2, 3, 4, 5, 5, 6, 9];
      expect(SortUtils.countingSort(unsortedDuplicates, 9)).toEqual(
        sortedDuplicates,
      );
    });

    it('deve lançar erro para array com números negativos', () => {
      expect(() => {
        SortUtils.countingSort([-5, 3, 8], 8);
      }).toThrow('Counting Sort only supports non-negative integers');
    });

    it('deve lançar erro para maxValue negativo', () => {
      expect(() => {
        SortUtils.countingSort([5, 3, 8], -1);
      }).toThrow('Maximum value must be a non-negative integer');
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.countingSort(123, 10);
      }).toThrow('Input must be an array');
    });
  });

  describe('radixSort', () => {
    it('deve ordenar um array de números não negativos', () => {
      const unsortedPositive = [170, 45, 75, 90, 802, 24, 2, 66];
      const sortedPositive = [2, 24, 45, 66, 75, 90, 170, 802];
      expect(SortUtils.radixSort(unsortedPositive)).toEqual(sortedPositive);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.radixSort([])).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.radixSort([42])).toEqual([42]);
    });

    it('deve ordenar um array com elementos duplicados', () => {
      const unsortedDuplicates = [53, 11, 44, 11, 55, 99, 22, 66, 55];
      const sortedDuplicates = [11, 11, 22, 44, 53, 55, 55, 66, 99];
      expect(SortUtils.radixSort(unsortedDuplicates)).toEqual(sortedDuplicates);
    });

    it('deve lançar erro para array com números negativos', () => {
      expect(() => {
        SortUtils.radixSort([-5, 3, 8]);
      }).toThrow('Radix Sort only supports non-negative integers');
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.radixSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('bucketSort', () => {
    it('deve ordenar um array de números', () => {
      const unsorted = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];
      const sorted = [0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52];
      expect(SortUtils.bucketSort(unsorted)).toEqual(sorted);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.bucketSort([])).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.bucketSort([42])).toEqual([42]);
    });

    it('deve ordenar um array com elementos duplicados', () => {
      const unsortedDuplicates = [0.5, 0.3, 0.4, 0.3, 0.5];
      const sortedDuplicates = [0.3, 0.3, 0.4, 0.5, 0.5];
      expect(SortUtils.bucketSort(unsortedDuplicates)).toEqual(
        sortedDuplicates,
      );
    });

    it('deve ordenar com tamanho de bucket personalizado', () => {
      const unsorted = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];
      const sorted = [0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52];
      expect(SortUtils.bucketSort(unsorted, 3)).toEqual(sorted);
    });
  });

  describe('timSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.timSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve manter um array já ordenado', () => {
      expect(SortUtils.timSort(sortedArray)).toEqual(sortedArray);
    });

    it('deve lidar com um array vazio', () => {
      expect(SortUtils.timSort(emptyArray)).toEqual([]);
    });

    it('deve lidar com um array de um único elemento', () => {
      expect(SortUtils.timSort(singleElementArray)).toEqual(singleElementArray);
    });

    it('deve ordenar um array com elementos duplicados', () => {
      expect(SortUtils.timSort(duplicatesArray)).toEqual(sortedDuplicatesArray);
    });

    it('deve ordenar um array com números negativos', () => {
      expect(SortUtils.timSort(negativeArray)).toEqual(sortedNegativeArray);
    });

    it('deve ordenar um array com números mistos', () => {
      expect(SortUtils.timSort(mixedArray)).toEqual(sortedMixedArray);
    });
  });

  // Testes para algoritmos menos comuns
  describe('gnomeSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.gnomeSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.gnomeSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('combSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.combSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.combSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('cocktailShakerSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.cocktailShakerSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.cocktailShakerSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('pancakeSort', () => {
    it('deve ordenar um array não ordenado', () => {
      expect(SortUtils.pancakeSort(unsortedArray)).toEqual(sortedArray);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.pancakeSort(123);
      }).toThrow('Input must be an array');
    });
  });

  describe('bitonicSort', () => {
    it('deve ordenar um array não ordenado', () => {
      // Bitonic sort funciona melhor com arrays de tamanho 2^n
      const unsortedBitonic = [5, 3, 8, 4, 2, 9, 1, 7];
      const sortedBitonic = [1, 2, 3, 4, 5, 7, 8, 9];
      expect(SortUtils.bitonicSort(unsortedBitonic)).toEqual(sortedBitonic);
    });

    it('deve lançar erro para entrada não-array', () => {
      expect(() => {
        // @ts-ignore - Testando propositalmente com valor inválido
        SortUtils.bitonicSort(123);
      }).toThrow('Input must be an array');
    });
  });
});
