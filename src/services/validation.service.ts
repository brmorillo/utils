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
    if (!email || typeof email !== 'string') return false;

    // Regex mais rigorosa para validação de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Verificações adicionais para casos específicos
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      return false;
    }

    if (email.indexOf('@') !== email.lastIndexOf('@')) {
      return false;
    }

    if (email.includes(' ')) {
      return false;
    }

    const parts = email.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return false;
    }

    const domainParts = parts[1].split('.');
    if (domainParts.length < 2 || domainParts.some(part => !part)) {
      return false;
    }

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
    if (!inputUrl || typeof inputUrl !== 'string') return false;

    // Verificações adicionais antes de tentar criar o objeto URL
    if (inputUrl.includes(' ') || inputUrl.includes('..')) {
      return false;
    }

    // Verificar protocolos permitidos antes de tentar criar o objeto URL
    const allowedProtocols = ['http:', 'https:'];
    const protocolMatch = inputUrl.match(/^([a-z]+):/i);
    if (
      protocolMatch &&
      !allowedProtocols.includes(protocolMatch[0].toLowerCase())
    ) {
      return false;
    }

    // Verificar formato específico para http:/example.com (faltando uma barra)
    if (inputUrl.match(/^https?:\/[^\/]/)) {
      return false;
    }

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
    if (!phoneNumber || typeof phoneNumber !== 'string') return false;
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
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return false;
    if (value === Infinity || value === -Infinity) return false;
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
    if (!hexColor || typeof hexColor !== 'string') return false;
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
    if (typeof input !== 'string') return false;
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
    if (typeof input !== 'string') return false;
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
    if (!jsonString || typeof jsonString !== 'string') return false;
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
}
