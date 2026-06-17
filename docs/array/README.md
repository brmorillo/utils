# ArrayUtils

The ArrayUtils class provides a collection of utility methods for working with arrays, including operations like sorting, filtering, grouping, and more.

## Basic Usage

```javascript
import { ArrayUtils } from '@brmorillo/utils';

// Remove duplicates from an array
const array = [1, 2, 2, 3, 4, 4, 5];
const uniqueArray = ArrayUtils.removeDuplicates({ array });
console.log(uniqueArray); // [1, 2, 3, 4, 5]

// Find the intersection of two arrays
const array1 = [1, 2, 3, 4];
const array2 = [3, 4, 5, 6];
const intersection = ArrayUtils.intersect({ array1, array2 });
console.log(intersection); // [3, 4]

// Group array items by a key
const users = [
  { id: 1, role: 'admin', name: 'Alice' },
  { id: 2, role: 'user', name: 'Bob' },
  { id: 3, role: 'admin', name: 'Charlie' }
];
const groupedByRole = ArrayUtils.groupBy({
  array: users,
  keyFn: user => user.role
});
console.log(groupedByRole);
// {
//   admin: [{ id: 1, role: 'admin', name: 'Alice' }, { id: 3, role: 'admin', name: 'Charlie' }],
//   user: [{ id: 2, role: 'user', name: 'Bob' }]
// }
```

## Methods

### removeDuplicates({ array, keyFn, inPlace })

Removes duplicate items from an array. By default returns a new array; pass `inPlace: true` to mutate `array` and return the same reference.

```javascript
// Simple array
const numbers = [1, 2, 2, 3, 4, 4, 5];
const uniqueNumbers = ArrayUtils.removeDuplicates({ array: numbers });
// [1, 2, 3, 4, 5]

// Array of objects with key function
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice (duplicate)' }
];
const uniqueUsers = ArrayUtils.removeDuplicates({
  array: users,
  keyFn: user => user.id
});
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

### intersect({ array1, array2, inPlace })

Finds the intersection of two arrays. By default returns a new array; pass `inPlace: true` to mutate `array1` to hold the intersection and return the same reference.

```javascript
const array1 = [1, 2, 3, 4];
const array2 = [3, 4, 5, 6];
const intersection = ArrayUtils.intersect({ array1, array2 });
// [3, 4]
```

### flatten({ array, inPlace })

Deeply flattens a nested array to a single level, to any nesting depth. The recursive `NestedArray<T>` parameter type accepts deeply-nested array literals at compile time, and the runtime implementation flattens with `push`/`reverse` (avoiding the `O(n^2)` cost of `unshift`) while preserving element order. By default returns a new array; pass `inPlace: true` to mutate `array` to hold the flattened result and return the same reference. Throws a `ValidationError` if `array` is not an array.

```javascript
const nestedArray = [1, [2, 3], [4, [5, 6]]];
const flattened = ArrayUtils.flatten({ array: nestedArray });
// [1, 2, 3, 4, 5, 6]
```

### groupBy({ array, keyFn })

Groups array items by a key function.

```javascript
const users = [
  { id: 1, role: 'admin', name: 'Alice' },
  { id: 2, role: 'user', name: 'Bob' },
  { id: 3, role: 'admin', name: 'Charlie' }
];
const groupedByRole = ArrayUtils.groupBy({
  array: users,
  keyFn: user => user.role
});
// {
//   admin: [{ id: 1, role: 'admin', name: 'Alice' }, { id: 3, role: 'admin', name: 'Charlie' }],
//   user: [{ id: 2, role: 'user', name: 'Bob' }]
// }
```

### shuffle({ array, inPlace })

Randomly shuffles an array. By default returns a new shuffled array; pass `inPlace: true` to shuffle `array` directly and return the same reference.

```javascript
const array = [1, 2, 3, 4, 5];
const shuffled = ArrayUtils.shuffle({ array });
// [3, 1, 5, 2, 4] (random order)
```

### sort({ array, orderBy, inPlace })

Sorts an array with flexible ordering options. `orderBy` may be `'asc'`/`'desc'` (natural comparison, supported for both primitive and object arrays) or an object mapping keys to per-key directions. The comparator is stable (returns `0` for equal elements). By default returns a new sorted array; pass `inPlace: true` to sort `array` in place and return the same reference. Sorting an empty array returns `[]`; a non-array input throws a `ValidationError`.

```javascript
// Simple array with ascending order
const numbers = [3, 1, 4, 2];
const sortedAsc = ArrayUtils.sort({ array: numbers, orderBy: 'asc' });
// [1, 2, 3, 4]

// Empty array returns an empty array (no error)
ArrayUtils.sort({ array: [], orderBy: 'asc' }); // []

