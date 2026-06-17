# FileUtils

The FileUtils class provides static methods for working with the file system, including reading, writing, copying, moving, hashing, and managing files and directories.

> Note: Every method takes a single destructured-object parameter.

## Basic Usage

```javascript
import { FileUtils } from '@brmorillo/utils';

// Read a file
const content = FileUtils.readFile({ filePath: './data.txt' });
console.log(content);

// Write a file
FileUtils.writeFile({ filePath: './output.txt', data: 'Hello, world!' });

// Check existence
console.log(FileUtils.fileExists({ filePath: './output.txt' })); // true
```

## Methods

### readFile({ filePath, encoding })

Reads a file synchronously and returns its contents as a string. `encoding` defaults to `'utf8'`. Throws a `StorageError` if the file cannot be read.

```javascript
const content = FileUtils.readFile({ filePath: './data.txt' });
console.log(content);
```

### readFileAsync({ filePath })

Reads a file asynchronously (UTF-8) and returns a promise that resolves to its contents. Throws a `StorageError` if the file cannot be read.

```javascript
const content = await FileUtils.readFileAsync({ filePath: './data.txt' });
console.log(content);
```

### writeFile({ filePath, data })

Writes a string to a file synchronously (UTF-8), overwriting existing content. Throws a `StorageError` if the file cannot be written.

```javascript
FileUtils.writeFile({ filePath: './output.txt', data: 'Hello, world!' });
```

### writeFileAsync({ filePath, data })

Writes a string to a file asynchronously (UTF-8). Returns a promise that resolves when the write completes. Throws a `StorageError` if the file cannot be written.

```javascript
await FileUtils.writeFileAsync({ filePath: './output.txt', data: 'Hello, world!' });
```

### appendFile({ filePath, data })

Appends a string to a file synchronously (UTF-8). Throws a `StorageError` if the file cannot be appended to.

```javascript
FileUtils.appendFile({ filePath: './log.txt', data: 'New log line\n' });
```

### createDirectory({ dirPath, recursive })

Creates a directory. `recursive` defaults to `true` (creates parent directories as needed). Silently succeeds if the directory already exists. Throws a `StorageError` on other errors.

```javascript
FileUtils.createDirectory({ dirPath: './nested/dir' });
```

### fileExists({ filePath })

Returns `true` if the file exists, otherwise `false`.

```javascript
console.log(FileUtils.fileExists({ filePath: './data.txt' })); // true
```

### getFileExtension({ filePath })

Returns the file extension, including the leading dot (e.g. `'.txt'`).

```javascript
console.log(FileUtils.getFileExtension({ filePath: './data.txt' })); // '.txt'
```

### getBaseName({ filePath })

Returns the base name of a file without its extension.

```javascript
console.log(FileUtils.getBaseName({ filePath: './path/data.txt' })); // 'data'
```

### listFiles({ dirPath })

Returns an array of file/directory names in the given directory. Throws a `StorageError` if the directory cannot be read.

```javascript
const files = FileUtils.listFiles({ dirPath: './src' });
console.log(files); // ['index.ts', 'utils.ts', ...]
```

### getFileInfo({ filePath })

Returns an `fs.Stats` object with information about the file. Throws a `StorageError` if the information cannot be retrieved.

```javascript
const stats = FileUtils.getFileInfo({ filePath: './data.txt' });
console.log(stats.size, stats.isFile());
```

### deleteFile({ filePath })

Deletes a file. Throws a `StorageError` if the file cannot be deleted.

```javascript
FileUtils.deleteFile({ filePath: './output.txt' });
```

### deleteDirectory({ dirPath, recursive })

Deletes a directory. `recursive` defaults to `false`. Throws a `StorageError` if the directory cannot be deleted.

```javascript
FileUtils.deleteDirectory({ dirPath: './empty-dir' });
FileUtils.deleteDirectory({ dirPath: './full-dir', recursive: true });
```

### deleteDirectoryRecursive({ dirPath })

Recursively deletes a directory and all of its contents. Does nothing if the directory does not exist. Throws a `StorageError` on failure.

```javascript
FileUtils.deleteDirectoryRecursive({ dirPath: './build' });
```

### calculateFileHash({ filePath, algorithm })

Calculates the hash of a file using a streaming read. `algorithm` defaults to `'sha256'`. Returns a promise that resolves to the hex-encoded hash.

```javascript
const hash = await FileUtils.calculateFileHash({ filePath: './data.txt' });
console.log(hash);

const md5 = await FileUtils.calculateFileHash({ filePath: './data.txt', algorithm: 'md5' });
```

### copyFile({ sourcePath, destPath })

Copies a file from the source path to the destination path. Throws a `StorageError` if the file cannot be copied.

```javascript
FileUtils.copyFile({ sourcePath: './data.txt', destPath: './backup/data.txt' });
```

### moveFile({ sourcePath, destPath })

Moves (renames) a file. Falls back to copy-and-delete when moving across devices. Throws a `StorageError` on failure.

```javascript
FileUtils.moveFile({ sourcePath: './data.txt', destPath: './archive/data.txt' });
```

### getFileSize({ filePath })

Returns the size of a file in bytes.

```javascript
console.log(FileUtils.getFileSize({ filePath: './data.txt' })); // 1024
```

### readJsonFile({ filePath })

Reads and parses a JSON file, returning the parsed object. Throws a `StorageError` if the file cannot be read or parsed.

```javascript
const config = FileUtils.readJsonFile({ filePath: './config.json' });
console.log(config);
```

### writeJsonFile({ filePath, data, pretty })

Serializes an object to JSON and writes it to a file. `pretty` defaults to `false`; when `true`, the JSON is formatted with 2-space indentation. Throws a `StorageError` if the file cannot be written.

```javascript
FileUtils.writeJsonFile({ filePath: './config.json', data: { debug: true }, pretty: true });
```
