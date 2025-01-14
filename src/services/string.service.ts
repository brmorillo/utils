export class StringUtils {
  /**
   * Capitalizes the first letter of a string.
   * @param input The string to capitalize.
   * @returns The string with the first letter capitalized.
   * @example
   * StringUtils.capitalizeFirstLetter({ input: 'hello' }); // "Hello"
   */
  public static capitalizeFirstLetter({ input }: { input: string }): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  /**
   * Reverses a string.
   * @param input The string to reverse.
   * @returns The reversed string.
   * @example
   * StringUtils.reverse({ input: 'hello' }); // "olleh"
   */
  public static reverse({ input }: { input: string }): string {
    return input.split('').reverse().join('');
  }

  /**
   * Checks if a string is a palindrome.
   * @param input The string to check.
   * @returns `true` if the string is a palindrome, otherwise `false`.
   * @example
   * StringUtils.isPalindrome({ input: 'racecar' }); // true
   */
  public static isPalindrome({ input }: { input: string }): boolean {
    const cleaned = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleaned === StringUtils.reverse({ input: cleaned });
  }

  /**
   * Truncates a string to a specified length and adds an ellipsis if necessary.
   * @param input The string to truncate.
   * @param maxLength The maximum length of the truncated string.
   * @returns The truncated string with ellipsis if needed.
   * @example
   * StringUtils.truncate({ input: 'This is a long string', maxLength: 10 }); // "This is a..."
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
   * @param input The string to convert.
   * @returns The kebab-cased string.
   * @example
   * StringUtils.toKebabCase({ input: 'Hello World' }); // "hello-world"
   */
  public static toKebabCase({ input }: { input: string }): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Converts a string to snake_case.
   * @param input The string to convert.
   * @returns The snake-cased string.
   * @example
   * StringUtils.toSnakeCase({ input: 'Hello World' }); // "hello_world"
   */
  public static toSnakeCase({ input }: { input: string }): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  /**
   * Converts a string to camelCase.
   * @param input The string to convert.
   * @returns The camelCased string.
   * @example
   * StringUtils.toCamelCase({ input: 'Hello World' }); // "helloWorld"
   */
  public static toCamelCase({ input }: { input: string }): string {
    return input
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, match) => match.toUpperCase());
  }

  /**
   * Converts a string to title case.
   * @param input The string to convert.
   * @returns The title-cased string.
   * @example
   * StringUtils.toTitleCase({ input: 'hello world' }); // "Hello World"
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
   * @param input The string to search within.
   * @param substring The substring to count.
   * @returns The number of occurrences of the substring.
   * @example
   * StringUtils.countOccurrences({ input: 'hello world hello', substring: 'hello' }); // 2
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
   * @param input The string to search within.
   * @param substring The substring to replace.
   * @param replacement The string to replace the substring with.
   * @returns The string with all occurrences of the substring replaced.
   * @example
   * StringUtils.replaceAll({ input: 'hello world hello', substring: 'hello', replacement: 'hi' }); // "hi world hi"
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
   * @param input The string to search within.
   * @param substring The substring to replace.
   * @param replacement The string to replace the substring with.
   * @param occurrences The number of occurrences to replace.
   * @returns The string with the first `x` occurrences replaced.
   * @example
   * StringUtils.replaceOccurrences({ input: 'hello world hello', substring: 'hello', replacement: 'hi', occurrences: 1 }); // "hi world hello"
   */
  public static replaceAmountOccurrencies({
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
    return this.replaceOccurrences({
      input,
      substring,
      replacement,
      occurrences,
    });
  }

  /**
   * **Deprecated:** Use `replaceAmountOccurrencies` instead.
   *
   * Replaces the first `x` occurrences of a substring in a string.
   * @param input The string to search within.
   * @param substring The substring to replace.
   * @param replacement The string to replace the substring with.
   * @param occurrences The number of occurrences to replace.
   * @returns The string with the first `x` occurrences replaced.
   * @example
   * StringUtils.replaceOccurrences({ input: 'hello world hello', substring: 'hello', replacement: 'hi', occurrences: 1 }); // "hi world hello"
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
    console.warn(
      'replaceOccurrences is deprecated. Use replaceAmountOccurrencies instead.',
    );

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
   *
   * Placeholders in the string should be enclosed in curly braces `{}`.
   * For example: "Hello, {name}!" can be replaced with a value for "name".
   *
   * @param string - The input string containing placeholders to be replaced.
   * @param replacements - An object mapping placeholder keys (without braces) to their replacement values.
   * @returns A new string with placeholders replaced by their corresponding values from the replacements object.
   *
   * @example
   * const input = "Hello, {name}! You have {count} new messages.";
   * const replacements = { name: "John", count: "5" };
   * const result = replaceOcurrencyArray(input, replacements);
   * console.log(result); // "Hello, John! You have 5 new messages."
   */
  public static replaceOcurrencies(
    string: string,
    replacements: Record<string, string>,
  ): string {
    return string.replace(/\{([^}]+)\}/g, (match, key) => {
      return replacements[key] ?? match; // Substitui se a chave existir, senão mantém o valor original
    });
  }
}
