import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import {
  FileMetadata,
  IStorageProvider,
} from '../interfaces/storage.interface';
import { StorageError } from '../errors';

/**
 * Local filesystem storage provider options
 */
export interface LocalStorageOptions {
  basePath: string;
  baseUrl?: string;
}

/**
 * Local filesystem storage provider implementation
 */
export class LocalStorageProvider implements IStorageProvider {
  private basePath: string;
  private baseUrl: string;

  /**
   * Creates a new LocalStorageProvider instance
   */
  constructor(options: LocalStorageOptions) {
    this.basePath = options.basePath;
    this.baseUrl = options.baseUrl || '';

    // Ensure base directory exists
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  /**
   * Uploads a file to local storage
   */
  async uploadFile(
    filePath: string,
    content: Buffer | string | NodeJS.ReadableStream,
    metadata?: FileMetadata,
  ): Promise<string> {
    const fullPath = this.getFullPath(filePath);

    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (Buffer.isBuffer(content) || typeof content === 'string') {
      await promisify(fs.writeFile)(fullPath, content);
    } else {
      // Handle stream
      return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(fullPath);
        content.pipe(writeStream);

        writeStream.on('finish', () => {
          resolve(this.getFileUrl(filePath));
        });

        writeStream.on('error', err => {
          reject(err);
        });
      });
    }

    return this.getFileUrl(filePath);
  }

  /**
   * Downloads a file from local storage
   */
  async downloadFile(filePath: string): Promise<Buffer> {
    const fullPath = this.getFullPath(filePath);
    return promisify(fs.readFile)(fullPath);
  }

  /**
   * Checks if a file exists in local storage
   */
  async fileExists(filePath: string): Promise<boolean> {
    const fullPath = this.getFullPath(filePath);
    try {
      await promisify(fs.access)(fullPath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Deletes a file from local storage
   */
  async deleteFile(filePath: string): Promise<void> {
    const fullPath = this.getFullPath(filePath);
    await promisify(fs.unlink)(fullPath);
  }

  /**
   * Gets the URL for a file in local storage
   */
  getFileUrl(filePath: string): string {
    if (this.baseUrl) {
      const normalizedPath = filePath.replace(/\\/g, '/');
      return `${this.baseUrl}/${normalizedPath}`;
    }
    return this.getFullPath(filePath);
  }

  /**
   * Maximum recursion depth for {@link listFiles}. Bounds the traversal so a
   * deeply nested tree (or a symlink loop) cannot cause runaway recursion / DoS.
   */
  private static readonly MAX_LIST_DEPTH = 32;

  /**
   * Lists files in a directory.
   *
   * The recursion is bounded by {@link LocalStorageProvider.MAX_LIST_DEPTH} to
   * avoid runaway traversal or symlink-loop denial of service. Directories at
   * the depth limit are not descended into.
   */
  async listFiles(prefix: string): Promise<string[]> {
    const fullPath = this.getFullPath(prefix);

    if (!fs.existsSync(fullPath)) {
      return [];
    }

    const stat = await promisify(fs.stat)(fullPath);
    if (!stat.isDirectory()) {
      return [prefix];
    }

    return this.listFilesRecursive(prefix, 0);
  }

  /**
   * Recursive helper for {@link listFiles} that tracks the current depth.
   */
  private async listFilesRecursive(
    prefix: string,
    depth: number,
  ): Promise<string[]> {
    if (depth >= LocalStorageProvider.MAX_LIST_DEPTH) {
      return [];
    }

    const fullPath = this.getFullPath(prefix);
    // Use withFileTypes to avoid a stat() per entry.
    const entries = await promisify(fs.readdir)(fullPath, {
      withFileTypes: true,
    });
    const result: string[] = [];

    for (const entry of entries) {
      const filePath = path.join(prefix, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await this.listFilesRecursive(filePath, depth + 1);
        result.push(...subFiles);
      } else {
        result.push(filePath);
      }
    }

    return result;
  }

  /**
   * Gets metadata for a file in local storage
   */
  async getFileMetadata(filePath: string): Promise<FileMetadata> {
    const fullPath = this.getFullPath(filePath);
    const stats = await promisify(fs.stat)(fullPath);

    return {
      contentLength: stats.size,
      lastModified: stats.mtime,
      contentType: this.getContentType(filePath),
    };
  }

  /**
   * Resolves the full path for a file and confines it to {@link basePath}.
   *
   * @remarks
   * SECURITY: This guards against path traversal. Any `filePath` that resolves
   * outside the storage root (e.g. `'../../etc/passwd'`) or is an absolute path
   * pointing elsewhere is rejected with a {@link StorageError}. Every method
   * that touches the filesystem routes through this so traversal is impossible.
   *
   * @param filePath Caller-supplied (untrusted) relative path.
   * @returns The absolute, confined path within the storage root.
   * @throws {StorageError} If the resolved path escapes the storage root.
   */
  private getFullPath(filePath: string): string {
    const root = path.resolve(this.basePath);
    const resolved = path.resolve(this.basePath, filePath);

    if (resolved !== root && !resolved.startsWith(root + path.sep)) {
      throw new StorageError(
        'Invalid path: outside storage root',
        'INVALID_PATH',
        { path: filePath },
      );
    }

    return resolved;
  }

  /**
   * Gets the content type based on file extension
   */
  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
    };

    return contentTypes[ext] || 'application/octet-stream';
  }
}
