import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util';
import { StorageError } from '../errors';

export class FileUtils {
  /**
   * Reads a file and returns its contents.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @param {string} [params.encoding='utf8'] - The encoding for reading the file.
   * @returns {string} The file contents as a string.
   * @throws {StorageError} If the file cannot be read.
   * @example
   * ```typescript
   * const content = FileUtils.readFile({ filePath: './data.txt' });
   * console.log(content); // File contents
   * ```
   */
  public static readFile({
    filePath,
    encoding = 'utf8',
  }: {
    filePath: string;
    encoding?: BufferEncoding;
  }): string {
    try {
      return fs.readFileSync(filePath, encoding);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to read file ${filePath}: ${errorMessage}`,
        'FILE_READ_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Reads a file asynchronously and returns its contents.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns A promise that resolves to the file contents as a string.
   * @throws {StorageError} If the file cannot be read.
   * @example
   * ```typescript
   * const content = await FileUtils.readFileAsync({ filePath: './data.txt' });
   * ```
   */
  public static async readFileAsync({
    filePath,
  }: {
    filePath: string;
  }): Promise<string> {
    try {
      const readFile = promisify(fs.readFile);
      return await readFile(filePath, 'utf8');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to read file ${filePath}: ${errorMessage}`,
        'FILE_READ_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Writes data to a file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @param {string} params.data - The data to write.
   * @throws {StorageError} If the file cannot be written.
   * @example
   * ```typescript
   * FileUtils.writeFile({ filePath: './output.txt', data: 'Hello, world!' });
   * ```
   */
  public static writeFile({
    filePath,
    data,
  }: {
    filePath: string;
    data: string;
  }): void {
    try {
      fs.writeFileSync(filePath, data, 'utf8');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to write file ${filePath}: ${errorMessage}`,
        'FILE_WRITE_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Writes data to a file asynchronously.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @param {string} params.data - The data to write.
   * @returns A promise that resolves when the file has been written.
   * @throws {StorageError} If the file cannot be written.
   * @example
   * ```typescript
   * await FileUtils.writeFileAsync({ filePath: './output.txt', data: 'Hello' });
   * ```
   */
  public static async writeFileAsync({
    filePath,
    data,
  }: {
    filePath: string;
    data: string;
  }): Promise<void> {
    try {
      const writeFile = promisify(fs.writeFile);
      await writeFile(filePath, data, 'utf8');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to write file ${filePath}: ${errorMessage}`,
        'FILE_WRITE_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Appends data to a file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @param {string} params.data - The data to append.
   * @throws {StorageError} If the file cannot be appended to.
   * @example
   * ```typescript
   * FileUtils.appendFile({ filePath: './log.txt', data: 'New line\n' });
   * ```
   */
  public static appendFile({
    filePath,
    data,
  }: {
    filePath: string;
    data: string;
  }): void {
    try {
      fs.appendFileSync(filePath, data, 'utf8');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to append to file ${filePath}: ${errorMessage}`,
        'FILE_APPEND_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Creates a directory if it doesn't exist.
   * @param {object} params - The parameters for the method.
   * @param {string} params.dirPath - Path to the directory.
   * @param {boolean} [params.recursive=true] - Whether to create parent directories if they don't exist.
   * @throws {StorageError} If the directory cannot be created.
   * @example
   * ```typescript
   * FileUtils.createDirectory({ dirPath: './nested/dir' });
   * ```
   */
  public static createDirectory({
    dirPath,
    recursive = true,
  }: {
    dirPath: string;
    recursive?: boolean;
  }): void {
    try {
      fs.mkdirSync(dirPath, { recursive });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as NodeJS.ErrnoException).code === 'EEXIST'
      ) {
        return; // Directory already exists, which is fine
      }
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to create directory ${dirPath}: ${errorMessage}`,
        'DIR_CREATE_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Checks if a file exists.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns `true` if the file exists, otherwise `false`.
   * @example
   * ```typescript
   * FileUtils.fileExists({ filePath: './data.txt' });
   * ```
   */
  public static fileExists({ filePath }: { filePath: string }): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Gets the extension of a file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns The file extension (e.g., '.txt').
   * @example
   * ```typescript
   * FileUtils.getFileExtension({ filePath: './data.txt' }); // '.txt'
   * ```
   */
  public static getFileExtension({
    filePath,
  }: {
    filePath: string;
  }): string {
    return path.extname(filePath);
  }

  /**
   * Gets the base name of a file (without extension).
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns The base name of the file.
   * @example
   * ```typescript
   * FileUtils.getBaseName({ filePath: './path/data.txt' }); // 'data'
   * ```
   */
  public static getBaseName({ filePath }: { filePath: string }): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * Lists all files in a directory.
   * @param {object} params - The parameters for the method.
   * @param {string} params.dirPath - Path to the directory.
   * @returns An array of file names.
   * @throws {StorageError} If the directory cannot be read.
   * @example
   * ```typescript
   * const files = FileUtils.listFiles({ dirPath: './src' });
   * ```
   */
  public static listFiles({ dirPath }: { dirPath: string }): string[] {
    try {
      return fs.readdirSync(dirPath);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to list files in ${dirPath}: ${errorMessage}`,
        'FILE_LIST_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Gets information about a file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns An object containing file information.
   * @throws {StorageError} If the file information cannot be retrieved.
   * @example
   * ```typescript
   * const stats = FileUtils.getFileInfo({ filePath: './data.txt' });
   * ```
   */
  public static getFileInfo({ filePath }: { filePath: string }): fs.Stats {
    try {
      return fs.statSync(filePath);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to get file info for ${filePath}: ${errorMessage}`,
        'FILE_INFO_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Deletes a file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @throws {StorageError} If the file cannot be deleted.
   * @example
   * ```typescript
   * FileUtils.deleteFile({ filePath: './output.txt' });
   * ```
   */
  public static deleteFile({ filePath }: { filePath: string }): void {
    try {
      fs.unlinkSync(filePath);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to delete file ${filePath}: ${errorMessage}`,
        'FILE_DELETE_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Deletes a directory.
   * @param {object} params - The parameters for the method.
   * @param {string} params.dirPath - Path to the directory.
   * @param {boolean} [params.recursive=false] - Whether to delete subdirectories and files.
   * @throws {StorageError} If the directory cannot be deleted.
   * @example
   * ```typescript
   * FileUtils.deleteDirectory({ dirPath: './full-dir', recursive: true });
   * ```
   */
  public static deleteDirectory({
    dirPath,
    recursive = false,
  }: {
    dirPath: string;
    recursive?: boolean;
  }): void {
    try {
      fs.rmSync(dirPath, { recursive, force: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to delete directory ${dirPath}: ${errorMessage}`,
        'DIR_DELETE_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Recursively deletes a directory and all its contents.
   * @param {object} params - The parameters for the method.
   * @param {string} params.dirPath - Path to the directory.
   * @throws {StorageError} If the directory cannot be deleted.
   * @example
   * ```typescript
   * FileUtils.deleteDirectoryRecursive({ dirPath: './build' });
   * ```
   */
  public static deleteDirectoryRecursive({
    dirPath,
  }: {
    dirPath: string;
  }): void {
    try {
      if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(file => {
          const curPath = path.join(dirPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            // Recursive call for directories
            FileUtils.deleteDirectoryRecursive({ dirPath: curPath });
          } else {
            // Delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(dirPath);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to recursively delete directory ${dirPath}: ${errorMessage}`,
        'DIR_DELETE_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Calculates the hash of a file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @param {string} [params.algorithm='sha256'] - Hash algorithm to use.
   * @returns A promise that resolves to the file hash.
   * @throws {StorageError} If the file hash cannot be calculated.
   * @example
   * ```typescript
   * const hash = await FileUtils.calculateFileHash({ filePath: './data.txt' });
   * ```
   */
  public static calculateFileHash({
    filePath,
    algorithm = 'sha256',
  }: {
    filePath: string;
    algorithm?: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(algorithm);
      const stream = fs.createReadStream(filePath);

      stream.on('error', (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        reject(
          new StorageError(
            `Failed to calculate file hash for ${filePath}: ${errorMessage}`,
            'FILE_HASH_ERROR',
            undefined,
            { cause: error },
          ),
        );
      });

      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  /**
   * Copies a file from one location to another.
   * @param {object} params - The parameters for the method.
   * @param {string} params.sourcePath - Path to the source file.
   * @param {string} params.destPath - Path to the destination file.
   * @throws {StorageError} If the file cannot be copied.
   * @example
   * ```typescript
   * FileUtils.copyFile({ sourcePath: './data.txt', destPath: './backup.txt' });
   * ```
   */
  public static copyFile({
    sourcePath,
    destPath,
  }: {
    sourcePath: string;
    destPath: string;
  }): void {
    try {
      fs.copyFileSync(sourcePath, destPath);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to copy file from ${sourcePath} to ${destPath}: ${errorMessage}`,
        'FILE_COPY_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Moves a file from one location to another.
   * @param {object} params - The parameters for the method.
   * @param {string} params.sourcePath - Path to the source file.
   * @param {string} params.destPath - Path to the destination file.
   * @throws {StorageError} If the file cannot be moved.
   * @example
   * ```typescript
   * FileUtils.moveFile({ sourcePath: './data.txt', destPath: './archive.txt' });
   * ```
   */
  public static moveFile({
    sourcePath,
    destPath,
  }: {
    sourcePath: string;
    destPath: string;
  }): void {
    try {
      fs.renameSync(sourcePath, destPath);
    } catch (error: unknown) {
      // If rename fails due to cross-device link, fall back to copy and delete
      if (
        error instanceof Error &&
        (error as NodeJS.ErrnoException).code === 'EXDEV'
      ) {
        FileUtils.copyFile({ sourcePath, destPath });
        FileUtils.deleteFile({ filePath: sourcePath });
      } else {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new StorageError(
          `Failed to move file from ${sourcePath} to ${destPath}: ${errorMessage}`,
          'FILE_MOVE_ERROR',
          undefined,
          { cause: error },
        );
      }
    }
  }

  /**
   * Gets the size of a file in bytes.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @returns The size of the file in bytes.
   * @example
   * ```typescript
   * FileUtils.getFileSize({ filePath: './data.txt' }); // 1024
   * ```
   */
  public static getFileSize({ filePath }: { filePath: string }): number {
    const stats = FileUtils.getFileInfo({ filePath });
    return stats.size;
  }

  /**
   * Reads a JSON file and parses its contents.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the JSON file.
   * @typeParam T - The expected shape of the parsed JSON. Defaults to `unknown`;
   *   the value is not validated at runtime, so callers asserting a `T` are
   *   responsible for ensuring the file matches.
   * @returns The parsed JSON object, typed as `T`.
   * @throws {StorageError} If the file cannot be read or parsed.
   * @example
   * ```typescript
   * interface Config { debug: boolean }
   * const config = FileUtils.readJsonFile<Config>({ filePath: './config.json' });
   * ```
   */
  public static readJsonFile<T = unknown>({
    filePath,
  }: {
    filePath: string;
  }): T {
    try {
      const data = FileUtils.readFile({ filePath });
      return JSON.parse(data) as T;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to read JSON file ${filePath}: ${errorMessage}`,
        'JSON_READ_ERROR',
        undefined,
        { cause: error },
      );
    }
  }

  /**
   * Writes a JSON object to a file.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the JSON file.
   * @param {unknown} params.data - The JSON-serializable value to write.
   * @param {boolean} [params.pretty=false] - Whether to format the JSON with indentation.
   * @throws {StorageError} If the file cannot be written.
   * @example
   * ```typescript
   * FileUtils.writeJsonFile({ filePath: './config.json', data: { debug: true }, pretty: true });
   * ```
   */
  public static writeJsonFile({
    filePath,
    data,
    pretty = false,
  }: {
    filePath: string;
    data: unknown;
    pretty?: boolean;
  }): void {
    try {
      const jsonString = pretty
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);
      FileUtils.writeFile({ filePath, data: jsonString });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new StorageError(
        `Failed to write JSON file ${filePath}: ${errorMessage}`,
        'JSON_WRITE_ERROR',
        undefined,
        { cause: error },
      );
    }
  }
}
