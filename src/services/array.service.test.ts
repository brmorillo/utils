import { ArrayUtils } from './array.service';

describe('ArrayUtils', () => {
  describe('removeDuplicates', () => {
    it('should remove duplicate numbers', () => {
      expect(ArrayUtils.removeDuplicates([1, 2, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should remove duplicate objects based on a key', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 1 }];
      expect(
        ArrayUtils.removeDuplicates(array, (item: { id: number }) => item.id),
      ).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should return the same array if there are no duplicates', () => {
      expect(ArrayUtils.removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => ArrayUtils.removeDuplicates(null)).toThrow(
        'Input must be an array',
      );
    });

    it('should work with an empty array', () => {
      expect(ArrayUtils.removeDuplicates([])).toEqual([]);
    });
  });

  describe('intersect', () => {
    it('should return the intersection of two arrays', () => {
      expect(ArrayUtils.intersect([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it('should return an empty array if there are no common elements', () => {
      expect(ArrayUtils.intersect([1, 2], [3, 4])).toEqual([]);
    });

    it('should return the same array if both are identical', () => {
      expect(ArrayUtils.intersect([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should work with empty arrays', () => {
      expect(ArrayUtils.intersect([], [1, 2, 3])).toEqual([]);
      expect(ArrayUtils.intersect([1, 2, 3], [])).toEqual([]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => ArrayUtils.intersect(null, [1, 2, 3])).toThrow(
        'Both inputs must be arrays',
      );
    });
  });

  describe('flatten', () => {
    it('should flatten a simple nested array', () => {
      expect(ArrayUtils.flatten([1, [2, [3, 4]], 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return the same array if it is already flat', () => {
      expect(ArrayUtils.flatten([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should work with an empty array', () => {
      expect(ArrayUtils.flatten([])).toEqual([]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => ArrayUtils.flatten(null)).toThrow('Input must be an array');
    });
  });

  describe('groupBy', () => {
    it('should group elements by a key', () => {
      const array = [
        { type: 'fruit', name: 'apple' },
        { type: 'vegetable', name: 'carrot' },
        { type: 'fruit', name: 'banana' },
      ];
      expect(
        ArrayUtils.groupBy(
          array,
          (item: { type: string; name: string }) => item.type,
        ),
      ).toEqual({
        fruit: [
          { type: 'fruit', name: 'apple' },
          { type: 'fruit', name: 'banana' },
        ],
        vegetable: [{ type: 'vegetable', name: 'carrot' }],
      });
    });

    it('should return an empty object for an empty array', () => {
      expect(ArrayUtils.groupBy([], (item: any) => item?.type)).toEqual({});
    });

    it('should throw an error if input is not an array', () => {
      expect(() => ArrayUtils.groupBy(null, (item: any) => item?.type)).toThrow(
        'Input must be an array',
      );
    });

    it('should throw an error if key function is not provided', () => {
      expect(() => ArrayUtils.groupBy([1, 2, 3], null)).toThrow();
    });
  });

  describe('shuffle', () => {
    it('should shuffle the elements of the array', () => {
      const array = [1, 2, 3, 4];
      const shuffled = ArrayUtils.shuffle(array);
      expect(shuffled).toHaveLength(array.length);
      expect(shuffled).not.toEqual(array); // Pode falhar em casos raros devido à aleatoriedade
    });

    it('should return the same array if it has only one element', () => {
      expect(ArrayUtils.shuffle([1])).toEqual([1]);
    });

    it('should return an empty array if the input is empty', () => {
      expect(ArrayUtils.shuffle([])).toEqual([]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => ArrayUtils.removeDuplicates(null as any)).toThrow('Input must be an array');
    });
  });

  describe('sort', () => {
    it('should sort an array of numbers in ascending order', () => {
      expect(ArrayUtils.sort([3, 1, 2], 'asc')).toEqual([1, 2, 3]);
    });

    it('should sort an array of numbers in descending order', () => {
      expect(ArrayUtils.sort([3, 1, 2], 'desc')).toEqual([3, 2, 1]);
    });

    it('should sort an array of objects by a key in ascending order', () => {
      const array = [{ id: 2 }, { id: 1 }];
      expect(ArrayUtils.sort(array, { id: 'asc' })).toEqual([
        { id: 1 },
        { id: 2 },
      ]);
    });

    it('should sort an array of objects by multiple keys', () => {
      const array = [
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
        { id: 1, name: 'B' },
      ];
      expect(ArrayUtils.sort(array, { id: 'asc', name: 'desc' })).toEqual([
        { id: 1, name: 'B' },
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => ArrayUtils.sort(null as any, 'asc')).toThrow(
        'Input must be a non-empty array',
      );
    });

    it('should throw an error if orderBy is invalid', () => {
      expect(() => ArrayUtils.sort([1, 2, 3], 'invalid' as unknown as 'asc')).toThrow();
    });
  });

  describe('findSubset', () => {
    it('should find the first object matching the subset', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];
      expect(
        ArrayUtils.findSubset({ array, subset: { name: 'John' } }),
      ).toEqual({ id: 1, name: 'John' });
    });

    it('should return null if no object matches the subset', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];
      expect(
        ArrayUtils.findSubset({ array, subset: { name: 'Doe' } }),
      ).toBeNull();
    });

    it('should work with subsets containing arrays as values', () => {
      const array = [
        { id: 1, tags: ['a', 'b'] },
        { id: 2, tags: ['b', 'c'] },
      ];
      expect(ArrayUtils.findSubset({ array, subset: { tags: ['b'] } })).toEqual(
        { id: 1, tags: ['a', 'b'] },
      );
    });

    it('should throw an error if input is not an array', () => {
      expect(() =>
        ArrayUtils.findSubset({ array: null, subset: { name: 'John' } }),
      ).toThrow();
    });
  });

  describe('isSubset', () => {
    it('should return true if the superset contains the subset', () => {
      const superset = { id: 1, name: 'John' };
      const subset = { name: 'John' };
      expect(ArrayUtils.isSubset({ superset, subset })).toBe(true);
    });

    it('should return false if the subset is not fully contained', () => {
      const superset = { id: 1, name: 'John' };
      const subset = { name: 'Doe' };
      expect(ArrayUtils.isSubset({ superset, subset })).toBe(false);
    });

    it('should return true for empty subsets', () => {
      const superset = { id: 1, name: 'John' };
      expect(ArrayUtils.isSubset({ superset, subset: {} })).toBe(true);
    });

    it('should work with arrays as values in the subset', () => {
      const superset = { id: 1, tags: ['a', 'b', 'c'] };
      const subset = { tags: ['a', 'b'] };
      expect(ArrayUtils.isSubset({ superset, subset })).toBe(true);
    });

    it('should throw an error if inputs are not objects', () => {
      expect(() =>
        ArrayUtils.isSubset({ superset: null, subset: { name: 'John' } }),
      ).toThrow();
    });
  });
});
