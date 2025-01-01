import { ValidationUtils } from './validation.service';

describe('ValidationUtils', () => {
  describe('isValidEmail', () => {
    it('should return true for a valid email', () => {
      expect(ValidationUtils.isValidEmail({ email: 'test@example.com' })).toBe(
        true,
      );
      expect(
        ValidationUtils.isValidEmail({ email: 'user.name+tag@domain.co.uk' }),
      ).toBe(true);
    });

    it('should return false for an invalid email', () => {
      expect(ValidationUtils.isValidEmail({ email: 'invalid-email' })).toBe(
        false,
      );
      expect(ValidationUtils.isValidEmail({ email: 'user@.com' })).toBe(false);
    });
  });

  describe('isValidURL', () => {
    it('should return true for a valid URL', () => {
      expect(
        ValidationUtils.isValidURL({ inputUrl: 'https://example.com' }),
      ).toBe(true);
      expect(
        ValidationUtils.isValidURL({ inputUrl: 'http://www.example.com' }),
      ).toBe(true);
    });

    it('should return false for an invalid URL', () => {
      expect(ValidationUtils.isValidURL({ inputUrl: 'invalid-url' })).toBe(
        false,
      );
      expect(ValidationUtils.isValidURL({ inputUrl: 'htp://example' })).toBe(
        false,
      );
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should return true for a valid phone number', () => {
      expect(
        ValidationUtils.isValidPhoneNumber({ phoneNumber: '+1234567890' }),
      ).toBe(true);
      expect(
        ValidationUtils.isValidPhoneNumber({ phoneNumber: '1234567890' }),
      ).toBe(true);
    });

    it('should return false for an invalid phone number', () => {
      expect(ValidationUtils.isValidPhoneNumber({ phoneNumber: '12345' })).toBe(
        false,
      );
      expect(
        ValidationUtils.isValidPhoneNumber({ phoneNumber: '+abcd1234' }),
      ).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for a valid number', () => {
      expect(ValidationUtils.isNumber({ value: 123 })).toBe(true);
      expect(ValidationUtils.isNumber({ value: '123.45' })).toBe(true);
    });

    it('should return false for a non-number', () => {
      expect(ValidationUtils.isNumber({ value: 'abc' })).toBe(false);
      expect(ValidationUtils.isNumber({ value: NaN })).toBe(false);
    });
  });

  describe('isValidHexColor', () => {
    it('should return true for a valid hex color', () => {
      expect(ValidationUtils.isValidHexColor({ hexColor: '#FFFFFF' })).toBe(
        true,
      );
      expect(ValidationUtils.isValidHexColor({ hexColor: '#000' })).toBe(true);
    });

    it('should return false for an invalid hex color', () => {
      expect(ValidationUtils.isValidHexColor({ hexColor: '123456' })).toBe(
        false,
      );
      expect(ValidationUtils.isValidHexColor({ hexColor: '#GGG' })).toBe(false);
    });
  });

  describe('hasMinLength', () => {
    it('should return true if the string meets the minimum length', () => {
      expect(
        ValidationUtils.hasMinLength({ input: 'hello', minLength: 3 }),
      ).toBe(true);
    });

    it('should return false if the string does not meet the minimum length', () => {
      expect(ValidationUtils.hasMinLength({ input: 'hi', minLength: 3 })).toBe(
        false,
      );
    });
  });

  describe('hasMaxLength', () => {
    it('should return true if the string meets the maximum length', () => {
      expect(
        ValidationUtils.hasMaxLength({ input: 'hello', maxLength: 10 }),
      ).toBe(true);
    });

    it('should return false if the string exceeds the maximum length', () => {
      expect(
        ValidationUtils.hasMaxLength({
          input: 'this is too long',
          maxLength: 5,
        }),
      ).toBe(false);
    });
  });

  describe('isValidJSON', () => {
    it('should return true for a valid JSON string', () => {
      expect(
        ValidationUtils.isValidJSON({ jsonString: '{"key": "value"}' }),
      ).toBe(true);
    });

    it('should return false for an invalid JSON string', () => {
      expect(
        ValidationUtils.isValidJSON({ jsonString: '{invalid: json}' }),
      ).toBe(false);
    });
  });
});
