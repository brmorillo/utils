export class SortUtils {
  /**
   * Bubble Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static bubbleSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }

  /**
   * Merge Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static mergeSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    if (array.length <= 1) return array;

    const mid = Math.floor(array.length / 2);
    const left = SortUtils.mergeSort(array.slice(0, mid));
    const right = SortUtils.mergeSort(array.slice(mid));

    return SortUtils.merge(left, right);
  }

  private static merge<T>(left: T[], right: T[]): T[] {
    const result: T[] = [];
    while (left.length && right.length) {
      if (left[0] < right[0]) {
        result.push(left.shift()!);
      } else {
        result.push(right.shift()!);
      }
    }
    return [...result, ...left, ...right];
  }

  /**
   * Quick Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static quickSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    if (array.length <= 1) return array;

    const pivot = array[array.length - 1];
    const left = array.filter(
      (val, idx) => val <= pivot && idx !== array.length - 1,
    );
    const right = array.filter((val) => val > pivot);

    return [...SortUtils.quickSort(left), pivot, ...SortUtils.quickSort(right)];
  }

  /**
   * Heap Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static heapSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];

    const heapify = (n: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && arr[left] > arr[largest]) largest = left;
      if (right < n && arr[right] > arr[largest]) largest = right;

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(n, largest);
      }
    };

    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heapify(arr.length, i);
    }

    for (let i = arr.length - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      heapify(i, 0);
    }

    return arr;
  }

  /**
   * Selection Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static selectionSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }
    }
    return arr;
  }

  /**
   * Insertion Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static insertionSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      const current = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > current) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = current;
    }
    return arr;
  }

  /**
   * Shell Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static shellSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];
    let gap = Math.floor(arr.length / 2);

    while (gap > 0) {
      for (let i = gap; i < arr.length; i++) {
        const temp = arr[i];
        let j = i;

        while (j >= gap && arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          j -= gap;
        }
        arr[j] = temp;
      }
      gap = Math.floor(gap / 2);
    }

    return arr;
  }

  /**
   * Counting Sort
   * @param array Array of integers to sort
   * @param maxValue Maximum value in the array
   * @returns Sorted array
   */
  static countingSort(array: number[], maxValue: number): number[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');
    if (array.some((num) => num < 0))
      throw new Error('Counting Sort only supports non-negative integers');
    if (!Number.isInteger(maxValue) || maxValue < 0)
      throw new Error('Maximum value must be a non-negative integer');

    const count = new Array(maxValue + 1).fill(0);
    const output = new Array(array.length);

    for (const num of array) {
      count[num]++;
    }

    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }

    for (let i = array.length - 1; i >= 0; i--) {
      output[count[array[i]] - 1] = array[i];
      count[array[i]]--;
    }

    return output;
  }

  /**
   * Radix Sort
   * @param array Array of non-negative integers to sort
   * @returns Sorted array
   */
  static radixSort(array: number[]): number[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');
    if (array.length === 0) return [];
    if (array.some((num) => num < 0))
      throw new Error('Radix Sort only supports non-negative integers');

    const max = Math.max(...array);
    let exp = 1;

    const countingSortForRadix = (arr: number[], exp: number): number[] => {
      const output = new Array(arr.length).fill(0);
      const count = new Array(10).fill(0);

      for (const num of arr) {
        const digit = Math.floor(num / exp) % 10;
        count[digit]++;
      }

      for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
      }

      for (let i = arr.length - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
      }

      return output;
    };

    while (Math.floor(max / exp) > 0) {
      array = countingSortForRadix(array, exp);
      exp *= 10;
    }

    return array;
  }

  /**
   * Bucket Sort
   * @param array Array of floating-point numbers to sort
   * @param bucketSize Size of each bucket
   * @returns Sorted array
   */
  static bucketSort(array: number[], bucketSize = 5): number[] {
    if (array.length <= 1) return array;

    const minValue = Math.min(...array);
    const maxValue = Math.max(...array);
    const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    for (const num of array) {
      const bucketIndex = Math.floor((num - minValue) / bucketSize);
      buckets[bucketIndex].push(num);
    }

    return buckets.reduce((sortedArray, bucket) => {
      return sortedArray.concat(SortUtils.insertionSort(bucket));
    }, []);
  }

  /**
   * Tim Sort (Basic Implementation)
   * @param array Array to sort
   * @returns Sorted array
   */
  static timSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const RUN = 32;

    const insertionSort = (arr: T[], left: number, right: number) => {
      for (let i = left + 1; i <= right; i++) {
        const temp = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > temp) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = temp;
      }
    };

    const merge = (arr: T[], l: number, m: number, r: number) => {
      const len1 = m - l + 1;
      const len2 = r - m;
      const left = new Array(len1);
      const right = new Array(len2);

      for (let i = 0; i < len1; i++) left[i] = arr[l + i];
      for (let i = 0; i < len2; i++) right[i] = arr[m + 1 + i];

      let i = 0,
        j = 0,
        k = l;

      while (i < len1 && j < len2) {
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
        }
        k++;
      }

      while (i < len1) {
        arr[k] = left[i];
        i++;
        k++;
      }

      while (j < len2) {
        arr[k] = right[j];
        j++;
        k++;
      }
    };

    const n = array.length;
    for (let i = 0; i < n; i += RUN) {
      insertionSort(array, i, Math.min(i + RUN - 1, n - 1));
    }

    for (let size = RUN; size < n; size = 2 * size) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = left + size - 1;
        const right = Math.min(left + 2 * size - 1, n - 1);

        if (mid < right) {
          merge(array, left, mid, right);
        }
      }
    }

    return array;
  }

  /**
   * Bogo Sort
   * @param array Array to sort
   * @returns Sorted array
   * @note Highly inefficient, only for educational purposes.
   */
  static bogoSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');
    if (array.length <= 1) return [...array];

    const isSorted = (arr: T[]): boolean => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] > arr[i]) return false;
      }
      return true;
    };

    const shuffle = (arr: T[]): void => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    };

    const arr = [...array];
    while (!isSorted(arr)) {
      shuffle(arr);
    }
    return arr;
  }

  /**
   * Gnome Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static gnomeSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];
    let index = 0;

    while (index < arr.length) {
      if (index === 0 || arr[index] >= arr[index - 1]) {
        index++;
      } else {
        [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
        index--;
      }
    }

    return arr;
  }

  /**
   * Pancake Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static pancakeSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];

    const flip = (arr: T[], k: number): void => {
      let start = 0;
      while (start < k) {
        [arr[start], arr[k]] = [arr[k], arr[start]];
        start++;
        k--;
      }
    };

    for (let i = arr.length - 1; i > 0; i--) {
      let maxIndex = 0;
      for (let j = 1; j <= i; j++) {
        if (arr[j] > arr[maxIndex]) {
          maxIndex = j;
        }
      }

      if (maxIndex !== i) {
        flip(arr, maxIndex);
        flip(arr, i);
      }
    }

    return arr;
  }

  /**
   * Comb Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static combSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];
    const shrinkFactor = 1.3;
    let gap = arr.length;
    let sorted = false;

    while (!sorted) {
      gap = Math.floor(gap / shrinkFactor);
      if (gap <= 1) {
        gap = 1;
        sorted = true;
      }

      for (let i = 0; i + gap < arr.length; i++) {
        if (arr[i] > arr[i + gap]) {
          [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
          sorted = false;
        }
      }
    }

    return arr;
  }
  /**
   * Cocktail Shaker Sort
   * @param array Array to sort
   * @returns Sorted array
   */
  static cocktailShakerSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;

    while (swapped) {
      swapped = false;

      // Forward pass
      for (let i = start; i < end; i++) {
        if (arr[i] > arr[i + 1]) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          swapped = true;
        }
      }
      end--;

      // Backward pass
      for (let i = end; i > start; i--) {
        if (arr[i] < arr[i - 1]) {
          [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
          swapped = true;
        }
      }
      start++;
    }

    return arr;
  }

  /**
   * Bitonic Sort
   * @param array Array to sort
   * @returns Sorted array
   * @note Typically used in parallel computing environments.
   */
  static bitonicSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];

    const compareAndSwap = (
      arr: T[],
      i: number,
      j: number,
      ascending: boolean,
    ) => {
      if (arr[i] > arr[j] === ascending) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    };

    const bitonicMerge = (
      arr: T[],
      low: number,
      count: number,
      ascending: boolean,
    ) => {
      if (count > 1) {
        const mid = Math.floor(count / 2);
        for (let i = low; i < low + mid; i++) {
          compareAndSwap(arr, i, i + mid, ascending);
        }
        bitonicMerge(arr, low, mid, ascending);
        bitonicMerge(arr, low + mid, mid, ascending);
      }
    };

    const bitonicSortRecursive = (
      arr: T[],
      low: number,
      count: number,
      ascending: boolean,
    ) => {
      if (count > 1) {
        const mid = Math.floor(count / 2);
        bitonicSortRecursive(arr, low, mid, true);
        bitonicSortRecursive(arr, low + mid, mid, false);
        bitonicMerge(arr, low, count, ascending);
      }
    };

    bitonicSortRecursive(arr, 0, arr.length, true);
    return arr;
  }

  /**
   * Stooge Sort
   * @param array Array to sort
   * @returns Sorted array
   * @note Inefficient and mainly used for educational purposes.
   */
  static stoogeSort<T>(array: T[]): T[] {
    if (!Array.isArray(array)) throw new Error('Input must be an array');

    const arr = [...array];

    const stoogeSortRecursive = (arr: T[], start: number, end: number) => {
      if (arr[start] > arr[end]) {
        [arr[start], arr[end]] = [arr[end], arr[start]];
      }

      if (end - start + 1 > 2) {
        const third = Math.floor((end - start + 1) / 3);
        stoogeSortRecursive(arr, start, end - third);
        stoogeSortRecursive(arr, start + third, end);
        stoogeSortRecursive(arr, start, end - third);
      }
    };

    stoogeSortRecursive(arr, 0, arr.length - 1);
    return arr;
  }
}
