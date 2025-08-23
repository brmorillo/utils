import {
  IHttpClient,
  RequestOptions,
  RequestResponse,
} from '../interfaces/request.interface';

/**
 * Axios HTTP client implementation
 */
export class AxiosClient implements IHttpClient {
  private axios: any;

  constructor() {
    try {
      // Dynamic import to avoid requiring axios as a direct dependency
      this.axios = require('axios');
    } catch (error) {
      throw new Error(
        'Axios is not installed. Please install axios to use AxiosClient.',
      );
    }
  }

  /**
   * Makes a generic HTTP request
   */
  async request<T = any>(options: RequestOptions): Promise<RequestResponse<T>> {
    try {
      const response = await this.axios({
        url: options.url,
        method: options.method,
        headers: options.headers,
        params: options.params,
        data: options.data,
        timeout: options.timeout,
        responseType: options.responseType || 'json',
      });

      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        };
      }

      throw error;
    }
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
