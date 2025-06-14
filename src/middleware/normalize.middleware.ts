import { normalizeValue } from '../utils/normalize.util';

export function Normalize(target: any) {
  const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
    key => typeof target.prototype[key] === 'function',
  );

  for (const methodName of methodNames) {
    const originalMethod = target.prototype[methodName];

    target.prototype[methodName] = function (...args: any[]) {
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
  }
}
