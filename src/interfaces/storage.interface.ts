/**
 * Storage provider type
 */
export type StorageProviderType = 'local' | 's3';

/**
 * File metadata interface
 */
export interface FileMetadata {
  contentType?: string;
  contentLength?: number;
  lastModified?: Date;
  etag?: string;
  [key: string]: any;
}

/**
 * Storage provider interface
 */
export interface IStorageProvider {
  /**
   * Uploads a file to storage
   * @param path The path/key where the file will be stored
   * @param content The file content (Buffer, string, or readable stream)
   * @param metadata Optional metadata for the file
   * @returns Promise resolving to the file URL or path
   */
  uploadFile(path: string, content: Buffer | string | NodeJS.ReadableStream, metadata?: FileMetadata): Promise<string>;

  /**
   * Downloads a file from storage
   * @param path The path/key of the file to download
   * @returns Promise resolving to the file content as a Buffer
   */
  downloadFile(path: string): Promise<Buffer>;

  /**
   * Checks if a file exists in storage
   * @param path The path/key of the file to check
   * @returns Promise resolving to true if the file exists, false otherwise
   */
  fileExists(path: string): Promise<boolean>;

  /**
   * Deletes a file from storage
   * @param path The path/key of the file to delete
   * @returns Promise resolving when the file is deleted
   */
  deleteFile(path: string): Promise<void>;

  /**
   * Gets the URL for a file
   * @param path The path/key of the file
   * @returns The URL or path to access the file
   */
  getFileUrl(path: string): string;

  /**
   * Lists files in a directory/prefix
   * @param prefix The directory or prefix to list
   * @returns Promise resolving to an array of file paths/keys
   */
  listFiles(prefix: string): Promise<string[]>;

  /**
   * Gets metadata for a file
   * @param path The path/key of the file
   * @returns Promise resolving to the file metadata
   */
  getFileMetadata(path: string): Promise<FileMetadata>;
}