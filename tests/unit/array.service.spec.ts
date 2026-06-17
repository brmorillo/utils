import { ArrayUtils } from '../../src/services/array.service';
import { ValidationError } from '../../src/errors';

/**
 * Unit tests for the ArrayUtils class.
 * These tests verify the behavior of each method individually.
 */
describe('ArrayUtils', () => {
  // Tests for the removeDuplicates method
  describe('removeDuplicates', () => {
    it('should remove duplicate values from an array of numbers', () => {
      // Arrange
      const array = [1, 2, 2, 3, 4, 4, 5];

      // Act
      const result = ArrayUtils.removeDuplicates({ array });

      // Assert
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should remove duplicate values from an array of strings', () => {
      // Arrange
      const array = ['a', 'b', 'b', 'c', 'a'];

      // Act
      const result = ArrayUtils.removeDuplicates({ array });

      // Assert
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should remove duplicates using a custom key function', () => {
      // Arrange
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'John (duplicate)' },
      ];

      // Act
      const result = ArrayUtils.removeDuplicates({
        array,
        keyFn: item => item.id,
      });

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should return an empty array when the input is an empty array', () => {
      // Arrange
      const array: number[] = [];

      // Act
      const result = ArrayUtils.removeDuplicates({ array });

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw an error when the input is not an array', () => {
      // Arrange & Act & Assert
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.removeDuplicates({ array: 'not an array' });
      }).toThrow('Input must be an array');
    });
  });

  // Tests for the intersect method
  describe('intersect', () => {
    it('should find the intersection between two arrays of numbers', () => {
      // Arrange
      const array1 = [1, 2, 3, 4];
      const array2 = [3, 4, 5, 6];

      // Act
      const result = ArrayUtils.intersect({ array1, array2 });

      // Assert
      expect(result).toEqual([3, 4]);
    });

    it('should find the intersection between two arrays of strings', () => {
      // Arrange
      const array1 = ['a', 'b', 'c'];
      const array2 = ['b', 'c', 'd'];

      // Act
      const result = ArrayUtils.intersect({ array1, array2 });

      // Assert
      expect(result).toEqual(['b', 'c']);
    });

    it('should return an empty array when there is no intersection', () => {
      // Arrange
      const array1 = [1, 2, 3];
      const array2 = [4, 5, 6];

      // Act
      const result = ArrayUtils.intersect({ array1, array2 });

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw an error when the first input is not an array', () => {
      // Arrange & Act & Assert
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.intersect({ array1: 'not an array', array2: [1, 2, 3] });
      }).toThrow('Both inputs must be arrays');
    });

    it('should throw an error when the second input is not an array', () => {
      // Arrange & Act & Assert
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.intersect({ array1: [1, 2, 3], array2: 'not an array' });
      }).toThrow('Both inputs must be arrays');
    });
  });

  // Tests for the flatten method
  describe('flatten', () => {
    it('should flatten a multidimensional array', () => {
      // Arrange
      const array = [1, [2, [3, 4]], 5];

      // Act
      const result = ArrayUtils.flatten({ array });

      // Assert
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return the same array when it is already flattened', () => {
      // Arrange
      const array = [1, 2, 3, 4, 5];

      // Act
      const result = ArrayUtils.flatten({ array });

      // Assert
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle empty arrays', () => {
      // Arrange
      const array = [1, [], 2, [], 3];

      // Act
      const result = ArrayUtils.flatten({ array });

      // Assert
      expect(result).toEqual([1, 2, 3]);
    });

    it('should deeply flatten while preserving order', () => {
      // Arrange
      const array = [1, [2, [3, [4, [5]]]], 6];

      // Act
      const result = ArrayUtils.flatten({ array });

      // Assert
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should accept deeply-nested arrays at compile time', () => {
      // The recursive NestedArray<T> type must allow arbitrary nesting depth
      // without `as any` casts on the call.
      const result = ArrayUtils.flatten<number>({ array: [1, [2, [3, [4]]]] });
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should throw an error when the input is not an array', () => {
      // Arrange & Act & Assert
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.flatten({ array: 'not an array' });
      }).toThrow('Input must be an array');
    });
  });

  // Tests for the groupBy method
  describe('groupBy', () => {
    it('should group objects by a property', () => {
      // Arrange
      const array = [
        { type: 'fruit', name: 'apple' },
        { type: 'vegetable', name: 'carrot' },
        { type: 'fruit', name: 'banana' },
      ];

      // Act
      const result = ArrayUtils.groupBy({
        array,
        keyFn: item => item.type,
      });

      // Assert
      expect(Object.keys(result)).toEqual(['fruit', 'vegetable']);
      expect(result.fruit).toHaveLength(2);
      expect(result.vegetable).toHaveLength(1);
      expect(result.fruit[0].name).toBe('apple');
      expect(result.fruit[1].name).toBe('banana');
      expect(result.vegetable[0].name).toBe('carrot');
    });

    it('should group numbers by parity', () => {
      // Arrange
      const array = [1, 2, 3, 4, 5];

      // Act
      const result = ArrayUtils.groupBy({
        array,
        keyFn: item => (item % 2 === 0 ? 'even' : 'odd'),
      });

      // Assert
      expect(Object.keys(result)).toEqual(['odd', 'even']);
      expect(result.odd).toEqual([1, 3, 5]);
      expect(result.even).toEqual([2, 4]);
    });

    it('should throw an error when the input is not an array', () => {
      // Arrange & Act & Assert
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.groupBy({ array: 'not an array', keyFn: item => item });
      }).toThrow('Input must be an array');
    });
  });

  // Tests for the shuffle method
  describe('shuffle', () => {
    it('should shuffle an array while keeping the same elements', () => {
      // Arrange
      const array = [1, 2, 3, 4, 5];

      // Act
      const result = ArrayUtils.shuffle({ array });

      // Assert
      // Check that the result has the same length
      expect(result).toHaveLength(array.length);

      // Check that all original elements are present
      array.forEach(item => {
        expect(result).toContain(item);
      });

      // Check that the array was actually shuffled (may rarely fail)
      // Since shuffling is random, there is a small chance of getting the same order
      const isSameOrder = array.every((item, index) => result[index] === item);

      // If the array is very small, it may end up in the same order
      // so we only check when the array is large enough
      if (array.length > 3) {
        // It is unlikely (but possible) that the shuffled array is identical to the original
        // This check may fail occasionally, but it is useful for detecting problems
        expect(isSameOrder).toBe(false);
      }
    });

    it('should return a copy of the array and not modify the original', () => {
      // Arrange
      const array = [1, 2, 3, 4, 5];
      const originalArray = [...array];

      // Act
      const result = ArrayUtils.shuffle({ array });

      // Assert
      expect(array).toEqual(originalArray);
      expect(result).not.toBe(array);
    });

    it('should throw an error when the input is not an array', () => {
      // Arrange & Act & Assert
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.shuffle({ array: 'not an array' });
      }).toThrow('Input must be an array');
    });
  });

  // Tests for the sort method
  describe('sort', () => {
    it('should sort an array of numbers in ascending order', () => {
      // Arrange
      const array = [5, 3, 1, 4, 2];

      // Act
      const result = ArrayUtils.sort({ array, orderBy: 'asc' });

      // Assert
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort an array of numbers in descending order', () => {
      // Arrange
      const array = [5, 3, 1, 4, 2];

      // Act
      const result = ArrayUtils.sort({ array, orderBy: 'desc' });

      // Assert
      expect(result).toEqual([5, 4, 3, 2, 1]);
    });

    it('should sort an array of objects by a property', () => {
      // Arrange
      const array = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
        { name: 'Bob', age: 40 },
      ];

      // Act
      const result = ArrayUtils.sort({ array, orderBy: { age: 'asc' } });

      // Assert
      expect(result[0].age).toBe(25);
      expect(result[1].age).toBe(30);
      expect(result[2].age).toBe(40);
    });

    it('should sort an array of objects by multiple properties', () => {
      // Arrange
      const array = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'Boston' },
        { name: 'Bob', age: 25, city: 'Chicago' },
      ];

      // Act
      const result = ArrayUtils.sort({
        array,
        orderBy: { age: 'asc', city: 'asc' },
      });

      // Assert
      expect(result[0].name).toBe('Jane');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('John');
    });

    it('should treat elements as equal when all sort keys match', () => {
      // Both elements share the same age and city, so the comparator exhausts
      // every key and falls through to `return 0`.
      const array = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jack', age: 30, city: 'New York' },
      ];

      const result = ArrayUtils.sort({
        array,
        orderBy: { age: 'asc', city: 'asc' },
      });

      // Stable sort: original relative order is preserved.
      expect(result.map(item => item.name)).toEqual(['John', 'Jack']);
    });

    it('should sort an array of objects with a plain asc direction', () => {
      // Arrange: objects are comparable via their natural valueOf.
      const array = [
        { valueOf: () => 3 },
        { valueOf: () => 1 },
        { valueOf: () => 2 },
      ];

      // Act
      const result = ArrayUtils.sort({ array, orderBy: 'asc' });

      // Assert
      expect(result.map(item => item.valueOf())).toEqual([1, 2, 3]);
    });

    it('should sort an array of objects with a plain desc direction', () => {
      // Arrange
      const array = [
        { valueOf: () => 1 },
        { valueOf: () => 3 },
        { valueOf: () => 2 },
      ];

      // Act
      const result = ArrayUtils.sort({ array, orderBy: 'desc' });

      // Assert
      expect(result.map(item => item.valueOf())).toEqual([3, 2, 1]);
    });

    it('should be stable, returning 0 for equal elements', () => {
      // Arrange: all elements compare equal.
      const array = [
        { id: 1, valueOf: () => 5 },
        { id: 2, valueOf: () => 5 },
        { id: 3, valueOf: () => 5 },
      ];

      // Act
      const result = ArrayUtils.sort({ array, orderBy: 'asc' });

      // Assert: original relative order preserved.
      expect(result.map(item => item.id)).toEqual([1, 2, 3]);
    });

    it('should throw an error when the input is not an array', () => {
      // Arrange & Act & Assert
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.sort({ array: 'not an array', orderBy: 'asc' });
      }).toThrow('Input must be an array');
    });

    it('should return an empty array when the array is empty', () => {
      // Arrange & Act & Assert
      expect(ArrayUtils.sort({ array: [], orderBy: 'asc' })).toEqual([]);
    });

    it('should throw an error when the orderBy format is invalid', () => {
      // Arrange & Act & Assert
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.sort({ array: [1, 2, 3], orderBy: 'invalid' });
      }).toThrow("Invalid 'orderBy' format");
    });
  });

  // Tests for the findSubset method
  describe('findSubset', () => {
    it('should find the first object that matches the subset', () => {
      // Arrange
      const array = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
        { id: 3, name: 'John', age: 40 },
      ];

      // Act
      const result = ArrayUtils.findSubset({
        array,
        subset: { name: 'John' },
      });

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('John');
      expect(result?.age).toBe(30);
    });

    it('should find a match with multiple properties', () => {
      // Arrange
      const array = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
        { id: 3, name: 'John', age: 40 },
      ];

      // Act
      const result = ArrayUtils.findSubset({
        array,
        subset: { name: 'John', age: 40 },
      });

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(3);
    });

    it('should return null when no match is found', () => {
      // Arrange
      const array = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
      ];

      // Act
      const result = ArrayUtils.findSubset({
        array,
        subset: { name: 'Bob' },
      });

      // Assert
      expect(result).toBeNull();
    });

    it('should match arrays inside objects', () => {
      // Arrange
      const array = [
        { id: 1, tags: ['javascript', 'typescript'] },
        { id: 2, tags: ['python', 'java'] },
      ];

      // Act
      const result = ArrayUtils.findSubset({
        array,
        subset: { tags: ['javascript'] },
      });

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
    });

    it('should throw a ValidationError when the input is not an array', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.findSubset({ array: 'not an array', subset: {} });
      }).toThrow(ValidationError);
    });
  });

  // Tests for the isSubset method
  describe('isSubset', () => {
    it('should check whether an object contains a subset', () => {
      // Arrange
      const superset = { id: 1, name: 'John', age: 30, city: 'New York' };
      const subset = { name: 'John', age: 30 };

      // Act
      const result = ArrayUtils.isSubset({ superset, subset });

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when the subset is not contained', () => {
      // Arrange
      const superset = { id: 1, name: 'John', age: 30 };
      const subset = { name: 'John', city: 'New York' };

      // Act
      const result = ArrayUtils.isSubset({ superset, subset });

      // Assert
      expect(result).toBe(false);
    });

    it('should check arrays inside objects', () => {
      // Arrange
      const superset = { id: 1, tags: ['javascript', 'typescript', 'react'] };
      const subset = { tags: ['javascript', 'typescript'] };

      // Act
      const result = ArrayUtils.isSubset({ superset, subset });

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when an array does not contain all elements', () => {
      // Arrange
      const superset = { id: 1, tags: ['javascript', 'react'] };
      const subset = { tags: ['javascript', 'typescript'] };

      // Act
      const result = ArrayUtils.isSubset({ superset, subset });

      // Assert
      expect(result).toBe(false);
    });

    it('should throw a ValidationError when an input is not an object', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.isSubset({ superset: null, subset: {} });
      }).toThrow(ValidationError);
    });
  });

  // Tests for the groupBy guard
  describe('groupBy validation', () => {
    it('should throw a ValidationError when the input is not an array', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        ArrayUtils.groupBy({ array: 'not an array', keyFn: item => item });
      }).toThrow(ValidationError);
    });
  });
});
