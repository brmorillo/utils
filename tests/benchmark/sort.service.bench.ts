import { SortUtils } from '../../src/services/sort.service';

/**
 * Testes de benchmark para a classe SortUtils.
 * Estes testes verificam o desempenho da classe em operações de alta frequência.
 */
describe('SortUtils - Testes de Benchmark', () => {
  // Função auxiliar para medir o tempo de execução
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Converte para milissegundos
  };

  // Função para gerar arrays aleatórios
  const generateRandomArray = (size: number, max: number = 1000): number[] => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * max));
  };

  // Função para gerar arrays quase ordenados
  const generateNearlySortedArray = (size: number, swaps: number): number[] => {
    const arr = Array.from({ length: size }, (_, i) => i);
    for (let i = 0; i < swaps; i++) {
      const idx1 = Math.floor(Math.random() * size);
      const idx2 = Math.floor(Math.random() * size);
      [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
    }
    return arr;
  };

  // Função para gerar arrays em ordem reversa
  const generateReverseSortedArray = (size: number): number[] => {
    return Array.from({ length: size }, (_, i) => size - i - 1);
  };

  describe('Desempenho com arrays pequenos (100 elementos)', () => {
    const size = 100;
    let randomArray: number[];
    let nearlySortedArray: number[];
    let reverseSortedArray: number[];

    beforeEach(() => {
      randomArray = generateRandomArray(size);
      nearlySortedArray = generateNearlySortedArray(size, 10);
      reverseSortedArray = generateReverseSortedArray(size);
    });

    it('deve medir o desempenho do bubbleSort', () => {
      const randomTime = measureExecutionTime(() => {
        SortUtils.bubbleSort(randomArray);
      });

      const nearlySortedTime = measureExecutionTime(() => {
        SortUtils.bubbleSort(nearlySortedArray);
      });

      const reverseSortedTime = measureExecutionTime(() => {
        SortUtils.bubbleSort(reverseSortedArray);
      });

      console.log(`BubbleSort (${size} elementos):`);
      console.log(`  - Array aleatório: ${randomTime.toFixed(2)}ms`);
      console.log(`  - Array quase ordenado: ${nearlySortedTime.toFixed(2)}ms`);
      console.log(
        `  - Array em ordem reversa: ${reverseSortedTime.toFixed(2)}ms`,
      );

      expect(randomTime).toBeLessThan(100);
      expect(nearlySortedTime).toBeLessThan(100);
      expect(reverseSortedTime).toBeLessThan(100);
    });

    it('deve medir o desempenho do quickSort', () => {
      const randomTime = measureExecutionTime(() => {
        SortUtils.quickSort(randomArray);
      });

      const nearlySortedTime = measureExecutionTime(() => {
        SortUtils.quickSort(nearlySortedArray);
      });

      const reverseSortedTime = measureExecutionTime(() => {
        SortUtils.quickSort(reverseSortedArray);
      });

      console.log(`QuickSort (${size} elementos):`);
      console.log(`  - Array aleatório: ${randomTime.toFixed(2)}ms`);
      console.log(`  - Array quase ordenado: ${nearlySortedTime.toFixed(2)}ms`);
      console.log(
        `  - Array em ordem reversa: ${reverseSortedTime.toFixed(2)}ms`,
      );

      expect(randomTime).toBeLessThan(50);
      expect(nearlySortedTime).toBeLessThan(50);
      expect(reverseSortedTime).toBeLessThan(50);
    });

    it('deve medir o desempenho do mergeSort', () => {
      const randomTime = measureExecutionTime(() => {
        SortUtils.mergeSort(randomArray);
      });

      const nearlySortedTime = measureExecutionTime(() => {
        SortUtils.mergeSort(nearlySortedArray);
      });

      const reverseSortedTime = measureExecutionTime(() => {
        SortUtils.mergeSort(reverseSortedArray);
      });

      console.log(`MergeSort (${size} elementos):`);
      console.log(`  - Array aleatório: ${randomTime.toFixed(2)}ms`);
      console.log(`  - Array quase ordenado: ${nearlySortedTime.toFixed(2)}ms`);
      console.log(
        `  - Array em ordem reversa: ${reverseSortedTime.toFixed(2)}ms`,
      );

      expect(randomTime).toBeLessThan(50);
      expect(nearlySortedTime).toBeLessThan(50);
      expect(reverseSortedTime).toBeLessThan(50);
    });

    it('deve medir o desempenho do heapSort', () => {
      const randomTime = measureExecutionTime(() => {
        SortUtils.heapSort(randomArray);
      });

      const nearlySortedTime = measureExecutionTime(() => {
        SortUtils.heapSort(nearlySortedArray);
      });

      const reverseSortedTime = measureExecutionTime(() => {
        SortUtils.heapSort(reverseSortedArray);
      });

      console.log(`HeapSort (${size} elementos):`);
      console.log(`  - Array aleatório: ${randomTime.toFixed(2)}ms`);
      console.log(`  - Array quase ordenado: ${nearlySortedTime.toFixed(2)}ms`);
      console.log(
        `  - Array em ordem reversa: ${reverseSortedTime.toFixed(2)}ms`,
      );

      expect(randomTime).toBeLessThan(50);
      expect(nearlySortedTime).toBeLessThan(50);
      expect(reverseSortedTime).toBeLessThan(50);
    });
  });

  describe('Desempenho com arrays médios (1.000 elementos)', () => {
    const size = 1000;
    let randomArray: number[];

    beforeEach(() => {
      randomArray = generateRandomArray(size);
    });

    it('deve medir o desempenho de algoritmos eficientes', () => {
      const quickSortTime = measureExecutionTime(() => {
        SortUtils.quickSort(randomArray);
      });

      const mergeSortTime = measureExecutionTime(() => {
        SortUtils.mergeSort(randomArray);
      });

      const heapSortTime = measureExecutionTime(() => {
        SortUtils.heapSort(randomArray);
      });

      const timSortTime = measureExecutionTime(() => {
        SortUtils.timSort(randomArray);
      });

      console.log(`Algoritmos eficientes (${size} elementos):`);
      console.log(`  - QuickSort: ${quickSortTime.toFixed(2)}ms`);
      console.log(`  - MergeSort: ${mergeSortTime.toFixed(2)}ms`);
      console.log(`  - HeapSort: ${heapSortTime.toFixed(2)}ms`);
      console.log(`  - TimSort: ${timSortTime.toFixed(2)}ms`);

      expect(quickSortTime).toBeLessThan(100);
      expect(mergeSortTime).toBeLessThan(100);
      expect(heapSortTime).toBeLessThan(100);
      expect(timSortTime).toBeLessThan(100);
    });

    it('deve medir o desempenho de algoritmos O(n²)', () => {
      // Usamos um array menor para algoritmos O(n²)
      const smallerArray = generateRandomArray(200);

      const insertionSortTime = measureExecutionTime(() => {
        SortUtils.insertionSort(smallerArray);
      });

      const selectionSortTime = measureExecutionTime(() => {
        SortUtils.selectionSort(smallerArray);
      });

      const bubbleSortTime = measureExecutionTime(() => {
        SortUtils.bubbleSort(smallerArray);
      });

      console.log(`Algoritmos O(n²) (200 elementos):`);
      console.log(`  - InsertionSort: ${insertionSortTime.toFixed(2)}ms`);
      console.log(`  - SelectionSort: ${selectionSortTime.toFixed(2)}ms`);
      console.log(`  - BubbleSort: ${bubbleSortTime.toFixed(2)}ms`);

      expect(insertionSortTime).toBeLessThan(100);
      expect(selectionSortTime).toBeLessThan(100);
      expect(bubbleSortTime).toBeLessThan(100);
    });

    it('deve medir o desempenho de algoritmos não-comparativos', () => {
      // Gera array de inteiros não-negativos para counting e radix sort
      const positiveArray = generateRandomArray(size, 1000);

      const countingSortTime = measureExecutionTime(() => {
        SortUtils.countingSort(positiveArray, 1000);
      });

      const radixSortTime = measureExecutionTime(() => {
        SortUtils.radixSort(positiveArray);
      });

      // Gera array de números entre 0 e 1 para bucket sort
      const floatArray = Array.from({ length: size }, () => Math.random());

      const bucketSortTime = measureExecutionTime(() => {
        SortUtils.bucketSort(floatArray);
      });

      console.log(`Algoritmos não-comparativos (${size} elementos):`);
      console.log(`  - CountingSort: ${countingSortTime.toFixed(2)}ms`);
      console.log(`  - RadixSort: ${radixSortTime.toFixed(2)}ms`);
      console.log(`  - BucketSort: ${bucketSortTime.toFixed(2)}ms`);

      expect(countingSortTime).toBeLessThan(100);
      expect(radixSortTime).toBeLessThan(100);
      expect(bucketSortTime).toBeLessThan(100);
    });
  });

  describe('Desempenho com arrays grandes (10.000 elementos)', () => {
    const size = 10000;
    let randomArray: number[];

    beforeEach(() => {
      randomArray = generateRandomArray(size);
    });

    it('deve medir o desempenho de algoritmos eficientes com arrays grandes', () => {
      const quickSortTime = measureExecutionTime(() => {
        SortUtils.quickSort(randomArray);
      });

      const mergeSortTime = measureExecutionTime(() => {
        SortUtils.mergeSort(randomArray);
      });

      const heapSortTime = measureExecutionTime(() => {
        SortUtils.heapSort(randomArray);
      });

      console.log(`Algoritmos eficientes (${size} elementos):`);
      console.log(`  - QuickSort: ${quickSortTime.toFixed(2)}ms`);
      console.log(`  - MergeSort: ${mergeSortTime.toFixed(2)}ms`);
      console.log(`  - HeapSort: ${heapSortTime.toFixed(2)}ms`);

      expect(quickSortTime).toBeLessThan(1000);
      expect(mergeSortTime).toBeLessThan(1000);
      expect(heapSortTime).toBeLessThan(1000);
    });

    it('deve medir o desempenho de algoritmos não-comparativos com arrays grandes', () => {
      // Gera array de inteiros não-negativos para counting e radix sort
      const positiveArray = generateRandomArray(size, 1000);

      const countingSortTime = measureExecutionTime(() => {
        SortUtils.countingSort(positiveArray, 1000);
      });

      const radixSortTime = measureExecutionTime(() => {
        SortUtils.radixSort(positiveArray);
      });

      console.log(`Algoritmos não-comparativos (${size} elementos):`);
      console.log(`  - CountingSort: ${countingSortTime.toFixed(2)}ms`);
      console.log(`  - RadixSort: ${radixSortTime.toFixed(2)}ms`);

      expect(countingSortTime).toBeLessThan(1000);
      expect(radixSortTime).toBeLessThan(1000);
    });
  });

  describe('Comparação de desempenho em diferentes cenários', () => {
    it('deve comparar algoritmos em arrays quase ordenados', () => {
      const size = 1000;
      const swaps = 50; // 5% de elementos fora de ordem
      const nearlySortedArray = generateNearlySortedArray(size, swaps);

      const insertionSortTime = measureExecutionTime(() => {
        SortUtils.insertionSort(nearlySortedArray);
      });

      const quickSortTime = measureExecutionTime(() => {
        SortUtils.quickSort(nearlySortedArray);
      });

      const mergeSortTime = measureExecutionTime(() => {
        SortUtils.mergeSort(nearlySortedArray);
      });

      console.log(
        `Arrays quase ordenados (${size} elementos, ${swaps} trocas):`,
      );
      console.log(`  - InsertionSort: ${insertionSortTime.toFixed(2)}ms`);
      console.log(`  - QuickSort: ${quickSortTime.toFixed(2)}ms`);
      console.log(`  - MergeSort: ${mergeSortTime.toFixed(2)}ms`);

      // InsertionSort deve ser eficiente para arrays quase ordenados
      expect(insertionSortTime).toBeLessThan(100);
    });

    it('deve comparar algoritmos em arrays com muitos elementos duplicados', () => {
      const size = 1000;
      // Gera array com apenas 10 valores diferentes
      const duplicatesArray = Array.from({ length: size }, () =>
        Math.floor(Math.random() * 10),
      );

      const quickSortTime = measureExecutionTime(() => {
        SortUtils.quickSort(duplicatesArray);
      });

      const countingSortTime = measureExecutionTime(() => {
        SortUtils.countingSort(duplicatesArray, 9);
      });

      console.log(`Arrays com muitos duplicados (${size} elementos):`);
      console.log(`  - QuickSort: ${quickSortTime.toFixed(2)}ms`);
      console.log(`  - CountingSort: ${countingSortTime.toFixed(2)}ms`);

      // CountingSort deve ser muito eficiente para arrays com poucos valores distintos
      expect(countingSortTime).toBeLessThan(quickSortTime * 2);
    });
  });
});
