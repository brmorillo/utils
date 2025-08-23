import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import {
  FileMetadata,
  IStorageProvider,
} from '../interfaces/storage.interface';

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
   * Lists files in a directory
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

    const files = await promisify(fs.readdir)(fullPath);
    const result: string[] = [];

    for (const file of files) {
      const filePath = path.join(prefix, file);
      const fullFilePath = this.getFullPath(filePath);
      const fileStat = await promisify(fs.stat)(fullFilePath);

      if (fileStat.isDirectory()) {
        const subFiles = await this.listFiles(filePath);
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
   * Gets the full path for a file
   */
  private getFullPath(filePath: string): string {
    return path.join(this.basePath, filePath);
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
