export class StringUtils {
  /**
   * Capitalizes the first letter of a string.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to capitalize.
   * @returns {string} The string with the first letter capitalized.
   * @example
   * StringUtils.capitalizeFirstLetter({ 
   *   input: 'hello' 
   * }); // "Hello"
   */
  public static capitalizeFirstLetter({ input }: { input: string }): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  /**
   * Reverses a string.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to reverse.
   * @returns {string} The reversed string.
   * @example
   * StringUtils.reverse({ 
   *   input: 'hello' 
   * }); // "olleh"
   */
  public static reverse({ input }: { input: string }): string {
    return input.split('').reverse().join('');
  }

  /**
   * Checks if a string is a palindrome.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to check.
   * @returns {boolean} `true` if the string is a palindrome, otherwise `false`.
   * @example
   * StringUtils.isPalindrome({ 
   *   input: 'racecar' 
   * }); // true
   * 
   * StringUtils.isPalindrome({ 
   *   input: 'hello' 
   * }); // false
   */
  public static isPalindrome({ input }: { input: string }): boolean {
    const cleaned = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleaned === StringUtils.reverse({ input: cleaned });
  }

  /**
   * Truncates a string to a specified length and adds an ellipsis if necessary.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to truncate.
   * @param {number} params.maxLength - The maximum length of the truncated string.
   * @returns {string} The truncated string with ellipsis if needed.
   * @example
   * StringUtils.truncate({ 
   *   input: 'This is a long string', 
   *   maxLength: 10 
   * }); // "This is a..."
   */
  public static truncate({
    input,
    maxLength,
  }: {
    input: string;
    maxLength: number;
  }): string {
    return input.length > maxLength
      ? input.slice(0, maxLength).trimEnd() + '...'
      : input;
  }

  /**
   * Converts a string to kebab-case.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to convert.
   * @returns {string} The kebab-cased string.
   * @example
   * StringUtils.toKebabCase({ 
   *   input: 'Hello World' 
   * }); // "hello-world"
   * 
   * StringUtils.toKebabCase({ 
   *   input: 'camelCaseString' 
   * }); // "camel-case-string"
   */
  public static toKebabCase({ input }: { input: string }): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Converts a string to snake_case.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to convert.
   * @returns {string} The snake-cased string.
   * @example
   * StringUtils.toSnakeCase({ 
   *   input: 'Hello World' 
   * }); // "hello_world"
   * 
   * StringUtils.toSnakeCase({ 
   *   input: 'camelCaseString' 
   * }); // "camel_case_string"
   */
  public static toSnakeCase({ input }: { input: string }): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  /**
   * Converts a string to camelCase.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to convert.
   * @returns {string} The camelCased string.
   * @example
   * StringUtils.toCamelCase({ 
   *   input: 'Hello World' 
   * }); // "helloWorld"
   * 
   * StringUtils.toCamelCase({ 
   *   input: 'snake_case_string' 
   * }); // "snakeCaseString"
   */
  public static toCamelCase({ input }: { input: string }): string {
    return input
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, match) => match.toUpperCase());
  }

  /**
   * Converts a string to title case.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to convert.
   * @returns {string} The title-cased string.
   * @example
   * StringUtils.toTitleCase({ 
   *   input: 'hello world' 
   * }); // "Hello World"
   */
  public static toTitleCase({ input }: { input: string }): string {
    return input
      .toLowerCase()
      .split(' ')
      .map((word) => StringUtils.capitalizeFirstLetter({ input: word }))
      .join(' ');
  }

  /**
   * Counts the occurrences of a substring in a string.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to search within.
   * @param {string} params.substring - The substring to count.
   * @returns {number} The number of occurrences of the substring.
   * @example
   * StringUtils.countOccurrences({ 
   *   input: 'hello world hello', 
   *   substring: 'hello' 
   * }); // 2
   * 
   * StringUtils.countOccurrences({ 
   *   input: 'abc abc abc', 
   *   substring: 'abc' 
   * }); // 3
   */
  public static countOccurrences({
    input,
    substring,
  }: {
    input: string;
    substring: string;
  }): number {
    return (input.match(new RegExp(substring, 'g')) || []).length;
  }

  /**
   * Replaces all occurrences of a substring in a string.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to search within.
   * @param {string} params.substring - The substring to replace.
   * @param {string} params.replacement - The string to replace the substring with.
   * @returns {string} The string with all occurrences of the substring replaced.
   * @example
   * StringUtils.replaceAll({ 
   *   input: 'hello world hello', 
   *   substring: 'hello', 
   *   replacement: 'hi' 
   * }); // "hi world hi"
   */
  public static replaceAll({
    input,
    substring,
    replacement,
  }: {
    input: string;
    substring: string;
    replacement: string;
  }): string {
    return input.split(substring).join(replacement);
  }

  /**
   * Replaces the first `x` occurrences of a substring in a string.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to search within.
   * @param {string} params.substring - The substring to replace.
   * @param {string} params.replacement - The string to replace the substring with.
   * @param {number} params.occurrences - The number of occurrences to replace.
   * @returns {string} The string with the first `x` occurrences replaced.
   * @example
   * StringUtils.replaceOccurrences({ 
   *   input: 'hello world hello', 
   *   substring: 'hello', 
   *   replacement: 'hi', 
   *   occurrences: 1 
   * }); // "hi world hello"
   */
  public static replaceOccurrences({
    input,
    substring,
    replacement,
    occurrences,
  }: {
    input: string;
    substring: string;
    replacement: string;
    occurrences: number;
  }): string {
    let count = 0;
    return input.replace(new RegExp(substring, 'g'), (match) => {
      if (count < occurrences) {
        count++;
        return replacement;
      }
      return match;
    });
  }

  /**
   * Replaces placeholders in a string with corresponding values from a replacement map.
   * @param {object} params - The parameters for the method.
   * @param {string} params.template - The input string containing placeholders to be replaced.
   * @param {Record<string, string>} params.replacements - An object mapping placeholder keys (without braces) to their replacement values.
   * @returns {string} A new string with placeholders replaced by their corresponding values from the replacements object.
   * @example
   * StringUtils.replacePlaceholders({
   *   template: "Hello, {name}! You have {count} new messages.",
   *   replacements: { name: "John", count: "5" }
   * }); // "Hello, John! You have 5 new messages."
   */
  public static replacePlaceholders({
    template,
    replacements,
  }: {
    template: string;
    replacements: Record<string, string>;
  }): string {
    return template.replace(/\{([^}]+)\}/g, (match, key) => {
      return replacements[key] ?? match;
    });
  }
}
