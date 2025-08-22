# StorageService

The StorageService provides a configurable file storage system with support for multiple providers (Local filesystem, Amazon S3).

## Basic Usage

```javascript
import { Utils } from '@brmorillo/utils';

// Initialize with default configuration (Local storage)
const utils = Utils.getInstance({
  storage: {
    providerType: 'local',
    local: {
      basePath: './storage',
      baseUrl: 'http://localhost:3000/files'
    }
  }
});

const storage = utils.getStorageService();

// Upload a file
const fileUrl = await storage.uploadFile('path/to/file.txt', 'File content', {
  contentType: 'text/plain'
});
console.log('File uploaded:', fileUrl);

// Download a file
const fileContent = await storage.downloadFile('path/to/file.txt');
console.log('File content:', fileContent.toString());

// Check if a file exists
const exists = await storage.fileExists('path/to/file.txt');
console.log('File exists:', exists);

// Delete a file
await storage.deleteFile('path/to/file.txt');
```

## Configuration

You can configure the storage service when initializing the Utils instance:

```javascript
const utils = Utils.getInstance({
  storage: {
    providerType: 'local',
    local: {
      basePath: './storage',
      baseUrl: 'http://localhost:3000/files'
    }
  }
});
```

Or reconfigure it later:

```javascript
utils.configure({
  storage: {
    providerType: 's3',
    s3: {
      bucket: 'my-bucket',
      region: 'us-east-1',
      accessKeyId: 'YOUR_ACCESS_KEY',
      secretAccessKey: 'YOUR_SECRET_KEY'
    }
  }
});
```

### Configuration Options

#### Local Storage Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `providerType` | string | Storage provider type ('local' or 's3') | 'local' |
| `local.basePath` | string | Base directory path for file storage | required |
| `local.baseUrl` | string | Base URL for accessing files (optional) | '' |

#### S3 Storage Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `providerType` | string | Storage provider type ('local' or 's3') | 'local' |
| `s3.bucket` | string | S3 bucket name | required |
| `s3.region` | string | AWS region | required |
| `s3.accessKeyId` | string | AWS access key ID | optional |
| `s3.secretAccessKey` | string | AWS secret access key | optional |
| `s3.endpoint` | string | Custom S3 endpoint (for S3-compatible services) | optional |
| `s3.forcePathStyle` | boolean | Use path-style URLs | optional |
| `s3.baseUrl` | string | Custom base URL for files | optional |

## Methods

### uploadFile(path, content, metadata)

Uploads a file to storage.

```javascript
const fileUrl = await storage.uploadFile('images/photo.jpg', imageBuffer, {
  contentType: 'image/jpeg'
});
```

### downloadFile(path)

Downloads a file from storage.

```javascript
const fileContent = await storage.downloadFile('documents/report.pdf');
```

### fileExists(path)

Checks if a file exists in storage.

```javascript
const exists = await storage.fileExists('documents/report.pdf');
```

### deleteFile(path)

Deletes a file from storage.

```javascript
await storage.deleteFile('temp/old-file.txt');
```

### getFileUrl(path)

Gets the URL for a file.

```javascript
const url = storage.getFileUrl('images/photo.jpg');
```

### listFiles(prefix)

Lists files in a directory/prefix.

```javascript
const files = await storage.listFiles('images/');
```

### getFileMetadata(path)

Gets metadata for a file.

```javascript
const metadata = await storage.getFileMetadata('documents/report.pdf');
```

## Examples

### Example 1: Uploading Different Types of Content

```javascript
import { Utils } from '@brmorillo/utils';
import * as fs from 'fs';

const utils = Utils.getInstance({
  storage: {
    providerType: 'local',
    local: {
      basePath: './storage'
    }
  }
});

const storage = utils.getStorageService();

// Upload string content
await storage.uploadFile('text/hello.txt', 'Hello, world!', {
  contentType: 'text/plain'
});

// Upload buffer content
const imageBuffer = fs.readFileSync('local-image.jpg');
await storage.uploadFile('images/photo.jpg', imageBuffer, {
  contentType: 'image/jpeg'
});

// Upload stream content
const fileStream = fs.createReadStream('large-file.pdf');
await storage.uploadFile('documents/large-file.pdf', fileStream, {
  contentType: 'application/pdf'
});
```

### Example 2: Switching Between Storage Providers

```javascript
import { Utils } from '@brmorillo/utils';

// Start with local storage
const utils = Utils.getInstance({
  storage: {
    providerType: 'local',
    local: {
      basePath: './local-storage'
    }
  }
});

const storage = utils.getStorageService();

// Upload to local storage
await storage.uploadFile('backup/data.json', JSON.stringify({ key: 'value' }));

// Switch to S3 storage
utils.configure({
  storage: {
    providerType: 's3',
    s3: {
      bucket: 'my-production-bucket',
      region: 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  }
});

// Now upload to S3
await storage.uploadFile('backup/data.json', JSON.stringify({ key: 'value' }));
```

### Example 3: Working with File Metadata

```javascript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance();
const storage = utils.getStorageService();

// Upload with custom metadata
await storage.uploadFile('documents/report.pdf', pdfBuffer, {
  contentType: 'application/pdf',
  contentLength: pdfBuffer.length,
  author: 'John Doe',
  department: 'Finance',
  createdAt: new Date().toISOString()
});

// Get file metadata
const metadata = await storage.getFileMetadata('documents/report.pdf');
console.log('File type:', metadata.contentType);
console.log('File size:', metadata.contentLength);
console.log('Author:', metadata.author);
console.log('Department:', metadata.department);
```

For more detailed examples and advanced usage, see the [complete StorageService documentation](./storage-service-detailed.md).