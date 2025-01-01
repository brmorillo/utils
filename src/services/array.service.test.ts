import { ArrayUtils } from './array.service';

describe('ArrayUtils', () => {
  describe('removeDuplicates', () => {
    it('should remove duplicates from a simple array', () => {
      expect(ArrayUtils.removeDuplicates({ array: [1, 2, 2, 3] })).toEqual([
        1, 2, 3,
      ]);
    });

    it('should remove duplicates using a key function', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 1 }];
      expect(
        ArrayUtils.removeDuplicates({
          array,
          keyFn: (item) => item.id,
        }),
      ).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should handle an empty array', () => {
      expect(ArrayUtils.removeDuplicates({ array: [] })).toEqual([]);
    });

    it('should work with an array of strings', () => {
      expect(
        ArrayUtils.removeDuplicates({ array: ['a', 'b', 'b', 'c'] }),
      ).toEqual(['a', 'b', 'c']);
    });
  });

  describe('intersect', () => {
    it('should find the intersection of two arrays', () => {
      expect(
        ArrayUtils.intersect({ array1: [1, 2, 3], array2: [2, 3, 4] }),
      ).toEqual([2, 3]);
    });

    it('should return an empty array if no intersection exists', () => {
      expect(ArrayUtils.intersect({ array1: [1, 2], array2: [3, 4] })).toEqual(
        [],
      );
    });

    it('should handle one empty array', () => {
      expect(ArrayUtils.intersect({ array1: [1, 2, 3], array2: [] })).toEqual(
        [],
      );
    });

    it('should handle both arrays being empty', () => {
      expect(ArrayUtils.intersect({ array1: [], array2: [] })).toEqual([]);
    });
  });

  describe('flatten', () => {
    it('should flatten a multi-dimensional array', () => {
      expect(ArrayUtils.flatten({ array: [1, [2, [3, 4]], 5] })).toEqual([
        1, 2, 3, 4, 5,
      ]);
    });

    it('should handle an already flat array', () => {
      expect(ArrayUtils.flatten({ array: [1, 2, 3] })).toEqual([1, 2, 3]);
    });

    it('should handle an empty array', () => {
      expect(ArrayUtils.flatten({ array: [] })).toEqual([]);
    });
  });

  describe('groupBy', () => {
    it('should group elements by a key function', () => {
      const array = [
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
        { type: 'vegetable', name: 'carrot' },
      ];
      expect(
        ArrayUtils.groupBy({
          array,
          keyFn: (item) => item.type,
        }),
      ).toEqual({
        fruit: [
          { type: 'fruit', name: 'apple' },
          { type: 'fruit', name: 'banana' },
        ],
        vegetable: [{ type: 'vegetable', name: 'carrot' }],
      });
    });

    it('should handle an empty array', () => {
      expect(
        ArrayUtils.groupBy({
          array: [],
          keyFn: (item) => (item as any).type,
        }),
      ).toEqual({});
    });

    it('should handle mixed data types in the array', () => {
      const array = [
        { type: 'fruit', name: 'apple' },
        42,
        { type: 'fruit', name: 'banana' },
      ];
      expect(
        ArrayUtils.groupBy({
          array,
          keyFn: (item) => (typeof item === 'object' ? item.type : 'unknown'),
        }),
      ).toEqual({
        fruit: [
          { type: 'fruit', name: 'apple' },
          { type: 'fruit', name: 'banana' },
        ],
        unknown: [42],
      });
    });
  });

  describe('shuffle', () => {
    it('should shuffle the elements of an array', () => {
      const array = [1, 2, 3, 4];
      const shuffled = ArrayUtils.shuffle({ array });
      expect(shuffled).toHaveLength(array.length);
      expect(shuffled.sort()).toEqual(array.sort());
    });

    it('should throw an error if input is not an array', () => {
      expect(() => ArrayUtils.shuffle({ array: null as any })).toThrow(
        'Input must be an array',
      );
    });

    it('should return the same array if it has only one element', () => {
      const array = [1];
      const shuffled = ArrayUtils.shuffle({ array });
      expect(shuffled).toEqual(array);
    });

    it('should return an empty array if the input is empty', () => {
      expect(ArrayUtils.shuffle({ array: [] })).toEqual([]);
    });
  });

  describe('findSubset', () => {
    it('should find the first object that contains a subset', () => {
      const array = [
        { id: '1', name: 'John', age: 30 },
        { id: '2', name: 'Jane', age: 25 },
      ];
      expect(
        ArrayUtils.findSubset({
          array,
          subset: { name: 'John' },
        }),
      ).toEqual({ id: '1', name: 'John', age: 30 });
    });

    it('should return null if no match is found', () => {
      const array = [
        { id: '1', name: 'John', age: 30 },
        { id: '2', name: 'Jane', age: 25 },
      ];
      expect(
        ArrayUtils.findSubset({
          array,
          subset: { age: 40 },
        }),
      ).toBeNull();
    });
  });

  describe('isSubset', () => {
    it('should return true if the subset is contained in the superset', () => {
      const superset = { id: '1', name: 'John', age: 30 };
      const subset = { name: 'John' };
      expect(
        ArrayUtils.isSubset({
          superset,
          subset,
        }),
      ).toBe(true);
    });

    it('should return false if the subset is not contained in the superset', () => {
      const superset = { id: '1', name: 'John', age: 30 };
      const subset = { name: 'Jane' };
      expect(
        ArrayUtils.isSubset({
          superset,
          subset,
        }),
      ).toBe(false);
    });

    it('should handle arrays within objects', () => {
      const superset = { id: '1', tags: ['admin', 'user'] };
      const subset = { tags: ['admin'] };
      expect(
        ArrayUtils.isSubset({
          superset,
          subset,
        }),
      ).toBe(true);
    });
  });

  it('should return true for an empty subset', () => {
    const superset = { id: '1', name: 'John', age: 30 };
    const subset = {};
    expect(
      ArrayUtils.isSubset({
        superset,
        subset,
      }),
    ).toBe(true);
  });

  it('should return true if subset is identical to superset', () => {
    const superset = { id: '1', name: 'John', age: 30 };
    const subset = { id: '1', name: 'John', age: 30 };
    expect(
      ArrayUtils.isSubset({
        superset,
        subset,
      }),
    ).toBe(true);
  });
});
