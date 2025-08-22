/**
 * Basic examples for ArrayUtils
 * 
 * Run with: node array-utils.js
 */
const { ArrayUtils } = require('@brmorillo/utils');

// Example 1: Remove duplicates
console.log('Example 1: Remove duplicates');
const array = [1, 2, 2, 3, 4, 4, 5];
const uniqueArray = ArrayUtils.removeDuplicates({ array });
console.log('Original array:', array);
console.log('Unique array:', uniqueArray);
console.log('---');

// Example 2: Remove duplicates with custom key function
console.log('Example 2: Remove duplicates with custom key function');
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John (duplicate)' }
];
const uniqueUsers = ArrayUtils.removeDuplicates({
  array: users,
  keyFn: user => user.id
});
console.log('Original users:', JSON.stringify(users, null, 2));
console.log('Unique users:', JSON.stringify(uniqueUsers, null, 2));
console.log('---');

// Example 3: Find intersection of arrays
console.log('Example 3: Find intersection of arrays');
const array1 = [1, 2, 3, 4, 5];
const array2 = [3, 4, 5, 6, 7];
const intersection = ArrayUtils.intersect({ array1, array2 });
console.log('Array 1:', array1);
console.log('Array 2:', array2);
console.log('Intersection:', intersection);
console.log('---');

// Example 4: Group array items by a key
console.log('Example 4: Group array items by a key');
const products = [
  { id: 1, category: 'electronics', name: 'Laptop' },
  { id: 2, category: 'books', name: 'JavaScript Guide' },
  { id: 3, category: 'electronics', name: 'Smartphone' },
  { id: 4, category: 'books', name: 'TypeScript Handbook' }
];
const groupedByCategory = ArrayUtils.groupBy({
  array: products,
  keyFn: product => product.category
});
console.log('Products:', JSON.stringify(products, null, 2));
console.log('Grouped by category:', JSON.stringify(groupedByCategory, null, 2));
console.log('---');

// Example 5: Sort array
console.log('Example 5: Sort array');
const unsortedArray = [5, 3, 8, 1, 2];
const sortedAsc = ArrayUtils.sort({ array: unsortedArray, orderBy: 'asc' });
const sortedDesc = ArrayUtils.sort({ array: unsortedArray, orderBy: 'desc' });
console.log('Unsorted array:', unsortedArray);
console.log('Sorted ascending:', sortedAsc);
console.log('Sorted descending:', sortedDesc);
console.log('---');

// Example 6: Sort array of objects
console.log('Example 6: Sort array of objects');
const people = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 40 },
  { name: 'Alice', age: 25 }
];
const sortedByAge = ArrayUtils.sort({
  array: people,
  orderBy: { age: 'asc', name: 'asc' }
});
console.log('People:', JSON.stringify(people, null, 2));
console.log('Sorted by age and name:', JSON.stringify(sortedByAge, null, 2));