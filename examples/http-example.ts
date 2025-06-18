import { Utils } from '../src';

// Example 1: Initialize with default configuration (Axios client)
const utils = Utils.getInstance();
const http = utils.getHttpService();

async function runExamples() {
  try {
    // Example 2: Make a GET request
    console.log('Making GET request with default Axios client...');
    const response = await http.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    // Example 3: Reconfigure to use native HTTP client
    console.log('\nReconfiguring to use native HTTP client...');
    utils.configure({
      http: {
        clientType: 'http',
        baseUrl: 'https://jsonplaceholder.typicode.com',
        defaultHeaders: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'Custom Value'
        },
        timeout: 5000
      }
    });

    // Example 4: Make a POST request with the native HTTP client
    console.log('Making POST request with native HTTP client...');
    const postResponse = await http.post('/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1
    });
    console.log('POST Response status:', postResponse.status);
    console.log('POST Response data:', postResponse.data);

    // Example 5: Make a request with custom options
    console.log('\nMaking request with custom options...');
    const customResponse = await http.request({
      url: '/comments',
      method: 'GET',
      params: {
        postId: 1
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('Custom Response status:', customResponse.status);
    console.log('Custom Response data (first item):', customResponse.data[0]);
    console.log('Total comments:', customResponse.data.length);

  } catch (error) {
    console.error('Error in HTTP examples:', error);
  }
}

// Run the examples
runExamples().catch(console.error);