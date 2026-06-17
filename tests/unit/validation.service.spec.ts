import { ValidationUtils } from '../../src/services/validation.service';

/**
 * Unit tests for the ValidationUtils class.
 * These tests verify the behavior of each method individually.
 */
describe('ValidationUtils - Unit Tests', () => {
  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user@subdomain.example.com',
        'user@example.co.uk',
        '123@example.com',
        'user@example-domain.com',
        'user@example.technology',
      ];

      validEmails.forEach(email => {
        expect(ValidationUtils.isValidEmail({ email })).toBe(true);
      });
    });

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'test',
        'test@',
        '@example.com',
        'test@example',
        'test@.com',
        'test@example..com',
        'test@example.c',
        'test@example.com.',
        'test@example.com@example.com',
        'test@example,com',
        'test user@example.com',
        'test\u007F@example.com', // control character
      ];

      // Test each email individually for debugging
      for (const email of invalidEmails) {
        const result = ValidationUtils.isValidEmail({ email });
        if (result !== false) {
          console.log(
            `Email that should be invalid but was accepted: ${email}`,
          );
        }
        expect(result).toBe(false);
      }
    });
  });

  describe('isValidURL', () => {
    it('should validate correct URLs', () => {
      const validURLs = [
        'https://example.com',
        'http://example.com',
        'https://www.example.com',
        'http://subdomain.example.com',
        'https://example.com/path',
        'http://example.com/path/to/resource',
        'https://example.com/path?query=value',
        'http://example.com/path?query=value&another=value',
        'https://example.com:8080',
        'http://192.168.1.1',
        'https://example.com/path#fragment',
      ];

      validURLs.forEach(inputUrl => {
        expect(ValidationUtils.isValidURL({ inputUrl })).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidURLs = [
        'example.com',
        'ftp://example.com',
        'file:///path/to/file',
        'javascript:alert("XSS")',
        'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
        'not a url',
        'http:/example.com',
        'https://example..com',
        'http://',
        'https://',
        '',
      ];

      // Test each URL individually for debugging
      for (const inputUrl of invalidURLs) {
        const result = ValidationUtils.isValidURL({ inputUrl });
        if (result !== false) {
          console.log(
            `URL that should be invalid but was accepted: ${inputUrl}`,
          );
        }
        expect(result).toBe(false);
      }
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      const validPhoneNumbers = [
        '+1234567890',
        '+551155556666',
        '+447911123456',
        '1234567890',
        '12345678901',
        '123456789012',
        '1234567890123',
        '12345678901234',
      ];

      validPhoneNumbers.forEach(phoneNumber => {
        expect(ValidationUtils.isValidPhoneNumber({ phoneNumber })).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhoneNumbers = [
        '+12345',
        '12345',
        '+abc1234567890',
        'abcdefghij',
        '+',
        '',
        '+0234567890',
        '0234567890',
        '+1234567890123456', // too long
      ];

      invalidPhoneNumbers.forEach(phoneNumber => {
        expect(ValidationUtils.isValidPhoneNumber({ phoneNumber })).toBe(false);
      });
    });
  });

  describe('isNumber', () => {
    it('should validate numeric values', () => {
      const validNumbers = [
        123,
        -123,
        0,
        123.456,
        -123.456,
        '123',
        '-123',
        '0',
        '123.456',
        '-123.456',
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      ];

      validNumbers.forEach(value => {
        expect(ValidationUtils.isNumber({ value })).toBe(true);
      });
    });

    it('should reject non-numeric values', () => {
      const invalidNumbers = [
        'abc',
        '123abc',
        'abc123',
        '',
        null,
        undefined,
        NaN,
        Infinity,
        -Infinity,
        {},
        [],
        true,
        false,
      ];

      invalidNumbers.forEach(value => {
        expect(ValidationUtils.isNumber({ value })).toBe(false);
      });
    });
  });

  describe('isValidHexColor', () => {
    it('should validate correct hexadecimal color codes', () => {
      const validHexColors = [
        '#000000',
        '#FFFFFF',
        '#ff0000',
        '#00FF00',
        '#0000ff',
        '#123456',
        '#abcdef',
        '#ABCDEF',
        '#000',
        '#FFF',
        '#f00',
        '#0F0',
        '#00f',
      ];

      validHexColors.forEach(hexColor => {
        expect(ValidationUtils.isValidHexColor({ hexColor })).toBe(true);
      });
    });

    it('should reject invalid hexadecimal color codes', () => {
      const invalidHexColors = [
        '000000',
        'FFFFFF',
        '#1234567',
        '#12345',
        '#1234',
        '#12',
        '#1',
        '#',
        '#xyz',
        '#GHIJKL',
        'rgb(255, 0, 0)',
        'rgba(255, 0, 0, 1)',
        'hsl(0, 100%, 50%)',
        'red',
        '',
      ];

      invalidHexColors.forEach(hexColor => {
        expect(ValidationUtils.isValidHexColor({ hexColor })).toBe(false);
      });
    });
  });

  describe('hasMinLength', () => {
    it('should validate strings with the minimum length', () => {
      const testCases = [
        { input: 'hello', minLength: 5, expected: true },
        { input: 'hello', minLength: 4, expected: true },
        { input: 'hello', minLength: 0, expected: true },
        { input: '', minLength: 0, expected: true },
        { input: 'a', minLength: 1, expected: true },
        { input: 'abcdefghij', minLength: 10, expected: true },
      ];

      testCases.forEach(({ input, minLength, expected }) => {
        expect(ValidationUtils.hasMinLength({ input, minLength })).toBe(
          expected,
        );
      });
    });

    it('should reject strings shorter than the minimum length', () => {
      const testCases = [
        { input: 'hello', minLength: 6, expected: false },
        { input: '', minLength: 1, expected: false },
        { input: 'a', minLength: 2, expected: false },
        { input: 'abcdefghi', minLength: 10, expected: false },
      ];

      testCases.forEach(({ input, minLength, expected }) => {
        expect(ValidationUtils.hasMinLength({ input, minLength })).toBe(
          expected,
        );
      });
    });
  });

  describe('hasMaxLength', () => {
    it('should validate strings with the maximum length', () => {
      const testCases = [
        { input: 'hello', maxLength: 5, expected: true },
        { input: 'hello', maxLength: 6, expected: true },
        { input: 'hello', maxLength: 10, expected: true },
        { input: '', maxLength: 0, expected: true },
        { input: '', maxLength: 5, expected: true },
        { input: 'a', maxLength: 1, expected: true },
      ];

      testCases.forEach(({ input, maxLength, expected }) => {
        expect(ValidationUtils.hasMaxLength({ input, maxLength })).toBe(
          expected,
        );
      });
    });

    it('should reject strings longer than the maximum length', () => {
      const testCases = [
        { input: 'hello', maxLength: 4, expected: false },
        { input: 'hello', maxLength: 0, expected: false },
        { input: 'a', maxLength: 0, expected: false },
        { input: 'abcdefghij', maxLength: 9, expected: false },
      ];

      testCases.forEach(({ input, maxLength, expected }) => {
        expect(ValidationUtils.hasMaxLength({ input, maxLength })).toBe(
          expected,
        );
      });
    });
  });

  describe('isValidJSON', () => {
    it('should validate correct JSON strings', () => {
      const validJSONs = [
        '{}',
        '[]',
        '{"key": "value"}',
        '{"key": 123}',
        '{"key": true}',
        '{"key": null}',
        '{"key": ["value1", "value2"]}',
        '{"key": {"nested": "value"}}',
        '[1, 2, 3]',
        '[{"key": "value"}, {"key": "value2"}]',
        '"string"',
        '123',
        'true',
        'false',
        'null',
      ];

      validJSONs.forEach(jsonString => {
        expect(ValidationUtils.isValidJSON({ jsonString })).toBe(true);
      });
    });

    it('should reject invalid JSON strings', () => {
      const invalidJSONs = [
        '{key: "value"}',
        "{'key': 'value'}",
        '{key: value}',
        '{',
        '}',
        '[',
        ']',
        '{"key": "value",}',
        '{"key": "value"',
        'key: "value"',
        '',
        'undefined',
        'function() {}',
      ];

      invalidJSONs.forEach(jsonString => {
        expect(ValidationUtils.isValidJSON({ jsonString })).toBe(false);
      });
    });
  });
});
