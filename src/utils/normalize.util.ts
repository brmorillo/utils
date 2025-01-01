export const normalizeValue = <T>(value: T): T => {
  if (value === -0) return 0 as T;
  return value;
};
