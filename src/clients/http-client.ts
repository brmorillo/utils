import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import {
  IHttpClient,
  RequestOptions,
  RequestResponse,
} from '../interfaces/request.interface';
import { HttpError } from '../errors';

/**
 * Native HTTP/HTTPS client implementation.
 *
 * @remarks
 * This client does NOT follow HTTP redirects. A 3xx response is resolved
 * verbatim (status + `location` header) just like any other status code; the
 * caller is responsible for inspecting `response.status` and re-issuing the
 * request if a redirect should be followed.
 *
 * Like the rest of the HTTP layer, this client RESOLVES with the response for
 * every completed request, including non-2xx status codes. It only REJECTS on
 * transport-level failures (connection errors, timeouts). Callers must check
 * `response.status` to detect HTTP errors.
 */
export class HttpClient implements IHttpClient {
  /**
   * Makes a generic HTTP request
   */
  async request<T = any>(options: RequestOptions): Promise<RequestResponse<T>> {
    return new Promise((resolve, reject) => {
      const url = new URL(options.url);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      // Prepare the request body. Use `!== undefined` so falsy-but-valid bodies
      // (0, '', false) are still sent. Objects are JSON-serialized.
      const hasBody = options.data !== undefined;
      let body: string | Buffer | undefined;
      if (hasBody) {
        if (Buffer.isBuffer(options.data) || typeof options.data === 'string') {
          body = options.data;
        } else if (typeof options.data === 'object') {
          body = JSON.stringify(options.data);
        } else {
          // number / boolean primitives
          body = String(options.data);
        }
      }

      const headers: Record<string, string | number> = {
        ...(options.headers || {}),
      };

      // When sending a JSON/object body, set Content-Type and Content-Length
      // unless the caller already provided them.
      if (hasBody && body !== undefined) {
        const hasContentType = Object.keys(headers).some(
          h => h.toLowerCase() === 'content-type',
        );
        if (
          !hasContentType &&
          typeof options.data === 'object' &&
          !Buffer.isBuffer(options.data)
        ) {
          headers['Content-Type'] = 'application/json';
        }
        const hasContentLength = Object.keys(headers).some(
          h => h.toLowerCase() === 'content-length',
        );
        if (!hasContentLength) {
          headers['Content-Length'] = Buffer.byteLength(body);
        }
      }

      const requestOptions: http.RequestOptions = {
        method: options.method,
        headers,
        timeout: options.timeout,
      };

      // Add query parameters to URL
      if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }

      const req = client.request(url, requestOptions, res => {
        let data = '';

        // Handle different response types
        if (
          options.responseType === 'arraybuffer' ||
          options.responseType === 'blob'
        ) {
          const chunks: Buffer[] = [];
          res.on('data', chunk => chunks.push(Buffer.from(chunk)));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve({
              data: buffer as unknown as T,
              status: res.statusCode || 0,
              headers: res.headers as Record<string, string>,
            });
          });
        } else {
          res.on('data', chunk => {
            data += chunk;
          });

          res.on('end', () => {
            let parsedData: any;

            try {
              // Try to parse as JSON if responseType is json or not specified
              if (options.responseType !== 'text') {
                parsedData = JSON.parse(data);
              } else {
                parsedData = data;
              }
            } catch {
              // If parsing fails, return the raw data
              parsedData = data;
            }

            resolve({
              data: parsedData,
              status: res.statusCode || 0,
              headers: res.headers as Record<string, string>,
            });
          });
        }
      });

      req.on('error', error => {
        reject(error);
      });

      // Enforce the timeout: when the socket times out, abort the request and
      // reject with a typed HttpError rather than hanging.
      if (options.timeout !== undefined) {
        req.on('timeout', () => {
          req.destroy();
          reject(
            new HttpError(
              `Request to ${options.url} timed out after ${options.timeout}ms`,
              408,
              'REQUEST_TIMEOUT',
              { url: options.url, timeout: options.timeout },
            ),
          );
        });
      }

      // Write data to request body. `!== undefined` so 0/''/false are sent.
      if (body !== undefined) {
        req.write(body);
      }

      req.end();
    });
  }

  /**
   * Makes a GET request
   */
  async get<T = any>(
    url: string,
    options?: Omit<RequestOptions, 'url' | 'method'>,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      ...options,
    });
  }

  /**
   * Makes a POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'url' | 'method' | 'data'>,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...options,
    });
  }

  /**
   * Makes a PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'url' | 'method' | 'data'>,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...options,
    });
  }

  /**
   * Makes a DELETE request
   */
  async delete<T = any>(
    url: string,
    options?: Omit<RequestOptions, 'url' | 'method'>,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Makes a PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'url' | 'method' | 'data'>,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...options,
    });
  }
}
