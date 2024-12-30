export class ValidationUtils {
  /**
   * Validates if a string is a valid email address.
   * @param email The string to validate
   * @returns True if the string is a valid email, false otherwise
   * @example
   * ValidationUtils.isValidEmail({ email: 'test@example.com' }); // true
   * ValidationUtils.isValidEmail({ email: 'invalid-email' }); // false
   */
  static isValidEmail({ email }: { email: string }): boolean {
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Validates if a string is a valid URL.
   * @param inputUrl The string to validate
   * @returns True if the string is a valid URL, false otherwise
   * @example
   * ValidationUtils.isValidURL({ inputUrl: 'https://example.com' }); // true
   * ValidationUtils.isValidURL({ inputUrl: 'invalid-url' }); // false
   */
  static isValidURL({ inputUrl }: { inputUrl: string }): boolean {
    try {
      new URL(inputUrl);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates if a string is a valid phone number (generic format).
   * @param phoneNumber The string to validate
   * @returns True if the string is a valid phone number, false otherwise
   * @example
   * ValidationUtils.isValidPhoneNumber({ phoneNumber: '+1234567890' }); // true
   * ValidationUtils.isValidPhoneNumber({ phoneNumber: '12345' }); // false
   */
  static isValidPhoneNumber({ phoneNumber }: { phoneNumber: string }): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Validates if a value is a number.
   * @param value The value to validate
   * @returns True if the value is a number, false otherwise
   * @example
   * ValidationUtils.isNumber({ value: 123 }); // true
   * ValidationUtils.isNumber({ value: 'abc' }); // false
   */
  static isNumber({ value }: { value: any }): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * Validates if a string is a valid hexadecimal color code.
   * @param hexColor The string to validate
   * @returns True if the string is a valid hex color, false otherwise
   * @example
   * ValidationUtils.isValidHexColor({ hexColor: '#FFFFFF' }); // true
   * ValidationUtils.isValidHexColor({ hexColor: '123456' }); // false
   */
  static isValidHexColor({ hexColor }: { hexColor: string }): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(hexColor);
  }

  /**
   * Validates if a string has a minimum length.
   * @param input The string to validate
   * @param minLength The minimum length required
   * @returns True if the string meets the minimum length, false otherwise
   * @example
   * ValidationUtils.hasMinLength({ input: 'hello', minLength: 3 }); // true
   * ValidationUtils.hasMinLength({ input: 'hi', minLength: 3 }); // false
   */
  static hasMinLength({
    input,
    minLength,
  }: {
    input: string;
    minLength: number;
  }): boolean {
    return input.length >= minLength;
  }

  /**
   * Validates if a string has a maximum length.
   * @param input The string to validate
   * @param maxLength The maximum length allowed
   * @returns True if the string meets the maximum length, false otherwise
   * @example
   * ValidationUtils.hasMaxLength({ input: 'hello', maxLength: 10 }); // true
   * ValidationUtils.hasMaxLength({ input: 'this is too long', maxLength: 5 }); // false
   */
  static hasMaxLength({
    input,
    maxLength,
  }: {
    input: string;
    maxLength: number;
  }): boolean {
    return input.length <= maxLength;
  }

  /**
   * Validates if a string is a valid JSON string.
   * @param jsonString The string to validate
   * @returns True if the string is a valid JSON, false otherwise
   * @example
   * ValidationUtils.isValidJSON({ jsonString: '{"key": "value"}' }); // true
   * ValidationUtils.isValidJSON({ jsonString: '{invalid: json}' }); // false
   */
  static isValidJSON({ jsonString }: { jsonString: string }): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
}
