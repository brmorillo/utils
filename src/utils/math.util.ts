/**
 * Rounds a number to the specified number of decimal places.
 * @param value The number to be rounded
 * @param decimals The number of decimal places
 * @returns Rounded number
 */
export function roundToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculates the percentage of a value.
 * @param total The total value
 * @param part The part value
 * @returns Percentage of the part relative to the total
 */
export function calculatePercentage(total: number, part: number): number {
  return (part / total) * 100;
}

/**
 * Finds the greatest common divisor (GCD) of two numbers.
 * @param a First number
 * @param b Second number
 * @returns GCD of the two numbers
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Finds the least common multiple (LCM) of two numbers.
 * @param a First number
 * @param b Second number
 * @returns LCM of the two numbers
 */
export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * Generates a random number within a given range.
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Random number within the range
 */
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Clamps a number within a specified range.
 * @param value The number to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped number
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
