import { Utils } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// Example 1: Initialize with local storage configuration
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

async function runLocalStorageExamples() {
  try {
    console.log('Running local storage examples...');
    
    // Example 2: Upload a text file
    const textContent = 'This is a sample text file content';
    const textFilePath = 'example/text-file.txt';
    
    console.log(`Uploading text file to ${textFilePath}...`);
    const textFileUrl = await storage.uploadFile(textFilePath, textContent, {
      contentType: 'text/plain'
    });
    console.log(`Text file uploaded, URL: ${textFileUrl}`);
    
    // Example 3: Upload a binary file (image)
    const imagePath = path.join(__dirname, 'sample-image.jpg');
    if (fs.existsSync(imagePath)) {
      const imageContent = fs.readFileSync(imagePath);
      const imageFilePath = 'example/image-file.jpg';
      
      console.log(`Uploading image file to ${imageFilePath}...`);
      const imageFileUrl = await storage.uploadFile(imageFilePath, imageContent, {
        contentType: 'image/jpeg'
      });
      console.log(`Image file uploaded, URL: ${imageFileUrl}`);
    } else {
      console.log('Sample image not found, skipping image upload example');
    }
    
    // Example 4: Check if file exists
    const fileExists = await storage.fileExists(textFilePath);
    console.log(`File ${textFilePath} exists: ${fileExists}`);
    
    // Example 5: Get file metadata
    const metadata = await storage.getFileMetadata(textFilePath);
    console.log('File metadata:', metadata);
    
    // Example 6: Download file
    const downloadedContent = await storage.downloadFile(textFilePath);
    console.log(`Downloaded file content (${downloadedContent.length} bytes): ${downloadedContent.toString().substring(0, 50)}...`);
    
    // Example 7: List files
    const files = await storage.listFiles('example');
    console.log('Files in example directory:', files);
    
    // Example 8: Delete file
    console.log(`Deleting file ${textFilePath}...`);
    await storage.deleteFile(textFilePath);
    console.log('File deleted');
    
    // Example 9: Verify file is deleted
    const fileExistsAfterDelete = await storage.fileExists(textFilePath);
    console.log(`File ${textFilePath} exists after delete: ${fileExistsAfterDelete}`);
  } catch (error) {
    console.error('Error in local storage examples:', error);
  }
}

async function runS3Examples() {
  try {
    console.log('\nReconfiguring to use S3 storage...');
    
    // Example 10: Reconfigure to use S3
    utils.configure({
      storage: {
        providerType: 's3',
        s3: {
          bucket: 'my-example-bucket',
          region: 'us-east-1',
          accessKeyId: 'YOUR_ACCESS_KEY_ID',
          secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
        }
      }
    });
    
    console.log('S3 storage configured. To run S3 examples, replace the placeholder credentials with valid AWS credentials.');
    
    // Note: The following examples are commented out to prevent accidental execution with invalid credentials
    // Uncomment and provide valid credentials to test S3 functionality
    
    /*
    // Example 11: Upload a file to S3
    const textContent = 'This is a sample text file content for S3';
    const textFilePath = 'example/s3-text-file.txt';
    
    console.log(`Uploading text file to S3 at ${textFilePath}...`);
    const textFileUrl = await storage.uploadFile(textFilePath, textContent, {
      contentType: 'text/plain'
    });
    console.log(`Text file uploaded to S3, URL: ${textFileUrl}`);
    
    // Example 12: List files in S3
    const s3Files = await storage.listFiles('example');
    console.log('Files in S3 example directory:', s3Files);
    
    // Example 13: Delete file from S3
    console.log(`Deleting file ${textFilePath} from S3...`);
    await storage.deleteFile(textFilePath);
    console.log('File deleted from S3');
    */
  } catch (error) {
    console.error('Error in S3 examples:', error);
  }
}

// Run the examples
async function runExamples() {
  await runLocalStorageExamples();
  await runS3Examples();
}

runExamples().catch(console.error);