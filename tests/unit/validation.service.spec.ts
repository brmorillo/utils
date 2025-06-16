import { ValidationUtils } from '../../src/services/validation.service';

/**
 * Testes unitários para a classe ValidationUtils.
 * Estes testes verificam o comportamento de cada método individualmente.
 */
describe('ValidationUtils - Testes Unitários', () => {
  describe('isValidEmail', () => {
    it('deve validar emails corretos', () => {
const validEmails = [
  'test@example.com',
  'user.name@example.com',
  'user+tag@example.com',
  'user@subdomain.example.com',
  'user@example.co.uk',
  '123@example.com',
  'user@example-domain.com',
  'user@example.technology'
];

validEmails.forEach(email => {
  expect(ValidationUtils.isValidEmail({ email })).toBe(true);
});
    });

    it('deve rejeitar emails inválidos', () => {
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
  'test\u007F@example.com' // caractere de controle
];

// Teste cada email individualmente para depuração
for (const email of invalidEmails) {
  const result = ValidationUtils.isValidEmail({ email });
  if (result !== false) {
    console.log(`Email que deveria ser inválido mas foi aceito: ${email}`);
  }
  expect(result).toBe(false);
}
    });
  });

  describe('isValidURL', () => {
    it('deve validar URLs corretas', () => {
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
  'https://example.com/path#fragment'
];

validURLs.forEach(inputUrl => {
  expect(ValidationUtils.isValidURL({ inputUrl })).toBe(true);
});
    });

    it('deve rejeitar URLs inválidas', () => {
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
  ''
];

// Teste cada URL individualmente para depuração
for (const inputUrl of invalidURLs) {
  const result = ValidationUtils.isValidURL({ inputUrl });
  if (result !== false) {
    console.log(`URL que deveria ser inválida mas foi aceita: ${inputUrl}`);
  }
  expect(result).toBe(false);
}
    });
  });

  describe('isValidPhoneNumber', () => {
    it('deve validar números de telefone corretos', () => {
const validPhoneNumbers = [
  '+1234567890',
  '+551155556666',
  '+447911123456',
  '1234567890',
  '12345678901',
  '123456789012',
  '1234567890123',
  '12345678901234'
];

validPhoneNumbers.forEach(phoneNumber => {
  expect(ValidationUtils.isValidPhoneNumber({ phoneNumber })).toBe(true);
});
    });

    it('deve rejeitar números de telefone inválidos', () => {
const invalidPhoneNumbers = [
  '+12345',
  '12345',
  '+abc1234567890',
  'abcdefghij',
  '+',
  '',
  '+0234567890',
  '0234567890',
  '+1234567890123456' // muito longo
];

invalidPhoneNumbers.forEach(phoneNumber => {
  expect(ValidationUtils.isValidPhoneNumber({ phoneNumber })).toBe(false);
});
    });
  });

  describe('isNumber', () => {
    it('deve validar valores numéricos', () => {
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
  Number.MIN_SAFE_INTEGER
];

validNumbers.forEach(value => {
  expect(ValidationUtils.isNumber({ value })).toBe(true);
});
    });

    it('deve rejeitar valores não numéricos', () => {
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
  false
];

invalidNumbers.forEach(value => {
  expect(ValidationUtils.isNumber({ value })).toBe(false);
});
    });
  });

  describe('isValidHexColor', () => {
    it('deve validar códigos de cores hexadecimais corretos', () => {
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
  '#00f'
];

validHexColors.forEach(hexColor => {
  expect(ValidationUtils.isValidHexColor({ hexColor })).toBe(true);
});
    });

    it('deve rejeitar códigos de cores hexadecimais inválidos', () => {
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
  ''
];

invalidHexColors.forEach(hexColor => {
  expect(ValidationUtils.isValidHexColor({ hexColor })).toBe(false);
});
    });
  });

  describe('hasMinLength', () => {
    it('deve validar strings com comprimento mínimo', () => {
const testCases = [
  { input: 'hello', minLength: 5, expected: true },
  { input: 'hello', minLength: 4, expected: true },
  { input: 'hello', minLength: 0, expected: true },
  { input: '', minLength: 0, expected: true },
  { input: 'a', minLength: 1, expected: true },
  { input: 'abcdefghij', minLength: 10, expected: true }
];

testCases.forEach(({ input, minLength, expected }) => {
  expect(ValidationUtils.hasMinLength({ input, minLength })).toBe(expected);
});
    });

    it('deve rejeitar strings com comprimento menor que o mínimo', () => {
const testCases = [
  { input: 'hello', minLength: 6, expected: false },
  { input: '', minLength: 1, expected: false },
  { input: 'a', minLength: 2, expected: false },
  { input: 'abcdefghi', minLength: 10, expected: false }
];

testCases.forEach(({ input, minLength, expected }) => {
  expect(ValidationUtils.hasMinLength({ input, minLength })).toBe(expected);
});
    });
  });

  describe('hasMaxLength', () => {
    it('deve validar strings com comprimento máximo', () => {
const testCases = [
  { input: 'hello', maxLength: 5, expected: true },
  { input: 'hello', maxLength: 6, expected: true },
  { input: 'hello', maxLength: 10, expected: true },
  { input: '', maxLength: 0, expected: true },
  { input: '', maxLength: 5, expected: true },
  { input: 'a', maxLength: 1, expected: true }
];

testCases.forEach(({ input, maxLength, expected }) => {
  expect(ValidationUtils.hasMaxLength({ input, maxLength })).toBe(expected);
});
    });

    it('deve rejeitar strings com comprimento maior que o máximo', () => {
const testCases = [
  { input: 'hello', maxLength: 4, expected: false },
  { input: 'hello', maxLength: 0, expected: false },
  { input: 'a', maxLength: 0, expected: false },
  { input: 'abcdefghij', maxLength: 9, expected: false }
];

testCases.forEach(({ input, maxLength, expected }) => {
  expect(ValidationUtils.hasMaxLength({ input, maxLength })).toBe(expected);
});
    });
  });

  describe('isValidJSON', () => {
    it('deve validar strings JSON corretas', () => {
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
  'null'
];

validJSONs.forEach(jsonString => {
  expect(ValidationUtils.isValidJSON({ jsonString })).toBe(true);
});
    });

    it('deve rejeitar strings JSON inválidas', () => {
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
  'function() {}'
];

invalidJSONs.forEach(jsonString => {
  expect(ValidationUtils.isValidJSON({ jsonString })).toBe(false);
});
    });
  });
});