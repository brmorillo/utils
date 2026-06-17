import { ArrayUtils } from '../../src/services/array.service';
import { ObjectUtils } from '../../src/services/object.service';

/**
 * Immutability invariant.
 *
 * Every data-transformation method must leave the caller's input untouched by
 * default (mutation is opt-in via `inPlace` where offered). The only intentional
 * exception is `ObjectUtils.deepFreeze`, which freezes the input in place by
 * design (documented). This guards the convention against future regressions —
 * line coverage would not catch a re-introduced mutation.
 *
 * Each case builds a fresh input, snapshots it, runs the method on THAT exact
 * input, and asserts the input is unchanged afterwards.
 */
describe('Immutability invariant (transformations do not mutate input)', () => {
  type Case = { name: string; build: () => any; run: (input: any) => void };

  const cases: Case[] = [
    // ---- ArrayUtils ----
    {
      name: 'ArrayUtils.removeDuplicates',
      build: () => [1, 2, 2, 3],
      run: array => ArrayUtils.removeDuplicates({ array }),
    },
    {
      name: 'ArrayUtils.intersect',
      build: () => [1, 2, 3],
      run: array1 => ArrayUtils.intersect({ array1, array2: [2, 3, 4] }),
    },
    {
      name: 'ArrayUtils.flatten',
      build: () => [1, [2, [3, 4]], 5],
      run: array => ArrayUtils.flatten({ array }),
    },
    {
      name: 'ArrayUtils.groupBy',
      build: () => [1, 2, 3, 4],
      run: array =>
        ArrayUtils.groupBy({ array, keyFn: (n: number) => `${n % 2}` }),
    },
    {
      name: 'ArrayUtils.shuffle',
      build: () => [1, 2, 3, 4, 5],
      run: array => ArrayUtils.shuffle({ array }),
    },
    {
      name: 'ArrayUtils.sort',
      build: () => [3, 1, 2],
      run: array => ArrayUtils.sort({ array, orderBy: 'asc' }),
    },
    // ---- ObjectUtils ----
    {
      name: 'ObjectUtils.deepClone',
      build: () => ({ a: { b: 1 } }),
      run: obj => ObjectUtils.deepClone({ obj }),
    },
    {
      name: 'ObjectUtils.deepMerge (target)',
      build: () => ({ a: 1, nested: { x: 1 } }),
      run: target => ObjectUtils.deepMerge({ target, source: { b: 2 } }),
    },
    {
      name: 'ObjectUtils.deepMerge (source)',
      build: () => ({ b: 2, nested: { y: 1 } }),
      run: source => ObjectUtils.deepMerge({ target: { a: 1 }, source }),
    },
    {
      name: 'ObjectUtils.pick',
      build: () => ({ a: 1, b: 2 }),
      run: obj => ObjectUtils.pick({ obj, keys: ['a'] }),
    },
    {
      name: 'ObjectUtils.omit',
      build: () => ({ a: 1, b: 2 }),
      run: obj => ObjectUtils.omit({ obj, keys: ['b'] }),
    },
    {
      name: 'ObjectUtils.flattenObject',
      build: () => ({ a: { b: 1 } }),
      run: obj => ObjectUtils.flattenObject({ obj }),
    },
    {
      name: 'ObjectUtils.unflattenObject',
      build: () => ({ x: 1 }),
      run: obj => ObjectUtils.unflattenObject({ obj, path: 'a.b', value: 2 }),
    },
    {
      name: 'ObjectUtils.removeUndefined',
      build: () => ({ a: 1, b: undefined }),
      run: obj => ObjectUtils.removeUndefined({ obj }),
    },
    {
      name: 'ObjectUtils.removeNull',
      build: () => ({ a: 1, b: null }),
      run: obj => ObjectUtils.removeNull({ obj }),
    },
    {
      name: 'ObjectUtils.invert',
      build: () => ({ a: 'x' }),
      run: obj => ObjectUtils.invert({ obj }),
    },
  ];

  it.each(cases)('$name leaves its input unchanged', ({ build, run }) => {
    const input = build();
    const snapshot = JSON.stringify(input);
    run(input);
    expect(JSON.stringify(input)).toEqual(snapshot);
  });

  it('self-check: the harness would catch a real mutation', () => {
    const input = [3, 1, 2];
    const snapshot = JSON.stringify(input);
    input.sort(); // a real in-place mutation
    expect(JSON.stringify(input)).not.toEqual(snapshot);
  });
});
