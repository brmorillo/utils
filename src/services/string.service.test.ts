import { StringUtils } from './string.service';

describe('StringUtils', () => {
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a string', () => {
      expect(StringUtils.capitalizeFirstLetter({ input: 'hello' })).toBe(
        'Hello',
      );
    });

    it('should handle an empty string', () => {
      expect(StringUtils.capitalizeFirstLetter({ input: '' })).toBe('');
    });

    it('should convert the rest of the string to lowercase', () => {
      expect(StringUtils.capitalizeFirstLetter({ input: 'hELLO' })).toBe(
        'Hello',
      );
    });
  });

  describe('reverse', () => {
    it('should reverse a string', () => {
      expect(StringUtils.reverse({ input: 'hello' })).toBe('olleh');
    });

    it('should handle an empty string', () => {
      expect(StringUtils.reverse({ input: '' })).toBe('');
    });
  });

  describe('isPalindrome', () => {
    it('should return true for a palindrome', () => {
      expect(StringUtils.isPalindrome({ input: 'racecar' })).toBe(true);
    });

    it('should return false for a non-palindrome', () => {
      expect(StringUtils.isPalindrome({ input: 'hello' })).toBe(false);
    });

    it('should ignore spaces and special characters', () => {
      expect(
        StringUtils.isPalindrome({ input: 'A man, a plan, a canal: Panama' }),
      ).toBe(true);
    });
  });

  describe('truncate', () => {
    it('should truncate a string and add ellipsis', () => {
      expect(
        StringUtils.truncate({ input: 'This is a long string', maxLength: 10 }),
      ).toBe('This is a...');
    });

    it('should not truncate if the string is within the length limit', () => {
      expect(StringUtils.truncate({ input: 'Short', maxLength: 10 })).toBe(
        'Short',
      );
    });

    it('should handle edge cases with exact maxLength', () => {
      expect(
        StringUtils.truncate({ input: 'Exact length', maxLength: 12 }),
      ).toBe('Exact length');
    });
  });

  describe('toKebabCase', () => {
    it('should convert a string to kebab-case', () => {
      expect(StringUtils.toKebabCase({ input: 'Hello World' })).toBe(
        'hello-world',
      );
    });

    it('should handle camelCase strings', () => {
      expect(StringUtils.toKebabCase({ input: 'helloWorld' })).toBe(
        'hello-world',
      );
    });
  });

  describe('toSnakeCase', () => {
    it('should convert a string to snake_case', () => {
      expect(StringUtils.toSnakeCase({ input: 'Hello World' })).toBe(
        'hello_world',
      );
    });

    it('should handle camelCase strings', () => {
      expect(StringUtils.toSnakeCase({ input: 'helloWorld' })).toBe(
        'hello_world',
      );
    });
  });

  describe('toCamelCase', () => {
    it('should convert a string to camelCase', () => {
      expect(StringUtils.toCamelCase({ input: 'Hello World' })).toBe(
        'helloWorld',
      );
    });

    it('should handle snake_case strings', () => {
      expect(StringUtils.toCamelCase({ input: 'hello_world' })).toBe(
        'helloWorld',
      );
    });
  });

  describe('toTitleCase', () => {
    it('should convert a string to title case', () => {
      expect(StringUtils.toTitleCase({ input: 'hello world' })).toBe(
        'Hello World',
      );
    });

    it('should handle mixed-case input', () => {
      expect(StringUtils.toTitleCase({ input: 'hElLo WoRlD' })).toBe(
        'Hello World',
      );
    });
  });

  describe('countOccurrences', () => {
    it('should count occurrences of a substring in a string', () => {
      expect(
        StringUtils.countOccurrences({
          input: 'hello world hello',
          substring: 'hello',
        }),
      ).toBe(2);
    });

    it('should return 0 if the substring is not present', () => {
      expect(
        StringUtils.countOccurrences({
          input: 'hello world',
          substring: 'bye',
        }),
      ).toBe(0);
    });
  });

  describe('replaceAll', () => {
    it('should replace all occurrences of a substring', () => {
      expect(
        StringUtils.replaceAll({
          input: 'hello world hello',
          substring: 'hello',
          replacement: 'hi',
        }),
      ).toBe('hi world hi');
    });

    it('should return the original string if the substring is not found', () => {
      expect(
        StringUtils.replaceAll({
          input: 'hello world',
          substring: 'bye',
          replacement: 'hi',
        }),
      ).toBe('hello world');
    });
  });

  describe('replaceOccurrences', () => {
    it('should replace all occurrences if occurrences is greater than available matches', () => {
      expect(
        StringUtils.replaceOccurrences({
          input: 'hello hello hello',
          substring: 'hello',
          replacement: 'hi',
          occurrences: 5,
        }),
      ).toBe('hi hi hi');
    });

    it('should not replace if occurrences is 0', () => {
      expect(
        StringUtils.replaceOccurrences({
          input: 'hello world hello',
          substring: 'hello',
          replacement: 'hi',
          occurrences: 0,
        }),
      ).toBe('hello world hello');
    });

    it('should replace the first x occurrences of a substring', () => {
      expect(
        StringUtils.replaceOccurrences({
          input: 'hello world hello',
          substring: 'hello',
          replacement: 'hi',
          occurrences: 1,
        }),
      ).toBe('hi world hello');
    });
  });
});
