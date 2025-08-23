import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util';

export class FileUtils {
  /**
   * Reads a file and returns its contents.
   * @param {object} params - The parameters for the method.
   * @param {string} params.filePath - Path to the file.
   * @param {string} [params.encoding='utf8'] - The encoding for reading the file.
   * @returns {string} The file contents as a string.
   * @throws {Error} If the file cannot be read.
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
      throw new Error(`Failed to read file ${filePath}: ${errorMessage}`);
    }
  }

  /**
   * Reads a file asynchronously and returns its contents.
   * @param filePath Path to the file.
   * @returns A promise that resolves to the file contents as a string.
   * @throws {Error} If the file cannot be read.
   */
  public static async readFileAsync(filePath: string): Promise<string> {
    try {
      const readFile = promisify(fs.readFile);
      return await readFile(filePath, 'utf8');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read file ${filePath}: ${errorMessage}`);
    }
  }

  /**
   * Writes data to a file.
   * @param filePath Path to the file.
   * @param data The data to write.
   * @throws {Error} If the file cannot be written.
   */
  public static writeFile(filePath: string, data: string): void {
    try {
      fs.writeFileSync(filePath, data, 'utf8');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to write file ${filePath}: ${errorMessage}`);
    }
  }

  /**
   * Writes data to a file asynchronously.
   * @param filePath Path to the file.
   * @param data The data to write.
   * @returns A promise that resolves when the file has been written.
   * @throws {Error} If the file cannot be written.
   */
  public static async writeFileAsync(
    filePath: string,
    data: string,
  ): Promise<void> {
    try {
      const writeFile = promisify(fs.writeFile);
      await writeFile(filePath, data, 'utf8');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to write file ${filePath}: ${errorMessage}`);
    }
  }

  /**
   * Appends data to a file.
   * @param filePath Path to the file.
   * @param data The data to append.
   * @throws {Error} If the file cannot be appended to.
   */
  public static appendFile(filePath: string, data: string): void {
    try {
      fs.appendFileSync(filePath, data, 'utf8');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to append to file ${filePath}: ${errorMessage}`);
    }
  }

  /**
   * Creates a directory if it doesn't exist.
   * @param dirPath Path to the directory.
   * @param recursive Whether to create parent directories if they don't exist.
   * @throws {Error} If the directory cannot be created.
   */
  public static createDirectory(dirPath: string, recursive = true): void {
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
      throw new Error(`Failed to create directory ${dirPath}: ${errorMessage}`);
    }
  }

  /**
   * Checks if a file exists.
   * @param filePath Path to the file.
   * @returns `true` if the file exists, otherwise `false`.
   */
  public static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Gets the extension of a file.
   * @param filePath Path to the file.
   * @returns The file extension (e.g., '.txt').
   */
  public static getFileExtension(filePath: string): string {
    return path.extname(filePath);
  }

  /**
   * Gets the base name of a file (without extension).
   * @param filePath Path to the file.
   * @returns The base name of the file.
   */
  public static getBaseName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * Lists all files in a directory.
   * @param dirPath Path to the directory.
   * @returns An array of file names.
   * @throws {Error} If the directory cannot be read.
   */
  public static listFiles(dirPath: string): string[] {
    try {
      return fs.readdirSync(dirPath);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to list files in ${dirPath}: ${errorMessage}`);
    }
  }

  /**
   * Gets information about a file.
   * @param filePath Path to the file.
   * @returns An object containing file information.
   * @throws {Error} If the file information cannot be retrieved.
   */
  public static getFileInfo(filePath: string): fs.Stats {
    try {
      return fs.statSync(filePath);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to get file info for ${filePath}: ${errorMessage}`,
      );
    }
  }

  /**
   * Deletes a file.
   * @param filePath Path to the file.
   * @throws {Error} If the file cannot be deleted.
   */
  public static deleteFile(filePath: string): void {
    try {
      fs.unlinkSync(filePath);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete file ${filePath}: ${errorMessage}`);
    }
  }

  /**
   * Deletes a directory.
   * @param dirPath Path to the directory.
   * @param recursive Whether to delete subdirectories and files.
   * @throws {Error} If the directory cannot be deleted.
   */
  public static deleteDirectory(dirPath: string, recursive = false): void {
    try {
      fs.rmdirSync(dirPath, { recursive });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete directory ${dirPath}: ${errorMessage}`);
    }
  }

  /**
   * Recursively deletes a directory and all its contents.
   * @param dirPath Path to the directory.
   * @throws {Error} If the directory cannot be deleted.
   */
  public static deleteDirectoryRecursive(dirPath: string): void {
    try {
      if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(file => {
          const curPath = path.join(dirPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            // Recursive call for directories
            FileUtils.deleteDirectoryRecursive(curPath);
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
      throw new Error(
        `Failed to recursively delete directory ${dirPath}: ${errorMessage}`,
      );
    }
  }

  /**
   * Calculates the hash of a file.
   * @param filePath Path to the file.
   * @param algorithm Hash algorithm to use (default: 'sha256').
   * @returns A promise that resolves to the file hash.
   */
  public static calculateFileHash(
    filePath: string,
    algorithm = 'sha256',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(algorithm);
      const stream = fs.createReadStream(filePath);

      stream.on('error', (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        reject(
          new Error(
            `Failed to calculate file hash for ${filePath}: ${errorMessage}`,
          ),
        );
      });

      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  /**
   * Copies a file from one location to another.
   * @param sourcePath Path to the source file.
   * @param destPath Path to the destination file.
   * @throws {Error} If the file cannot be copied.
   */
  public static copyFile(sourcePath: string, destPath: string): void {
    try {
      fs.copyFileSync(sourcePath, destPath);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to copy file from ${sourcePath} to ${destPath}: ${errorMessage}`,
      );
    }
  }

  /**
   * Moves a file from one location to another.
   * @param sourcePath Path to the source file.
   * @param destPath Path to the destination file.
   * @throws {Error} If the file cannot be moved.
   */
  public static moveFile(sourcePath: string, destPath: string): void {
    try {
      fs.renameSync(sourcePath, destPath);
    } catch (error: unknown) {
      // If rename fails due to cross-device link, fall back to copy and delete
      if (
        error instanceof Error &&
        (error as NodeJS.ErrnoException).code === 'EXDEV'
      ) {
        FileUtils.copyFile(sourcePath, destPath);
        FileUtils.deleteFile(sourcePath);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to move file from ${sourcePath} to ${destPath}: ${errorMessage}`,
        );
      }
    }
  }

  /**
   * Gets the size of a file in bytes.
   * @param filePath Path to the file.
   * @returns The size of the file in bytes.
   */
  public static getFileSize(filePath: string): number {
    const stats = FileUtils.getFileInfo(filePath);
    return stats.size;
  }

  /**
   * Reads a JSON file and parses its contents.
   * @param filePath Path to the JSON file.
   * @returns The parsed JSON object.
   * @throws {Error} If the file cannot be read or parsed.
   */
  public static readJsonFile(filePath: string): any {
    try {
      const data = FileUtils.readFile({ filePath });
      return JSON.parse(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read JSON file ${filePath}: ${errorMessage}`);
    }
  }

  /**
   * Writes a JSON object to a file.
   * @param filePath Path to the JSON file.
   * @param data The JSON object to write.
   * @param pretty Whether to format the JSON with indentation.
   * @throws {Error} If the file cannot be written.
   */
  public static writeJsonFile(
    filePath: string,
    data: any,
    pretty = false,
  ): void {
    try {
      const jsonString = pretty
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);
      FileUtils.writeFile(filePath, jsonString);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to write JSON file ${filePath}: ${errorMessage}`);
    }
  }
}
