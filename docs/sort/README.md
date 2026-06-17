# SortUtils

The SortUtils class provides a collection of classic sorting algorithms. Most methods are generic and return a new sorted array. Like the rest of the library, these methods take a single destructured object argument.

## Mutability

By default every sort is **non-mutating**: the caller's `array` is left untouched and a **new** sorted array is returned.

Pass `inPlace: true` to sort the caller's array in place; in that case the input is mutated and the **same array reference** is returned. This option is available on every sort method.

```javascript
const input = [5, 2, 9, 1, 7];

// Default: input is untouched, a new array is returned.
const sorted = SortUtils.quickSort({ array: input });
console.log(sorted); // [1, 2, 5, 7, 9]
console.log(input);  // [5, 2, 9, 1, 7] (unchanged)

// inPlace: input is sorted and returned (same reference).
const same = SortUtils.quickSort({ array: input, inPlace: true });
console.log(same === input); // true
console.log(input);          // [1, 2, 5, 7, 9]
```

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

### bubbleSort({ array, inPlace? })

Sorts an array using Bubble Sort. Stable. O(n²) average. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.bubbleSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### mergeSort({ array, inPlace? })

Sorts an array using Merge Sort (divide and conquer). Stable. O(n log n). Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.mergeSort({ array: [3, 1, 4, 1, 5] }); // [1, 1, 3, 4, 5]
```

### quickSort({ array, inPlace? })

Sorts an array using Quick Sort (divide and conquer). O(n log n) average. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.quickSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### heapSort({ array, inPlace? })

Sorts an array using Heap Sort (binary heaps). O(n log n). Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.heapSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### selectionSort({ array, inPlace? })

Sorts an array using Selection Sort. O(n²) for all cases. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.selectionSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### insertionSort({ array, inPlace? })

Sorts an array using Insertion Sort. Stable, efficient for small or nearly sorted lists. O(n²) average. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.insertionSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### shellSort({ array, inPlace? })

Sorts an array using Shell Sort (gap-based generalization of Insertion Sort). Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.shellSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### countingSort({ array, maxValue, inPlace? })

Sorts an array of non-negative integers using Counting Sort. Requires `maxValue`, the maximum value present in the array. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array, contains negative numbers, or if `maxValue` is not a non-negative integer.

```javascript
SortUtils.countingSort({ array: [4, 2, 2, 8, 3], maxValue: 8 }); // [2, 2, 3, 4, 8]
```

### radixSort({ array, inPlace? })

Sorts an array of non-negative integers using Radix Sort (digit by digit). Stable. O(nk). Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array or contains negative numbers.

```javascript
SortUtils.radixSort({ array: [170, 45, 75, 90, 2, 802] }); // [2, 45, 75, 90, 170, 802]
```

### bucketSort({ array, bucketSize?, inPlace? })

Sorts an array of numbers using Bucket Sort. `bucketSize` is optional and defaults to `5`. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Works well for uniformly distributed data.

```javascript
SortUtils.bucketSort({ array: [0.42, 0.32, 0.73, 0.12] }); // [0.12, 0.32, 0.42, 0.73]
SortUtils.bucketSort({ array: [29, 25, 3, 49, 9, 37], bucketSize: 10 }); // [3, 9, 25, 29, 37, 49]
```

### timSort({ array, inPlace? })

Sorts an array using Tim Sort (a hybrid of Merge Sort and Insertion Sort). Stable. O(n log n). Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.timSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### bogoSort({ array, inPlace? })

Sorts an array using Bogo Sort by randomly shuffling until sorted. Extremely inefficient (O(n!)) — for educational purposes only. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.bogoSort({ array: [3, 1, 2] }); // [1, 2, 3]
```

### gnomeSort({ array, inPlace? })

Sorts an array using Gnome Sort (a single-loop variation of Insertion Sort). Stable. O(n²) average. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.gnomeSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### pancakeSort({ array, inPlace? })

Sorts an array using Pancake Sort by repeatedly flipping subarrays. O(n²). Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.pancakeSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### combSort({ array, inPlace? })

Sorts an array using Comb Sort (an improvement over Bubble Sort using shrinking gaps). Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.combSort({ array: [5, 2, 9, 1, 7] }); // [1, 2, 5, 7, 9]
```

### cocktailShakerSort({ array, inPlace? })

Sorts an array using Cocktail Shaker Sort (a bi-directional Bubble Sort). Stable. O(n²) average. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.cocktailShakerSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### bitonicSort({ array, inPlace? })

Sorts an array using Bitonic Sort. O(n log² n). Designed for parallel systems. Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.bitonicSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```

### stoogeSort({ array, inPlace? })

Sorts an array using Stooge Sort (a recursive, highly inefficient algorithm for academic use). O(n^2.71). Non-mutating by default; pass `inPlace: true` to sort the caller's array and return the same reference. Throws `ValidationError` if the input is not an array.

```javascript
SortUtils.stoogeSort({ array: [5, 2, 9, 1] }); // [1, 2, 5, 9]
```
