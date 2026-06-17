import { Readable } from 'stream';

/**
 * Shared mock state for the AWS SDK clients/commands.
 * The provider does `require('@aws-sdk/client-s3')` and
 * `require('@aws-sdk/lib-storage')` inside its constructor/methods, so the
 * mocks below are wired in at module load time via jest.mock.
 */
const mockSend = jest.fn();
const mockUploadDone = jest.fn();
const S3ClientCtor = jest.fn();
const UploadCtor = jest.fn();

/**
 * Helper command classes. Each simply records the params it was created with so
 * the tests can assert on what the provider passed down to the SDK.
 */
class FakeCommand {
  constructor(public input: any) {}
}

jest.mock(
  '@aws-sdk/client-s3',
  () => ({
    S3Client: jest.fn().mockImplementation(function (this: any, config: any) {
      S3ClientCtor(config);
      this.send = mockSend;
    }),
    PutObjectCommand: jest
      .fn()
      .mockImplementation((input: any) => new FakeCommand(input)),
    GetObjectCommand: jest
      .fn()
      .mockImplementation((input: any) => new FakeCommand(input)),
    HeadObjectCommand: jest
      .fn()
      .mockImplementation((input: any) => new FakeCommand(input)),
    DeleteObjectCommand: jest
      .fn()
      .mockImplementation((input: any) => new FakeCommand(input)),
    ListObjectsV2Command: jest
      .fn()
      .mockImplementation((input: any) => new FakeCommand(input)),
  }),
);

jest.mock(
  '@aws-sdk/lib-storage',
  () => ({
    Upload: jest.fn().mockImplementation((config: any) => {
      UploadCtor(config);
      return { done: mockUploadDone };
    }),
  }),
);

import {
  S3StorageProvider,
  S3StorageOptions,
} from '../../src/providers/s3-storage.provider';

/**
 * Unit tests for the S3StorageProvider.
 * The AWS SDK is fully mocked so no real network/credentials are required.
 */
