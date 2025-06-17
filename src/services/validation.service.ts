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

  /**
   * Validates if a string is a valid CPF (Brazilian individual taxpayer registry number).
   * @param {object} params - The parameters for the method.
   * @param {string} params.cpf - The string to validate.
   * @returns {boolean} `true` if the string is a valid CPF, otherwise `false`.
   * @example
   * ValidationUtils.isValidCPF({
   *   cpf: '123.456.789-09'
   * }); // true or false depending on the CPF validity
   *
   * ValidationUtils.isValidCPF({
   *   cpf: '12345678909'
   * }); // true or false depending on the CPF validity
   */
  public static isValidCPF({ cpf }: { cpf: string }): boolean {
    if (!cpf || typeof cpf !== 'string') return false;

    // Remove non-numeric characters
    cpf = cpf.replace(/[^\d]/g, '');

    // Check if length is 11
    if (cpf.length !== 11) return false;

    // Check for known invalid patterns
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    const checkDigit1 = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cpf.charAt(9)) !== checkDigit1) return false;

    // Validate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    const checkDigit2 = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cpf.charAt(10)) !== checkDigit2) return false;

    return true;
  }

  /**
   * Validates if a string is a valid CNPJ (Brazilian company registry number).
   * @param {object} params - The parameters for the method.
   * @param {string} params.cnpj - The string to validate.
   * @returns {boolean} `true` if the string is a valid CNPJ, otherwise `false`.
   * @example
   * ValidationUtils.isValidCNPJ({
   *   cnpj: '12.345.678/0001-90'
   * }); // true or false depending on the CNPJ validity
   *
   * ValidationUtils.isValidCNPJ({
   *   cnpj: '12345678000190'
   * }); // true or false depending on the CNPJ validity
   */
  public static isValidCNPJ({ cnpj }: { cnpj: string }): boolean {
    if (!cnpj || typeof cnpj !== 'string') return false;

    // Remove non-numeric characters
    cnpj = cnpj.replace(/[^\d]/g, '');

    // Check if length is 14
    if (cnpj.length !== 14) return false;

    // Check for known invalid patterns
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    // Validate first check digit
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    // Validate second check digit
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  }

  /**
   * Validates if a string is a valid RG (Brazilian ID document).
   * @param {object} params - The parameters for the method.
   * @param {string} params.rg - The string to validate.
   * @param {string} [params.state] - Optional. The Brazilian state that issued the RG.
   * @returns {boolean} `true` if the string is a valid RG format, otherwise `false`.
   * @example
   * ValidationUtils.isValidRG({
   *   rg: '12.345.678-9'
   * }); // true for valid format
   *
   * ValidationUtils.isValidRG({
   *   rg: '123456789',
   *   state: 'SP'
   * }); // true for valid format for São Paulo
   */
  public static isValidRG({
    rg,
    state,
  }: {
    rg: string;
    state?: string;
  }): boolean {
    if (!rg || typeof rg !== 'string') return false;

    // Remove non-alphanumeric characters
    const cleanRG = rg.replace(/[^\dXx]/g, '');

    // Basic format validation - most RGs have 8-10 characters
    if (cleanRG.length < 5 || cleanRG.length > 12) return false;

    // If state is provided, perform state-specific validation
    if (state) {
      switch (state.toUpperCase()) {
        case 'SP':
          // São Paulo RG has 9 digits
          if (cleanRG.length !== 9) return false;

          // For SP, we could implement the actual check digit algorithm
          // This is a simplified validation for demonstration
          const body = cleanRG.substring(0, 8);
          const digit = cleanRG.charAt(8);

          // Check if body is numeric
          if (!/^\d+$/.test(body)) return false;

          // Check if digit is numeric or 'X'
          if (!/^[\dXx]$/.test(digit)) return false;

          return true;

        // Add other states as needed
        default:
          // For other states, just check if it's numeric or has X as last digit
          return /^\d+[\dXx]?$/.test(cleanRG);
      }
    }

    // Generic validation - check if it's mostly numeric with possibly X at the end
    return /^\d+[\dXx]?$/.test(cleanRG);
  }
}
