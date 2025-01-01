import { normalizeValue } from '../utils/normalize.util';

export function NormalizeReturn() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);

      if (Array.isArray(result)) {
        return result.map(normalizeValue);
      }

      if (typeof result === 'object' && result !== null) {
        return Object.fromEntries(
          Object.entries(result).map(([key, value]) => [
            key,
            normalizeValue(value),
          ]),
        );
      }

      return normalizeValue(result);
    };

    return descriptor;
  };
}
