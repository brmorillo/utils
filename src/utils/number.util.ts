export class NumberUtils {
  /**
   * Checks if a number is even.
   * @param value The number to check
   * @returns True if the number is even, false otherwise
   * @example
   * NumberUtils.isEven({ value: 4 }) // true
   */
  static isEven({ value }: { value: number }): boolean {
    return value % 2 === 0;
  }

  /**
   * Checks if a number is odd.
   * @param value The number to check
   * @returns True if the number is odd, false otherwise
   * @example
   * NumberUtils.isOdd({ value: 3 }) // true
   */
  static isOdd({ value }: { value: number }): boolean {
    return value % 2 !== 0;
  }

  /**
   * Rounds a number down to the nearest integer.
   * @param value The number to round down
   * @returns Rounded down number
   * @example
   * NumberUtils.roundDown({ value: 4.7 }) // 4
   */
  static roundDown({ value }: { value: number }): number {
    return Math.floor(value);
  }

  /**
   * Rounds a number up to the nearest integer.
   * @param value The number to round up
   * @returns Rounded up number
   * @example
   * NumberUtils.roundUp({ value: 4.2 }) // 5
   */
  static roundUp({ value }: { value: number }): number {
    return Math.ceil(value);
  }

  /**
   * Rounds a number to the nearest integer.
   * @param value The number to round
   * @returns Rounded number
   * @example
   * NumberUtils.roundToNearest({ value: 4.5 }) // 5
   */
  static roundToNearest({ value }: { value: number }): number {
    return Math.round(value);
  }

  /**
   * Converts a number to cents (removes decimal places).
   * @param value The number to convert
   * @returns Number in cents
   * @example
   * NumberUtils.toCents({ value: 10.56 }) // 1056
   */
  static toCents({ value }: { value: number }): number {
    return Math.round(value * 100);
  }

  /**
   * Adds decimal places to a number.
   * @param value The number to format
   * @param decimalPlaces Number of decimal places to add
   * @returns Number with added decimal places
   * @example
   * NumberUtils.addDecimalPlaces({ value: 10.5, decimalPlaces: 3 }) // "10.500"
   */
  static addDecimalPlaces({
    value,
    decimalPlaces,
  }: {
    value: number;
    decimalPlaces: number;
  }): string {
    return value.toFixed(decimalPlaces);
  }

  /**
   * Removes all decimal places from a number.
   * @param value The number to format
   * @returns Number without decimal places
   * @example
   * NumberUtils.removeDecimalPlaces({ value: 10.56 }) // 10
   */
  static removeDecimalPlaces({ value }: { value: number }): number {
    return Math.trunc(value);
  }

  /**
   * Generates a random integer within a specified range.
   * @param min Minimum value (inclusive)
   * @param max Maximum value (inclusive)
   * @returns A random integer within the range
   * @example
   * NumberUtils.randomIntegerInRange({ min: 1, max: 10 }) // e.g., 7
   */
  static randomIntegerInRange({
    min,
    max,
  }: {
    min: number;
    max: number;
  }): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculates the factorial of a number.
   * @param value The number to calculate the factorial of
   * @returns The factorial of the number
   * @example
   * NumberUtils.factorial({ value: 5 }) // 120
   */
  static factorial({ value }: { value: number }): number {
    if (value < 0) {
      return 0;
    }
    return value <= 1 ? 1 : value * NumberUtils.factorial({ value: value - 1 });
  }

  /**
   * Clamps a number within a specified range.
   * @param value The number to clamp
   * @param min Minimum value of the range
   * @param max Maximum value of the range
   * @returns The clamped number
   * @example
   * NumberUtils.clamp({ value: 15, min: 0, max: 10 }) // 10
   */
  static clamp({
    value,
    min,
    max,
  }: {
    value: number;
    min: number;
    max: number;
  }): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Checks if a number is a prime number.
   * @param value The number to check
   * @returns True if the number is prime, false otherwise
   * @example
   * NumberUtils.isPrime({ value: 7 }) // true
   */
  static isPrime({ value }: { value: number }): boolean {
    if (value <= 1) return false;
    if (value <= 3) return true;
    if (value % 2 === 0 || value % 3 === 0) return false;
    for (let i = 5; i * i <= value; i += 6) {
      if (value % i === 0 || value % (i + 2) === 0) return false;
    }
    return true;
  }
}
