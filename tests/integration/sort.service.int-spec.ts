import { SortUtils } from '../../src/services/sort.service';

/**
 * Testes de integração para a classe SortUtils.
 * Estes testes verificam cenários mais complexos que envolvem múltiplos métodos.
 */
describe('SortUtils - Testes de Integração', () => {
  describe('Comparação entre algoritmos', () => {
    it('deve produzir o mesmo resultado com diferentes algoritmos', () => {
      const unsortedArray = [38, 27, 43, 3, 9, 82, 10];
      const expectedSorted = [3, 9, 10, 27, 38, 43, 82];

      // Algoritmos de comparação
      const bubbleSorted = SortUtils.bubbleSort(unsortedArray);
      const mergeSorted = SortUtils.mergeSort(unsortedArray);
      const quickSorted = SortUtils.quickSort(unsortedArray);
      const heapSorted = SortUtils.heapSort(unsortedArray);
      const selectionSorted = SortUtils.selectionSort(unsortedArray);
      const insertionSorted = SortUtils.insertionSort(unsortedArray);
      const shellSorted = SortUtils.shellSort(unsortedArray);
      const timSorted = SortUtils.timSort(unsortedArray);

      // Verificações
      expect(bubbleSorted).toEqual(expectedSorted);
      expect(mergeSorted).toEqual(expectedSorted);
      expect(quickSorted).toEqual(expectedSorted);
      expect(heapSorted).toEqual(expectedSorted);
      expect(selectionSorted).toEqual(expectedSorted);
      expect(insertionSorted).toEqual(expectedSorted);
      expect(shellSorted).toEqual(expectedSorted);
      expect(timSorted).toEqual(expectedSorted);

      // Algoritmos não-comparativos (apenas para números não-negativos)
      const positiveArray = [38, 27, 43, 3, 9, 82, 10];
      const countingSorted = SortUtils.countingSort(positiveArray, 82);
      const radixSorted = SortUtils.radixSort(positiveArray);

      expect(countingSorted).toEqual(expectedSorted);
      expect(radixSorted).toEqual(expectedSorted);
    });

    it('deve manter a estabilidade em algoritmos estáveis', () => {
      // Cria um array de objetos para testar estabilidade
      const unsortedObjects = [
        { key: 3, value: 'a' },
        { key: 1, value: 'b' },
        { key: 2, value: 'c' },
        { key: 1, value: 'd' },
        { key: 3, value: 'e' },
      ];

      // Função para ordenar por chave
      const sortByKey = <T extends { key: number }>(
        arr: T[],
        algorithm: (array: T[]) => T[],
      ): T[] => {
        // Cria uma função de comparação personalizada
        const compare = (a: T, b: T): number => a.key - b.key;

        // Substitui temporariamente o operador de comparação
        const gtSymbol = Symbol.for('>') as unknown as keyof Array<T>;
        const ltSymbol = Symbol.for('<') as unknown as keyof Array<T>;

        const originalGT = Array.prototype[gtSymbol] as any;
        const originalLT = Array.prototype[ltSymbol] as any;

        // Definindo explicitamente os tipos para evitar erros
        type CompareFunction = (this: any, other: any) => boolean;

        (Array.prototype[gtSymbol] as CompareFunction) = function (
          this: any,
          other: any,
        ): boolean {
          return compare(this, other) > 0;
        };

        (Array.prototype[ltSymbol] as CompareFunction) = function (
          this: any,
          other: any,
        ): boolean {
          return compare(this, other) < 0;
        };

        try {
          return algorithm(arr);
        } finally {
          // Restaura os operadores originais
          (Array.prototype[gtSymbol] as any) = originalGT;
          (Array.prototype[ltSymbol] as any) = originalLT;
        }
      };

      // Testa algoritmos estáveis
      const mergeSorted = sortByKey(unsortedObjects, SortUtils.mergeSort);
      const bubbleSorted = sortByKey(unsortedObjects, SortUtils.bubbleSort);
      const insertionSorted = sortByKey(
        unsortedObjects,
        SortUtils.insertionSort,
      );

      // Verifica se a ordem relativa dos elementos com a mesma chave é preservada
      expect(mergeSorted[1].value).toBe('b'); // Primeiro elemento com chave 1
      expect(mergeSorted[2].value).toBe('d'); // Segundo elemento com chave 1

      expect(bubbleSorted[1].value).toBe('b');
      expect(bubbleSorted[2].value).toBe('d');

      expect(insertionSorted[1].value).toBe('b');
      expect(insertionSorted[2].value).toBe('d');
    });
  });

  describe('Cenários de uso real', () => {
    it('deve ordenar um conjunto de dados de estudantes por nota', () => {
      const students = [
        { name: 'Alice', grade: 85 },
        { name: 'Bob', grade: 92 },
        { name: 'Charlie', grade: 78 },
        { name: 'Diana', grade: 95 },
        { name: 'Evan', grade: 88 },
      ];

      // Extrai as notas para ordenação
      const grades = students.map(student => student.grade);

      // Ordena as notas
      const sortedGrades = SortUtils.quickSort(grades);

      // Reordena os estudantes com base nas notas ordenadas
      const sortedStudents = sortedGrades.map(grade =>
        students.find(student => student.grade === grade),
      );

      // Verificações
      expect(sortedStudents[0]?.name).toBe('Charlie');
      expect(sortedStudents[1]?.name).toBe('Alice');
      expect(sortedStudents[2]?.name).toBe('Evan');
      expect(sortedStudents[3]?.name).toBe('Bob');
      expect(sortedStudents[4]?.name).toBe('Diana');
    });

    it('deve ordenar um conjunto de dados de produtos por preço', () => {
      const products = [
        { id: 1, name: 'Laptop', price: 1200 },
        { id: 2, name: 'Phone', price: 800 },
        { id: 3, name: 'Tablet', price: 500 },
        { id: 4, name: 'Smartwatch', price: 300 },
        { id: 5, name: 'Headphones', price: 150 },
      ];

      // Extrai os preços para ordenação
      const prices = products.map(product => product.price);

      // Ordena os preços (do mais barato ao mais caro)
      const sortedPrices = SortUtils.mergeSort(prices);

      // Reordena os produtos com base nos preços ordenados
      const sortedProducts = sortedPrices.map(price =>
        products.find(product => product.price === price),
      );

      // Verificações
      expect(sortedProducts[0]?.name).toBe('Headphones');
      expect(sortedProducts[1]?.name).toBe('Smartwatch');
      expect(sortedProducts[2]?.name).toBe('Tablet');
      expect(sortedProducts[3]?.name).toBe('Phone');
      expect(sortedProducts[4]?.name).toBe('Laptop');
    });

    it('deve ordenar um conjunto de datas', () => {
      const dates = [
        new Date('2023-05-15'),
        new Date('2022-12-31'),
        new Date('2023-01-01'),
        new Date('2022-06-30'),
        new Date('2023-03-10'),
      ];

      // Converte datas para timestamps para ordenação
      const timestamps = dates.map(date => date.getTime());

      // Ordena os timestamps
      const sortedTimestamps = SortUtils.heapSort(timestamps);

      // Converte timestamps ordenados de volta para datas
      const sortedDates = sortedTimestamps.map(
        timestamp => new Date(timestamp),
      );

      // Verificações
      expect(sortedDates[0].toISOString().split('T')[0]).toBe('2022-06-30');
      expect(sortedDates[1].toISOString().split('T')[0]).toBe('2022-12-31');
      expect(sortedDates[2].toISOString().split('T')[0]).toBe('2023-01-01');
      expect(sortedDates[3].toISOString().split('T')[0]).toBe('2023-03-10');
      expect(sortedDates[4].toISOString().split('T')[0]).toBe('2023-05-15');
    });
  });

  describe('Combinação de algoritmos', () => {
    it('deve usar algoritmos diferentes com base no tamanho do array', () => {
      // Função que escolhe o algoritmo com base no tamanho do array
      const smartSort = <T>(array: T[]): T[] => {
        if (array.length <= 10) {
          // Para arrays pequenos, insertion sort é eficiente
          return SortUtils.insertionSort(array);
        } else if (array.length <= 1000) {
          // Para arrays médios, quick sort é uma boa escolha
          return SortUtils.quickSort(array);
        } else {
          // Para arrays grandes, merge sort garante desempenho consistente
          return SortUtils.mergeSort(array);
        }
      };

      // Testa com arrays de diferentes tamanhos
      const smallArray = [5, 3, 8, 4, 2];
      const mediumArray = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 1000),
      );

      // Ordena os arrays
      const sortedSmall = smartSort(smallArray);
      const sortedMedium = smartSort(mediumArray);

      // Verifica se os arrays foram ordenados corretamente
      expect(sortedSmall).toEqual(SortUtils.insertionSort(smallArray));
      expect(sortedMedium).toEqual(SortUtils.quickSort(mediumArray));
    });

    it('deve usar algoritmos diferentes com base no tipo de dados', () => {
      // Arrays de diferentes tipos
      const integerArray = [38, 27, 43, 3, 9, 82, 10];
      const floatArray = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];

      // Função que escolhe o algoritmo com base no tipo de dados
      const typeBasedSort = (array: number[]): number[] => {
        // Verifica se todos os elementos são inteiros não-negativos
        const allNonNegativeIntegers = array.every(
          num => Number.isInteger(num) && num >= 0,
        );

        // Verifica se todos os elementos são entre 0 e 1
        const allBetweenZeroAndOne = array.every(num => num >= 0 && num <= 1);

        if (allNonNegativeIntegers) {
          // Para inteiros não-negativos, counting sort é eficiente
          const max = Math.max(...array);
          return SortUtils.countingSort(array, max);
        } else if (allBetweenZeroAndOne) {
          // Para números entre 0 e 1, bucket sort é uma boa escolha
          return SortUtils.bucketSort(array);
        } else {
          // Para outros casos, merge sort é seguro
          return SortUtils.mergeSort(array);
        }
      };

      // Ordena os arrays
      const sortedIntegers = typeBasedSort(integerArray);
      const sortedFloats = typeBasedSort(floatArray);

      // Verifica se os arrays foram ordenados corretamente
      expect(sortedIntegers).toEqual([3, 9, 10, 27, 38, 43, 82]);
      expect(sortedFloats).toEqual([0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52]);
    });
  });
});