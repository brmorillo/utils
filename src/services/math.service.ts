import { Normalize } from '../middleware/normalize.middleware';

@Normalize
export class MathUtils {
  /**
   * Calculates the percentage of a value.
   * @param total The total value.
   * @param part The part value.
   * @returns The percentage of the part relative to the total.
   * @example
   * MathUtils.percentage({ total: 200, part: 50 }); // 25
   */
  public static percentage({
    total,
    part,
  }: {
    total: number;
    part: number;
  }): number {
    return (part / total) * 100;
  }

  /**
   * Finds the greatest common divisor (GCD) of two numbers.
   * @param a The first number.
   * @param b The second number.
   * @returns The greatest common divisor of the two numbers.
   * @example
   * MathUtils.gcd({ a: 24, b: 36 }); // 12
   */
  public static gcd({ a, b }: { a: number; b: number }): number {
    return b === 0 ? a : MathUtils.gcd({ a: b, b: a % b });
  }

  /**
   * Finds the least common multiple (LCM) of two numbers.
   * @param a The first number.
   * @param b The second number.
   * @returns The least common multiple of the two numbers.
   * @example
   * MathUtils.lcm({ a: 4, b: 6 }); // 12
   */
  public static lcm({ a, b }: { a: number; b: number }): number {
    return (a * b) / MathUtils.gcd({ a, b });
  }
}
