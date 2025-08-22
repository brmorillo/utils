import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import {
  IHttpClient,
  RequestOptions,
  RequestResponse,
} from '../interfaces/request.interface';

/**
 * Native HTTP/HTTPS client implementation
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

      const requestOptions: http.RequestOptions = {
        method: options.method,
        headers: options.headers || {},
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
            } catch (e) {
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

      // Write data to request body
      if (options.data) {
        const data =
          typeof options.data === 'object'
            ? JSON.stringify(options.data)
            : options.data;
        req.write(data);
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
