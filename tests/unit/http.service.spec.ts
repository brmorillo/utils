import * as http from 'http';
import { AddressInfo } from 'net';
import { HttpService } from '../../src/services/http.service';

/**
 * Unit tests for the HttpService using the native 'http' client.
 * These tests spin up a real local HTTP server on an ephemeral port and
 * exercise the service against it, verifying methods, status codes,
 * JSON body round-trips and headers.
 */
describe('HttpService (native http client)', () => {
  let server: http.Server;
  let baseUrl: string;
  let service: HttpService;

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
    // Arrange: start a real local HTTP server that echoes request info back.
    server = http.createServer(async (req, res) => {
      const body = await readBody(req);

      // Endpoint that echoes a custom header back to the client.
      if (req.url === '/echo-header') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ received: req.headers['x-custom-header'] || null }),
        );
        return;
      }

      // Endpoint that responds with a specific (non-200) status code.
      if (req.url === '/not-found') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'not found' }));
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

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'x-response-header': 'response-value',
      });
      res.end(
        JSON.stringify({
          method: req.method,
          url: req.url,
          body: parsedBody,
        }),
      );
    });

    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));

    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;

    // Configure the singleton to use the native http client and our local server.
    service = HttpService.getInstance();
    service.configure({ clientType: 'http', baseUrl });
  });

  afterAll(async () => {
    // Cleanup: close the local server.
    await new Promise<void>(resolve => server.close(() => resolve()));
  });

  describe('get', () => {
    it('should perform a GET request and return status 200', async () => {
      // Act
      const response = await service.get('/');

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.method).toBe('GET');
    });

    it('should send and echo back query parameters', async () => {
      // Act
      const response = await service.get('/query', {
        params: { foo: 'bar', count: 2 },
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.params).toEqual({ foo: 'bar', count: '2' });
    });

    it('should expose response headers', async () => {
      // Act
      const response = await service.get('/');

      // Assert
      expect(response.headers['x-response-header']).toBe('response-value');
    });
  });

  describe('post', () => {
    it('should round-trip a JSON body on POST', async () => {
      // Arrange
      const payload = { name: 'John', age: 30 };

      // Act
      const response = await service.post('/', payload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.method).toBe('POST');
      expect(response.data.body).toEqual(payload);
    });
  });

  describe('put', () => {
    it('should round-trip a JSON body on PUT', async () => {
      // Arrange
      const payload = { id: 1, value: 'updated' };

      // Act
      const response = await service.put('/', payload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.method).toBe('PUT');
      expect(response.data.body).toEqual(payload);
    });
  });

  describe('patch', () => {
    it('should round-trip a JSON body on PATCH', async () => {
      // Arrange
      const payload = { value: 'patched' };

      // Act
      const response = await service.patch('/', payload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.method).toBe('PATCH');
      expect(response.data.body).toEqual(payload);
    });
  });

  describe('delete', () => {
    it('should perform a DELETE request and return status 200', async () => {
      // Act
      const response = await service.delete('/');

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.method).toBe('DELETE');
    });
  });

  describe('headers', () => {
    it('should send custom request headers to the server', async () => {
      // Act
      const response = await service.get('/echo-header', {
        headers: { 'x-custom-header': 'custom-value' },
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.received).toBe('custom-value');
    });

    it('should merge default headers configured on the service', async () => {
      // Arrange
      service.configure({
        defaultHeaders: { 'x-custom-header': 'default-value' },
      });

      // Act
      const response = await service.get('/echo-header');

      // Assert
      expect(response.data.received).toBe('default-value');

      // Cleanup: reset default headers so other tests are not affected.
      service.configure({ defaultHeaders: {} });
    });
  });

  describe('status codes', () => {
    it('should expose non-200 status codes', async () => {
      // Act
      const response = await service.get('/not-found');

      // Assert
      expect(response.status).toBe(404);
      expect(response.data.error).toBe('not found');
    });
  });

  /**
   * Additional edge/error branch coverage.
   * Targets previously uncovered lines:
   * 69 (configure timeout), 83 (createClient default case),
   * 92 (buildUrl with an absolute URL).
   */
  describe('edge cases and configuration branches', () => {
    describe('configure - timeout option (line 69)', () => {
      it('should apply a configured timeout and still complete a request', async () => {
        // Setting a timeout exercises the `options.timeout !== undefined` branch.
        service.configure({ timeout: 5000 });

        const response = await service.get('/');
        expect(response.status).toBe(200);
        expect(response.data.method).toBe('GET');

        // Cleanup so the timeout does not affect other suites.
        service.configure({ timeout: undefined as unknown as number });
      });
    });

    describe('createClient - default/unknown client type (line 83)', () => {
      it('should fall back to the default client for an unknown client type', async () => {
        // An unknown clientType hits the switch `default` branch, which falls
        // back to the axios client. The request must still succeed.
        service.configure({
          clientType: 'unknown' as any,
          baseUrl,
        });

        const response = await service.get('/');
        expect(response.status).toBe(200);
        expect(response.data.method).toBe('GET');

        // Restore the native http client for any subsequent tests.
        service.configure({ clientType: 'http', baseUrl });
      });
    });

    describe('buildUrl - absolute URL passthrough (line 92)', () => {
      it('should use an absolute http URL as-is without prepending baseUrl', async () => {
        // Passing a fully-qualified URL exercises the early-return branch.
        const response = await service.get(`${baseUrl}/`);

        expect(response.status).toBe(200);
        expect(response.data.method).toBe('GET');
      });
    });

    describe('post/put/patch - request without a body', () => {
      it('should perform a POST without a body', async () => {
        const response = await service.post('/');
        expect(response.status).toBe(200);
        expect(response.data.method).toBe('POST');
      });

      it('should perform a PUT without a body', async () => {
        const response = await service.put('/');
        expect(response.status).toBe(200);
        expect(response.data.method).toBe('PUT');
      });

      it('should perform a PATCH without a body', async () => {
        const response = await service.patch('/');
        expect(response.status).toBe(200);
        expect(response.data.method).toBe('PATCH');
      });
    });
  });
});
