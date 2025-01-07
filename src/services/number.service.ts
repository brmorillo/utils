import { Normalize } from '../middleware/normalize.middleware';

@Normalize
export class NumberUtils {
  /**
   * Checks if a number is even.
   * @param value The number to check.
   * @returns `true` if the number is even, otherwise `false`.
   * @example
   * NumberUtils.isEven({ value: 4 }); // true
   */
  public static isEven({ value }: { value: number }): boolean {
    return value % 2 === 0;
  }

  /**
   * Checks if a number is odd.
   * @param value The number to check.
   * @returns `true` if the number is odd, otherwise `false`.
   * @example
   * NumberUtils.isOdd({ value: 3 }); // true
   */
  public static isOdd({ value }: { value: number }): boolean {
    return value % 2 !== 0;
  }

  /**
   * Checks if a number is positive.
   * @param value The number to check.
   * @returns `true` if the number is positive, otherwise `false`.
   * @example
   * NumberUtils.isPositive({ value: 5 }); // true
   */
  public static isPositive({ value }: { value: number }): boolean {
    return value > 0;
  }

  /**
   * Rounds a number down to the nearest integer.
   * @param value The number to round down.
   * @returns The rounded-down number.
   * @example
   * NumberUtils.roundDown({ value: 4.7 }); // 4
   */
  public static roundDown({ value }: { value: number }): number {
    const result = Math.floor(value);
    return result === -0 ? 0 : result;
  }

  /**
   * Rounds a number up to the nearest integer.
   * @param value The number to round up.
   * @returns The rounded-up number.
   * @example
   * NumberUtils.roundUp({ value: 4.2 }); // 5
   */
  public static roundUp({ value }: { value: number }): number {
    const result = Math.ceil(value);
    return result === -0 ? 0 : result;
  }

  /**
   * Rounds a number to the nearest integer.
   * @param value The number to round.
   * @returns The rounded number.
   * @example
   * NumberUtils.roundToNearest({ value: 4.5 }); // 5
   */
  public static roundToNearest({ value }: { value: number }): number {
    return Math.round(value);
  }

  /**
   * Rounds a number to the specified number of decimal places.
   * @param value The number to be rounded.
   * @param decimals The number of decimal places. Defaults to `2`.
   * @returns The rounded number.
   * @example
   * MathUtils.roundToDecimals({ value: 3.14159, decimals: 2 }); // 3.14
   */
  public static roundToDecimals({
    value,
    decimals = 2,
  }: {
    value: number;
    decimals: number;
  }): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  /**
   * Converts a number to cents by removing decimal places.
   * @param value The number to convert.
   * @returns The number in cents.
   * @example
   * NumberUtils.toCents({ value: 10.56 }); // 1056
   */
  public static toCents({ value }: { value: number }): number {
    return Math.round(value * 100);
  }

  /**
   * Adds decimal places to a number.
   * @param value The number to format.
   * @param decimalPlaces The number of decimal places to add.
   * @returns A string representing the number with the added decimal places.
   * @example
   * NumberUtils.addDecimalPlaces({ value: 10.5, decimalPlaces: 3 }); // "10.500"
   */
  public static addDecimalPlaces({
    value,
    decimalPlaces,
  }: {
    value: number;
    decimalPlaces: number;
  }): string {
    if (isNaN(value) || decimalPlaces < 0) {
      throw new Error(
        `Invalid number or decimal places: ${value}, ${decimalPlaces}`,
      );
    }
    return value.toFixed(decimalPlaces);
  }

  /**
   * Removes all decimal places from a number.
   * @param value The number to format.
   * @returns The number without decimal places.
   * @example
   * NumberUtils.removeDecimalPlaces({ value: 10.56 }); // 10
   */
  public static removeDecimalPlaces({ value }: { value: number }): number {
    return Math.trunc(value);
  }

  /**
   * Generates a random integer within a specified range.
   * @param min The minimum value (inclusive).
   * @param max The maximum value (inclusive).
   * @returns A random integer within the specified range.
   * @example
   * NumberUtils.randomIntegerInRange({ min: 1, max: 10 }); // 7
   */
  public static randomIntegerInRange({
    min,
    max,
  }: {
    min: number;
    max: number;
  }): number {
    if (min > max) {
      throw new Error(
        `Minimum value ${min} is greater than maximum value ${max}`,
      );
    }
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomValue;
  }

  /**
   * Generates a random float within a specified range.
   * @param min The minimum value (inclusive).
   * @param max The maximum value (exclusive).
   * @param decimals The number of decimal places (default: 2).
   * @returns A random float within the specified range.
   * @example
   * NumberUtils.randomFloatInRange({ min: 1, max: 10, decimals: 2 }); // 7.42
   */
  public static randomFloatInRange({
    min,
    max,
    decimals = 2,
  }: {
    min: number;
    max: number;
    decimals?: number;
  }): number {
    const randomValue = Math.random() * (max - min) + min;
    return parseFloat(randomValue.toFixed(decimals));
  }

  /**
   * Calculates the factorial of a number.
   * @param value The number to calculate the factorial of.
   * @returns The factorial of the number.
   * @example
   * NumberUtils.factorial({ value: 5 }); // 120
   */
  public static factorial({ value }: { value: number }): number {
    if (value < 0) {
      return 0;
    }
    return value <= 1 ? 1 : value * NumberUtils.factorial({ value: value - 1 });
  }

  /**
   * Clamps a number within a specified range.
   * @param value The number to clamp.
   * @param min The minimum value of the range.
   * @param max The maximum value of the range.
   * @returns The clamped number.
   * @example
   * NumberUtils.clamp({ value: 15, min: 0, max: 10 }); // 10
   */
  public static clamp({
    value,
    min,
    max,
  }: {
    value: number;
    min: number;
    max: number;
  }): number {
    if (min > max) {
      [min, max] = [max, min];
    }
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Checks if a number is a prime number.
   * @param value The number to check.
   * @returns `true` if the number is prime, otherwise `false`.
   * @example
   * NumberUtils.isPrime({ value: 7 }); // true
   */
  public static isPrime({ value }: { value: number }): boolean {
    if (value <= 1) return false;
    if (value <= 3) return true;
    if (value % 2 === 0 || value % 3 === 0) return false;
    for (let i = 5; i * i <= value; i += 6) {
      if (value % i === 0 || value % (i + 2) === 0) return false;
    }
    return true;
  }
}
