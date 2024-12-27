/**
 * Capitalizes the first letter of a string.
 * @param input The string to be capitalized
 * @returns String with the first letter capitalized
 */
export function capitalizeFirstLetter(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Reverses a string.
 * @param input The string to be reversed
 * @returns Reversed string
 */
export function reverseString(input: string): string {
  return input.split('').reverse().join('');
}

/**
 * Checks if a string is a palindrome.
 * @param input The string to check
 * @returns True if the string is a palindrome, false otherwise
 */
export function isPalindrome(input: string): boolean {
  const cleaned = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return cleaned === reverseString(cleaned);
}

/**
 * Truncates a string to a specified length and adds an ellipsis if necessary.
 * @param input The string to truncate
 * @param maxLength The maximum length of the string
 * @returns Truncated string with ellipsis if needed
 */
export function truncateString(input: string, maxLength: number): string {
  return input.length > maxLength ? input.slice(0, maxLength) + '...' : input;
}

/**
 * Converts a string to kebab-case.
 * @param input The string to convert
 * @returns Kebab-cased string
 */
export function toKebabCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to snake_case.
 * @param input The string to convert
 * @returns Snake-cased string
 */
export function toSnakeCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

/**
 * Counts the occurrences of a substring in a string.
 * @param input The string to search within
 * @param substring The substring to count
 * @returns Number of occurrences of the substring
 */
export function countOccurrences(input: string, substring: string): number {
  return (input.match(new RegExp(substring, 'g')) || []).length;
}