describe('S3StorageProvider - Unit Tests', () => {
  const baseOptions: S3StorageOptions = {
    bucket: 'my-bucket',
    region: 'us-east-1',
    accessKeyId: 'key',
    secretAccessKey: 'secret',
  };

  let provider: S3StorageProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUploadDone.mockResolvedValue(undefined);
    provider = new S3StorageProvider(baseOptions);
  });

  describe('constructor', () => {
    it('should create an S3 client with the provided credentials', () => {
      expect(S3ClientCtor).toHaveBeenCalledWith(
        expect.objectContaining({
          region: 'us-east-1',
          credentials: { accessKeyId: 'key', secretAccessKey: 'secret' },
        }),
      );
    });

    it('should omit credentials when they are not provided', () => {
      S3ClientCtor.mockClear();
      new S3StorageProvider({ bucket: 'b', region: 'us-east-1' });
      expect(S3ClientCtor).toHaveBeenCalledWith(
        expect.objectContaining({ credentials: undefined }),
      );
    });

    it('should throw a helpful error when the AWS SDK is unavailable', () => {
      const clientModule = require('@aws-sdk/client-s3');
      const original = clientModule.S3Client;
      clientModule.S3Client = jest.fn().mockImplementation(() => {
        throw new Error('module not found');
      });

      try {
        expect(() => new S3StorageProvider(baseOptions)).toThrow(
          'AWS SDK is not installed',
        );
      } finally {
        clientModule.S3Client = original;
      }
    });
  });

  describe('uploadFile', () => {
    it('should upload a buffer and return the file URL', async () => {
      const url = await provider.uploadFile('path/file.txt', Buffer.from('hi'));

      expect(UploadCtor).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            Bucket: 'my-bucket',
            Key: 'path/file.txt',
          }),
        }),
      );
      expect(mockUploadDone).toHaveBeenCalled();
      expect(url).toBe('https://my-bucket.s3.us-east-1.amazonaws.com/path/file.txt');
    });

    it('should pass content type and custom metadata', async () => {
      await provider.uploadFile('f.txt', 'content', {
        contentType: 'text/plain',
        author: 'bruno',
      } as any);

      const params = UploadCtor.mock.calls[0][0].params;
      expect(params.ContentType).toBe('text/plain');
      expect(params.Metadata).toEqual({ author: 'bruno' });
    });

    it('should accept a readable stream as content', async () => {
      const stream = Readable.from(['chunk']);
      await provider.uploadFile('f.txt', stream);
      expect(UploadCtor).toHaveBeenCalled();
    });

    it('should wrap upload errors', async () => {
      mockUploadDone.mockRejectedValueOnce(new Error('boom'));
      await expect(
        provider.uploadFile('f.txt', Buffer.from('x')),
      ).rejects.toThrow('Failed to upload file to S3: boom');
    });
  });

  describe('downloadFile', () => {
    it('should download a file and return a buffer from the stream body', async () => {
      const body = Readable.from([Buffer.from('hello '), Buffer.from('world')]);
      mockSend.mockResolvedValueOnce({ Body: body });

      const result = await provider.downloadFile('f.txt');
      expect(result.toString()).toBe('hello world');
    });

    it('should reject when the stream emits an error', async () => {
      const body = new Readable({
        read() {
          this.emit('error', new Error('stream failed'));
        },
      });
      mockSend.mockResolvedValueOnce({ Body: body });

      await expect(provider.downloadFile('f.txt')).rejects.toThrow();
    });

    it('should wrap download errors', async () => {
      mockSend.mockRejectedValueOnce(new Error('nope'));
      await expect(provider.downloadFile('f.txt')).rejects.toThrow(
        'Failed to download file from S3: nope',
      );
    });
  });

  describe('fileExists', () => {
    it('should return true when the object exists', async () => {
      mockSend.mockResolvedValueOnce({});
      await expect(provider.fileExists('f.txt')).resolves.toBe(true);
    });

    it('should return false when the object is NotFound', async () => {
      const err: any = new Error('not found');
      err.name = 'NotFound';
      mockSend.mockRejectedValueOnce(err);
      await expect(provider.fileExists('f.txt')).resolves.toBe(false);
    });

    it('should return false when the error name is NoSuchKey', async () => {
      const err: any = new Error('no such key');
      err.name = 'NoSuchKey';
      mockSend.mockRejectedValueOnce(err);
      await expect(provider.fileExists('f.txt')).resolves.toBe(false);
    });

    it('should return false when the $metadata http status is 404', async () => {
      const err: any = new Error('not found');
      err.name = 'SomeOtherName';
      err.$metadata = { httpStatusCode: 404 };
      mockSend.mockRejectedValueOnce(err);
      await expect(provider.fileExists('f.txt')).resolves.toBe(false);
    });

    it('should rethrow unexpected errors', async () => {
      mockSend.mockRejectedValueOnce(new Error('access denied'));
      await expect(provider.fileExists('f.txt')).rejects.toThrow(
        'Failed to check if file exists in S3: access denied',
      );
    });
  });

  describe('deleteFile', () => {
    it('should send a delete command', async () => {
      mockSend.mockResolvedValueOnce({});
      await expect(provider.deleteFile('f.txt')).resolves.toBeUndefined();
      expect(mockSend).toHaveBeenCalled();
    });

    it('should wrap delete errors', async () => {
      mockSend.mockRejectedValueOnce(new Error('denied'));
      await expect(provider.deleteFile('f.txt')).rejects.toThrow(
        'Failed to delete file from S3: denied',
      );
    });
  });

  describe('listFiles', () => {
    it('should return the keys of the listed objects', async () => {
      mockSend.mockResolvedValueOnce({
        Contents: [{ Key: 'a.txt' }, { Key: 'b.txt' }],
      });
      await expect(provider.listFiles('prefix/')).resolves.toEqual([
        'a.txt',
        'b.txt',
      ]);
    });

    it('should return an empty array when there are no contents', async () => {
      mockSend.mockResolvedValueOnce({});
      await expect(provider.listFiles('prefix/')).resolves.toEqual([]);
    });

    it('should paginate using the continuation token until exhausted', async () => {
      mockSend
        .mockResolvedValueOnce({
          Contents: [{ Key: 'a.txt' }, { Key: 'b.txt' }],
          IsTruncated: true,
          NextContinuationToken: 'token-1',
        })
        .mockResolvedValueOnce({
          Contents: [{ Key: 'c.txt' }],
          IsTruncated: true,
          NextContinuationToken: 'token-2',
        })
        .mockResolvedValueOnce({
          Contents: [{ Key: 'd.txt' }],
          IsTruncated: false,
        });

      await expect(provider.listFiles('prefix/')).resolves.toEqual([
        'a.txt',
        'b.txt',
        'c.txt',
        'd.txt',
      ]);
      expect(mockSend).toHaveBeenCalledTimes(3);

      // Verify the continuation token was threaded through each page request.
      const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
      expect(ListObjectsV2Command).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ ContinuationToken: undefined }),
      );
      expect(ListObjectsV2Command).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ ContinuationToken: 'token-1' }),
      );
      expect(ListObjectsV2Command).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({ ContinuationToken: 'token-2' }),
      );
    });

    it('should wrap list errors', async () => {
      mockSend.mockRejectedValueOnce(new Error('fail'));
      await expect(provider.listFiles('prefix/')).rejects.toThrow(
        'Failed to list files in S3: fail',
      );
    });
  });

  describe('getFileUrl', () => {
    it('should build a region-aware default S3 URL', () => {
      expect(provider.getFileUrl('dir/f.txt')).toBe(
        'https://my-bucket.s3.us-east-1.amazonaws.com/dir/f.txt',
      );
    });

    it('should reflect a different region in the default URL', () => {
      const euProvider = new S3StorageProvider({
        ...baseOptions,
        region: 'eu-central-1',
      });
      expect(euProvider.getFileUrl('dir/f.txt')).toBe(
        'https://my-bucket.s3.eu-central-1.amazonaws.com/dir/f.txt',
      );
    });

    it('should honor a custom endpoint when provided', () => {
      const minio = new S3StorageProvider({
        ...baseOptions,
        endpoint: 'http://localhost:9000/',
      });
      expect(minio.getFileUrl('dir/f.txt')).toBe(
        'http://localhost:9000/my-bucket/dir/f.txt',
      );
    });

    it('should use the custom baseUrl when provided', () => {
      const custom = new S3StorageProvider({
        ...baseOptions,
        baseUrl: 'https://cdn.example.com',
      });
      expect(custom.getFileUrl('dir/f.txt')).toBe(
        'https://cdn.example.com/dir/f.txt',
      );
    });
  });

  describe('getFileMetadata', () => {
    it('should map the head response into file metadata', async () => {
      const lastModified = new Date('2024-01-01T00:00:00Z');
      mockSend.mockResolvedValueOnce({
        ContentType: 'text/plain',
        ContentLength: 12,
        LastModified: lastModified,
        ETag: '"abc"',
        Metadata: { author: 'bruno' },
      });

      const metadata = await provider.getFileMetadata('f.txt');
      expect(metadata).toEqual({
        contentType: 'text/plain',
        contentLength: 12,
        lastModified,
        etag: '"abc"',
        author: 'bruno',
      });
    });

    it('should handle a response without custom metadata', async () => {
      mockSend.mockResolvedValueOnce({
        ContentType: 'application/json',
        ContentLength: 2,
      });
      const metadata = await provider.getFileMetadata('f.json');
      expect(metadata.contentType).toBe('application/json');
    });

    it('should wrap metadata errors', async () => {
      mockSend.mockRejectedValueOnce(new Error('missing'));
      await expect(provider.getFileMetadata('f.txt')).rejects.toThrow(
        'Failed to get file metadata from S3: missing',
      );
    });
  });
});
