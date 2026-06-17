import { ArrayUtils } from '../../src/services/array.service';
/**
 * Benchmark tests for the ArrayUtils class.
 * These tests check the class performance in high-frequency operations.
 */
describe('ArrayUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('removeDuplicates', () => {
    it('should process 100,000 items in a reasonable time', () => {
      // Arrange - Create a large array with many duplicates
      const size = 100000;
      const array = Array.from({ length: size }, (_, i) => i % 1000); // Many duplicates
      // Act - Measure the time to remove duplicates
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.removeDuplicates({ array });
      });
      // Log the execution time
      console.log(
        `Time to remove duplicates from ${size} items: ${executionTime.toFixed(2)}ms`,
      );
      // Assert - Check whether the average time per item is reasonable
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.001); // Less than 0.001ms per item (1 microsecond)
    });
    it('should process objects with a key function in a reasonable time', () => {
      // Arrange - Create an array of objects
      const size = 10000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i % 1000, // Many duplicates
        value: `value-${i}`,
      }));
      // Act - Measure the time to remove duplicates with a key function
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.removeDuplicates({
          array,
          keyFn: item => item.id,
        });
      });
      // Log the execution time
      console.log(
        `Time to remove duplicates from ${size} objects with keyFn: ${executionTime.toFixed(2)}ms`,
      );
      // Assert - Check whether the average time per item is reasonable
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Less than 0.01ms per item
    });
  });

  describe('intersect', () => {
    it('should find the intersection of large arrays in a reasonable time', () => {
      // Arrange - Create two large arrays with some overlap
      const size = 100000;
      const array1 = Array.from({ length: size }, (_, i) => i);
      const array2 = Array.from({ length: size }, (_, i) => i + size / 2);
      // Act - Measure the time to find the intersection
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.intersect({ array1, array2 });
      });
      // Log the execution time
      console.log(
        `Time to find the intersection of two arrays of ${size} items: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Check whether the average time per item is reasonable
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Less than 0.01ms per item
    });
  });

  describe('flatten', () => {
    it('should flatten a large nested array in a reasonable time', () => {
      // Arrange - Create a large nested array
      const size = 10000;
      const nestedArrays = Array.from({ length: size }, (_, i) => [
        i,
        [i + 1, i + 2],
      ]);
      // Act - Measure the time to flatten the array
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.flatten({ array: nestedArrays });
      });
      // Log the execution time
      console.log(
        `Time to flatten a nested array of ${size} items: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Check whether the average time per item is reasonable
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Less than 0.01ms per item
    });
  });

  describe('groupBy', () => {
    it('should group a large array in a reasonable time', () => {
      // Arrange - Create an array of objects
      const size = 100000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i,
        category: `category-${i % 10}`,
        value: i,
      }));
      // Act - Measure the time to group by category
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.groupBy({
          array,
          keyFn: item => item.category,
        });
      });
      // Log the execution time
      console.log(
        `Time to group an array of ${size} items: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Check whether the average time per item is reasonable
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Less than 0.01ms per item
    });
  });

  describe('shuffle', () => {
    it('should shuffle a large array in a reasonable time', () => {
      // Arrange - Create a large array
      const size = 100000;
      const array = Array.from({ length: size }, (_, i) => i);
      // Act - Measure the time to shuffle the array
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.shuffle({ array });
      });
      // Log the execution time
      console.log(
        `Time to shuffle an array of ${size} items: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Check whether the average time per item is reasonable
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.001); // Less than 0.001ms per item
    });
  });

  describe('sort', () => {
    it('should sort a large array in a reasonable time', () => {
      // Arrange - Create a large array
      const size = 10000;
      const array = Array.from({ length: size }, () =>
        Math.floor(Math.random() * size),
      );
      // Act - Measure the time to sort the array
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.sort({
          array,
          orderBy: 'asc',
        });
      });
      // Log the execution time
      console.log(
        `Time to sort an array of ${size} items: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Check whether the average time per item is reasonable
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Less than 0.01ms per item
    });

    it('should sort an array of objects by multiple properties in a reasonable time', () => {
      // Arrange - Create an array of objects
      const size = 10000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i,
        name: `name-${Math.floor(Math.random() * 100)}`,
        value: Math.floor(Math.random() * 1000),
      }));
      // Act - Measure the time to sort the array by multiple properties
      const executionTime = measureExecutionTime(() => {
        ArrayUtils.sort({
          array,
          orderBy: {
            name: 'asc',
            value: 'desc',
          },
        });
      });
      // Log the execution time
      console.log(
        `Time to sort an array of ${size} objects by multiple properties: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Check whether the average time per item is reasonable
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.1); // Less than 0.1ms per item
    });
  });

  describe('findSubset', () => {
    it('should find a subset in a large array in a reasonable time', () => {
      // Arrange - Create a large array of objects
      const size = 100000;
      const array = Array.from({ length: size }, (_, i) => ({
        id: i,
        name: `name-${i % 1000}`,
        category: `category-${i % 10}`,
        active: i % 2 === 0,
      }));
      // Subset to be found
      const subset = {
        category: 'category-5',
        active: true,
      };
      // Act - Measure the time to find the subset
      const executionTime = measureExecutionTime(() => {
        array.filter(item =>
          item.category === subset.category && item.active === subset.active
        );
      });
      // Log the execution time
      console.log(
        `Time to find a subset in an array of ${size} items: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Check whether the average time per item is reasonable
      const avgTimePerItem = executionTime / size;
      expect(avgTimePerItem).toBeLessThan(0.01); // Less than 0.01ms per item
    });
  });

  describe('isSubset', () => {
    it('should check whether an object is a subset of another in a reasonable time', () => {
      // Arrange - Create a large object
      const superset = {
        id: 1,
        name: 'Item',
        values: [1, 2, 3],
        nested: { a: 1, b: 2, c: { d: 3, e: 4 } },
      };
      // Subset to be checked
      const subset = {
        name: 'Item',
        nested: { a: 1, b: 2, c: { d: 3 } },
      };
      // Act - Measure the time to check whether it is a subset
      const count = 100000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const isSubset = Object.entries(subset).every(([key, val]) => {
            if (typeof val === 'object' && val !== null) {
              return JSON.stringify(val) === JSON.stringify(superset[key as keyof typeof superset]);
            }
            return superset[key as keyof typeof superset] === val;
          });
        }
      });
      // Log the execution time
      console.log(
        `Time to check whether it is a subset ${count} times: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // Assert - Check whether the average time per check is reasonable
      const avgTimePerCheck = executionTime / count;
      expect(avgTimePerCheck).toBeLessThan(0.01); // Less than 0.01ms per check
    });
  });
});