import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util';

// Promisify fs functions
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const access = promisify(fs.access);

/**
 * Utility class for common file operations.
 */
export class FileUtils {
  /**
   * Reads a file asynchronously.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @param {string} [params.encoding='utf8'] - File encoding.
   * @returns {Promise<string|Buffer>} The file contents.
   * @example
   * const content = await FileUtils.readFile({
   *   filePath: '/path/to/file.txt'
   * });
   * console.log(content);
   */
  public static async readFile({
    filePath,
    encoding = 'utf8',
  }: {
    filePath: string;
    encoding?: BufferEncoding;
  }): Promise<string | Buffer> {
    try {
      return await readFile(filePath, { encoding });
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Writes data to a file asynchronously.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @param {string|Buffer} params.data - Data to write.
   * @param {string} [params.encoding='utf8'] - File encoding.
   * @param {boolean} [params.createDir=true] - Whether to create parent directories if they don't exist.
   * @returns {Promise<void>}
   * @example
   * await FileUtils.writeFile({
   *   filePath: '/path/to/file.txt',
   *   data: 'Hello, world!'
   * });
   */
  public static async writeFile({
    filePath,
    data,
    encoding = 'utf8',
    createDir = true,
  }: {
    filePath: string;
    data: string | Buffer;
    encoding?: BufferEncoding;
    createDir?: boolean;
  }): Promise<void> {
    try {
      if (createDir) {
        await FileUtils.ensureDir({ dirPath: path.dirname(filePath) });
      }
      await writeFile(filePath, data, { encoding });
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Appends data to a file asynchronously.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @param {string|Buffer} params.data - Data to append.
   * @param {string} [params.encoding='utf8'] - File encoding.
   * @param {boolean} [params.createDir=true] - Whether to create parent directories if they don't exist.
   * @returns {Promise<void>}
   * @example
   * await FileUtils.appendFile({
   *   filePath: '/path/to/log.txt',
   *   data: 'New log entry\n'
   * });
   */
  public static async appendFile({
    filePath,
    data,
    encoding = 'utf8',
    createDir = true,
  }: {
    filePath: string;
    data: string | Buffer;
    encoding?: BufferEncoding;
    createDir?: boolean;
  }): Promise<void> {
    try {
      if (createDir) {
        await FileUtils.ensureDir({ dirPath: path.dirname(filePath) });
      }
      await appendFile(filePath, data, { encoding });
    } catch (error) {
      throw new Error(`Failed to append to file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Ensures that a directory exists, creating it and its parents if necessary.
   * @param {object} params - The parameters for the method.
   * @param {string} params.dirPath - Path to the directory.
   * @returns {Promise<void>}
   * @example
   * await FileUtils.ensureDir({
   *   dirPath: '/path/to/directory'
   * });
   */
  public static async ensureDir({
    dirPath,
  }: {
    dirPath: string;
  }): Promise<void> {
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Ignore error if directory already exists
      if (error.code !== 'EEXIST') {
        throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
      }
    }
  }

  /**
   * Lists files in a directory.
   * @param {object} params - The parameters for the method.
   * @param {string} params.dirPath - Path to the directory.
   * @param {boolean} [params.recursive=false] - Whether to list files recursively.
   * @param {RegExp} [params.filter] - Optional regex pattern to filter files.
   * @returns {Promise<string[]>} Array of file paths.
   * @example
   * // List all files in a directory
   * const files = await FileUtils.listFiles({
   *   dirPath: '/path/to/directory'
   * });
   * 
   * // List all JavaScript files recursively
   * const jsFiles = await FileUtils.listFiles({
   *   dirPath: '/path/to/directory',
   *   recursive: true,
   *   filter: /\.js$/
   * });
   */
  public static async listFiles({
    dirPath,
    recursive = false,
    filter,
  }: {
    dirPath: string;
    recursive?: boolean;
    filter?: RegExp;
  }): Promise<string[]> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      
      const files = await Promise.all(
        entries.map(async entry => {
          const fullPath = path.join(dirPath, entry.name);
          
          if (entry.isDirectory()) {
            if (recursive) {
              return await FileUtils.listFiles({
                dirPath: fullPath,
                recursive,
                filter,
              });
            }
            return [];
          }
          
          if (filter && !filter.test(entry.name)) {
            return [];
          }
          
          return [fullPath];
        })
      );
      
      return files.flat();
    } catch (error) {
      throw new Error(`Failed to list files in ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Checks if a file exists.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns {Promise<boolean>} `true` if the file exists, otherwise `false`.
   * @example
   * if (await FileUtils.fileExists({
   *   filePath: '/path/to/file.txt'
   * })) {
   *   console.log('File exists');
   * }
   */
  public static async fileExists({
    filePath,
  }: {
    filePath: string;
  }): Promise<boolean> {
    try {
      await access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets file information.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns {Promise<fs.Stats>} File statistics.
   * @example
   * const stats = await FileUtils.getFileInfo({
   *   filePath: '/path/to/file.txt'
   * });
   * console.log(`File size: ${stats.size} bytes`);
   * console.log(`Last modified: ${stats.mtime}`);
   */
  public static async getFileInfo({
    filePath,
  }: {
    filePath: string;
  }): Promise<fs.Stats> {
    try {
      return await stat(filePath);
    } catch (error) {
      throw new Error(`Failed to get file info for ${filePath}: ${error.message}`);
    }
  }

  /**
   * Deletes a file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns {Promise<void>}
   * @example
   * await FileUtils.deleteFile({
   *   filePath: '/path/to/file.txt'
   * });
   */
  public static async deleteFile({
    filePath,
  }: {
    filePath: string;
  }): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error) {
      throw new Error(`Failed to delete file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Deletes a directory and its contents.
   * @param {object} params - The parameters for the method.
   * @param {string} params.dirPath - Path to the directory.
   * @param {boolean} [params.recursive=true] - Whether to delete recursively.
   * @returns {Promise<void>}
   * @example
   * await FileUtils.deleteDir({
   *   dirPath: '/path/to/directory'
   * });
   */
  public static async deleteDir({
    dirPath,
    recursive = true,
  }: {
    dirPath: string;
    recursive?: boolean;
  }): Promise<void> {
    try {
      if (recursive) {
        await FileUtils.deleteDirRecursive({ dirPath });
      } else {
        await rmdir(dirPath);
      }
    } catch (error) {
      throw new Error(`Failed to delete directory ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Recursively deletes a directory and its contents.
   * @private
   */
  private static async deleteDirRecursive({
    dirPath,
  }: {
    dirPath: string;
  }): Promise<void> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      
      await Promise.all(
        entries.map(async entry => {
          const fullPath = path.join(dirPath, entry.name);
          
          if (entry.isDirectory()) {
            await FileUtils.deleteDirRecursive({ dirPath: fullPath });
          } else {
            await unlink(fullPath);
          }
        })
      );
      
      await rmdir(dirPath);
    } catch (error) {
      throw new Error(`Failed to recursively delete directory ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Calculates the MD5 hash of a file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns {Promise<string>} The MD5 hash as a hexadecimal string.
   * @example
   * const hash = await FileUtils.calculateFileHash({
   *   filePath: '/path/to/file.txt'
   * });
   * console.log(`File hash: ${hash}`);
   */
  public static async calculateFileHash({
    filePath,
  }: {
    filePath: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', data => {
          hash.update(data);
        });
        
        stream.on('end', () => {
          resolve(hash.digest('hex'));
        });
        
        stream.on('error', error => {
          reject(new Error(`Failed to calculate file hash for ${filePath}: ${error.message}`));
        });
      } catch (error) {
        reject(new Error(`Failed to calculate file hash for ${filePath}: ${error.message}`));
      }
    });
  }

  /**
   * Copies a file from one location to another.
   * @param {object} params - The parameters for the method.
   * @param {string} params.sourcePath - Path to the source file.
   * @param {string} params.destPath - Path to the destination file.
   * @param {boolean} [params.createDir=true] - Whether to create parent directories if they don't exist.
   * @returns {Promise<void>}
   * @example
   * await FileUtils.copyFile({
   *   sourcePath: '/path/to/source.txt',
   *   destPath: '/path/to/destination.txt'
   * });
   */
  public static async copyFile({
    sourcePath,
    destPath,
    createDir = true,
  }: {
    sourcePath: string;
    destPath: string;
    createDir?: boolean;
  }): Promise<void> {
    try {
      if (createDir) {
        await FileUtils.ensureDir({ dirPath: path.dirname(destPath) });
      }
      
      await fs.promises.copyFile(sourcePath, destPath);
    } catch (error) {
      throw new Error(`Failed to copy file from ${sourcePath} to ${destPath}: ${error.message}`);
    }
  }

  /**
   * Moves a file from one location to another.
   * @param {object} params - The parameters for the method.
   * @param {string} params.sourcePath - Path to the source file.
   * @param {string} params.destPath - Path to the destination file.
   * @param {boolean} [params.createDir=true] - Whether to create parent directories if they don't exist.
   * @returns {Promise<void>}
   * @example
   * await FileUtils.moveFile({
   *   sourcePath: '/path/to/source.txt',
   *   destPath: '/path/to/destination.txt'
   * });
   */
  public static async moveFile({
    sourcePath,
    destPath,
    createDir = true,
  }: {
    sourcePath: string;
    destPath: string;
    createDir?: boolean;
  }): Promise<void> {
    try {
      if (createDir) {
        await FileUtils.ensureDir({ dirPath: path.dirname(destPath) });
      }
      
      await fs.promises.rename(sourcePath, destPath);
    } catch (error) {
      // If rename fails (e.g., across different filesystems), try copy + delete
      if (error.code === 'EXDEV') {
        await FileUtils.copyFile({ sourcePath, destPath, createDir });
        await FileUtils.deleteFile({ filePath: sourcePath });
      } else {
        throw new Error(`Failed to move file from ${sourcePath} to ${destPath}: ${error.message}`);
      }
    }
  }

  /**
   * Gets the file extension.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns {string} The file extension (without the dot).
   * @example
   * const ext = FileUtils.getFileExtension({
   *   filePath: '/path/to/file.txt'
   * });
   * console.log(ext); // 'txt'
   */
  public static getFileExtension({
    filePath,
  }: {
    filePath: string;
  }): string {
    return path.extname(filePath).slice(1).toLowerCase();
  }

  /**
   * Gets the file name without extension.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns {string} The file name without extension.
   * @example
   * const name = FileUtils.getFileName({
   *   filePath: '/path/to/file.txt'
   * });
   * console.log(name); // 'file'
   */
  public static getFileName({
    filePath,
  }: {
    filePath: string;
  }): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * Reads a JSON file and parses its contents.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the JSON file.
   * @returns {Promise<any>} The parsed JSON data.
   * @example
   * const config = await FileUtils.readJsonFile({
   *   filePath: '/path/to/config.json'
   * });
   * console.log(config.apiKey);
   */
  public static async readJsonFile({
    filePath,
  }: {
    filePath: string;
  }): Promise<any> {
    try {
      const content = await FileUtils.readFile({ filePath });
      return JSON.parse(content as string);
    } catch (error) {
      throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Writes data to a JSON file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the JSON file.
   * @param {any} params.data - Data to write.
   * @param {boolean} [params.pretty=true] - Whether to format the JSON with indentation.
   * @param {boolean} [params.createDir=true] - Whether to create parent directories if they don't exist.
   * @returns {Promise<void>}
   * @example
   * await FileUtils.writeJsonFile({
   *   filePath: '/path/to/config.json',
   *   data: { apiKey: '123456', debug: true }
   * });
   */
  public static async writeJsonFile({
    filePath,
    data,
    pretty = true,
    createDir = true,
  }: {
    filePath: string;
    data: any;
    pretty?: boolean;
    createDir?: boolean;
  }): Promise<void> {
    try {
      const jsonString = pretty
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);
      
      await FileUtils.writeFile({
        filePath,
        data: jsonString,
        createDir,
      });
    } catch (error) {
      throw new Error(`Failed to write JSON file ${filePath}: ${error.message}`);
    }
  }
}