// Array of objects with multiple sort criteria
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 30 }
];
const sorted = ArrayUtils.sort({
  array: users,
  orderBy: {
    age: 'asc',
    name: 'desc'
  }
});
// [
//   { name: 'Bob', age: 25 },
//   { name: 'Charlie', age: 30 },
//   { name: 'Alice', age: 30 }
// ]
```

### findSubset({ array, subset })

Finds the first object in an array of objects whose properties match the given `subset`, returning that object or `null` if none match. Array-valued subset properties match when the target array contains all the given values. Throws a `ValidationError` if `array` is not an array.

```javascript
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];
const found = ArrayUtils.findSubset({ array: users, subset: { name: 'John' } });
// { id: 1, name: 'John' }
```

### isSubset({ superset, subset })

Checks whether `subset` is fully contained within `superset`. Array-valued subset properties match when the superset array contains all the given values. Throws a `ValidationError` if either input is not an object.

```javascript
ArrayUtils.isSubset({
  superset: { id: 1, name: 'John' },
  subset: { name: 'John' }
}); // true
```

## Mutability

The data-transforming methods are **non-mutating by default**: they leave the caller's input array untouched and return a brand-new array.

To opt into mutation for performance or lower memory usage, pass `inPlace: true` to any of `removeDuplicates`, `flatten`, `sort`, `shuffle`, or `intersect`. With `inPlace: true` the method mutates the input array (for `intersect`, it mutates `array1`) and returns that **same reference** holding the result.

```javascript
const numbers = [3, 1, 2, 1];

// Default (safe): input is preserved, a new array is returned.
const sorted = ArrayUtils.sort({ array: numbers, orderBy: 'asc' });
// numbers -> [3, 1, 2, 1] (unchanged), sorted -> [1, 1, 2, 3]

// inPlace (fast): input is mutated and returned.
const sameRef = ArrayUtils.sort({ array: numbers, orderBy: 'asc', inPlace: true });
// numbers -> [1, 1, 2, 3], sameRef === numbers
```

The `groupBy`, `findSubset`, and `isSubset` methods are non-mutating/read-only — they return a different structure (an object, a found item/`null`, or a boolean) and therefore do **not** accept an `inPlace` option.

## Examples

### Example 1: Working with Arrays of Objects

```javascript
import { ArrayUtils } from '@brmorillo/utils';

// Sample data
const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
  { id: 2, name: 'Phone', category: 'Electronics', price: 699 },
  { id: 3, name: 'Book', category: 'Books', price: 15 },
  { id: 4, name: 'Tablet', category: 'Electronics', price: 399 },
  { id: 5, name: 'Notebook', category: 'Books', price: 5 }
];

// Group products by category
const productsByCategory = ArrayUtils.groupBy({
  array: products,
  keyFn: product => product.category
});

// Sort products by price (lowest to highest)
const sortedByPrice = ArrayUtils.sort({
  array: products,
  orderBy: { price: 'asc' }
});

// Find electronics products
const electronics = products.filter(product => product.category === 'Electronics');

// Get unique categories
const categories = ArrayUtils.removeDuplicates({
  array: products.map(product => product.category)
});

console.log('Products by category:', productsByCategory);
console.log('Sorted by price:', sortedByPrice);
console.log('Electronics:', electronics);
console.log('Categories:', categories);
```

### Example 2: Data Processing Pipeline

```javascript
import { ArrayUtils } from '@brmorillo/utils';

// Sample data: sales records
const salesData = [
  { date: '2023-01-15', product: 'Laptop', category: 'Electronics', amount: 999 },
  { date: '2023-01-15', product: 'Phone', category: 'Electronics', amount: 699 },
  { date: '2023-01-16', product: 'Book', category: 'Books', amount: 15 },
  { date: '2023-01-16', product: 'Laptop', category: 'Electronics', amount: 999 },
  { date: '2023-01-17', product: 'Notebook', category: 'Books', amount: 5 },
  { date: '2023-01-17', product: 'Phone', category: 'Electronics', amount: 699 }
];

// 1. Group sales by date
const salesByDate = ArrayUtils.groupBy({
  array: salesData,
  keyFn: sale => sale.date
});

// 2. Calculate daily totals
const dailyTotals = Object.entries(salesByDate).map(([date, sales]) => {
  const total = sales.reduce((sum, sale) => sum + sale.amount, 0);
  return { date, total };
});

// 3. Sort daily totals by amount (highest to lowest)
const sortedDailyTotals = ArrayUtils.sort({
  array: dailyTotals,
  orderBy: { total: 'desc' }
});

// 4. Get unique products sold
const uniqueProducts = ArrayUtils.removeDuplicates({
  array: salesData.map(sale => sale.product)
});

console.log('Daily totals (sorted):', sortedDailyTotals);
console.log('Unique products:', uniqueProducts);
```

### Example 3: Advanced Array Manipulations

```javascript
import { ArrayUtils } from '@brmorillo/utils';

// Create a range of numbers
const range = Array.from({ length: 10 }, (_, i) => i + 1);
console.log('Range:', range); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Flatten a nested structure
const nested = [[1, 2], [3, [4, 5]], 6];
const flattened = ArrayUtils.flatten({ array: nested });
console.log('Flattened:', flattened); // [1, 2, 3, 4, 5, 6]

// Create combinations of items
const items = ['A', 'B', 'C'];
const combinations = [];

for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    combinations.push([items[i], items[j]]);
  }
}

console.log('Combinations:', combinations); // [['A', 'B'], ['A', 'C'], ['B', 'C']]

// Shuffle an array
const shuffled = ArrayUtils.shuffle({ array: range });
console.log('Shuffled:', shuffled); // Random order
```

