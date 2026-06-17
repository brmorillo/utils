import { StringUtils } from '../../src/services/string.service';

/**
 * Benchmark tests for the StringUtils class.
 * These tests verify the class performance in high-frequency operations.
 */
describe('StringUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('capitalizeFirstLetter', () => {
    it('should process 1,000,000 strings in a reasonable time', () => {
      const input = 'hello world';
      const count = 1000000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.capitalizeFirstLetter({ input });
        }
      });

      console.log(
        `Time to capitalize ${count} strings: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('reverse', () => {
    it('should process 1,000,000 strings in a reasonable time', () => {
      const input = 'hello world';
      const count = 1000000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.reverse({ input });
        }
      });

      console.log(
        `Time to reverse ${count} strings: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });

    it('should process 10,000 long strings in a reasonable time', () => {
      // Create a long string of 10,000 characters
      const input = 'a'.repeat(10000);
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.reverse({ input });
        }
      });

      console.log(
        `Time to reverse ${count} long strings: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(1);
    });
  });

  describe('isValidPalindrome', () => {
    it('should process 1,000,000 palindrome checks in a reasonable time', () => {
      const input = 'racecar';
      const count = 1000000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.isValidPalindrome({ input });
        }
      });

      console.log(
        `Time to check ${count} palindromes: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.002ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.002);
    });

    it('should process 10,000 palindrome checks with complex strings in a reasonable time', () => {
      const input = 'A man, a plan, a canal: Panama';
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.isValidPalindrome({ input });
        }
      });

      console.log(
        `Time to check ${count} complex palindromes: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });

  describe('truncate', () => {
    it('should process 1,000,000 truncations in a reasonable time', () => {
      const input = 'This is a long string that needs to be truncated';
      const maxLength = 20;
      const count = 1000000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.truncate({ input, maxLength });
        }
      });

      console.log(
        `Time to truncate ${count} strings: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.001ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.001);
    });
  });

  describe('toKebabCase', () => {
    it('should process 100,000 conversions to kebab-case in a reasonable time', () => {
      const input = 'ThisIsACamelCaseStringThatNeedsToBeConverted';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.toKebabCase({ input });
        }
      });

      console.log(
        `Time to convert ${count} strings to kebab-case: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('toSnakeCase', () => {
    it('should process 100,000 conversions to snake_case in a reasonable time', () => {
      const input = 'ThisIsACamelCaseStringThatNeedsToBeConverted';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.toSnakeCase({ input });
        }
      });

      console.log(
        `Time to convert ${count} strings to snake_case: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('toCamelCase', () => {
    it('should process 100,000 conversions to camelCase in a reasonable time', () => {
      const input = 'this-is-a-kebab-case-string-that-needs-to-be-converted';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.toCamelCase({ input });
        }
      });

      console.log(
        `Time to convert ${count} strings to camelCase: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('toTitleCase', () => {
    it('should process 100,000 conversions to title case in a reasonable time', () => {
      const input = 'this is a string that needs to be converted to title case';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.toTitleCase({ input });
        }
      });

      console.log(
        `Time to convert ${count} strings to title case: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('countOccurrences', () => {
    it('should process 100,000 occurrence counts in a reasonable time', () => {
      const input =
        'This is a string with multiple occurrences of the word string. String appears multiple times in this string.';
      const substring = 'string';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.countOccurrences({ input, substring });
        }
      });

      console.log(
        `Time to count ${count} occurrences: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });

    it('should process 10,000 occurrence counts on long strings in a reasonable time', () => {
      // Create a long string with many occurrences
      const input = 'target'.repeat(1000);
      const substring = 'target';
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.countOccurrences({ input, substring });
        }
      });

      console.log(
        `Time to count ${count} occurrences on long strings: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(1);
    });
  });

  describe('replaceAll', () => {
    it('should process 100,000 replacements in a reasonable time', () => {
      const input =
        'This is a string with multiple occurrences of the word string. String appears multiple times in this string.';
      const substring = 'string';
      const replacement = 'text';
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.replaceAll({ input, substring, replacement });
        }
      });

      console.log(
        `Time to perform ${count} replacements: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('replaceOccurrences', () => {
    it('should process 100,000 occurrence replacements in a reasonable time', () => {
      const input =
        'This is a string with multiple occurrences of the word string. String appears multiple times in this string.';
      const substring = 'string';
      const replacement = 'text';
      const occurrences = 2;
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.replaceOccurrences({
            input,
            substring,
            replacement,
            occurrences,
          });
        }
      });

      console.log(
        `Time to perform ${count} occurrence replacements: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });
  });

  describe('replacePlaceholders', () => {
    it('should process 100,000 placeholder replacements in a reasonable time', () => {
      const template =
        'Hello, {name}! You have {count} new messages. Your last login was on {date}.';
      const replacements = { name: 'John', count: '5', date: '2023-06-15' };
      const count = 100000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.replacePlaceholders({ template, replacements });
        }
      });

      console.log(
        `Time to perform ${count} placeholder replacements: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 0.01ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.01);
    });

    it('should process 10,000 placeholder replacements on long templates in a reasonable time', () => {
      // Create a long template with many placeholders
      let template = '';
      const replacements: Record<string, string> = {};

      for (let i = 0; i < 100; i++) {
        template += `Field {field${i}} has value {value${i}}. `;
        replacements[`field${i}`] = `field${i}`;
        replacements[`value${i}`] = `value${i}`;
      }

      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          StringUtils.replacePlaceholders({ template, replacements });
        }
      });

      console.log(
        `Time to perform ${count} placeholder replacements on long templates: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per operation should be less than 1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(1);
    });
  });

  describe('Combined operations', () => {
    it('should process 10,000 combined operations in a reasonable time', () => {
      const input = 'This is a test string for benchmark testing';
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Sequence of operations
          const kebabCase = StringUtils.toKebabCase({ input });
          const reversed = StringUtils.reverse({ input: kebabCase });
          const isValidPalindrome = StringUtils.isValidPalindrome({
            input: reversed,
          });
          const truncated = StringUtils.truncate({
            input: reversed,
            maxLength: 20,
          });
          const titleCase = StringUtils.toTitleCase({ input: truncated });
        }
      });

      console.log(
        `Time to perform ${count} combined operations: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per combined operation should be less than 0.1ms
      const avgTimePerOperation = executionTime / count;
      expect(avgTimePerOperation).toBeLessThan(0.1);
    });
  });
});
