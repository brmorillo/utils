export class ValidationUtils {
  /**
   * Validates if a string is a valid email address.
   * @param {object} params - The parameters for the method.
   * @param {string} params.email - The string to validate.
   * @returns {boolean} `true` if the string is a valid email, otherwise `false`.
   * @example
   * ValidationUtils.isValidEmail({
   *   email: 'test@example.com'
   * }); // true
   *
   * ValidationUtils.isValidEmail({
   *   email: 'invalid-email'
   * }); // false
   */
  public static isValidEmail({ email }: { email: string }): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Validates if a string is a valid URL.
   * @param {object} params - The parameters for the method.
   * @param {string} params.inputUrl - The string to validate.
   * @returns {boolean} `true` if the string is a valid URL, otherwise `false`.
   * @example
   * ValidationUtils.isValidURL({
   *   inputUrl: 'https://example.com'
   * }); // true
   *
   * ValidationUtils.isValidURL({
   *   inputUrl: 'invalid-url'
   * }); // false
   */
  public static isValidURL({ inputUrl }: { inputUrl: string }): boolean {
    try {
      const url = new URL(inputUrl);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Validates if a string is a valid phone number (generic format).
   * @param {object} params - The parameters for the method.
   * @param {string} params.phoneNumber - The string to validate.
   * @returns {boolean} `true` if the string is a valid phone number, otherwise `false`.
   * @example
   * ValidationUtils.isValidPhoneNumber({
   *   phoneNumber: '+1234567890'
   * }); // true
   *
   * ValidationUtils.isValidPhoneNumber({
   *   phoneNumber: '12345'
   * }); // false
   */
  public static isValidPhoneNumber({
    phoneNumber,
  }: {
    phoneNumber: string;
  }): boolean {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Validates if a value is a number.
   * @param {object} params - The parameters for the method.
   * @param {any} params.value - The value to validate.
   * @returns {boolean} `true` if the value is a number, otherwise `false`.
   * @example
   * ValidationUtils.isNumber({
   *   value: 123
   * }); // true
   *
   * ValidationUtils.isNumber({
   *   value: '123'
   * }); // true (can be parsed as a number)
   *
   * ValidationUtils.isNumber({
   *   value: 'abc'
   * }); // false
   */
  public static isNumber({ value }: { value: any }): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * Validates if a string is a valid hexadecimal color code.
   * @param {object} params - The parameters for the method.
   * @param {string} params.hexColor - The string to validate.
   * @returns {boolean} `true` if the string is a valid hex color, otherwise `false`.
   * @example
   * ValidationUtils.isValidHexColor({
   *   hexColor: '#FFFFFF'
   * }); // true
   *
   * ValidationUtils.isValidHexColor({
   *   hexColor: '#F00'
   * }); // true (shorthand format)
   *
   * ValidationUtils.isValidHexColor({
   *   hexColor: '123456'
   * }); // false (missing #)
   */
  public static isValidHexColor({ hexColor }: { hexColor: string }): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(hexColor);
  }

  /**
   * Validates if a string has a minimum length.
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to validate.
   * @param {number} params.minLength - The minimum length required.
   * @returns {boolean} `true` if the string meets the minimum length, otherwise `false`.
   * @example
   * ValidationUtils.hasMinLength({
   *   input: 'hello',
   *   minLength: 3
   * }); // true
   *
   * ValidationUtils.hasMinLength({
   *   input: 'hi',
   *   minLength: 3
   * }); // false
   */
  public static hasMinLength({
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
   * @param {object} params - The parameters for the method.
   * @param {string} params.input - The string to validate.
   * @param {number} params.maxLength - The maximum length allowed.
   * @returns {boolean} `true` if the string meets the maximum length, otherwise `false`.
   * @example
   * ValidationUtils.hasMaxLength({
   *   input: 'hello',
   *   maxLength: 10
   * }); // true
   *
   * ValidationUtils.hasMaxLength({
   *   input: 'this is too long',
   *   maxLength: 5
   * }); // false
   */
  public static hasMaxLength({
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
   * @param {object} params - The parameters for the method.
   * @param {string} params.jsonString - The string to validate.
   * @returns {boolean} `true` if the string is a valid JSON, otherwise `false`.
   * @example
   * ValidationUtils.isValidJSON({
   *   jsonString: '{"key": "value"}'
   * }); // true
   *
   * ValidationUtils.isValidJSON({
   *   jsonString: '{invalid: json}'
   * }); // false
   */
  public static isValidJSON({ jsonString }: { jsonString: string }): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
}
