import { AxiosClient } from '../clients/axios-client';
import { HttpClient } from '../clients/http-client';
import { IHttpClient, RequestOptions, RequestResponse } from '../interfaces/request.interface';

/**
 * HTTP client type
 */
export type HttpClientType = 'axios' | 'http';

/**
 * HTTP service configuration options
 */
export interface HttpServiceOptions {
  clientType?: HttpClientType;
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

/**
 * HTTP service for making HTTP requests
 */
export class HttpService {
  private static instance: HttpService;
  private client: IHttpClient;
  private baseUrl: string = '';
  private defaultHeaders: Record<string, string> = {};
  private timeout?: number;

  /**
   * Creates a new HttpService instance
   */
  private constructor(options: HttpServiceOptions = {}) {
    const clientType = options.clientType || 'axios';
    this.client = this.createClient(clientType);
    this.baseUrl = options.baseUrl || '';
    this.defaultHeaders = options.defaultHeaders || {};
    this.timeout = options.timeout;
  }

  /**
   * Gets the singleton instance of HttpService
   */
  public static getInstance(options?: HttpServiceOptions): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService(options);
    }
    return HttpService.instance;
  }

  /**
   * Reconfigures the HTTP service
   */
  public configure(options: HttpServiceOptions): void {
    if (options.clientType) {
      this.client = this.createClient(options.clientType);
    }
    if (options.baseUrl !== undefined) {
      this.baseUrl = options.baseUrl;
    }
    if (options.defaultHeaders !== undefined) {
      this.defaultHeaders = options.defaultHeaders;
    }
    if (options.timeout !== undefined) {
      this.timeout = options.timeout;
    }
  }

  /**
   * Creates an HTTP client based on the specified type
   */
  private createClient(clientType: HttpClientType): IHttpClient {
    switch (clientType) {
      case 'axios':
        return new AxiosClient();
      case 'http':
        return new HttpClient();
      default:
        return new AxiosClient();
    }
  }

  /**
   * Builds the full URL by combining baseUrl and the provided path
   */
  private buildUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  }

  /**
   * Merges default headers with request-specific headers
   */
  private mergeHeaders(headers?: Record<string, string>): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  /**
   * Makes a generic HTTP request
   */
  public async request<T = any>(options: RequestOptions): Promise<RequestResponse<T>> {
    const fullOptions: RequestOptions = {
      ...options,
      url: this.buildUrl(options.url),
      headers: this.mergeHeaders(options.headers),
      timeout: options.timeout || this.timeout,
    };

    return this.client.request<T>(fullOptions);
  }

  /**
   * Makes a GET request
   */
  public async get<T = any>(url: string, options?: Omit<RequestOptions, 'url' | 'method'>): Promise<RequestResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      ...options,
    });
  }

  /**
   * Makes a POST request
   */
  public async post<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse<T>> {
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
  public async put<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse<T>> {
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
  public async delete<T = any>(url: string, options?: Omit<RequestOptions, 'url' | 'method'>): Promise<RequestResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Makes a PATCH request
   */
  public async patch<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse<T>> {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...options,
    });
  }
}