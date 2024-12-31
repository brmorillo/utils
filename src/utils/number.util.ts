export class NumberUtils {
  /**
   * Checks if a number is even.
   * @param value The number to check
   * @returns True if the number is even, false otherwise
   * @example
   * NumberUtils.isEven({ value: 4 }) // true
   */
  public static isEven({ value }: { value: number }): boolean {
    return value % 2 === 0;
  }

  /**
   * Checks if a number is odd.
   * @param value The number to check
   * @returns True if the number is odd, false otherwise
   * @example
   * NumberUtils.isOdd({ value: 3 }) // true
   */
  public static isOdd({ value }: { value: number }): boolean {
    return value % 2 !== 0;
  }

  /**
   * Checks if a number is negative.
   * @param value The number to check
   * @returns True if the number is negative, false otherwise*
   * @example
   * NumberUtils.isPositive({ value: 5 }) // true
   */
  public static isPositive({ value }: { value: number }): boolean {
    return value > 0;
  }

  /**
   * Rounds a number down to the nearest integer.
   * @param value The number to round down
   * @returns Rounded down number
   * @example
   * NumberUtils.roundDown({ value: 4.7 }) // 4
   */
  public static roundDown({ value }: { value: number }): number {
    return Math.floor(value);
  }

  /**
   * Rounds a number up to the nearest integer.
   * @param value The number to round up
   * @returns Rounded up number
   * @example
   * NumberUtils.roundUp({ value: 4.2 }) // 5
   */
  public static roundUp({ value }: { value: number }): number {
    return Math.ceil(value);
  }

  /**
   * Rounds a number to the nearest integer.
   * @param value The number to round
   * @returns Rounded number
   * @example
   * NumberUtils.roundToNearest({ value: 4.5 }) // 5
   */
  public static roundToNearest({ value }: { value: number }): number {
    return Math.round(value);
  }

  /**
   * Converts a number to cents (removes decimal places).
   * @param value The number to convert
   * @returns Number in cents
   * @example
   * NumberUtils.toCents({ value: 10.56 }) // 1056
   */
  public static toCents({ value }: { value: number }): number {
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
  public static addDecimalPlaces({
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
  public static removeDecimalPlaces({ value }: { value: number }): number {
    return Math.trunc(value);
  }

  // TODO: Unify random functions into a single function with optional parameters (randomIntegerInRange and randomFloatInRange)
  /**
   * Generates a random integer within a specified range.
   * @param min Minimum value (inclusive)
   * @param max Maximum value (inclusive)
   * @returns A random integer within the range
   * @example
   * NumberUtils.randomIntegerInRange({ min: 1, max: 10 }) // 7
   */
  public static randomIntegerInRange({
    min,
    max,
  }: {
    min: number;
    max: number;
  }): number {
    return (
      this.roundDown({
        value: this.randomFloatInRange({ min: 0, max: 1 }) * (max - min + 1),
      }) + min
    );
  }

  /**
   * Generates a random float within a specified range.
   * @param min Minimum value (inclusive)
   * @param max Maximum value (exclusive)
   * @returns A random float within the range
   * @example
   * NumberUtils.randomFloatInRange({ min: 1, max: 10 }) // 7.42
   */
  public static randomFloatInRange({
    min,
    max,
    decimals = 2, // Número padrão de casas decimais
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
   * @param value The number to calculate the factorial of
   * @returns The factorial of the number
   * @example
   * NumberUtils.factorial({ value: 5 }) // 120
   */
  public static factorial({ value }: { value: number }): number {
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
  public static clamp({
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
