import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
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
