# SortUtils

The SortUtils class provides a collection of classic sorting algorithms. Most methods are generic and return a new sorted array. Like the rest of the library, these methods take a single destructured object argument.

## Basic Usage

```javascript
import { SortUtils } from '@brmorillo/utils';

// Sort an array with Quick Sort
const sorted = SortUtils.quickSort({ array: [5, 2, 9, 1, 7] });
console.log(sorted); // [1, 2, 5, 7, 9]

// Sort with Merge Sort
const merged = SortUtils.mergeSort({ array: [3, 1, 4, 1, 5] });
console.log(merged); // [1, 1, 3, 4, 5]

// Counting Sort for non-negative integers
const counted = SortUtils.countingSort({ array: [4, 2, 2, 8, 3], maxValue: 8 });
console.log(counted); // [2, 2, 3, 4, 8]
```

## Methods

### bubbleSort({ array })

Sorts an array using Bubble Sort. Stable, in-place. O(n²) average. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.bubbleSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### mergeSort({ array })

Sorts an array using Merge Sort (divide and conquer). Stable. O(n log n). Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.mergeSort({ array: [3, 1, 4, 1, 5] }); // [1, 1, 3, 4, 5]
```

### quickSort({ array })

Sorts an array using Quick Sort (divide and conquer). O(n log n) average. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.quickSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### heapSort({ array })

Sorts an array using Heap Sort (binary heaps). O(n log n). Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.heapSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### selectionSort({ array })

Sorts an array using Selection Sort. O(n²) for all cases. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.selectionSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### insertionSort({ array })

Sorts an array using Insertion Sort. Stable, efficient for small or nearly sorted lists. O(n²) average. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.insertionSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### shellSort({ array })

Sorts an array using Shell Sort (gap-based generalization of Insertion Sort). Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.shellSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### countingSort({ array, maxValue })

Sorts an array of non-negative integers using Counting Sort. Requires `maxValue`, the maximum value present in the array. Throws `ValidationError` if the input is not an array, contains negative numbers, or if `maxValue` is not a non-negative integer.

```javascript
SortUtils.countingSort({ array: [4, 2, 2, 8, 3], maxValue: 8 }); // [2, 2, 3, 4, 8]
```

### radixSort({ array })

Sorts an array of non-negative integers using Radix Sort (digit by digit). Stable. O(nk). Throws `ValidationError` if the input is not an array or contains negative numbers.

```javascript
SortUtils.radixSort({ array: [170, 45, 75, 90, 2, 802] }); // [2, 45, 75, 90, 170, 802]
```

### bucketSort({ array, bucketSize? })

Sorts an array of numbers using Bucket Sort. `bucketSize` is optional and defaults to `5`. Works well for uniformly distributed data.

```javascript
SortUtils.bucketSort({ array: [0.42, 0.32, 0.73, 0.12] }); // [0.12, 0.32, 0.42, 0.73]
SortUtils.bucketSort({ array: [29, 25, 3, 49, 9, 37], bucketSize: 10 }); // [3, 9, 25, 29, 37, 49]
```

### timSort({ array })

Sorts an array using Tim Sort (a hybrid of Merge Sort and Insertion Sort). Stable. O(n log n). Note: this implementation sorts the array in place and returns it.

```javascript
SortUtils.timSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### bogoSort({ array })

Sorts an array using Bogo Sort by randomly shuffling until sorted. Extremely inefficient (O(n!)) — for educational purposes only. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.bogoSort({ array: [3, 1, 2] }); // [1, 2, 3]
```

### gnomeSort({ array })

Sorts an array using Gnome Sort (a single-loop variation of Insertion Sort). Stable. O(n²) average. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.gnomeSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### pancakeSort({ array })

Sorts an array using Pancake Sort by repeatedly flipping subarrays. O(n²). Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.pancakeSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### combSort({ array })

Sorts an array using Comb Sort (an improvement over Bubble Sort using shrinking gaps). Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.combSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### cocktailShakerSort({ array })

Sorts an array using Cocktail Shaker Sort (a bi-directional Bubble Sort). Stable. O(n²) average. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.cocktailShakerSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### bitonicSort({ array })

Sorts an array using Bitonic Sort. O(n log² n). Designed for parallel systems. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.bitonicSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### stoogeSort({ array })

Sorts an array using Stooge Sort (a recursive, highly inefficient algorithm for academic use). O(n^2.71). Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.stoogeSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```
