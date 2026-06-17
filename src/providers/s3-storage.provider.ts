import {
  FileMetadata,
  IStorageProvider,
} from '../interfaces/storage.interface';
import { Readable } from 'stream';
import { StorageError } from '../errors';

/**
 * S3 storage provider options
 */
export interface S3StorageOptions {
  bucket: string;
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  forcePathStyle?: boolean;
  baseUrl?: string;
}

/**
 * S3 storage provider implementation
 */
export class S3StorageProvider implements IStorageProvider {
  private s3Client: any;
  private bucket: string;
  private baseUrl: string;
  private region: string;
  private endpoint?: string;

  /**
   * Creates a new S3StorageProvider instance
   */
  constructor(options: S3StorageOptions) {
    this.bucket = options.bucket;
    this.baseUrl = options.baseUrl || '';
    this.region = options.region;
    this.endpoint = options.endpoint;

    try {
      // Dynamic import to avoid requiring AWS SDK as a direct dependency
      const { S3Client } = require('@aws-sdk/client-s3');

      this.s3Client = new S3Client({
        region: options.region,
        credentials:
          options.accessKeyId && options.secretAccessKey
            ? {
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey,
              }
            : undefined,
        endpoint: options.endpoint,
        forcePathStyle: options.forcePathStyle,
      });
    } catch (error) {
      throw new StorageError(
        'AWS SDK is not installed. Please install @aws-sdk/client-s3 and @aws-sdk/lib-storage to use S3StorageProvider.',
        'SDK_NOT_INSTALLED',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Uploads a file to S3
   */
  async uploadFile(
    filePath: string,
    content: Buffer | string | NodeJS.ReadableStream,
    metadata?: FileMetadata,
  ): Promise<string> {
    try {
      const { Upload } = require('@aws-sdk/lib-storage');

      let body: Buffer | string | Readable;

      if (Buffer.isBuffer(content) || typeof content === 'string') {
        body = content;
      } else {
        body = content as Readable;
      }

      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucket,
          Key: filePath,
          Body: body,
          ContentType: metadata?.contentType,
          Metadata: this.prepareMetadata(metadata),
        },
      });

      await upload.done();
      return this.getFileUrl(filePath);
    } catch (error) {
      throw new StorageError(
        `Failed to upload file to S3: ${error instanceof Error ? error.message : String(error)}`,
        'S3_UPLOAD_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Downloads a file from S3
   */
  async downloadFile(filePath: string): Promise<Buffer> {
    try {
      const { GetObjectCommand } = require('@aws-sdk/client-s3');

      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: filePath,
      });

      const response = await this.s3Client.send(command);

      // Convert stream to buffer
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        response.Body.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.Body.on('end', () => resolve(Buffer.concat(chunks)));
        response.Body.on('error', reject);
      });
    } catch (error) {
      throw new StorageError(
        `Failed to download file from S3: ${error instanceof Error ? error.message : String(error)}`,
        'S3_DOWNLOAD_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Checks if a file exists in S3
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const { HeadObjectCommand } = require('@aws-sdk/client-s3');

      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: filePath,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (
        error?.name === 'NotFound' ||
        error?.name === 'NoSuchKey' ||
        error?.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }
      throw new StorageError(
        `Failed to check if file exists in S3: ${error instanceof Error ? error.message : String(error)}`,
        'S3_METADATA_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Deletes a file from S3
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: filePath,
      });

      await this.s3Client.send(command);
    } catch (error) {
      throw new StorageError(
        `Failed to delete file from S3: ${error instanceof Error ? error.message : String(error)}`,
        'S3_DELETE_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Gets the URL for a file in S3
   */
  getFileUrl(filePath: string): string {
    if (this.baseUrl) {
      return `${this.baseUrl}/${filePath}`;
    }

    // Honor a custom endpoint (e.g. MinIO / S3-compatible) when configured.
    if (this.endpoint) {
      const base = this.endpoint.replace(/\/+$/, '');
      return `${base}/${this.bucket}/${filePath}`;
    }

    // Region-aware virtual-hosted-style URL. us-east-1 historically uses the
    // global endpoint, but the region-qualified host is valid for every region.
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${filePath}`;
  }

  /**
   * Lists files in a prefix.
   *
   * @remarks
   * Pages through the bucket using `ContinuationToken` until the result set is
   * exhausted (`IsTruncated === false`), so the full key set is returned rather
   * than being silently capped at the 1000-key per-response limit.
   */
  async listFiles(prefix: string): Promise<string[]> {
    try {
      const { ListObjectsV2Command } = require('@aws-sdk/client-s3');

      const keys: string[] = [];
      let continuationToken: string | undefined;

      do {
        const command = new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        });

        const response = await this.s3Client.send(command);

        if (response.Contents) {
          for (const item of response.Contents) {
            if (item.Key !== undefined) {
              keys.push(item.Key);
            }
          }
        }

        continuationToken = response.IsTruncated
          ? response.NextContinuationToken
          : undefined;
      } while (continuationToken);

      return keys;
    } catch (error) {
      throw new StorageError(
        `Failed to list files in S3: ${error instanceof Error ? error.message : String(error)}`,
        'S3_LIST_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Gets metadata for a file in S3
   */
  async getFileMetadata(filePath: string): Promise<FileMetadata> {
    try {
      const { HeadObjectCommand } = require('@aws-sdk/client-s3');

      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: filePath,
      });

      const response = await this.s3Client.send(command);

      return {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        etag: response.ETag,
        ...this.extractMetadata(response.Metadata),
      };
    } catch (error) {
      throw new StorageError(
        `Failed to get file metadata from S3: ${error instanceof Error ? error.message : String(error)}`,
        'S3_METADATA_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Prepares metadata for S3
   */
  private prepareMetadata(
    metadata?: FileMetadata,
  ): Record<string, string> | undefined {
    if (!metadata) {
      return undefined;
    }

    const result: Record<string, string> = {};

    Object.entries(metadata).forEach(([key, value]) => {
      if (
        key !== 'contentType' &&
        key !== 'contentLength' &&
        key !== 'lastModified' &&
        key !== 'etag'
      ) {
        result[key] = String(value);
      }
    });

    return Object.keys(result).length > 0 ? result : undefined;
  }

  /**
   * Extracts metadata from S3 response
   */
  private extractMetadata(
    metadata?: Record<string, string>,
  ): Record<string, any> {
    if (!metadata) {
      return {};
    }

    return Object.entries(metadata).reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, any>,
    );
  }
}
