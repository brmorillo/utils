export class NumberUtils {
  /**
   * Checks if a number is even.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to check.
   * @returns {boolean} `true` if the number is even, otherwise `false`.
   * @example
   * NumberUtils.isValidEven({ value: 4 }); // true
   * NumberUtils.isValidEven({ value: 5 }); // false
   */
  public static isValidEven({ value }: { value: number }): boolean {
    return value % 2 === 0;
  }

  /**
   * Checks if a number is odd.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to check.
   * @returns {boolean} `true` if the number is odd, otherwise `false`.
   * @example
   * NumberUtils.isValidOdd({ value: 3 }); // true
   * NumberUtils.isValidOdd({ value: 4 }); // false
   */
  public static isValidOdd({ value }: { value: number }): boolean {
    return value % 2 !== 0;
  }

  /**
   * Checks if a number is positive.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to check.
   * @returns {boolean} `true` if the number is positive, otherwise `false`.
   * @example
   * NumberUtils.isPositive({ value: 5 }); // true
   * NumberUtils.isPositive({ value: -5 }); // false
   * NumberUtils.isPositive({ value: 0 }); // false
   */
  public static isPositive({ value }: { value: number }): boolean {
    return value > 0;
  }

  /**
   * Normalizes a number by converting negative zero (-0) to positive zero (0).
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to normalize.
   * @returns {number} The normalized number.
   * @example
   * NumberUtils.normalize({ value: -0 }); // 0
   * NumberUtils.normalize({ value: 5 }); // 5
   */
  public static normalize({ value }: { value: number }): number {
    return Object.is(value, -0) ? 0 : value;
  }

  /**
   * Rounds a number down to the nearest integer.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to round down.
   * @returns {number} The rounded-down number.
   * @example
   * NumberUtils.roundDown({ value: 4.7 }); // 4
   * NumberUtils.roundDown({ value: -4.7 }); // -5
   */
  public static roundDown({ value }: { value: number }): number {
    const result = Math.floor(value);
    return NumberUtils.normalize({ value: result });
  }

  /**
   * Rounds a number up to the nearest integer.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to round up.
   * @returns {number} The rounded-up number.
   * @example
   * NumberUtils.roundUp({ value: 4.2 }); // 5
   * NumberUtils.roundUp({ value: -4.2 }); // -4
   */
  public static roundUp({ value }: { value: number }): number {
    const result = Math.ceil(value);
    return NumberUtils.normalize({ value: result });
  }

  /**
   * Rounds a number to the nearest integer.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to round.
   * @returns {number} The rounded number.
   * @example
   * NumberUtils.roundToNearest({ value: 4.5 }); // 5
   * NumberUtils.roundToNearest({ value: 4.4 }); // 4
   */
  public static roundToNearest({ value }: { value: number }): number {
    const result = Math.round(value);
    return NumberUtils.normalize({ value: result });
  }

  /**
   * Rounds a number to the specified number of decimal places.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to be rounded.
   * @param {number} [params.decimals=2] - The number of decimal places.
   * @returns {number} The rounded number.
   * @example
   * NumberUtils.roundToDecimals({ value: 3.14159, decimals: 2 }); // 3.14
   * NumberUtils.roundToDecimals({ value: 3.14159 }); // 3.14 (default 2 decimals)
   */
  public static roundToDecimals({
    value,
    decimals = 2,
  }: {
    value: number;
    decimals?: number;
  }): number {
    const factor = Math.pow(10, decimals);
    const result = Math.round(value * factor) / factor;
    return NumberUtils.normalize({ value: result });
  }

  /**
   * Converts a number to cents by removing decimal places.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to convert.
   * @returns {number} The number in cents.
   * @example
   * NumberUtils.toCents({ value: 10.56 }); // 1056
   * NumberUtils.toCents({ value: 0.99 }); // 99
   */
  public static toCents({ value }: { value: number }): number {
    return Math.round(value * 100);
  }

  /**
   * Adds decimal places to a number.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to format.
   * @param {number} params.decimalPlaces - The number of decimal places to add.
   * @returns {string} A string representing the number with the added decimal places.
   * @throws {Error} If the value is not a number or decimalPlaces is negative.
   * @example
   * NumberUtils.addDecimalPlaces({ value: 10.5, decimalPlaces: 3 }); // "10.500"
   * NumberUtils.addDecimalPlaces({ value: 10, decimalPlaces: 2 }); // "10.00"
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
    return NumberUtils.normalize({ value }).toFixed(decimalPlaces);
  }

  /**
   * Removes all decimal places from a number.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to format.
   * @returns {number} The number without decimal places.
   * @example
   * NumberUtils.removeDecimalPlaces({ value: 10.56 }); // 10
   * NumberUtils.removeDecimalPlaces({ value: -10.56 }); // -10
   */
  public static removeDecimalPlaces({ value }: { value: number }): number {
    const result = Math.trunc(value);
    return NumberUtils.normalize({ value: result });
  }

  /**
   * Generates a random integer within a specified range.
   * @param {object} params - The parameters for the method.
   * @param {number} params.min - The minimum value (inclusive).
   * @param {number} params.max - The maximum value (inclusive).
   * @returns {number} A random integer within the specified range.
   * @throws {Error} If min is greater than max.
   * @example
   * NumberUtils.randomIntegerInRange({ min: 1, max: 10 }); // e.g., 7 (varies)
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
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generates a random float within a specified range.
   * @param {object} params - The parameters for the method.
   * @param {number} params.min - The minimum value (inclusive).
   * @param {number} params.max - The maximum value (exclusive).
   * @param {number} [params.decimals=2] - The number of decimal places.
   * @returns {number} A random float within the specified range.
   * @example
   * NumberUtils.randomFloatInRange({
   *   min: 1,
   *   max: 10,
   *   decimals: 2
   * }); // e.g., 7.42 (varies)
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
    if (min > max) {
      throw new Error(
        `Minimum value ${min} is greater than maximum value ${max}`,
      );
    }
    // Ensure the result is strictly less than max
    const randomValue = Math.random() * (max - min - Number.EPSILON) + min;
    return parseFloat(randomValue.toFixed(decimals));
  }

  /**
   * Calculates the factorial of a number.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to calculate the factorial of.
   * @returns {number} The factorial of the number.
   * @example
   * NumberUtils.factorial({ value: 5 }); // 120
   * NumberUtils.factorial({ value: 0 }); // 1
   */
  public static factorial({ value }: { value: number }): number {
    if (value < 0) {
      return 0;
    }
    return value <= 1 ? 1 : value * NumberUtils.factorial({ value: value - 1 });
  }

  /**
   * Clamps a number within a specified range.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to clamp.
   * @param {number} params.min - The minimum value of the range.
   * @param {number} params.max - The maximum value of the range.
   * @returns {number} The clamped number.
   * @example
   * NumberUtils.clamp({ value: 15, min: 0, max: 10 }); // 10
   * NumberUtils.clamp({ value: -5, min: 0, max: 10 }); // 0
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
    const result = Math.max(min, Math.min(max, value));
    return NumberUtils.normalize({ value: result });
  }

  /**
   * Checks if a number is a prime number.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to check.
   * @returns {boolean} `true` if the number is prime, otherwise `false`.
   * @example
   * NumberUtils.isValidPrime({ value: 7 }); // true
   * NumberUtils.isValidPrime({ value: 4 }); // false
   */
  public static isValidPrime({ value }: { value: number }): boolean {
    if (value <= 1) return false;
    if (value <= 3) return true;
    if (value % 2 === 0 || value % 3 === 0) return false;
    for (let i = 5; i * i <= value; i += 6) {
      if (value % i === 0 || value % (i + 2) === 0) return false;
    }
    return true;
  }

  /**
   * Checks if a number is odd.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to check.
   * @returns {boolean} `true` if the number is odd, otherwise `false`.
   * @example
   * NumberUtils.isOdd({ value: 3 }); // true
   * NumberUtils.isOdd({ value: 4 }); // false
   */
  public static isOdd({ value }: { value: number }): boolean {
    return value % 2 !== 0;
  }
}
