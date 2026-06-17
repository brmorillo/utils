import { ArrayUtils } from '../../src/services/array.service';
import { ObjectUtils } from '../../src/services/object.service';
import { SortUtils } from '../../src/services/sort.service';

/**
 * `inPlace` invariant.
 *
 * Every method that offers `inPlace` must honour the same contract: with
 * `inPlace: true` it mutates the caller's input and returns the SAME reference.
 * (The mirror invariant — default options never mutate — lives in
 * `immutability.spec.ts`.) This locks the opt-in-mutation convention so a new
 * `inPlace` method can't silently diverge.
 */
describe('inPlace invariant (opt-in mutation returns the same reference)', () => {
  type Case = { name: string; run: () => { input: unknown; result: unknown } };

  const cases: Case[] = [
    // ---- ArrayUtils ----
    {
      name: 'ArrayUtils.removeDuplicates',
      run: () => {
        const input = [1, 2, 2, 3];
        return {
          input,
          result: ArrayUtils.removeDuplicates({ array: input, inPlace: true }),
        };
      },
    },
    {
      name: 'ArrayUtils.intersect',
      run: () => {
        const input = [1, 2, 3];
        return {
          input,
          result: ArrayUtils.intersect({
            array1: input,
            array2: [2, 3, 4],
            inPlace: true,
          }),
        };
      },
    },
    {
      name: 'ArrayUtils.flatten',
      run: () => {
        const input = [1, [2, [3, 4]], 5];
        return {
          input,
          result: ArrayUtils.flatten({ array: input, inPlace: true }),
        };
      },
    },
    {
      name: 'ArrayUtils.shuffle',
      run: () => {
        const input = [1, 2, 3, 4, 5];
        return {
          input,
          result: ArrayUtils.shuffle({ array: input, inPlace: true }),
        };
      },
    },
    {
      name: 'ArrayUtils.sort',
      run: () => {
        const input = [3, 1, 2];
        return {
          input,
          result: ArrayUtils.sort({ array: input, orderBy: 'asc', inPlace: true }),
        };
      },
    },
    // ---- ObjectUtils ----
    {
      name: 'ObjectUtils.deepMerge',
      run: () => {
        const input: Record<string, unknown> = { a: 1 };
        return {
          input,
          result: ObjectUtils.deepMerge({
            target: input,
            source: { b: 2 },
            inPlace: true,
          }),
        };
      },
    },
    {
      name: 'ObjectUtils.pick',
      run: () => {
        const input = { a: 1, b: 2 };
        return {
          input,
          result: ObjectUtils.pick({ obj: input, keys: ['a'], inPlace: true }),
        };
      },
    },
    {
      name: 'ObjectUtils.omit',
      run: () => {
        const input = { a: 1, b: 2 };
        return {
          input,
          result: ObjectUtils.omit({ obj: input, keys: ['b'], inPlace: true }),
        };
      },
    },
    {
      name: 'ObjectUtils.removeUndefined',
      run: () => {
        const input = { a: 1, b: undefined };
        return {
          input,
          result: ObjectUtils.removeUndefined({ obj: input, inPlace: true }),
        };
      },
    },
    {
      name: 'ObjectUtils.removeNull',
      run: () => {
        const input = { a: 1, b: null };
        return {
          input,
          result: ObjectUtils.removeNull({ obj: input, inPlace: true }),
        };
      },
    },
    {
      name: 'ObjectUtils.unflattenObject',
      run: () => {
        const input: Record<string, unknown> = {};
        return {
          input,
          result: ObjectUtils.unflattenObject({
            obj: input,
            path: 'a.b',
            value: 1,
            inPlace: true,
          }),
        };
      },
    },
    // ---- SortUtils (representative in-place + allocate algorithms) ----
    {
      name: 'SortUtils.bubbleSort',
      run: () => {
        const input = [3, 1, 2];
        return {
          input,
          result: SortUtils.bubbleSort({ array: input, inPlace: true }),
        };
      },
    },
    {
      name: 'SortUtils.mergeSort',
      run: () => {
        const input = [3, 1, 2];
        return {
          input,
          result: SortUtils.mergeSort({ array: input, inPlace: true }),
        };
      },
    },
    {
      name: 'SortUtils.quickSort',
      run: () => {
        const input = [3, 1, 2];
        return {
          input,
          result: SortUtils.quickSort({ array: input, inPlace: true }),
        };
      },
    },
  ];

  it.each(cases)(
    '$name with inPlace:true returns the same reference it received',
    ({ run }) => {
      const { input, result } = run();
      expect(result).toBe(input);
    },
  );

  it('SortUtils.bubbleSort inPlace:true actually sorts the input', () => {
    const input = [5, 3, 8, 1];
    SortUtils.bubbleSort({ array: input, inPlace: true });
    expect(input).toEqual([1, 3, 5, 8]);
  });

  it('ObjectUtils.omit inPlace:true deletes keys from the input', () => {
    const input: Record<string, number> = { a: 1, b: 2, c: 3 };
    ObjectUtils.omit({ obj: input, keys: ['b'], inPlace: true });
    expect(input).toEqual({ a: 1, c: 3 });
  });
});
