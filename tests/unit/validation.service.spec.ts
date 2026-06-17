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
        // `..` in the path/query must NOT cause rejection (host scoped check)
        'https://example.com/path/../resource',
        'https://example.com/path?redirect=../home',
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

    it('should reject empty and non-string inputs', () => {
      expect(ValidationUtils.isValidJSON({ jsonString: '' })).toBe(false);
      expect(
        ValidationUtils.isValidJSON({ jsonString: null as any }),
      ).toBe(false);
      expect(
        ValidationUtils.isValidJSON({ jsonString: undefined as any }),
      ).toBe(false);
      expect(
        ValidationUtils.isValidJSON({ jsonString: 123 as any }),
      ).toBe(false);
    });
  });

  describe('isValidEmail - additional branches', () => {
    it('should reject empty and non-string inputs', () => {
      expect(ValidationUtils.isValidEmail({ email: '' })).toBe(false);
      expect(ValidationUtils.isValidEmail({ email: null as any })).toBe(false);
      expect(
        ValidationUtils.isValidEmail({ email: undefined as any }),
      ).toBe(false);
      expect(ValidationUtils.isValidEmail({ email: 12345 as any })).toBe(false);
    });

    it('should reject emails with leading or trailing dots', () => {
      expect(ValidationUtils.isValidEmail({ email: '.user@example.com' })).toBe(
        false,
      );
      expect(ValidationUtils.isValidEmail({ email: 'user@example.com.' })).toBe(
        false,
      );
    });

    it('should reject emails with multiple @ symbols', () => {
      expect(
        ValidationUtils.isValidEmail({ email: 'user@@example.com' }),
      ).toBe(false);
    });

    it('should reject emails with spaces', () => {
      expect(ValidationUtils.isValidEmail({ email: 'user @example.com' })).toBe(
        false,
      );
    });

    it('should reject emails with empty local or domain parts', () => {
      expect(ValidationUtils.isValidEmail({ email: '@example.com' })).toBe(
        false,
      );
      expect(ValidationUtils.isValidEmail({ email: 'user@' })).toBe(false);
    });
  });

  describe('isValidURL - additional branches', () => {
    it('should reject empty and non-string inputs', () => {
      expect(ValidationUtils.isValidURL({ inputUrl: '' })).toBe(false);
      expect(ValidationUtils.isValidURL({ inputUrl: null as any })).toBe(false);
      expect(
        ValidationUtils.isValidURL({ inputUrl: undefined as any }),
      ).toBe(false);
      expect(ValidationUtils.isValidURL({ inputUrl: 42 as any })).toBe(false);
    });

    it('should reject URLs containing spaces or an empty host label', () => {
      expect(
        ValidationUtils.isValidURL({ inputUrl: 'https://exa mple.com' }),
      ).toBe(false);
      // `..` in the HOST produces an empty label and is rejected
      expect(
        ValidationUtils.isValidURL({ inputUrl: 'https://example..com' }),
      ).toBe(false);
    });

    it('should reject disallowed protocols', () => {
      expect(
        ValidationUtils.isValidURL({ inputUrl: 'ftp://example.com' }),
      ).toBe(false);
      expect(
        ValidationUtils.isValidURL({ inputUrl: 'mailto://example.com' }),
      ).toBe(false);
    });

    it('should reject http with a single slash', () => {
      expect(
        ValidationUtils.isValidURL({ inputUrl: 'http:/example.com' }),
      ).toBe(false);
    });

    it('should reject malformed URLs that throw', () => {
      expect(ValidationUtils.isValidURL({ inputUrl: 'http://' })).toBe(false);
    });
  });

  describe('isValidPhoneNumber - additional branches', () => {
    it('should reject empty and non-string inputs', () => {
      expect(
        ValidationUtils.isValidPhoneNumber({ phoneNumber: '' }),
      ).toBe(false);
      expect(
        ValidationUtils.isValidPhoneNumber({ phoneNumber: null as any }),
      ).toBe(false);
      expect(
        ValidationUtils.isValidPhoneNumber({ phoneNumber: 1234567890 as any }),
      ).toBe(false);
    });
  });

  describe('isNumber - additional branches', () => {
    it('should reject boolean values', () => {
      expect(ValidationUtils.isNumber({ value: true })).toBe(false);
      expect(ValidationUtils.isNumber({ value: false })).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(ValidationUtils.isNumber({ value: null })).toBe(false);
      expect(ValidationUtils.isNumber({ value: undefined })).toBe(false);
    });

    it('should reject Infinity values', () => {
      expect(ValidationUtils.isNumber({ value: Infinity })).toBe(false);
      expect(ValidationUtils.isNumber({ value: -Infinity })).toBe(false);
    });

    it('should reject whitespace-only strings', () => {
      expect(ValidationUtils.isNumber({ value: '   ' })).toBe(false);
      expect(ValidationUtils.isNumber({ value: '\t' })).toBe(false);
    });

    it('should reject non-decimal numeric strings', () => {
      expect(ValidationUtils.isNumber({ value: '0x1F' })).toBe(false);
      expect(ValidationUtils.isNumber({ value: '0b101' })).toBe(false);
      expect(ValidationUtils.isNumber({ value: '0o17' })).toBe(false);
    });

    it('should reject non-string, non-number objects', () => {
      expect(ValidationUtils.isNumber({ value: {} })).toBe(false);
      expect(ValidationUtils.isNumber({ value: [] })).toBe(false);
      expect(ValidationUtils.isNumber({ value: NaN })).toBe(false);
    });
  });

  describe('isValidHexColor - additional branches', () => {
    it('should reject empty and non-string inputs', () => {
      expect(ValidationUtils.isValidHexColor({ hexColor: '' })).toBe(false);
      expect(
        ValidationUtils.isValidHexColor({ hexColor: null as any }),
      ).toBe(false);
      expect(
        ValidationUtils.isValidHexColor({ hexColor: 123456 as any }),
      ).toBe(false);
    });
  });

  describe('hasMinLength - additional branches', () => {
    it('should reject non-string inputs', () => {
      expect(
        ValidationUtils.hasMinLength({ input: 123 as any, minLength: 1 }),
      ).toBe(false);
      expect(
        ValidationUtils.hasMinLength({ input: null as any, minLength: 1 }),
      ).toBe(false);
    });
  });

  describe('hasMaxLength - additional branches', () => {
    it('should reject non-string inputs', () => {
      expect(
        ValidationUtils.hasMaxLength({ input: 123 as any, maxLength: 5 }),
      ).toBe(false);
      expect(
        ValidationUtils.hasMaxLength({ input: null as any, maxLength: 5 }),
      ).toBe(false);
    });
  });

  describe('isValidCPF', () => {
    it('should validate correct CPFs in both formatted and digits-only forms', () => {
      const validCPFs = [
        '529.982.247-25',
        '52998224725',
        '111.444.777-35',
        '11144477735',
      ];

      validCPFs.forEach(cpf => {
        expect(ValidationUtils.isValidCPF({ cpf })).toBe(true);
      });
    });

    it('should reject CPFs with invalid check digits', () => {
      const invalidCPFs = [
        '529.982.247-26', // wrong second digit
        '529.982.247-05', // wrong first check digit
        '52998224724', // wrong second digit
        '111.444.777-30', // wrong digits
        '12345678901', // invalid checksum
      ];

      invalidCPFs.forEach(cpf => {
        expect(ValidationUtils.isValidCPF({ cpf })).toBe(false);
      });
    });

    it('should reject CPFs with all identical digits', () => {
      const repeatedCPFs = [
        '000.000.000-00',
        '111.111.111-11',
        '222.222.222-22',
        '99999999999',
      ];

      repeatedCPFs.forEach(cpf => {
        expect(ValidationUtils.isValidCPF({ cpf })).toBe(false);
      });
    });

    it('should reject CPFs with the wrong length', () => {
      expect(ValidationUtils.isValidCPF({ cpf: '123456789' })).toBe(false);
      expect(ValidationUtils.isValidCPF({ cpf: '529.982.247-2' })).toBe(false);
      expect(ValidationUtils.isValidCPF({ cpf: '5299822472555' })).toBe(false);
    });

    it('should reject empty and non-string inputs', () => {
      expect(ValidationUtils.isValidCPF({ cpf: '' })).toBe(false);
      expect(ValidationUtils.isValidCPF({ cpf: null as any })).toBe(false);
      expect(ValidationUtils.isValidCPF({ cpf: undefined as any })).toBe(false);
      expect(ValidationUtils.isValidCPF({ cpf: 52998224725 as any })).toBe(
        false,
      );
    });
  });

  describe('isValidCNPJ', () => {
    it('should validate correct CNPJs in both formatted and digits-only forms', () => {
      const validCNPJs = ['11.222.333/0001-81', '11222333000181'];

      validCNPJs.forEach(cnpj => {
        expect(ValidationUtils.isValidCNPJ({ cnpj })).toBe(true);
      });
    });

    it('should reject CNPJs with invalid check digits', () => {
      const invalidCNPJs = [
        '11.222.333/0001-82', // wrong second digit
        '11222333000182',
        '11222333000180',
        '12345678000100',
      ];

      invalidCNPJs.forEach(cnpj => {
        expect(ValidationUtils.isValidCNPJ({ cnpj })).toBe(false);
      });
    });

    it('should reject CNPJs with all identical digits', () => {
      const repeatedCNPJs = [
        '00.000.000/0000-00',
        '11111111111111',
        '22.222.222/2222-22',
      ];

      repeatedCNPJs.forEach(cnpj => {
        expect(ValidationUtils.isValidCNPJ({ cnpj })).toBe(false);
      });
    });

    it('should reject CNPJs with the wrong length', () => {
      expect(ValidationUtils.isValidCNPJ({ cnpj: '1122233300018' })).toBe(
        false,
      );
      expect(ValidationUtils.isValidCNPJ({ cnpj: '112223330001811' })).toBe(
        false,
      );
      expect(ValidationUtils.isValidCNPJ({ cnpj: '11.222.333/0001' })).toBe(
        false,
      );
    });

    it('should reject empty and non-string inputs', () => {
      expect(ValidationUtils.isValidCNPJ({ cnpj: '' })).toBe(false);
      expect(ValidationUtils.isValidCNPJ({ cnpj: null as any })).toBe(false);
      expect(
        ValidationUtils.isValidCNPJ({ cnpj: undefined as any }),
      ).toBe(false);
      expect(
        ValidationUtils.isValidCNPJ({ cnpj: 11222333000181 as any }),
      ).toBe(false);
    });
  });

  describe('isValidRG', () => {
    it('should validate a correctly formatted RG without a state', () => {
      expect(ValidationUtils.isValidRG({ rg: '12.345.678-9' })).toBe(true);
      expect(ValidationUtils.isValidRG({ rg: '123456789' })).toBe(true);
    });

    it('should validate an RG ending with X (generic path)', () => {
      expect(ValidationUtils.isValidRG({ rg: '12.345.678-X' })).toBe(true);
      expect(ValidationUtils.isValidRG({ rg: '12345678x' })).toBe(true);
    });

    it('should validate a correct SP RG (9 digits)', () => {
      expect(
        ValidationUtils.isValidRG({ rg: '12.345.678-9', state: 'SP' }),
      ).toBe(true);
      expect(
        ValidationUtils.isValidRG({ rg: '123456789', state: 'sp' }),
      ).toBe(true);
      expect(
        ValidationUtils.isValidRG({ rg: '12.345.678-X', state: 'SP' }),
      ).toBe(true);
    });

    it('should reject an SP RG that does not have exactly 9 characters', () => {
      expect(
        ValidationUtils.isValidRG({ rg: '12.345.678', state: 'SP' }),
      ).toBe(false);
      expect(
        ValidationUtils.isValidRG({ rg: '1234567890', state: 'SP' }),
      ).toBe(false);
    });

    it('should reject an SP RG whose body is not numeric', () => {
      expect(
        ValidationUtils.isValidRG({ rg: '1234567X9', state: 'SP' }),
      ).toBe(false);
    });

    it('should validate other states via the default path', () => {
      expect(
        ValidationUtils.isValidRG({ rg: '12345678', state: 'RJ' }),
      ).toBe(true);
      expect(
        ValidationUtils.isValidRG({ rg: '1234567X', state: 'MG' }),
      ).toBe(true);
    });

    it('should reject RGs outside the allowed length range', () => {
      expect(ValidationUtils.isValidRG({ rg: '1234' })).toBe(false);
      expect(ValidationUtils.isValidRG({ rg: '1234567890123' })).toBe(false);
    });

    it('should reject empty and non-string inputs', () => {
      expect(ValidationUtils.isValidRG({ rg: '' })).toBe(false);
      expect(ValidationUtils.isValidRG({ rg: null as any })).toBe(false);
      expect(ValidationUtils.isValidRG({ rg: undefined as any })).toBe(false);
      expect(ValidationUtils.isValidRG({ rg: 123456789 as any })).toBe(false);
    });
  });
});
