/**
 * Basic examples for ObjectUtils
 *
 * Run with: node object-utils.js
 */
const { ObjectUtils } = require('@brmorillo/utils');

// Example 1: Deep clone an object
console.log('Example 1: Deep clone an object');
const original = { a: 1, b: { c: 2 } };
const clone = ObjectUtils.deepClone({ obj: original });
original.b.c = 99;
console.log('Original after mutation:', JSON.stringify(original));
console.log('Clone (unaffected):', JSON.stringify(clone));
console.log('---');

// Example 2: Deep merge two objects
console.log('Example 2: Deep merge two objects');
const target = { a: 1, b: { c: 2 } };
const source = { b: { d: 3 }, e: 4 };
const merged = ObjectUtils.deepMerge({ target, source });
console.log('Merged:', JSON.stringify(merged));
console.log('---');

// Example 3: Pick specific keys
console.log('Example 3: Pick specific keys');
const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
const picked = ObjectUtils.pick({ obj: user, keys: ['id', 'name'] });
console.log('Picked:', JSON.stringify(picked));
console.log('---');

// Example 4: Omit specific keys
console.log('Example 4: Omit specific keys');
const omitted = ObjectUtils.omit({ obj: user, keys: ['password'] });
console.log('Omitted:', JSON.stringify(omitted));
console.log('---');

// Example 5: Flatten a nested object
console.log('Example 5: Flatten a nested object');
const nested = { a: 1, b: { c: 2, d: { e: 3 } } };
const flattened = ObjectUtils.flattenObject({ obj: nested });
console.log('Flattened:', JSON.stringify(flattened));
console.log('---');

// Example 6: Find a value by path
console.log('Example 6: Find a value by path');
const data = { user: { address: { city: 'New York' } } };
const city = ObjectUtils.findValue({ obj: data, path: 'user.address.city' });
console.log("findValue({ path: 'user.address.city' }):", city);
