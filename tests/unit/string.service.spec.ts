import { StringUtils } from '../../src/services/string.service';

/**
 * Unit tests for the StringUtils class.
 * These tests verify the behavior of each method individually.
 */
describe('StringUtils - Unit Tests', () => {
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a string', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: 'hello' });
      expect(result).toBe('Hello');
    });

    it('should convert the rest of the string to lowercase', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: 'hELLO' });
      expect(result).toBe('Hello');
    });

    it('should handle empty strings', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: '' });
      expect(result).toBe('');
    });

    it('should handle single-character strings', () => {
      const result = StringUtils.capitalizeFirstLetter({ input: 'a' });
      expect(result).toBe('A');
    });
  });

  describe('reverse', () => {
    it('should reverse a string', () => {
      const result = StringUtils.reverse({ input: 'hello' });
      expect(result).toBe('olleh');
    });

    it('should handle empty strings', () => {
      const result = StringUtils.reverse({ input: '' });
      expect(result).toBe('');
    });

    it('should handle single-character strings', () => {
      const result = StringUtils.reverse({ input: 'a' });
      expect(result).toBe('a');
    });

    it('should handle strings with spaces', () => {
      const result = StringUtils.reverse({ input: 'hello world' });
      expect(result).toBe('dlrow olleh');
    });
  });

  describe('isValidPalindrome', () => {
    it('should identify a simple palindrome', () => {
      const result = StringUtils.isValidPalindrome({ input: 'racecar' });
      expect(result).toBe(true);
    });

    it('should identify a string that is not a palindrome', () => {
      const result = StringUtils.isValidPalindrome({ input: 'hello' });
      expect(result).toBe(false);
    });

    it('should ignore spaces and punctuation', () => {
      const result = StringUtils.isValidPalindrome({
        input: 'A man, a plan, a canal: Panama',
      });
      expect(result).toBe(true);
    });

    it('should ignore uppercase and lowercase', () => {
      const result = StringUtils.isValidPalindrome({
        input: 'Able was I ere I saw Elba',
      });
      expect(result).toBe(true);
    });

    it('should handle empty strings', () => {
      const result = StringUtils.isValidPalindrome({ input: '' });
      expect(result).toBe(true);
    });

    it('should handle single-character strings', () => {
      const result = StringUtils.isValidPalindrome({ input: 'a' });
      expect(result).toBe(true);
    });
  });

  describe('truncate', () => {
    it('should truncate a long string', () => {
      const result = StringUtils.truncate({
        input: 'This is a long string',
        maxLength: 10,
      });
      expect(result).toBe('This is...');
    });

    it('should not truncate a short string', () => {
      const result = StringUtils.truncate({
        input: 'Short',
        maxLength: 10,
      });
      expect(result).toBe('Short');
    });

    it('should truncate exactly at the maximum length', () => {
      const result = StringUtils.truncate({
        input: '1234567890abcdef',
        maxLength: 10,
      });
      expect(result).toBe('1234567...');
    });

    it('should remove trailing whitespace before adding the ellipsis', () => {
      const result = StringUtils.truncate({
        input: 'Hello world ',
        maxLength: 7,
      });
      expect(result).toBe('Hell...');
    });
  });

  describe('toKebabCase', () => {
    it('should convert a string with spaces to kebab-case', () => {
      const result = StringUtils.toKebabCase({ input: 'Hello World' });
      expect(result).toBe('hello-world');
    });

    it('should convert a camelCase string to kebab-case', () => {
      const result = StringUtils.toKebabCase({ input: 'camelCaseString' });
      expect(result).toBe('camel-case-string');
    });

    it('should handle multiple spaces', () => {
      const result = StringUtils.toKebabCase({ input: 'Hello  World  Test' });
      expect(result).toBe('hello-world-test');
    });

    it('should handle strings already in kebab-case', () => {
      const result = StringUtils.toKebabCase({ input: 'already-kebab-case' });
      expect(result).toBe('already-kebab-case');
    });

    it('should handle empty strings', () => {
      const result = StringUtils.toKebabCase({ input: '' });
      expect(result).toBe('');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert a string with spaces to snake_case', () => {
      const result = StringUtils.toSnakeCase({ input: 'Hello World' });
      expect(result).toBe('hello_world');
    });

    it('should convert a camelCase string to snake_case', () => {
      const result = StringUtils.toSnakeCase({ input: 'camelCaseString' });
      expect(result).toBe('camel_case_string');
    });

    it('should handle multiple spaces', () => {
      const result = StringUtils.toSnakeCase({ input: 'Hello  World  Test' });
      expect(result).toBe('hello_world_test');
    });

    it('should handle strings already in snake_case', () => {
      const result = StringUtils.toSnakeCase({ input: 'already_snake_case' });
      expect(result).toBe('already_snake_case');
    });

    it('should handle empty strings', () => {
      const result = StringUtils.toSnakeCase({ input: '' });
      expect(result).toBe('');
    });
  });

  describe('toCamelCase', () => {
    it('should convert a string with spaces to camelCase', () => {
      const result = StringUtils.toCamelCase({ input: 'Hello World' });
      expect(result).toBe('helloWorld');
    });

    it('should convert a snake_case string to camelCase', () => {
      const result = StringUtils.toCamelCase({ input: 'snake_case_string' });
      expect(result).toBe('snakeCaseString');
    });

    it('should convert a kebab-case string to camelCase', () => {
      const result = StringUtils.toCamelCase({ input: 'kebab-case-string' });
      expect(result).toBe('kebabCaseString');
    });

    it('should handle multiple separators', () => {
      const result = StringUtils.toCamelCase({ input: 'hello__world--test' });
      expect(result).toBe('helloWorldTest');
    });

    it('should handle strings already in camelCase', () => {
      const result = StringUtils.toCamelCase({ input: 'alreadyCamelCase' });
      expect(result).toBe('alreadyCamelCase');
    });

    it('should handle empty strings', () => {
      const result = StringUtils.toCamelCase({ input: '' });
      expect(result).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('should convert a string to title case', () => {
      const result = StringUtils.toTitleCase({ input: 'hello world' });
      expect(result).toBe('Hello World');
    });

    it('should convert an all-uppercase string to title case', () => {
      const result = StringUtils.toTitleCase({ input: 'HELLO WORLD' });
      expect(result).toBe('Hello World');
    });

    it('should convert an all-lowercase string to title case', () => {
      const result = StringUtils.toTitleCase({ input: 'hello world' });
      expect(result).toBe('Hello World');
    });

    it('should handle multiple spaces', () => {
      const result = StringUtils.toTitleCase({ input: 'hello  world  test' });
      expect(result).toBe('Hello  World  Test');
    });

    it('should handle empty strings', () => {
      const result = StringUtils.toTitleCase({ input: '' });
      expect(result).toBe('');
    });
  });

  describe('countOccurrences', () => {
    it('should count occurrences of a substring', () => {
      const result = StringUtils.countOccurrences({
        input: 'hello world hello',
        substring: 'hello',
      });
      expect(result).toBe(2);
    });

    it('should return 0 when the substring does not exist', () => {
      const result = StringUtils.countOccurrences({
        input: 'hello world',
        substring: 'xyz',
      });
      expect(result).toBe(0);
    });

    it('should count overlapping occurrences', () => {
      const result = StringUtils.countOccurrences({
        input: 'abababa',
        substring: 'aba',
      });
      expect(result).toBe(2);
    });

    it('should handle empty strings', () => {
      const result = StringUtils.countOccurrences({
        input: '',
        substring: 'hello',
      });
      expect(result).toBe(0);
    });

    it('should handle empty substrings', () => {
      const result = StringUtils.countOccurrences({
        input: 'hello',
        substring: '',
      });
      expect(result).toBe(0);
    });
  });

  describe('replaceAll', () => {
    it('should replace all occurrences of a substring', () => {
      const result = StringUtils.replaceAll({
        input: 'hello world hello',
        substring: 'hello',
        replacement: 'hi',
      });
      expect(result).toBe('hi world hi');
    });

    it('should return the original string when the substring does not exist', () => {
      const result = StringUtils.replaceAll({
        input: 'hello world',
        substring: 'xyz',
        replacement: 'abc',
      });
      expect(result).toBe('hello world');
    });

    it('should handle empty strings', () => {
      const result = StringUtils.replaceAll({
        input: '',
        substring: 'hello',
        replacement: 'hi',
      });
      expect(result).toBe('');
    });

    it('should handle empty substrings', () => {
      const result = StringUtils.replaceAll({
        input: 'hello',
        substring: '',
        replacement: 'hi',
      });
      expect(result).toBe('hello');
    });
  });

  describe('replaceOccurrences', () => {
    it('should replace the specified number of occurrences', () => {
      const result = StringUtils.replaceOccurrences({
        input: 'hello world hello world hello',
        substring: 'hello',
        replacement: 'hi',
        occurrences: 2,
      });
      expect(result).toBe('hi world hi world hello');
    });

    it('should replace all occurrences when the number is greater than the total', () => {
      const result = StringUtils.replaceOccurrences({
        input: 'hello world hello',
        substring: 'hello',
        replacement: 'hi',
        occurrences: 5,
      });
      expect(result).toBe('hi world hi');
    });

    it('should return the original string when the occurrence count is 0', () => {
      const result = StringUtils.replaceOccurrences({
        input: 'hello world hello',
        substring: 'hello',
        replacement: 'hi',
        occurrences: 0,
      });
      expect(result).toBe('hello world hello');
    });

    it('should return the original string when the substring does not exist', () => {
      const result = StringUtils.replaceOccurrences({
        input: 'hello world',
        substring: 'xyz',
        replacement: 'abc',
        occurrences: 1,
      });
      expect(result).toBe('hello world');
    });
  });

  describe('replacePlaceholders', () => {
    it('should replace placeholders in a template', () => {
      const result = StringUtils.replacePlaceholders({
        template: 'Hello, {name}! You have {count} new messages.',
        replacements: { name: 'John', count: '5' },
      });
      expect(result).toBe('Hello, John! You have 5 new messages.');
    });

    it('should keep placeholders not found in the replacements map', () => {
      const result = StringUtils.replacePlaceholders({
        template: 'Hello, {name}! You have {count} new messages.',
        replacements: { name: 'John' },
      });
      expect(result).toBe('Hello, John! You have {count} new messages.');
    });

    it('should handle templates without placeholders', () => {
      const result = StringUtils.replacePlaceholders({
        template: 'Hello, world!',
        replacements: { name: 'John', count: '5' },
      });
      expect(result).toBe('Hello, world!');
    });

    it('should handle empty templates', () => {
      const result = StringUtils.replacePlaceholders({
        template: '',
        replacements: { name: 'John', count: '5' },
      });
      expect(result).toBe('');
    });

    it('should handle an empty replacements map', () => {
      const result = StringUtils.replacePlaceholders({
        template: 'Hello, {name}!',
        replacements: {},
      });
      expect(result).toBe('Hello, {name}!');
    });
  });
});
