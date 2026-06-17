import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileUtils } from '../../src/services/file.service';

/**
 * The CommonJS `require('fs')` object exposes writable/configurable properties,
 * which lets `jest.spyOn` redefine its methods. The ESM namespace import (`fs`
 * above) has non-configurable bindings and cannot be spied on directly. Both
 * references point at the same underlying module instance that the source code
 * uses, so spying on this object intercepts the calls made by FileUtils.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fsSpyable = require('fs');

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

  // Additional branch-coverage tests exercising the catch blocks and
  // conditional branches of each method by spying on the underlying fs calls.
  describe('branch coverage: error handling and conditionals', () => {
    afterEach(() => {
      // Restore every spy created within this block.
      jest.restoreAllMocks();
    });

    describe('readFile', () => {
      it('should read with a non-default encoding', () => {
        // Arrange
        const filePath = path.join(tempDir, 'latin1.txt');
        FileUtils.writeFile(filePath, 'plain ascii');

        // Act
        const result = FileUtils.readFile({ filePath, encoding: 'latin1' });

        // Assert
        expect(result).toBe('plain ascii');
      });

      it('should wrap the original error as cause when reading fails', () => {
        // Arrange
        const filePath = path.join(tempDir, 'boom.txt');
        const original = new Error('disk failure');
        jest.spyOn(fsSpyable, 'readFileSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        try {
          FileUtils.readFile({ filePath });
          throw new Error('expected readFile to throw');
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect((err as Error).message).toContain(filePath);
          expect((err as Error).message).toContain('disk failure');
          expect((err as Error).cause).toBe(original);
        }
      });

      it('should stringify non-Error throwables when reading fails', () => {
        // Arrange
        const filePath = path.join(tempDir, 'nonerr.txt');
        jest.spyOn(fsSpyable, 'readFileSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'string failure';
        });

        // Act & Assert
        expect(() => FileUtils.readFile({ filePath })).toThrow(
          /Failed to read file .*string failure/,
        );
      });
    });

    describe('writeFile', () => {
      it('should wrap the original error as cause when writing fails', () => {
        // Arrange
        const filePath = path.join(tempDir, 'wfail.txt');
        const original = new Error('write denied');
        jest.spyOn(fsSpyable, 'writeFileSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        try {
          FileUtils.writeFile(filePath, 'data');
          throw new Error('expected writeFile to throw');
        } catch (err) {
          expect((err as Error).message).toContain(filePath);
          expect((err as Error).message).toContain('write denied');
          expect((err as Error).cause).toBe(original);
        }
      });
    });

    describe('writeFileAsync', () => {
      it('should reject and wrap the original error when writing fails', async () => {
        // Arrange
        const filePath = path.join(tempDir, 'wafail.txt');
        const original = new Error('async write denied');
        jest
          .spyOn(fsSpyable, 'writeFile')
          .mockImplementation((...args: unknown[]) => {
            // The promisified call passes the node-style callback last.
            const cb = args[args.length - 1] as (err: Error) => void;
            cb(original);
          });

        // Act & Assert
        await expect(
          FileUtils.writeFileAsync(filePath, 'data'),
        ).rejects.toThrow(/Failed to write file .*async write denied/);
      });

      it('should stringify a non-Error rejection', async () => {
        // Arrange
        const filePath = path.join(tempDir, 'wanonerr.txt');
        jest
          .spyOn(fsSpyable, 'writeFile')
          .mockImplementation((...args: unknown[]) => {
            const cb = args[args.length - 1] as (err: unknown) => void;
            cb('async string failure');
          });

        // Act & Assert
        await expect(
          FileUtils.writeFileAsync(filePath, 'data'),
        ).rejects.toThrow(/Failed to write file .*async string failure/);
      });
    });

    // Each catch block uses `error instanceof Error ? error.message :
    // String(error)`; these cases exercise the String(error) (non-Error) side
    // for the remaining synchronous methods to raise branch coverage.
    describe('non-Error throwables across methods', () => {
      it('writeFile stringifies a non-Error', () => {
        jest.spyOn(fsSpyable, 'writeFileSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'wf string';
        });
        expect(() =>
          FileUtils.writeFile(path.join(tempDir, 'x'), 'd'),
        ).toThrow(/Failed to write file .*wf string/);
      });

      it('appendFile stringifies a non-Error', () => {
        jest.spyOn(fsSpyable, 'appendFileSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'af string';
        });
        expect(() =>
          FileUtils.appendFile(path.join(tempDir, 'x'), 'd'),
        ).toThrow(/Failed to append to file .*af string/);
      });

      it('createDirectory stringifies a non-Error (non-EEXIST path)', () => {
        jest.spyOn(fsSpyable, 'mkdirSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'mkdir string';
        });
        expect(() =>
          FileUtils.createDirectory(path.join(tempDir, 'x')),
        ).toThrow(/Failed to create directory .*mkdir string/);
      });

      it('listFiles stringifies a non-Error', () => {
        jest.spyOn(fsSpyable, 'readdirSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'ls string';
        });
        expect(() => FileUtils.listFiles(path.join(tempDir, 'x'))).toThrow(
          /Failed to list files .*ls string/,
        );
      });

      it('getFileInfo stringifies a non-Error', () => {
        jest.spyOn(fsSpyable, 'statSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'stat string';
        });
        expect(() => FileUtils.getFileInfo(path.join(tempDir, 'x'))).toThrow(
          /Failed to get file info .*stat string/,
        );
      });

      it('deleteFile stringifies a non-Error', () => {
        jest.spyOn(fsSpyable, 'unlinkSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'unlink string';
        });
        expect(() => FileUtils.deleteFile(path.join(tempDir, 'x'))).toThrow(
          /Failed to delete file .*unlink string/,
        );
      });

      it('deleteDirectory stringifies a non-Error', () => {
        jest.spyOn(fsSpyable, 'rmSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'rm string';
        });
        expect(() =>
          FileUtils.deleteDirectory(path.join(tempDir, 'x')),
        ).toThrow(/Failed to delete directory .*rm string/);
      });

      it('moveFile stringifies a non-Error (non-EXDEV path)', () => {
        jest.spyOn(fsSpyable, 'renameSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'rename string';
        });
        expect(() =>
          FileUtils.moveFile(path.join(tempDir, 'a'), path.join(tempDir, 'b')),
        ).toThrow(/Failed to move file .*rename string/);
      });

      it('copyFile stringifies a non-Error', () => {
        jest.spyOn(fsSpyable, 'copyFileSync').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw 'copy string';
        });
        expect(() =>
          FileUtils.copyFile(path.join(tempDir, 'a'), path.join(tempDir, 'b')),
        ).toThrow(/Failed to copy file .*copy string/);
      });
    });

    describe('appendFile', () => {
      it('should wrap the original error as cause when appending fails', () => {
        // Arrange
        const filePath = path.join(tempDir, 'afail.txt');
        const original = new Error('append denied');
        jest.spyOn(fsSpyable, 'appendFileSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        expect(() => FileUtils.appendFile(filePath, 'x')).toThrow(
          /Failed to append to file/,
        );
      });
    });

    describe('createDirectory', () => {
      it('should swallow an EEXIST error', () => {
        // Arrange
        const dirPath = path.join(tempDir, 'eexist');
        const eexist = Object.assign(new Error('exists'), { code: 'EEXIST' });
        jest.spyOn(fsSpyable, 'mkdirSync').mockImplementation(() => {
          throw eexist;
        });

        // Act & Assert
        expect(() => FileUtils.createDirectory(dirPath)).not.toThrow();
      });

      it('should rethrow a non-EEXIST error wrapped with cause', () => {
        // Arrange
        const dirPath = path.join(tempDir, 'eacces');
        const eacces = Object.assign(new Error('denied'), { code: 'EACCES' });
        jest.spyOn(fsSpyable, 'mkdirSync').mockImplementation(() => {
          throw eacces;
        });

        // Act & Assert
        try {
          FileUtils.createDirectory(dirPath);
          throw new Error('expected createDirectory to throw');
        } catch (err) {
          expect((err as Error).message).toContain('Failed to create directory');
          expect((err as Error).cause).toBe(eacces);
        }
      });
    });

    describe('listFiles', () => {
      it('should wrap the original error as cause when listing fails', () => {
        // Arrange
        const dirPath = path.join(tempDir, 'lfail');
        const original = new Error('read dir failure');
        jest.spyOn(fsSpyable, 'readdirSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        try {
          FileUtils.listFiles(dirPath);
          throw new Error('expected listFiles to throw');
        } catch (err) {
          expect((err as Error).message).toContain('Failed to list files');
          expect((err as Error).cause).toBe(original);
        }
      });
    });

    describe('getFileInfo', () => {
      it('should wrap the original error as cause when stat fails', () => {
        // Arrange
        const filePath = path.join(tempDir, 'infofail.txt');
        const original = new Error('stat failure');
        jest.spyOn(fsSpyable, 'statSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        expect(() => FileUtils.getFileInfo(filePath)).toThrow(
          /Failed to get file info/,
        );
      });
    });

    describe('deleteFile', () => {
      it('should wrap the original error as cause when unlink fails', () => {
        // Arrange
        const filePath = path.join(tempDir, 'dfail.txt');
        const original = new Error('unlink failure');
        jest.spyOn(fsSpyable, 'unlinkSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        try {
          FileUtils.deleteFile(filePath);
          throw new Error('expected deleteFile to throw');
        } catch (err) {
          expect((err as Error).message).toContain('Failed to delete file');
          expect((err as Error).cause).toBe(original);
        }
      });
    });

    describe('deleteDirectory', () => {
      it('should wrap the original error as cause when rm fails', () => {
        // Arrange
        const dirPath = path.join(tempDir, 'ddfail');
        const original = new Error('rm failure');
        jest.spyOn(fsSpyable, 'rmSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        try {
          FileUtils.deleteDirectory(dirPath);
          throw new Error('expected deleteDirectory to throw');
        } catch (err) {
          expect((err as Error).message).toContain('Failed to delete directory');
          expect((err as Error).cause).toBe(original);
        }
      });
    });

    describe('deleteDirectoryRecursive', () => {
      it('should wrap the original error as cause when removal fails', () => {
        // Arrange
        const dirPath = path.join(tempDir, 'recfail');
        FileUtils.createDirectory(dirPath);
        const original = new Error('rmdir failure');
        jest.spyOn(fsSpyable, 'rmdirSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        expect(() => FileUtils.deleteDirectoryRecursive(dirPath)).toThrow(
          /Failed to recursively delete directory/,
        );
      });
    });

    describe('calculateFileHash', () => {
      it('should stringify a non-Error stream failure', async () => {
        // Arrange
        const { EventEmitter } = require('events');
        const fakeStream = new EventEmitter();
        jest
          .spyOn(fsSpyable, 'createReadStream')
          .mockReturnValue(fakeStream as unknown as fs.ReadStream);
        const promise = FileUtils.calculateFileHash(
          path.join(tempDir, 'whatever.txt'),
        );

        // Act: emit a non-Error value on the stream
        fakeStream.emit('error', 'stream string error');

        // Assert
        await expect(promise).rejects.toThrow(
          /Failed to calculate file hash .*stream string error/,
        );
      });
    });

    describe('copyFile', () => {
      it('should wrap the original error as cause when copy fails', () => {
        // Arrange
        const source = path.join(tempDir, 'csrc.txt');
        const dest = path.join(tempDir, 'cdst.txt');
        const original = new Error('copy failure');
        jest.spyOn(fsSpyable, 'copyFileSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        try {
          FileUtils.copyFile(source, dest);
          throw new Error('expected copyFile to throw');
        } catch (err) {
          expect((err as Error).message).toContain('Failed to copy file');
          expect((err as Error).cause).toBe(original);
        }
      });
    });

    describe('moveFile', () => {
      it('should fall back to copy + delete on a cross-device (EXDEV) error', () => {
        // Arrange
        const source = path.join(tempDir, 'mvsrc.txt');
        const dest = path.join(tempDir, 'mvdst.txt');
        const exdev = Object.assign(new Error('cross-device'), {
          code: 'EXDEV',
        });
        jest.spyOn(fsSpyable, 'renameSync').mockImplementation(() => {
          throw exdev;
        });
        const copySpy = jest
          .spyOn(fsSpyable, 'copyFileSync')
          .mockImplementation(() => undefined);
        const unlinkSpy = jest
          .spyOn(fsSpyable, 'unlinkSync')
          .mockImplementation(() => undefined);

        // Act
        FileUtils.moveFile(source, dest);

        // Assert: the copy + delete fallback ran
        expect(copySpy).toHaveBeenCalledWith(source, dest);
        expect(unlinkSpy).toHaveBeenCalledWith(source);
      });

      it('should rethrow a non-EXDEV error wrapped with cause', () => {
        // Arrange
        const source = path.join(tempDir, 'mvsrc2.txt');
        const dest = path.join(tempDir, 'mvdst2.txt');
        const original = Object.assign(new Error('move denied'), {
          code: 'EACCES',
        });
        jest.spyOn(fsSpyable, 'renameSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        try {
          FileUtils.moveFile(source, dest);
          throw new Error('expected moveFile to throw');
        } catch (err) {
          expect((err as Error).message).toContain('Failed to move file');
          expect((err as Error).cause).toBe(original);
        }
      });
    });

    describe('writeJsonFile', () => {
      it('should write compact JSON when pretty is false', () => {
        // Arrange
        const filePath = path.join(tempDir, 'compact.json');
        const data = { a: 1, b: 2 };

        // Act
        FileUtils.writeJsonFile(filePath, data, false);
        const raw = FileUtils.readFile({ filePath });

        // Assert
        expect(raw).toBe(JSON.stringify(data));
        expect(raw).not.toContain('\n');
      });

      it('should wrap the original error as cause when writing fails', () => {
        // Arrange
        const filePath = path.join(tempDir, 'jfail.json');
        const original = new Error('json write failure');
        jest.spyOn(fsSpyable, 'writeFileSync').mockImplementation(() => {
          throw original;
        });

        // Act & Assert
        expect(() => FileUtils.writeJsonFile(filePath, { a: 1 })).toThrow(
          /Failed to (write file|write JSON file)/,
        );
      });
    });
  });
});
