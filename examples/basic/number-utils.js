/**
 * Basic examples for NumberUtils
 *
 * Run with: node number-utils.js
 */
const { NumberUtils, MathUtils } = require('@brmorillo/utils');

// Example 1: Round to a number of decimal places
console.log('Example 1: Round to a number of decimal places');
console.log('roundToDecimals({ value: 3.14159, decimals: 2 }):', NumberUtils.roundToDecimals({ value: 3.14159, decimals: 2 }));
console.log('---');

// Example 2: Clamp a value within a range
console.log('Example 2: Clamp a value within a range');
console.log('clamp({ value: 15, min: 0, max: 10 }):', NumberUtils.clamp({ value: 15, min: 0, max: 10 }));
console.log('clamp({ value: -5, min: 0, max: 10 }):', NumberUtils.clamp({ value: -5, min: 0, max: 10 }));
console.log('---');

// Example 3: Generate a random integer in a range
console.log('Example 3: Generate a random integer in a range');
console.log('randomIntegerInRange({ min: 1, max: 10 }):', NumberUtils.randomIntegerInRange({ min: 1, max: 10 }));
console.log('---');

// Example 4: Check whether a number is prime
console.log('Example 4: Check whether a number is prime');
console.log('isValidPrime({ value: 7 }):', MathUtils.isValidPrime({ value: 7 }));
console.log('isValidPrime({ value: 8 }):', MathUtils.isValidPrime({ value: 8 }));
console.log('---');

// Example 5: Convert a monetary value to cents
console.log('Example 5: Convert a monetary value to cents');
console.log('toCents({ value: 10.56 }):', NumberUtils.toCents({ value: 10.56 }));
console.log('toCents({ value: 0.99 }):', NumberUtils.toCents({ value: 0.99 }));
