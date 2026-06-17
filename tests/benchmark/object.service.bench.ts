import { ObjectUtils } from '../../src/services/object.service';
/**
 * Benchmark tests for the ObjectUtils class.
 * These tests verify the performance of the class in high-frequency operations.
 */
describe('ObjectUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('deepClone', () => {
    it('should clone 100,000 simple objects in a reasonable time', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const count = 100000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepClone({ obj });
        }
      });
      console.log(
        `Time to clone ${count} simple objects: ${executionTime.toFixed(2)}ms`,
      );
      // The average time per clone should be less than 0.01ms
      const avgTimePerClone = executionTime / count;
      expect(avgTimePerClone).toBeLessThan(0.01);
    });

    it('should clone 10,000 complex objects in a reasonable time', () => {
      const obj = {
        a: { b: { c: { d: 1, e: 2, f: 3 } } },
        g: [1, 2, 3, { h: 4, i: [5, 6, 7] }],
        j: 'string',
        k: true,
        l: null,
      };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepClone({ obj });
        }
      });
      console.log(
        `Time to clone ${count} complex objects: ${executionTime.toFixed(2)}ms`,
      );
      // The average time per clone should be less than 0.05ms
      const avgTimePerClone = executionTime / count;
      expect(avgTimePerClone).toBeLessThan(0.05);
    });
  });

  describe('pick', () => {
    it('should select keys from 100,000 objects in a reasonable time', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const keys = ['a', 'c', 'e'] as ('a' | 'b' | 'c' | 'd' | 'e')[];
      const count = 100000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.pick({ obj, keys });
        }
      });
      console.log(
        `Time to select keys from ${count} objects: ${executionTime.toFixed(2)}ms`,
      );
      // The average time per pick should be less than 0.01ms
      const avgTimePerPick = executionTime / count;
      expect(avgTimePerPick).toBeLessThan(0.01);
    });
  });

  describe('omit', () => {
    it('should omit keys from 100,000 objects in a reasonable time', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const keys = ['b', 'd'] as ('a' | 'b' | 'c' | 'd' | 'e')[];
      const count = 100000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.omit({ obj, keys });
        }
      });
      console.log(
        `Time to omit keys from ${count} objects: ${executionTime.toFixed(2)}ms`,
      );
      // The average time per omit should be less than 0.01ms
      const avgTimePerOmit = executionTime / count;
      expect(avgTimePerOmit).toBeLessThan(0.01);
    });
  });

  describe('flattenObject', () => {
    it('should flatten 10,000 simple objects in a reasonable time', () => {
      const obj = { a: 1, b: { c: 2, d: 3 }, e: { f: { g: 4 } } };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.flattenObject({ obj });
        }
      });
      console.log(
        `Time to flatten ${count} simple objects: ${executionTime.toFixed(2)}ms`,
      );
      // The average time per flatten should be less than 0.05ms
      const avgTimePerFlatten = executionTime / count;
      expect(avgTimePerFlatten).toBeLessThan(0.05);
    });

    it('should flatten 1,000 complex objects in a reasonable time', () => {
      // Create an object with many levels of nesting
      const createNestedObject = (depth: number, breadth: number): any => {
        if (depth === 0) return 'value';
        const obj: Record<string, any> = {};
        for (let i = 0; i < breadth; i++) {
          obj[`key${i}`] = createNestedObject(depth - 1, breadth);
        }
        return obj;
      };

      const obj = createNestedObject(5, 3);
      const count = 1000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.flattenObject({ obj });
        }
      });
      console.log(
        `Time to flatten ${count} complex objects: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per flatten should be less than 0.5ms
      const avgTimePerFlatten = executionTime / count;
      expect(avgTimePerFlatten).toBeLessThan(0.5);
    });
  });

  describe('unflattenObject', () => {
    it('should unflatten 10,000 simple objects in a reasonable time', () => {
      const obj = {};
      const path = 'a.b.c';
      const value = 42;
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.unflattenObject({ obj: { ...obj }, path, value });
        }
      });
      console.log(
        `Time to unflatten ${count} simple objects: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per unflatten should be less than 0.05ms
      const avgTimePerUnflatten = executionTime / count;
      expect(avgTimePerUnflatten).toBeLessThan(0.05);
    });

    it('should unflatten 10,000 objects with complex paths in a reasonable time', () => {
      const obj = {};
      const paths = [
        'a.b.c.d.e',
        'a.b.c.d.f',
        'a.b.c.g',
        'a.b.h',
        'a.i',
        'j',
      ];
      const count = 10000 / paths.length;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          for (const path of paths) {
            ObjectUtils.unflattenObject({
              obj: { ...obj },
              path,
              value: `value-${i}-${path}`,
            });
          }
        }
      });
      console.log(
        `Time to unflatten ${
          count * paths.length
        } objects with complex paths: ${executionTime.toFixed(2)}ms`,
      );
      // The average time per unflatten should be less than 0.05ms
      const avgTimePerUnflatten = executionTime / (count * paths.length);
      expect(avgTimePerUnflatten).toBeLessThan(0.05);
    });
  });

  describe('deepMerge', () => {
    it('should merge 10,000 simple objects in a reasonable time', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepMerge({ target, source });
        }
      });
      console.log(
        `Time to merge ${count} simple objects: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per merge should be less than 0.05ms
      const avgTimePerMerge = executionTime / count;
      expect(avgTimePerMerge).toBeLessThan(0.05);
    });

    it('should merge 1,000 complex objects in a reasonable time', () => {
      const target = {
        a: { b: { c: 1, d: 2 }, e: [1, 2] },
        f: { g: 3 },
      };
      const source = {
        a: { b: { d: 3, h: 4 }, e: [3, 4] },
        i: { j: 5 },
      };
      const count = 1000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.deepMerge({ target, source });
        }
      });
      console.log(
        `Time to merge ${count} complex objects: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per merge should be less than 0.5ms
      const avgTimePerMerge = executionTime / count;
      expect(avgTimePerMerge).toBeLessThan(0.5);
    });
  });

  describe('compare', () => {
    it('should compare 10,000 simple objects in a reasonable time', () => {
      const obj1 = { a: 1, b: 2, c: 3 };
      const obj2 = { a: 1, b: 2, c: 3 };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.compare({ obj1, obj2 });
        }
      });
      console.log(
        `Time to compare ${count} simple objects: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per compare should be less than 0.01ms
      const avgTimePerCompare = executionTime / count;
      expect(avgTimePerCompare).toBeLessThan(0.01);
    });

    it('should compare 1,000 complex objects in a reasonable time', () => {
      const obj1 = {
        a: { b: { c: 1, d: 2 }, e: [1, 2] },
        f: { g: 3 },
        h: 'string',
        i: true,
        j: null,
      };
      const obj2 = {
        a: { b: { c: 1, d: 2 }, e: [1, 2] },
        f: { g: 3 },
        h: 'string',
        i: true,
        j: null,
      };
      const count = 1000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.compare({ obj1, obj2 });
        }
      });
      console.log(
        `Time to compare ${count} complex objects: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per compare should be less than 0.1ms
      const avgTimePerCompare = executionTime / count;
      expect(avgTimePerCompare).toBeLessThan(0.1);
    });
  });

  describe('diff', () => {
    it('should find differences between 10,000 pairs of objects in a reasonable time', () => {
      const obj1 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const obj2 = { a: 1, b: 3, c: 3, d: 5, e: 5 };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.diff({ obj1, obj2 });
        }
      });
      console.log(
        `Time to find differences between ${count} pairs of objects: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per diff operation should be less than 0.01ms
      const avgTimePerDiff = executionTime / count;
      expect(avgTimePerDiff).toBeLessThan(0.01);
    });
  });

  describe('findSubsetObjects', () => {
    it('should find subsets in 10,000 objects in a reasonable time', () => {
      const array = [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        { id: 3, name: 'Item 3', value: 300 },
        { id: 4, name: 'Item 4', value: 400 },
        { id: 5, name: 'Item 5', value: 500 },
      ];
      const subset = { name: 'Item 3' };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.findSubsetObjects({ array, subset });
        }
      });
      console.log(
        `Time to find subsets in ${count} objects: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per subset search should be less than 0.01ms
      const avgTimePerFindSubset = executionTime / count;
      expect(avgTimePerFindSubset).toBeLessThan(0.01);
    });
  });

  describe('isSubsetObject', () => {
    it('should check whether an object is a subset of another 10,000 times in a reasonable time', () => {
      const superset = {
        id: 1,
        name: 'Item',
        values: [1, 2, 3],
        nested: { a: 1, b: 2, c: { d: 3, e: 4 } },
      };
      const subset = {
        name: 'Item',
        nested: { a: 1, b: 2, c: { d: 3, e: 4 } },
      };
      const count = 10000;
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.isSubsetObject({ superset, subset });
        }
      });
      console.log(
        `Time to check subsets ${count} times: ${executionTime.toFixed(
          2,
        )}ms`,
      );
      // The average time per subset check should be less than 0.01ms
      const avgTimePerIsSubset = executionTime / count;
      expect(avgTimePerIsSubset).toBeLessThan(0.01);
    });
  });

  describe('compressObject and decompressObject', () => {
    it('should compress and decompress 10,000 objects in a reasonable time', () => {
      const json = {
        id: 1,
        name: 'Test Object',
        description: 'This is a test object for compression benchmark',
        nested: {
          a: 1,
          b: 2,
          c: [1, 2, 3, 4, 5],
        },
        tags: ['test', 'benchmark', 'compression'],
      };
      const count = 10000;
      let compressed: string;
      const compressionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          compressed = ObjectUtils.compressObject({ json });
        }
      });
      console.log(
        `Time to compress ${count} objects: ${compressionTime.toFixed(2)}ms`,
      );

      const decompressionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          ObjectUtils.decompressObject({ jsonString: compressed! });
        }
      });
      console.log(
        `Time to decompress ${count} objects: ${decompressionTime.toFixed(
          2,
        )}ms`,
      );

      // The average time per compression should be less than 0.05ms
      const avgTimePerCompression = compressionTime / count;
      expect(avgTimePerCompression).toBeLessThan(0.05);

      // The average time per decompression should be less than 0.05ms
      const avgTimePerDecompression = decompressionTime / count;
      expect(avgTimePerDecompression).toBeLessThan(0.05);
    });
  });
});