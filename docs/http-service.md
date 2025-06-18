# HttpService

The HttpService provides a configurable HTTP client with support for multiple providers (Axios, native HTTP/HTTPS).

## Basic Usage

```javascript
import { Utils } from '@brmorillo/utils';

// Initialize with default configuration (Axios client)
const utils = Utils.getInstance();
const http = utils.getHttpService();

// Make a GET request
const response = await http.get('https://api.example.com/users');
console.log(response.data);

// Make a POST request
const createResponse = await http.post('https://api.example.com/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
console.log(createResponse.data);
```

## Configuration

You can configure the HTTP service when initializing the Utils instance:

```javascript
const utils = Utils.getInstance({
  http: {
    clientType: 'axios',
    baseUrl: 'https://api.example.com',
    defaultHeaders: {
      'Authorization': 'Bearer token',
      'Content-Type': 'application/json'
    },
    timeout: 5000
  }
});
```

Or reconfigure it later:

```javascript
utils.configure({
  http: {
    clientType: 'http',
    baseUrl: 'https://api.example.com/v2'
  }
});
```

### Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `clientType` | string | HTTP client type ('axios' or 'http') | 'axios' |
| `baseUrl` | string | Base URL for all requests | '' |
| `defaultHeaders` | object | Default headers to include in all requests | {} |
| `timeout` | number | Request timeout in milliseconds | undefined |

## Methods

### get(url, options)

Makes a GET request.

```javascript
const response = await http.get('/users', {
  params: { page: 1, limit: 10 },
  headers: { 'Cache-Control': 'no-cache' }
});
```

### post(url, data, options)

Makes a POST request.

```javascript
const response = await http.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### put(url, data, options)

Makes a PUT request.

```javascript
const response = await http.put('/users/123', {
  name: 'John Updated',
  email: 'john.updated@example.com'
});
```

### delete(url, options)

Makes a DELETE request.

```javascript
const response = await http.delete('/users/123');
```

### patch(url, data, options)

Makes a PATCH request.

```javascript
const response = await http.patch('/users/123', {
  name: 'John Patched'
});
```

### request(options)

Makes a generic HTTP request with custom options.

```javascript
const response = await http.request({
  url: '/users',
  method: 'GET',
  params: { page: 1 },
  headers: { 'Custom-Header': 'value' }
});
```

## Examples

### Example 1: Basic API Requests

```javascript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance();
const http = utils.getHttpService();

async function fetchUsers() {
  const response = await http.get('https://jsonplaceholder.typicode.com/users');
  return response.data;
}

async function createUser(userData) {
  const response = await http.post('https://jsonplaceholder.typicode.com/users', userData);
  return response.data;
}

async function updateUser(id, userData) {
  const response = await http.put(`https://jsonplaceholder.typicode.com/users/${id}`, userData);
  return response.data;
}

async function deleteUser(id) {
  const response = await http.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
  return response.data;
}
```

### Example 2: Using Different HTTP Clients

```javascript
import { Utils } from '@brmorillo/utils';

// Using Axios client
const utils = Utils.getInstance({
  http: {
    clientType: 'axios',
    baseUrl: 'https://api.example.com'
  }
});

const http = utils.getHttpService();
await http.get('/users');

// Switch to native HTTP client
utils.configure({
  http: {
    clientType: 'http',
    baseUrl: 'https://api.example.com'
  }
});

await http.get('/users');
```

### Example 3: Error Handling

```javascript
import { Utils } from '@brmorillo/utils';

const utils = Utils.getInstance();
const http = utils.getHttpService();

async function fetchData() {
  try {
    const response = await http.get('https://api.example.com/data');
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server error:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error, no response received');
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    throw error;
  }
}
```

For more detailed examples and advanced usage, see the [complete HttpService documentation](./http-service-detailed.md).