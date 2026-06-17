import * as http from 'http';
import { AddressInfo } from 'net';
import { HttpClient } from '../../src/clients/http-client';

/**
 * Unit tests for the native HttpClient. These tests start a real local HTTP
 * server on an ephemeral port and exercise the client's request branches:
 * each HTTP verb with a JSON body, query parameters, plain-text (non-JSON)
 * responses and non-2xx status codes.
 */
describe('HttpClient (native)', () => {
  let server: http.Server;
  let baseUrl: string;
  let client: HttpClient;

  /**
   * Reads the full request body as a string.
   */
  const readBody = (req: http.IncomingMessage): Promise<string> =>
    new Promise(resolve => {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => resolve(data));
    });

  beforeAll(async () => {
    // Arrange: start a real local HTTP server with several endpoints.
    server = http.createServer(async (req, res) => {
      const body = await readBody(req);

      // Endpoint that returns a plain-text (non-JSON) body.
      if (req.url && req.url.startsWith('/text')) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('plain text response');
        return;
      }

      // Endpoint that responds with a non-2xx status and a JSON body.
      if (req.url && req.url.startsWith('/server-error')) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'internal' }));
        return;
      }

      // Endpoint that echoes query parameters back to the client.
      if (req.url && req.url.startsWith('/query')) {
        const parsed = new URL(req.url, baseUrl);
        const params: Record<string, string> = {};
        parsed.searchParams.forEach((value, key) => {
          params[key] = value;
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ params }));
        return;
      }

      // Default endpoint: echo back the method and the parsed JSON body.
      let parsedBody: unknown = null;
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          parsedBody = body;
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ method: req.method, url: req.url, body: parsedBody }),
      );
    });

    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));

    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
    client = new HttpClient();
  });

  afterAll(async () => {
    // Cleanup: close the local server.
    await new Promise<void>(resolve => server.close(() => resolve()));
  });

  describe('POST', () => {
    it('should send a JSON body and echo it back', async () => {
      // Arrange
      const payload = { name: 'Alice', age: 42 };

      // Act
      const response = await client.post(`${baseUrl}/`, payload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.method).toBe('POST');
      expect(response.data.body).toEqual(payload);
    });
  });

  describe('PUT', () => {
    it('should send a JSON body and echo it back', async () => {
      // Arrange
      const payload = { id: 7, value: 'updated' };

      // Act
      const response = await client.put(`${baseUrl}/`, payload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.method).toBe('PUT');
      expect(response.data.body).toEqual(payload);
    });
  });

  describe('PATCH', () => {
    it('should send a JSON body and echo it back', async () => {
      // Arrange
      const payload = { value: 'patched' };

      // Act
      const response = await client.patch(`${baseUrl}/`, payload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.method).toBe('PATCH');
      expect(response.data.body).toEqual(payload);
    });
  });

  describe('DELETE', () => {
    it('should perform a DELETE request', async () => {
      // Act
      const response = await client.delete(`${baseUrl}/`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.method).toBe('DELETE');
    });
  });

  describe('query parameters', () => {
    it('should append query parameters to the URL', async () => {
      // Act
      const response = await client.get(`${baseUrl}/query`, {
        params: { foo: 'bar', count: 3 },
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.params).toEqual({ foo: 'bar', count: '3' });
    });
  });

  describe('non-JSON responses', () => {
    it('should return raw text when JSON parsing fails', async () => {
      // Act
      const response = await client.get<string>(`${baseUrl}/text`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toBe('plain text response');
    });

    it('should return raw text when responseType is text', async () => {
      // Act
      const response = await client.request<string>({
        url: `${baseUrl}/`,
        method: 'GET',
        responseType: 'text',
      });

      // Assert
      expect(response.status).toBe(200);
      expect(typeof response.data).toBe('string');
    });
  });

  describe('error status codes', () => {
    it('should resolve and expose a non-2xx status code', async () => {
      // Act
      const response = await client.get(`${baseUrl}/server-error`);

      // Assert
      expect(response.status).toBe(500);
      expect(response.data.error).toBe('internal');
    });
  });

  describe('request errors', () => {
    it('should reject when the connection cannot be established', async () => {
      // Arrange: an unused port on the loopback interface.
      const deadUrl = 'http://127.0.0.1:1/';

      // Act / Assert
      await expect(client.get(deadUrl)).rejects.toBeDefined();
    });
  });
});
