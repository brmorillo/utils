/**
 * Basic examples for StringUtils
 *
 * Run with: node string-utils.js
 */
const { StringUtils } = require('@brmorillo/utils');

// Example 1: Capitalize the first letter
console.log('Example 1: Capitalize the first letter');
console.log("capitalizeFirstLetter({ input: 'hello world' }):", StringUtils.capitalizeFirstLetter({ input: 'hello world' }));
console.log('---');

// Example 2: Convert to camelCase
console.log('Example 2: Convert to camelCase');
console.log("toCamelCase({ input: 'hello world' }):", StringUtils.toCamelCase({ input: 'hello world' }));
console.log("toCamelCase({ input: 'snake_case_string' }):", StringUtils.toCamelCase({ input: 'snake_case_string' }));
console.log('---');

// Example 3: Convert to kebab-case
console.log('Example 3: Convert to kebab-case');
console.log("toKebabCase({ input: 'Hello World' }):", StringUtils.toKebabCase({ input: 'Hello World' }));
console.log("toKebabCase({ input: 'camelCaseString' }):", StringUtils.toKebabCase({ input: 'camelCaseString' }));
console.log('---');

// Example 4: Convert to snake_case
console.log('Example 4: Convert to snake_case');
console.log("toSnakeCase({ input: 'Hello World' }):", StringUtils.toSnakeCase({ input: 'Hello World' }));
console.log("toSnakeCase({ input: 'camelCaseString' }):", StringUtils.toSnakeCase({ input: 'camelCaseString' }));
console.log('---');

// Example 5: Truncate a long string
console.log('Example 5: Truncate a long string');
console.log("truncate({ input: 'This is a long string', maxLength: 10 }):", StringUtils.truncate({ input: 'This is a long string', maxLength: 10 }));
console.log('---');

// Example 6: Count occurrences of a substring
console.log('Example 6: Count occurrences of a substring');
console.log("countOccurrences({ input: 'hello world hello', substring: 'hello' }):", StringUtils.countOccurrences({ input: 'hello world hello', substring: 'hello' }));
console.log('---');

// Example 7: Replace all occurrences of a substring
console.log('Example 7: Replace all occurrences of a substring');
console.log("replaceAll({ input: 'hello world hello', substring: 'hello', replacement: 'hi' }):", StringUtils.replaceAll({ input: 'hello world hello', substring: 'hello', replacement: 'hi' }));
console.log('---');

// Example 8: Check whether a string is a palindrome
console.log('Example 8: Check whether a string is a palindrome');
console.log("isPalindrome({ input: 'racecar' }):", StringUtils.isPalindrome({ input: 'racecar' }));
console.log("isPalindrome({ input: 'hello' }):", StringUtils.isPalindrome({ input: 'hello' }));
