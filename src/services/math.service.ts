export class MathUtils {
  /**
   * Rounds a number to the specified number of decimal places.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to be rounded.
   * @param {number} [params.decimals=2] - The number of decimal places.
   * @returns {number} Rounded number.
   * @example
   * MathUtils.roundToDecimals({
   *   value: 3.14159,
   *   decimals: 2
   * }); // 3.14
   */
  public static roundToDecimals({
    value,
    decimals = 2,
  }: {
    value: number;
    decimals?: number;
  }): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  /**
   * Calculates the percentage of a value.
   * @param {object} params - The parameters for the method.
   * @param {number} params.total - The total value.
   * @param {number} params.part - The part value.
   * @returns {number} Percentage of the part relative to the total.
   * @throws {Error} If total is zero.
   * @example
   * MathUtils.percentage({
   *   total: 200,
   *   part: 50
   * }); // 25
   */
  public static percentage({
    total,
    part,
  }: {
    total: number;
    part: number;
  }): number {
    if (total === 0) {
      throw new Error('Total cannot be zero');
    }
    return (part / total) * 100;
  }

  /**
   * Generates a random number within a given range.
   * @param {object} params - The parameters for the method.
   * @param {number} params.min - Minimum value (inclusive).
   * @param {number} params.max - Maximum value (inclusive).
   * @returns {number} Random number within the range.
   * @throws {Error} If min is greater than max.
   * @example
   * MathUtils.randomInRange({
   *   min: 1,
   *   max: 10
   * }); // e.g., 5.432 (varies)
   */
  public static randomInRange({
    min,
    max,
  }: {
    min: number;
    max: number;
  }): number {
    if (min > max) {
      throw new Error('Min cannot be greater than max');
    }
    return Math.random() * (max - min) + min;
  }

  /**
   * Finds the greatest common divisor (GCD) of two numbers.
   * @param {object} params - The parameters for the method.
   * @param {number} params.a - The first number.
   * @param {number} params.b - The second number.
   * @returns {number} The greatest common divisor of the two numbers.
   * @example
   * MathUtils.gcd({
   *   a: 24,
   *   b: 36
   * }); // 12
   */
  public static gcd({ a, b }: { a: number; b: number }): number {
    return b === 0 ? a : MathUtils.gcd({ a: b, b: a % b });
  }

  /**
   * Finds the least common multiple (LCM) of two numbers.
   * @param {object} params - The parameters for the method.
   * @param {number} params.a - The first number.
   * @param {number} params.b - The second number.
   * @returns {number} The least common multiple of the two numbers.
   * @example
   * MathUtils.lcm({
   *   a: 4,
   *   b: 6
   * }); // 12
   */
  public static lcm({ a, b }: { a: number; b: number }): number {
    return (a * b) / MathUtils.gcd({ a, b });
  }

  /**
   * Clamps a number within a specified range.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to clamp.
   * @param {number} params.min - The minimum value.
   * @param {number} params.max - The maximum value.
   * @returns {number} The clamped number.
   * @example
   * MathUtils.clamp({
   *   value: 10,
   *   min: 0,
   *   max: 5
   * }); // 5
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
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Checks if a number is prime.
   * @param {object} params - The parameters for the method.
   * @param {number} params.value - The number to check.
   * @returns {boolean} `true` if the number is prime, otherwise `false`.
   * @example
   * MathUtils.isPrime({
   *   value: 7
   * }); // true
   *
   * MathUtils.isPrime({
   *   value: 4
   * }); // false
   */
  public static isPrime({ value }: { value: number }): boolean {
    if (value <= 1) return false;
    for (let i = 2; i <= Math.sqrt(value); i++) {
      if (value % i === 0) return false;
    }
    return true;
  }
}
