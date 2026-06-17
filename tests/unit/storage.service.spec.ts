import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Readable } from 'stream';
import { EventEmitter } from 'events';
import { LocalStorageProvider } from '../../src/providers/local-storage.provider';

// The CommonJS `require('fs')` object has configurable properties and can be
// spied on, unlike the ESM namespace import above. Both refer to the same
// module instance used by the provider under test.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fsSpyable = require('fs');
import { StorageService } from '../../src/services/storage.service';

/**
 * Unit tests for the StorageService using the local filesystem provider.
 * These tests operate against a unique temporary directory and verify the
 * full set of file operations exposed by the service.
 */
describe('StorageService (local provider)', () => {
  let tempDir: string;
  let service: StorageService;
  const baseUrl = 'http://localhost/files';

  beforeAll(() => {
    // Arrange: create a unique temporary directory under the OS temp dir.
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'storage-service-test-'));

    // Configure the singleton to use the local provider rooted at our temp dir.
    // Pass options to getInstance so the first construction succeeds, and also
    // call configure so an already-created singleton is reconfigured.
    const options = {
      providerType: 'local' as const,
      local: { basePath: tempDir, baseUrl },
    };
    service = StorageService.getInstance(options);
    service.configure(options);
  });

  afterAll(() => {
    // Cleanup: remove the temporary directory and all its contents.
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('uploadFile', () => {
    it('should upload a file from a string and return its URL', async () => {
      // Act
      const url = await service.uploadFile('hello.txt', 'hello world');

      // Assert
      expect(url).toBe(`${baseUrl}/hello.txt`);
      const onDisk = fs.readFileSync(path.join(tempDir, 'hello.txt'), 'utf-8');
      expect(onDisk).toBe('hello world');
    });

    it('should upload a file from a Buffer', async () => {
      // Arrange
      const content = Buffer.from([1, 2, 3, 4]);

      // Act
      const url = await service.uploadFile('binary.bin', content);

      // Assert
      expect(url).toBe(`${baseUrl}/binary.bin`);
      const onDisk = fs.readFileSync(path.join(tempDir, 'binary.bin'));
      expect(onDisk.equals(content)).toBe(true);
    });

    it('should create nested directories when uploading to a sub path', async () => {
      // Act
      const url = await service.uploadFile('nested/dir/file.txt', 'nested');

      // Assert
      expect(url).toBe(`${baseUrl}/nested/dir/file.txt`);
      expect(
        fs.existsSync(path.join(tempDir, 'nested', 'dir', 'file.txt')),
      ).toBe(true);
    });
  });

  describe('downloadFile', () => {
    it('should download a previously uploaded file as a Buffer', async () => {
      // Arrange
      await service.uploadFile('download.txt', 'download me');

      // Act
      const result = await service.downloadFile('download.txt');

      // Assert
      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.toString('utf-8')).toBe('download me');
    });
  });

  describe('fileExists', () => {
    it('should return true for an existing file', async () => {
      // Arrange
      await service.uploadFile('exists.txt', 'i exist');

      // Act
      const result = await service.fileExists('exists.txt');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for a missing file', async () => {
      // Act
      const result = await service.fileExists('does-not-exist.txt');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('deleteFile', () => {
    it('should delete an existing file', async () => {
      // Arrange
      await service.uploadFile('to-delete.txt', 'delete me');
      expect(await service.fileExists('to-delete.txt')).toBe(true);

      // Act
      await service.deleteFile('to-delete.txt');

      // Assert
      expect(await service.fileExists('to-delete.txt')).toBe(false);
    });
  });

  describe('getFileUrl', () => {
    it('should build the URL using the configured baseUrl', () => {
      // Act
      const url = service.getFileUrl('some/file.txt');

      // Assert
      expect(url).toBe(`${baseUrl}/some/file.txt`);
    });

    it('should normalize backslashes to forward slashes', () => {
      // Act
      const url = service.getFileUrl('some\\windows\\file.txt');

      // Assert
      expect(url).toBe(`${baseUrl}/some/windows/file.txt`);
    });
  });

  describe('listFiles', () => {
    it('should list files within a directory recursively', async () => {
      // Arrange
      await service.uploadFile('listing/a.txt', 'a');
      await service.uploadFile('listing/b.txt', 'b');
      await service.uploadFile('listing/sub/c.txt', 'c');

      // Act
      const files = await service.listFiles('listing');

      // Assert
      const normalized = files.map(f => f.replace(/\\/g, '/')).sort();
      expect(normalized).toEqual([
        'listing/a.txt',
        'listing/b.txt',
        'listing/sub/c.txt',
      ]);
    });

    it('should return an empty array for a non-existent prefix', async () => {
      // Act
      const files = await service.listFiles('no-such-dir');

      // Assert
      expect(files).toEqual([]);
    });
  });

  describe('getFileMetadata', () => {
    it('should return metadata including size and content type', async () => {
      // Arrange
      await service.uploadFile('meta.json', '{"key":"value"}');

      // Act
      const metadata = await service.getFileMetadata('meta.json');

      // Assert
      expect(metadata.contentLength).toBe('{"key":"value"}'.length);
      expect(metadata.contentType).toBe('application/json');
      expect(
        Object.prototype.toString.call(metadata.lastModified),
      ).toBe('[object Date]');
      expect(Number.isNaN(metadata.lastModified?.getTime())).toBe(false);
    });
  });
});

/**
 * Unit tests targeting the LocalStorageProvider directly. These cover branches
 * that are not easily reachable through the StorageService facade, such as
 * uploading from a ReadableStream and building URLs without a configured
 * baseUrl.
 */
describe('LocalStorageProvider (direct)', () => {
  let tempDir: string;

  beforeAll(() => {
    // Arrange: create a unique temporary directory under the OS temp dir.
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'local-provider-test-'));
  });

  afterAll(() => {
    // Cleanup: remove the temporary directory and all its contents.
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should create the base directory when it does not exist', () => {
    // Arrange
    const nestedBase = path.join(tempDir, 'auto', 'created', 'base');

    // Act
    // eslint-disable-next-line no-new
    new LocalStorageProvider({ basePath: nestedBase });

    // Assert
    expect(fs.existsSync(nestedBase)).toBe(true);
  });

  describe('uploadFile from a ReadableStream', () => {
    it('should persist the stream contents and return the URL', async () => {
      // Arrange
      const baseUrl = 'http://localhost/assets';
      const provider = new LocalStorageProvider({ basePath: tempDir, baseUrl });
      const stream = Readable.from(['streamed ', 'content']);

      // Act
      const url = await provider.uploadFile('stream/file.txt', stream);

      // Assert
      expect(url).toBe(`${baseUrl}/stream/file.txt`);
      const onDisk = fs.readFileSync(
        path.join(tempDir, 'stream', 'file.txt'),
        'utf-8',
      );
      expect(onDisk).toBe('streamed content');
    });
  });

  describe('getFileUrl', () => {
    it('should return a URL based on baseUrl when configured', () => {
      // Arrange
      const baseUrl = 'http://localhost/assets';
      const provider = new LocalStorageProvider({ basePath: tempDir, baseUrl });

      // Act
      const url = provider.getFileUrl('a/b.txt');

      // Assert
      expect(url).toBe(`${baseUrl}/a/b.txt`);
    });

    it('should fall back to the full file path when no baseUrl is set', () => {
      // Arrange
      const provider = new LocalStorageProvider({ basePath: tempDir });

      // Act
      const url = provider.getFileUrl('a/b.txt');

      // Assert
      expect(url).toBe(path.join(tempDir, 'a/b.txt'));
    });
  });

  describe('fileExists', () => {
    it('should return false for a missing file', async () => {
      // Arrange
      const provider = new LocalStorageProvider({ basePath: tempDir });

      // Act
      const exists = await provider.fileExists('missing/file.txt');

      // Assert
      expect(exists).toBe(false);
    });

    it('should return true for an existing file', async () => {
      // Arrange
      const provider = new LocalStorageProvider({ basePath: tempDir });
      await provider.uploadFile('present.txt', 'here');

      // Act
      const exists = await provider.fileExists('present.txt');

      // Assert
      expect(exists).toBe(true);
    });
  });

  describe('listFiles', () => {
    it('should recurse into nested directories', async () => {
      // Arrange
      const provider = new LocalStorageProvider({ basePath: tempDir });
      await provider.uploadFile('tree/root.txt', 'r');
      await provider.uploadFile('tree/level1/a.txt', 'a');
      await provider.uploadFile('tree/level1/level2/b.txt', 'b');

      // Act
      const files = await provider.listFiles('tree');

      // Assert
      const normalized = files.map(f => f.replace(/\\/g, '/')).sort();
      expect(normalized).toEqual([
        'tree/level1/a.txt',
        'tree/level1/level2/b.txt',
        'tree/root.txt',
      ]);
    });

    it('should return the prefix itself when it points to a single file', async () => {
      // Arrange
      const provider = new LocalStorageProvider({ basePath: tempDir });
      await provider.uploadFile('single.txt', 'x');

      // Act
      const files = await provider.listFiles('single.txt');

      // Assert
      expect(files).toEqual(['single.txt']);
    });

    it('should return an empty array for a non-existent prefix', async () => {
      // Arrange
      const provider = new LocalStorageProvider({ basePath: tempDir });

      // Act
      const files = await provider.listFiles('nope');

      // Assert
      expect(files).toEqual([]);
    });
  });

  describe('getFileMetadata', () => {
    it('should derive content type from the extension', async () => {
      // Arrange
      const provider = new LocalStorageProvider({ basePath: tempDir });
      await provider.uploadFile('image.png', Buffer.from([0, 1, 2]));

      // Act
      const metadata = await provider.getFileMetadata('image.png');

      // Assert
      expect(metadata.contentType).toBe('image/png');
      expect(metadata.contentLength).toBe(3);
      expect(Object.prototype.toString.call(metadata.lastModified)).toBe(
        '[object Date]',
      );
    });

    it('should fall back to octet-stream for unknown extensions', async () => {
      // Arrange
      const provider = new LocalStorageProvider({ basePath: tempDir });
      await provider.uploadFile('data.unknownext', 'blob');

      // Act
      const metadata = await provider.getFileMetadata('data.unknownext');

      // Assert
      expect(metadata.contentType).toBe('application/octet-stream');
    });
  });

  describe('uploadFile error branch', () => {
    it('should reject when the write stream emits an error', async () => {
      // Arrange: a stream upload whose write stream fails should reject,
      // exercising the writeStream 'error' handler branch.
      const provider = new LocalStorageProvider({ basePath: tempDir });
      const fakeWriteStream = new EventEmitter() as unknown as fs.WriteStream;
      jest
        .spyOn(fsSpyable, 'createWriteStream')
        .mockReturnValue(fakeWriteStream);

      const source = new EventEmitter() as unknown as NodeJS.ReadableStream;
      // pipe is invoked by the provider; provide a no-op implementation.
      (source as unknown as { pipe: () => void }).pipe = jest.fn();

      const promise = provider.uploadFile('errstream/file.txt', source);

      // Act: emit an error on the write stream
      (fakeWriteStream as unknown as EventEmitter).emit(
        'error',
        new Error('write stream failed'),
      );

      // Assert
      await expect(promise).rejects.toThrow(/write stream failed/);

      jest.restoreAllMocks();
    });
  });
});

/**
 * Unit tests covering StorageService.createProvider branch selection and the
 * required-options guard branches. These reset the singleton so each test
 * constructs a fresh service.
 */
describe('StorageService (provider selection and guards)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'storage-provider-test-'));
    // Reset the singleton so getInstance constructs anew for each test.
    (StorageService as unknown as { instance?: StorageService }).instance =
      undefined;
  });

  afterEach(() => {
    (StorageService as unknown as { instance?: StorageService }).instance =
      undefined;
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    jest.restoreAllMocks();
  });

  it('should throw when the local provider is selected without local options', () => {
    // Act & Assert
    expect(() =>
      StorageService.getInstance({ providerType: 'local' }),
    ).toThrow(/Local storage options are required/);
  });

  it('should throw when the s3 provider is selected without s3 options', () => {
    // Act & Assert
    expect(() =>
      StorageService.getInstance({ providerType: 's3' }),
    ).toThrow(/S3 options are required/);
  });

  it('should throw for an unsupported provider type', () => {
    // Act & Assert
    expect(() =>
      StorageService.getInstance({
        providerType: 'ftp' as unknown as 'local',
        local: { basePath: tempDir },
      }),
    ).toThrow(/Unsupported storage provider type/);
  });

  it('should default to the local provider when no providerType is given', () => {
    // Act
    const service = StorageService.getInstance({
      local: { basePath: tempDir, baseUrl: 'http://localhost' },
    });

    // Assert
    expect(service.getFileUrl('a.txt')).toBe('http://localhost/a.txt');
  });

  it('should build an S3 provider and route getFileUrl to it', () => {
    // Act: providerType 's3' with valid options should construct the S3 provider.
    const service = StorageService.getInstance({
      providerType: 's3',
      s3: {
        bucket: 'my-bucket',
        region: 'us-east-1',
      },
    });

    // Assert: the URL is built by the S3 provider (no baseUrl => s3 host form).
    expect(service.getFileUrl('path/to/object.txt')).toBe(
      'https://my-bucket.s3.amazonaws.com/path/to/object.txt',
    );
  });

  it('should route getFileUrl to an S3 provider using a configured baseUrl', () => {
    // Act
    const service = StorageService.getInstance({
      providerType: 's3',
      s3: {
        bucket: 'my-bucket',
        region: 'us-east-1',
        baseUrl: 'https://cdn.example.com',
      },
    });

    // Assert
    expect(service.getFileUrl('img.png')).toBe(
      'https://cdn.example.com/img.png',
    );
  });

  it('should reconfigure an existing instance to an S3 provider via configure()', () => {
    // Arrange: start with a local provider.
    const service = StorageService.getInstance({
      providerType: 'local',
      local: { basePath: tempDir, baseUrl: 'http://localhost' },
    });
    expect(service.getFileUrl('x.txt')).toBe('http://localhost/x.txt');

    // Act: reconfigure to S3.
    service.configure({
      providerType: 's3',
      s3: { bucket: 'reconfig-bucket', region: 'eu-west-1' },
    });

    // Assert: now routed to the S3 provider.
    expect(service.getFileUrl('y.txt')).toBe(
      'https://reconfig-bucket.s3.amazonaws.com/y.txt',
    );
  });

  it('should leave the provider unchanged when configure() is called without a providerType', () => {
    // Arrange
    const service = StorageService.getInstance({
      providerType: 'local',
      local: { basePath: tempDir, baseUrl: 'http://localhost' },
    });

    // Act: configure with no providerType should be a no-op for the provider.
    service.configure({});

    // Assert
    expect(service.getFileUrl('z.txt')).toBe('http://localhost/z.txt');
  });
});
