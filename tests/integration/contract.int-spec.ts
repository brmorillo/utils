import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';

import {
  ArrayUtils,
  ObjectUtils,
  StringUtils,
  NumberUtils,
  MathUtils,
  ConvertUtils,
  DateUtils,
  ValidationUtils,
  CryptUtils,
  HashUtils,
  JWTUtils,
  UUIDUtils,
  CuidUtils,
  SnowflakeUtils,
  SortUtils,
  QueueUtils,
  QueueFullError,
  CacheUtils,
  BenchmarkUtils,
  RequestUtils,
  FileUtils,
  EventUtils,
  RetryUtils,
  LazyLoader,
  ValidationError,
  HttpService,
  LogService,
  StorageService,
  Utils,
} from '../../src/index';

/**
 * Contract / smoke test.
 *
 * Exercises at least one representative method of every public module end to
 * end, plus the cross-cutting invariants (typed errors). It mirrors the
 * external `utils-dumb` consumer test but runs in CI on every commit, so a
 * broken contract is caught here even when line coverage stays green.
 */
describe('Library contract (one method per module)', () => {
  it('ArrayUtils.removeDuplicates', () => {
    expect(ArrayUtils.removeDuplicates({ array: [1, 1, 2] })).toEqual([1, 2]);
  });

  it('ObjectUtils.deepMerge', () => {
    expect(
      ObjectUtils.deepMerge({ target: { a: 1 }, source: { b: 2 } }),
    ).toEqual({ a: 1, b: 2 });
  });

  it('StringUtils.toCamelCase', () => {
    expect(StringUtils.toCamelCase({ input: 'hello world' })).toBe('helloWorld');
  });

  it('NumberUtils.isEven / isOdd', () => {
    expect(NumberUtils.isEven({ value: 4 })).toBe(true);
    expect(NumberUtils.isOdd({ value: 3 })).toBe(true);
  });

  it('MathUtils.isPrime', () => {
    expect(MathUtils.isPrime({ value: 7 })).toBe(true);
  });

  it('ConvertUtils.value (number -> integer)', () => {
    expect(ConvertUtils.value({ value: 42.9, toType: 'integer' })).toBe(42);
  });

  it('DateUtils.addTime', () => {
    const d = DateUtils.addTime({
      date: '2023-01-01T00:00:00Z',
      timeToAdd: { days: 1 },
    });
    expect(d.toUTC().toISODate()).toBe('2023-01-02');
  });

  it('ValidationUtils.isValidEmail', () => {
    expect(ValidationUtils.isValidEmail({ email: 'a@b.com' })).toBe(true);
    expect(ValidationUtils.isValidEmail({ email: 'nope' })).toBe(false);
  });

  it('CryptUtils AES-256-GCM round-trip', () => {
    const secretKey = '12345678901234567890123456789012';
    const enc = CryptUtils.aesEncrypt({ data: 'secret', secretKey });
    expect(enc.authTag).toBeTruthy();
    expect(
      CryptUtils.aesDecrypt({
        encryptedData: enc.encryptedData,
        secretKey,
        iv: enc.iv,
        authTag: enc.authTag,
      }),
    ).toBe('secret');
  });

  it('HashUtils bcrypt hash + compare', () => {
    const hash = HashUtils.bcryptHash({ value: 'pw', saltRounds: 8 });
    expect(HashUtils.bcryptCompare({ value: 'pw', encryptedValue: hash })).toBe(
      true,
    );
  });

  it('JWTUtils generate + verify (with default expiry)', () => {
    const token = JWTUtils.generate({ payload: { uid: 1 }, secretKey: 's' });
    expect(JWTUtils.verify({ token, secretKey: 's' })).toMatchObject({ uid: 1 });
    expect(JWTUtils.decode({ token })).toHaveProperty('exp');
  });

  it('UUIDUtils v4 generate + validate', () => {
    expect(UUIDUtils.isValidUuid({ id: UUIDUtils.uuidV4Generate() })).toBe(true);
  });

  it('CuidUtils generate + validate', () => {
    expect(CuidUtils.isValidCuid({ id: CuidUtils.generate({}) })).toBe(true);
  });

  it('SnowflakeUtils generate is valid and unique within a ms', () => {
    const ids = new Set([
      SnowflakeUtils.generate({}),
      SnowflakeUtils.generate({}),
      SnowflakeUtils.generate({}),
    ]);
    expect(ids.size).toBe(3);
    for (const id of ids) {
      expect(SnowflakeUtils.isValidSnowflake({ snowflakeId: id })).toBe(true);
    }
  });

  it('SortUtils.quickSort', () => {
    expect(SortUtils.quickSort({ array: [3, 1, 2] })).toEqual([1, 2, 3]);
  });

  it('QueueUtils queue throws QueueFullError when full', () => {
    const q = QueueUtils.createQueue<number>({ initialItems: [1], maxSize: 1 });
    expect(() => q.enqueue(2)).toThrow(QueueFullError);
  });

  it('CacheUtils set/get', () => {
    const cache = CacheUtils.createCache({ maxSize: 10 });
    cache.set('k', 'v');
    expect(cache.get('k')).toBe('v');
  });

  it('BenchmarkUtils.benchmark', () => {
    const r = BenchmarkUtils.benchmark({ fn: () => 1 + 1, iterations: 10 });
    expect(r.opsPerSecond).toBeGreaterThan(0);
  });

  it('RequestUtils.extractRequestData', () => {
    const data = RequestUtils.extractRequestData({
      request: {
        headers: { 'user-agent': 'Mozilla/5.0' },
        ip: '1.2.3.4',
      },
    });
    expect(data).toBeTruthy();
  });

  it('FileUtils write/read round-trip (temp dir)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'contract-'));
    const file = path.join(dir, 'a.txt');
    FileUtils.writeFile({ filePath: file, data: 'hello' });
    expect(FileUtils.readFile({ filePath: file })).toBe('hello');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('EventUtils emitter on/emit', () => {
    const em = EventUtils.createEmitter();
    let received: unknown;
    em.on('e', (d: unknown) => {
      received = d;
    });
    em.emit('e', 42);
    expect(received).toBe(42);
  });

  it('RetryUtils.retry recovers after failures', async () => {
    let attempts = 0;
    const result = await RetryUtils.retry({
      fn: async () => {
        attempts++;
        if (attempts < 3) throw new Error('fail');
        return 'ok';
      },
      maxAttempts: 5,
      delay: 1,
    });
    expect(result).toBe('ok');
  });

  it('LazyLoader caches the created value', () => {
    let calls = 0;
    const loader = new LazyLoader(() => {
      calls++;
      return {};
    });
    loader.get();
    loader.get();
    expect(calls).toBe(1);
    expect(loader.isLoaded()).toBe(true);
  });

  it('typed errors: library throws ValidationError on bad input', () => {
    expect(() =>
      CryptUtils.aesEncrypt({ data: 'x', secretKey: 'too-short' }),
    ).toThrow(ValidationError);
  });

  it('LogService getInstance', () => {
    const log = LogService.getInstance({ type: 'console', level: 'error' });
    expect(typeof log.error).toBe('function');
  });

  it('StorageService local upload/download (temp dir)', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'contract-st-'));
    const storage = StorageService.getInstance({
      providerType: 'local',
      local: { basePath: dir, baseUrl: 'http://localhost/files' },
    });
    storage.configure({
      providerType: 'local',
      local: { basePath: dir, baseUrl: 'http://localhost/files' },
    });
    await storage.uploadFile('f.txt', 'hi');
    const buf = await storage.downloadFile('f.txt');
    expect(buf.toString()).toBe('hi');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('Utils facade exposes the configurable services', () => {
    const utils = Utils.getInstance();
    expect(typeof utils.getLogger).toBe('function');
    expect(typeof utils.getHttpService).toBe('function');
    expect(typeof utils.getStorageService).toBe('function');
  });

  it('HttpService GET against a local server', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, path: req.url }));
    });
    await new Promise<void>(resolve => server.listen(0, resolve));
    const port = (server.address() as { port: number }).port;
    const svc = HttpService.getInstance({
      clientType: 'http',
      baseUrl: `http://127.0.0.1:${port}`,
    });
    svc.configure({ clientType: 'http', baseUrl: `http://127.0.0.1:${port}` });
    const resp = await svc.get<{ ok: boolean; path: string }>('/ping');
    expect(resp.status).toBe(200);
    expect(resp.data.ok).toBe(true);
    expect(resp.data.path).toBe('/ping');
    await new Promise<void>(resolve => server.close(() => resolve()));
  });
});
