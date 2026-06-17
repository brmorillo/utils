import * as pkg from '../../src/index';

/**
 * Public-surface guard.
 *
 * Asserts that every module, service, shared helper and error class the
 * library promises is actually exported from the package root. This catches
 * accidental removals or renames (e.g. dropping a service from src/index.ts)
 * before they reach consumers — line coverage alone would never flag it.
 */
describe('Public surface (package exports)', () => {
  const expectedExports = [
    // Core data
    'ArrayUtils',
    'ObjectUtils',
    'StringUtils',
    'NumberUtils',
    'MathUtils',
    // Data & validation
    'ConvertUtils',
    'DateUtils',
    'ValidationUtils',
    // Security & crypto
    'CryptUtils',
    'HashUtils',
    'JWTUtils',
    // Identifiers
    'UUIDUtils',
    'CuidUtils',
    'SnowflakeUtils',
    // Data structures & algorithms
    'SortUtils',
    'QueueUtils',
    'CacheUtils',
    'BenchmarkUtils',
    // System & I/O
    'FileUtils',
    'RequestUtils',
    'HttpService',
    'LogService',
    'StorageService',
    // Events & control flow
    'EventUtils',
    'RetryUtils',
    'LazyLoader',
    // Shared
    'Cache',
    'Utils',
    // Error classes
    'BaseError',
    'ValidationError',
    'HttpError',
    'StorageError',
    'QueueFullError',
  ];

  it.each(expectedExports)('exports %s as a constructable function', name => {
    expect(typeof (pkg as Record<string, unknown>)[name]).toBe('function');
  });

  it('exports the concrete queue data structures', () => {
    for (const name of [
      'Queue',
      'Stack',
      'PriorityQueue',
      'DelayQueue',
      'CircularBuffer',
      'MultiQueue',
    ]) {
      expect(typeof (pkg as Record<string, unknown>)[name]).toBe('function');
    }
  });

  it('error classes form a single hierarchy under BaseError', () => {
    const { BaseError, ValidationError, HttpError, StorageError, QueueFullError } =
      pkg;
    for (const Err of [ValidationError, HttpError, StorageError, QueueFullError]) {
      const instance = new (Err as new (m: string) => Error)('x');
      expect(instance).toBeInstanceOf(BaseError);
      expect(instance).toBeInstanceOf(Error);
    }
  });

  it('does NOT export removed/internal symbols', () => {
    // GitFlowTestUtils was test scaffolding removed before the v13 freeze.
    expect((pkg as Record<string, unknown>).GitFlowTestUtils).toBeUndefined();
  });
});
