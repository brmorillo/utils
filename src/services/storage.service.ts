import { FileMetadata, IStorageProvider, StorageProviderType } from '../interfaces/storage.interface';
import { LocalStorageProvider, LocalStorageOptions } from '../providers/local-storage.provider';
import { S3StorageProvider, S3StorageOptions } from '../providers/s3-storage.provider';

/**
 * Storage service configuration options
 */
export interface StorageServiceOptions {
  providerType?: StorageProviderType;
  local?: LocalStorageOptions;
  s3?: S3StorageOptions;
}

/**
 * Storage service for file operations
 */
export class StorageService {
  private static instance: StorageService;
  private provider: IStorageProvider;

  /**
   * Creates a new StorageService instance
   */
  private constructor(options: StorageServiceOptions = {}) {
    const providerType = options.providerType || 'local';
    this.provider = this.createProvider(providerType, options);
  }

  /**
   * Gets the singleton instance of StorageService
   */
  public static getInstance(options?: StorageServiceOptions): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService(options);
    }
    return StorageService.instance;
  }

  /**
   * Reconfigures the storage service
   */
  public configure(options: StorageServiceOptions): void {
    if (options.providerType) {
      this.provider = this.createProvider(options.providerType, options);
    }
  }

  /**
   * Creates a storage provider based on the specified type
   */
  private createProvider(providerType: StorageProviderType, options: StorageServiceOptions): IStorageProvider {
    switch (providerType) {
      case 'local':
        if (!options.local) {
          throw new Error('Local storage options are required when using local provider');
        }
        return new LocalStorageProvider(options.local);
      case 's3':
        if (!options.s3) {
          throw new Error('S3 options are required when using S3 provider');
        }
        return new S3StorageProvider(options.s3);
      default:
        throw new Error(`Unsupported storage provider type: ${providerType}`);
    }
  }

  /**
   * Uploads a file to storage
   */
  public async uploadFile(path: string, content: Buffer | string | NodeJS.ReadableStream, metadata?: FileMetadata): Promise<string> {
    return this.provider.uploadFile(path, content, metadata);
  }

  /**
   * Downloads a file from storage
   */
  public async downloadFile(path: string): Promise<Buffer> {
    return this.provider.downloadFile(path);
  }

  /**
   * Checks if a file exists in storage
   */
  public async fileExists(path: string): Promise<boolean> {
    return this.provider.fileExists(path);
  }

  /**
   * Deletes a file from storage
   */
  public async deleteFile(path: string): Promise<void> {
    return this.provider.deleteFile(path);
  }

  /**
   * Gets the URL for a file
   */
  public getFileUrl(path: string): string {
    return this.provider.getFileUrl(path);
  }

  /**
   * Lists files in a directory/prefix
   */
  public async listFiles(prefix: string): Promise<string[]> {
    return this.provider.listFiles(prefix);
  }

  /**
   * Gets metadata for a file
   */
  public async getFileMetadata(path: string): Promise<FileMetadata> {
    return this.provider.getFileMetadata(path);
  }
}