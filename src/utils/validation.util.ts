/**
 * Validates if a string is a valid email address.
 * @param email The string to validate
 * @returns True if the string is a valid email, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Validates if a string is a valid URL.
 * @param url The string to validate
 * @returns True if the string is a valid URL, false otherwise
 */
export function isValidURL(inputUrl: string): boolean {
  try {
    new URL(inputUrl)
    return true
  } catch {
    return false
  }
}

/**
 * Validates if a string is a valid phone number (generic format).
 * @param phoneNumber The string to validate
 * @returns True if the string is a valid phone number, false otherwise
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phoneNumber)
}

/**
 * Validates if a value is a number.
 * @param value The value to validate
 * @returns True if the value is a number, false otherwise
 */
export function isNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

/**
 * Validates if a string is a valid hexadecimal color code.
 * @param hexColor The string to validate
 * @returns True if the string is a valid hex color, false otherwise
 */
export function isValidHexColor(hexColor: string): boolean {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexColorRegex.test(hexColor)
}

/**
 * Validates if a string has a minimum length.
 * @param input The string to validate
 * @param minLength The minimum length required
 * @returns True if the string meets the minimum length, false otherwise
 */
export function hasMinLength(input: string, minLength: number): boolean {
  return input.length >= minLength
}

/**
 * Validates if a string has a maximum length.
 * @param input The string to validate
 * @param maxLength The maximum length allowed
 * @returns True if the string meets the maximum length, false otherwise
 */
export function hasMaxLength(input: string, maxLength: number): boolean {
  return input.length <= maxLength
}

/**
 * Validates if a string is a valid JSON string.
 * @param jsonString The string to validate
 * @returns True if the string is a valid JSON, false otherwise
 */
export function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString)
    return true
  } catch {
    return false
  }
}
