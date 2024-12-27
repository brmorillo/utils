/**
 * Checks if a number is even.
 * @param value The number to check
 * @returns True if the number is even, false otherwise
 */
export function isEven(value: number): boolean {
  return value % 2 === 0
}

/**
 * Checks if a number is odd.
 * @param value The number to check
 * @returns True if the number is odd, false otherwise
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0
}

/**
 * Rounds a number down to the nearest integer.
 * @param value The number to round
 * @returns Rounded down number
 */
export function roundDown(value: number): number {
  return Math.floor(value)
}

/**
 * Rounds a number up to the nearest integer.
 * @param value The number to round
 * @returns Rounded up number
 */
export function roundUp(value: number): number {
  return Math.ceil(value)
}

/**
 * Rounds a number to the nearest integer.
 * @param value The number to round
 * @returns Rounded number
 */
export function roundToNearest(value: number): number {
  return Math.round(value)
}

/**
 * Converts a number to cents (removes decimal places).
 * @param value The number to convert
 * @returns Number in cents
 */
export function toCents(value: number): number {
  return Math.round(value * 100)
}

/**
 * Adds decimal places to a number.
 * @param value The number to format
 * @param decimalPlaces The number of decimal places
 * @returns Number with added decimal places
 */
export function addDecimalPlaces(value: number, decimalPlaces: number): string {
  return value.toFixed(decimalPlaces)
}

/**
 * Removes all decimal places from a number.
 * @param value The number to format
 * @returns Number without decimal places
 */
export function removeDecimalPlaces(value: number): number {
  return Math.trunc(value)
}

/**
 * Generates a random integer within a specified range.
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @returns A random integer within the range
 */
export function randomIntegerInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Calculates the factorial of a number.
 * @param value The number to calculate the factorial for
 * @returns The factorial of the number
 */
export function factorial(value: number): number {
  if (value < 0) {
    throw new Error('Factorial is not defined for negative numbers.')
  }
  return value <= 1 ? 1 : value * factorial(value - 1)
}

/**
 * Clamps a number within a specified range.
 * @param value The number to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns The clamped number
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Checks if a number is a prime number.
 * @param value The number to check
 * @returns True if the number is prime, false otherwise
 */
export function isPrime(value: number): boolean {
  if (value <= 1) return false
  if (value <= 3) return true
  if (value % 2 === 0 || value % 3 === 0) return false
  for (let i = 5; i * i <= value; i += 6) {
    if (value % i === 0 || value % (i + 2) === 0) return false
  }
  return true
}
