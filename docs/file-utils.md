# FileUtils

The FileUtils class provides static methods for working with the file system, including reading, writing, copying, moving, hashing, and managing files and directories.

> Note: Most methods take positional arguments. Only `readFile` uses a destructured-object parameter.

## Basic Usage

```javascript
import { FileUtils } from '@brmorillo/utils';

// Read a file (object parameter)
const content = FileUtils.readFile({ filePath: './data.txt' });
console.log(content);

// Write a file (positional parameters)
FileUtils.writeFile('./output.txt', 'Hello, world!');

// Check existence
console.log(FileUtils.fileExists('./output.txt')); // true
```

## Methods

### readFile({ filePath, encoding })

Reads a file synchronously and returns its contents as a string. `encoding` defaults to `'utf8'`. Throws if the file cannot be read.

```javascript
const content = FileUtils.readFile({ filePath: './data.txt' });
console.log(content);
```

### readFileAsync(filePath)

Reads a file asynchronously (UTF-8) and returns a promise that resolves to its contents. Throws if the file cannot be read.

```javascript
const content = await FileUtils.readFileAsync('./data.txt');
console.log(content);
```

### writeFile(filePath, data)

Writes a string to a file synchronously (UTF-8), overwriting existing content. Throws if the file cannot be written.

```javascript
FileUtils.writeFile('./output.txt', 'Hello, world!');
```

### writeFileAsync(filePath, data)

Writes a string to a file asynchronously (UTF-8). Returns a promise that resolves when the write completes. Throws if the file cannot be written.

```javascript
await FileUtils.writeFileAsync('./output.txt', 'Hello, world!');
```

### appendFile(filePath, data)

Appends a string to a file synchronously (UTF-8). Throws if the file cannot be appended to.

```javascript
FileUtils.appendFile('./log.txt', 'New log line\n');
```

### createDirectory(dirPath, recursive)

Creates a directory. `recursive` defaults to `true` (creates parent directories as needed). Silently succeeds if the directory already exists. Throws on other errors.

```javascript
FileUtils.createDirectory('./nested/dir');
```

### fileExists(filePath)

Returns `true` if the file exists, otherwise `false`.

```javascript
console.log(FileUtils.fileExists('./data.txt')); // true
```

### getFileExtension(filePath)

Returns the file extension, including the leading dot (e.g. `'.txt'`).

```javascript
console.log(FileUtils.getFileExtension('./data.txt')); // '.txt'
```

### getBaseName(filePath)

Returns the base name of a file without its extension.

```javascript
console.log(FileUtils.getBaseName('./path/data.txt')); // 'data'
```

### listFiles(dirPath)

Returns an array of file/directory names in the given directory. Throws if the directory cannot be read.

```javascript
const files = FileUtils.listFiles('./src');
console.log(files); // ['index.ts', 'utils.ts', ...]
```

### getFileInfo(filePath)

Returns an `fs.Stats` object with information about the file. Throws if the information cannot be retrieved.

```javascript
const stats = FileUtils.getFileInfo('./data.txt');
console.log(stats.size, stats.isFile());
```

### deleteFile(filePath)

Deletes a file. Throws if the file cannot be deleted.

```javascript
FileUtils.deleteFile('./output.txt');
```

### deleteDirectory(dirPath, recursive)

Deletes a directory. `recursive` defaults to `false`. Throws if the directory cannot be deleted.

```javascript
FileUtils.deleteDirectory('./empty-dir');
FileUtils.deleteDirectory('./full-dir', true);
```

### deleteDirectoryRecursive(dirPath)

Recursively deletes a directory and all of its contents. Does nothing if the directory does not exist. Throws on failure.

```javascript
FileUtils.deleteDirectoryRecursive('./build');
```

### calculateFileHash(filePath, algorithm)

Calculates the hash of a file using a streaming read. `algorithm` defaults to `'sha256'`. Returns a promise that resolves to the hex-encoded hash.

```javascript
const hash = await FileUtils.calculateFileHash('./data.txt');
console.log(hash);

const md5 = await FileUtils.calculateFileHash('./data.txt', 'md5');
```

### copyFile(sourcePath, destPath)

Copies a file from the source path to the destination path. Throws if the file cannot be copied.

```javascript
FileUtils.copyFile('./data.txt', './backup/data.txt');
```

### moveFile(sourcePath, destPath)

Moves (renames) a file. Falls back to copy-and-delete when moving across devices. Throws on failure.

```javascript
FileUtils.moveFile('./data.txt', './archive/data.txt');
```

### getFileSize(filePath)

Returns the size of a file in bytes.

```javascript
console.log(FileUtils.getFileSize('./data.txt')); // 1024
```

### readJsonFile(filePath)

Reads and parses a JSON file, returning the parsed object. Throws if the file cannot be read or parsed.

```javascript
const config = FileUtils.readJsonFile('./config.json');
console.log(config);
```

### writeJsonFile(filePath, data, pretty)

Serializes an object to JSON and writes it to a file. `pretty` defaults to `false`; when `true`, the JSON is formatted with 2-space indentation. Throws if the file cannot be written.

```javascript
FileUtils.writeJsonFile('./config.json', { debug: true }, true);
```
