import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileUtils } from '../../src/services/file.service';

/**
 * Unit tests for the FileUtils class.
 * These tests exercise real file system operations within an isolated
 * temporary directory created under the OS tmpdir.
 */
describe('FileUtils', () => {
  let tempDir: string;

  beforeEach(() => {
    // Arrange: create a unique temporary directory for each test
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fileutils-test-'));
  });

  afterEach(() => {
    // Cleanup: remove the temporary directory and all of its contents
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  // Tests for the writeFile / readFile methods
  describe('writeFile and readFile', () => {
    it('should write content to a file and read it back', () => {
      // Arrange
      const filePath = path.join(tempDir, 'sample.txt');
      const content = 'Hello, world!';

      // Act
      FileUtils.writeFile(filePath, content);
      const result = FileUtils.readFile({ filePath });

      // Assert
      expect(result).toBe(content);
    });

    it('should throw an error when reading a non-existent file', () => {
      // Arrange
      const filePath = path.join(tempDir, 'missing.txt');

      // Act & Assert
      expect(() => FileUtils.readFile({ filePath })).toThrow(
        /Failed to read file/,
      );
    });
  });

  // Tests for the async write / read methods
  describe('writeFileAsync and readFileAsync', () => {
    it('should write content asynchronously and read it back', async () => {
      // Arrange
      const filePath = path.join(tempDir, 'async.txt');
      const content = 'Async content';

      // Act
      await FileUtils.writeFileAsync(filePath, content);
      const result = await FileUtils.readFileAsync(filePath);

      // Assert
      expect(result).toBe(content);
    });

    it('should reject when reading a non-existent file asynchronously', async () => {
      // Arrange
      const filePath = path.join(tempDir, 'missing-async.txt');

      // Act & Assert
      await expect(FileUtils.readFileAsync(filePath)).rejects.toThrow(
        /Failed to read file/,
      );
    });
  });

  // Tests for the appendFile method
  describe('appendFile', () => {
    it('should append data to an existing file', () => {
      // Arrange
      const filePath = path.join(tempDir, 'append.txt');
      FileUtils.writeFile(filePath, 'first');

      // Act
      FileUtils.appendFile(filePath, '-second');
      const result = FileUtils.readFile({ filePath });

      // Assert
      expect(result).toBe('first-second');
    });
  });

  // Tests for the createDirectory method
  describe('createDirectory', () => {
    it('should create a new directory', () => {
      // Arrange
      const dirPath = path.join(tempDir, 'newdir');

      // Act
      FileUtils.createDirectory(dirPath);

      // Assert
      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should create nested directories recursively', () => {
      // Arrange
      const dirPath = path.join(tempDir, 'a', 'b', 'c');

      // Act
      FileUtils.createDirectory(dirPath, true);

      // Assert
      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should not throw when the directory already exists', () => {
      // Arrange
      const dirPath = path.join(tempDir, 'existing');
      FileUtils.createDirectory(dirPath);

      // Act & Assert
      expect(() => FileUtils.createDirectory(dirPath)).not.toThrow();
    });
  });

  // Tests for the fileExists method
  describe('fileExists', () => {
    it('should return true for an existing file', () => {
      // Arrange
      const filePath = path.join(tempDir, 'exists.txt');
      FileUtils.writeFile(filePath, 'data');

      // Act
      const result = FileUtils.fileExists(filePath);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for a non-existent file', () => {
      // Arrange
      const filePath = path.join(tempDir, 'nope.txt');

      // Act
      const result = FileUtils.fileExists(filePath);

      // Assert
      expect(result).toBe(false);
    });
  });

  // Tests for the getFileExtension method
  describe('getFileExtension', () => {
    it('should return the file extension including the dot', () => {
      // Arrange
      const filePath = '/some/path/document.txt';

      // Act
      const result = FileUtils.getFileExtension(filePath);

      // Assert
      expect(result).toBe('.txt');
    });

    it('should return an empty string when there is no extension', () => {
      // Arrange
      const filePath = '/some/path/README';

      // Act
      const result = FileUtils.getFileExtension(filePath);

      // Assert
      expect(result).toBe('');
    });
  });

  // Tests for the getBaseName method
  describe('getBaseName', () => {
    it('should return the base name without the extension', () => {
      // Arrange
      const filePath = '/some/path/document.txt';

      // Act
      const result = FileUtils.getBaseName(filePath);

      // Assert
      expect(result).toBe('document');
    });
  });

  // Tests for the listFiles method
  describe('listFiles', () => {
    it('should list the files contained in a directory', () => {
      // Arrange
      FileUtils.writeFile(path.join(tempDir, 'one.txt'), '1');
      FileUtils.writeFile(path.join(tempDir, 'two.txt'), '2');

      // Act
      const result = FileUtils.listFiles(tempDir);

      // Assert
      expect(result).toEqual(expect.arrayContaining(['one.txt', 'two.txt']));
      expect(result).toHaveLength(2);
    });

    it('should throw an error when the directory does not exist', () => {
      // Arrange
      const dirPath = path.join(tempDir, 'missing-dir');

      // Act & Assert
      expect(() => FileUtils.listFiles(dirPath)).toThrow(
        /Failed to list files/,
      );
    });
  });

  // Tests for the getFileInfo method
  describe('getFileInfo', () => {
    it('should return stats for an existing file', () => {
      // Arrange
      const filePath = path.join(tempDir, 'info.txt');
      FileUtils.writeFile(filePath, 'content');

      // Act
      const stats = FileUtils.getFileInfo(filePath);

      // Assert
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should throw an error when the file does not exist', () => {
      // Arrange
      const filePath = path.join(tempDir, 'no-info.txt');

      // Act & Assert
      expect(() => FileUtils.getFileInfo(filePath)).toThrow(
        /Failed to get file info/,
      );
    });
  });

  // Tests for the getFileSize method
  describe('getFileSize', () => {
    it('should return the size of a file in bytes', () => {
      // Arrange
      const filePath = path.join(tempDir, 'size.txt');
      const content = '12345';
      FileUtils.writeFile(filePath, content);

      // Act
      const result = FileUtils.getFileSize(filePath);

      // Assert
      expect(result).toBe(Buffer.byteLength(content));
    });
  });

  // Tests for the deleteFile method
  describe('deleteFile', () => {
    it('should delete an existing file', () => {
      // Arrange
      const filePath = path.join(tempDir, 'delete.txt');
      FileUtils.writeFile(filePath, 'data');

      // Act
      FileUtils.deleteFile(filePath);

      // Assert
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('should throw an error when deleting a non-existent file', () => {
      // Arrange
      const filePath = path.join(tempDir, 'no-delete.txt');

      // Act & Assert
      expect(() => FileUtils.deleteFile(filePath)).toThrow(
        /Failed to delete file/,
      );
    });
  });

  // Tests for the deleteDirectory method
  describe('deleteDirectory', () => {
    it('should delete an empty directory recursively', () => {
      // Arrange
      const dirPath = path.join(tempDir, 'empty');
      FileUtils.createDirectory(dirPath);

      // Act
      FileUtils.deleteDirectory(dirPath, true);

      // Assert
      expect(fs.existsSync(dirPath)).toBe(false);
    });

    it('should throw an error when deleting a non-existent directory', () => {
      // Arrange
      const dirPath = path.join(tempDir, 'no-such-dir');

      // Act & Assert
      expect(() => FileUtils.deleteDirectory(dirPath)).toThrow(
        /Failed to delete directory/,
      );
    });

    it('should delete a non-empty directory recursively', () => {
      // Arrange
      const dirPath = path.join(tempDir, 'full');
      FileUtils.createDirectory(dirPath);
      FileUtils.writeFile(path.join(dirPath, 'child.txt'), 'data');

      // Act
      FileUtils.deleteDirectory(dirPath, true);

      // Assert
      expect(fs.existsSync(dirPath)).toBe(false);
    });
  });

  // Tests for the deleteDirectoryRecursive method
  describe('deleteDirectoryRecursive', () => {
    it('should recursively delete a directory tree', () => {
      // Arrange
      const dirPath = path.join(tempDir, 'tree');
      const nested = path.join(dirPath, 'nested');
      FileUtils.createDirectory(nested);
      FileUtils.writeFile(path.join(dirPath, 'a.txt'), 'a');
      FileUtils.writeFile(path.join(nested, 'b.txt'), 'b');

      // Act
      FileUtils.deleteDirectoryRecursive(dirPath);

      // Assert
      expect(fs.existsSync(dirPath)).toBe(false);
    });

    it('should not throw when the directory does not exist', () => {
      // Arrange
      const dirPath = path.join(tempDir, 'ghost');

      // Act & Assert
      expect(() => FileUtils.deleteDirectoryRecursive(dirPath)).not.toThrow();
    });
  });

  // Tests for the calculateFileHash method
  describe('calculateFileHash', () => {
    it('should calculate the sha256 hash of a file', async () => {
      // Arrange
      const filePath = path.join(tempDir, 'hash.txt');
      FileUtils.writeFile(filePath, 'hash me');

      // Act
      const result = await FileUtils.calculateFileHash(filePath);

      // Assert
      // sha256 hex digest is 64 characters long
      expect(result).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce the same hash for identical content', async () => {
      // Arrange
      const fileA = path.join(tempDir, 'a.txt');
      const fileB = path.join(tempDir, 'b.txt');
      FileUtils.writeFile(fileA, 'same content');
      FileUtils.writeFile(fileB, 'same content');

      // Act
      const hashA = await FileUtils.calculateFileHash(fileA);
      const hashB = await FileUtils.calculateFileHash(fileB);

      // Assert
      expect(hashA).toBe(hashB);
    });

    it('should reject when the file does not exist', async () => {
      // Arrange
      const filePath = path.join(tempDir, 'no-hash.txt');

      // Act & Assert
      await expect(FileUtils.calculateFileHash(filePath)).rejects.toThrow(
        /Failed to calculate file hash/,
      );
    });
  });

  // Tests for the copyFile method
  describe('copyFile', () => {
    it('should copy a file to a new location', () => {
      // Arrange
      const source = path.join(tempDir, 'source.txt');
      const dest = path.join(tempDir, 'copy.txt');
      FileUtils.writeFile(source, 'copy me');

      // Act
      FileUtils.copyFile(source, dest);

      // Assert
      expect(FileUtils.fileExists(source)).toBe(true);
      expect(FileUtils.readFile({ filePath: dest })).toBe('copy me');
    });

    it('should throw an error when the source does not exist', () => {
      // Arrange
      const source = path.join(tempDir, 'no-source.txt');
      const dest = path.join(tempDir, 'dest.txt');

      // Act & Assert
      expect(() => FileUtils.copyFile(source, dest)).toThrow(
        /Failed to copy file/,
      );
    });
  });

  // Tests for the moveFile method
  describe('moveFile', () => {
    it('should move a file to a new location', () => {
      // Arrange
      const source = path.join(tempDir, 'move-source.txt');
      const dest = path.join(tempDir, 'move-dest.txt');
      FileUtils.writeFile(source, 'move me');

      // Act
      FileUtils.moveFile(source, dest);

      // Assert
      expect(FileUtils.fileExists(source)).toBe(false);
      expect(FileUtils.readFile({ filePath: dest })).toBe('move me');
    });

    it('should throw an error when the source does not exist', () => {
      // Arrange
      const source = path.join(tempDir, 'no-move.txt');
      const dest = path.join(tempDir, 'move-dest.txt');

      // Act & Assert
      expect(() => FileUtils.moveFile(source, dest)).toThrow(
        /Failed to move file/,
      );
    });
  });

  // Tests for the readJsonFile / writeJsonFile methods
  describe('writeJsonFile and readJsonFile', () => {
    it('should write a JSON object and read it back', () => {
      // Arrange
      const filePath = path.join(tempDir, 'data.json');
      const data = { name: 'John', age: 30, tags: ['a', 'b'] };

      // Act
      FileUtils.writeJsonFile(filePath, data);
      const result = FileUtils.readJsonFile(filePath);

      // Assert
      expect(result).toEqual(data);
    });

    it('should write pretty-formatted JSON when requested', () => {
      // Arrange
      const filePath = path.join(tempDir, 'pretty.json');
      const data = { a: 1 };

      // Act
      FileUtils.writeJsonFile(filePath, data, true);
      const raw = FileUtils.readFile({ filePath });

      // Assert
      expect(raw).toContain('\n');
      expect(raw).toBe(JSON.stringify(data, null, 2));
    });

    it('should throw an error when the JSON is invalid', () => {
      // Arrange
      const filePath = path.join(tempDir, 'invalid.json');
      FileUtils.writeFile(filePath, '{ not valid json');

      // Act & Assert
      expect(() => FileUtils.readJsonFile(filePath)).toThrow(
        /Failed to read JSON file/,
      );
    });
  });
});
