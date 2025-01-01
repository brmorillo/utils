import { ObjectUtils } from './object.service';

describe('ObjectUtils', () => {
  describe('findValue', () => {
    it('should find a nested value by path', () => {
      const obj = { user: { address: { city: 'NY' } } };
      expect(ObjectUtils.findValue({ obj, path: 'user.address.city' })).toBe(
        'NY',
      );
    });

    it('should return undefined for a non-existent path', () => {
      const obj = { user: { address: { city: 'NY' } } };
      expect(
        ObjectUtils.findValue({ obj, path: 'user.phone.number' }),
      ).toBeUndefined();
    });
  });

  describe('deepClone', () => {
    it('should create a deep clone of an object', () => {
      const original = { a: { b: 1 } };
      const clone = ObjectUtils.deepClone({ obj: original });
      clone.a.b = 2;
      expect(original.a.b).toBe(1);
    });

    it('should clone arrays', () => {
      const array: Array<number | { a: number }> = [1, 2, { a: 3 }]; // Especifica o tipo do array
      const clone = ObjectUtils.deepClone({ obj: array });

      if (typeof clone[2] === 'object' && clone[2] !== null) {
        clone[2].a = 4; // Garante que clone[2] é um objeto antes de acessar `a`
      }

      expect((array[2] as { a: number }).a).toBe(3); // Usa asserção de tipo para acessar `a`
    });
  });

  describe('deepMerge', () => {
    it('should deeply merge two objects', () => {
      const target = { a: { b: 1 } };
      const source = { a: { c: 2 } };
      expect(ObjectUtils.deepMerge({ target, source })).toEqual({
        a: { b: 1, c: 2 },
      });
    });

    it('should merge arrays by concatenation', () => {
      const target = { a: [1, 2] };
      const source = { a: [3, 4] };
      expect(ObjectUtils.deepMerge({ target, source })).toEqual({
        a: [1, 2, 3, 4],
      });
    });

    it('should overwrite primitive values', () => {
      const target = { a: 1 };
      const source = { a: 2, b: 3 };
      expect(ObjectUtils.deepMerge({ target, source })).toEqual({ a: 2, b: 3 });
    });
  });

  describe('pick', () => {
    it('should pick specific keys from an object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(ObjectUtils.pick({ obj, keys: ['a', 'c'] })).toEqual({
        a: 1,
        c: 3,
      });
    });
  });

  describe('omit', () => {
    it('should omit specific keys from an object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(ObjectUtils.omit({ obj, keys: ['b'] })).toEqual({ a: 1, c: 3 });
    });
  });

  describe('flattenObject', () => {
    it('should flatten a nested object', () => {
      const obj = { a: { b: 1, c: 2 }, d: 3 };
      expect(ObjectUtils.flattenObject({ obj })).toEqual({
        'a.b': 1,
        'a.c': 2,
        d: 3,
      });
    });
  });

  describe('invert', () => {
    it('should invert the keys and values of an object', () => {
      const obj = { a: 1, b: 2 };
      expect(ObjectUtils.invert({ obj })).toEqual({ 1: 'a', 2: 'b' });
    });
  });

  describe('deepFreeze', () => {
    it('should deeply freeze an object', () => {
      const obj = { a: { b: 1 } };
      const frozen = ObjectUtils.deepFreeze({ obj });
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.a)).toBe(true);
    });
  });

  describe('compare', () => {
    it('should return true for deeply equal objects', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(true);
    });

    it('should return false for non-equal objects', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 3 } };
      expect(ObjectUtils.compare({ obj1, obj2 })).toBe(false);
    });
  });

  describe('groupBy', () => {
    it('should group object values by a callback function', () => {
      const obj = { a: 1, b: 2, c: 1 };
      expect(ObjectUtils.groupBy({ obj, callback: (value) => value })).toEqual({
        1: ['a', 'c'],
        2: ['b'],
      });
    });
  });

  describe('diff', () => {
    it('should find the difference between two objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      expect(ObjectUtils.diff({ obj1, obj2 })).toEqual({ b: 3 });
    });
  });

  describe('unflattenObject', () => {
    it('should set a value in a nested object by path', () => {
      const obj = { a: { b: 1 } };
      ObjectUtils.unflattenObject({ obj, path: 'a.c', value: 2 });
      expect(obj).toEqual({ a: { b: 1, c: 2 } });
    });
  });
});
