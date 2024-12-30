export class StringUtils {
  /**
   * Capitalizes the first letter of a string.
   * @param input The string to capitalize
   * @returns The string with the first letter capitalized
   * @example
   * StringUtils.capitalizeFirstLetter({ input: 'hello' }); // "Hello"
   */
  static capitalizeFirstLetter({ input }: { input: string }): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  /**
   * Reverses a string.
   * @param input The string to reverse
   * @returns The reversed string
   * @example
   * StringUtils.reverseString({ input: 'hello' }); // "olleh"
   */
  static reverseString({ input }: { input: string }): string {
    return input.split('').reverse().join('');
  }

  /**
   * Checks if a string is a palindrome.
   * @param input The string to check
   * @returns True if the string is a palindrome, false otherwise
   * @example
   * StringUtils.isPalindrome({ input: 'racecar' }); // true
   */
  static isPalindrome({ input }: { input: string }): boolean {
    const cleaned = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleaned === StringUtils.reverseString({ input: cleaned });
  }

  /**
   * Truncates a string to a specified length and adds an ellipsis if necessary.
   * @param input The string to truncate
   * @param maxLength The maximum length of the truncated string
   * @returns The truncated string with ellipsis if needed
   * @example
   * StringUtils.truncateString({ input: 'This is a long string', maxLength: 10 }); // "This is a..."
   */
  static truncateString({
    input,
    maxLength,
  }: {
    input: string;
    maxLength: number;
  }): string {
    return input.length > maxLength ? input.slice(0, maxLength) + '...' : input;
  }

  /**
   * Converts a string to kebab-case.
   * @param input The string to convert
   * @returns The kebab-cased string
   * @example
   * StringUtils.toKebabCase({ input: 'Hello World' }); // "hello-world"
   */
  static toKebabCase({ input }: { input: string }): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Converts a string to snake_case.
   * @param input The string to convert
   * @returns The snake-cased string
   * @example
   * StringUtils.toSnakeCase({ input: 'Hello World' }); // "hello_world"
   */
  static toSnakeCase({ input }: { input: string }): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  /**
   * Counts the occurrences of a substring in a string.
   * @param input The string to search within
   * @param substring The substring to count
   * @returns The number of occurrences of the substring
   * @example
   * StringUtils.countOccurrences({ input: 'hello world hello', substring: 'hello' }); // 2
   */
  static countOccurrences({
    input,
    substring,
  }: {
    input: string;
    substring: string;
  }): number {
    return (input.match(new RegExp(substring, 'g')) || []).length;
  }
}
