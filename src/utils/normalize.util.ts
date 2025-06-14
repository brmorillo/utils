/**
 * Normalizes a number by converting negative zero (-0) to positive zero (0).
 * @param {number} value - The number to normalize.
 * @returns {number} The normalized number.
 * @example
 * normalizeNumber(-0); // 0
 * normalizeNumber(5); // 5
 */
export const normalizeNumber = (value: number): number => {
  return Object.is(value, -0) ? 0 : value;
};

/**
 * Normalizes a value by converting negative zero (-0) to positive zero (0).
 * Works with primitive values, arrays, and objects.
 * @param {T} value - The value to normalize.
 * @returns {T} The normalized value.
 * @example
 * normalizeValue(-0); // 0
 * normalizeValue([1, -0, 3]); // [1, 0, 3]
 * normalizeValue({ x: -0, y: 5 }); // { x: 0, y: 5 }
 */
export const normalizeValue = <T>(value: T): T => {
  // Handle primitive values
  if (typeof value !== 'object' || value === null) {
    if (typeof value === 'number') {
      return normalizeNumber(value) as unknown as T;
    }
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(normalizeValue) as unknown as T;
  }

  // Handle objects
  const result = {} as Record<string, any>;
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = normalizeValue((value as Record<string, any>)[key]);
    }
  }
  return result as T;
};

/**
 * Creates a proxy that automatically normalizes number values.
 * @param {T} target - The object to wrap with normalization.
 * @returns {T} A proxy that normalizes number values.
 * @example
 * const obj = createNormalizedProxy({ x: -0 });
 * console.log(obj.x); // 0
 */
export const createNormalizedProxy = <T extends object>(target: T): T => {
  return new Proxy(target, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      return normalizeValue(value);
    },
    set(target, prop, value, receiver) {
      return Reflect.set(target, prop, normalizeValue(value), receiver);
    },
  });
};
