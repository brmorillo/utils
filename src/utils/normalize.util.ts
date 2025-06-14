/**
 * Normalizes a value by converting negative zero (-0) to positive zero (0).
 * @param {T} value - The value to normalize.
 * @returns {T} The normalized value.
 * @example
 * normalizeValue(-0); // 0
 * normalizeValue(5); // 5
 * normalizeValue("hello"); // "hello"
 */
export const normalizeValue = <T>(value: T): T => {
  if (Object.is(value, -0)) return 0 as T;
  return value;
};
