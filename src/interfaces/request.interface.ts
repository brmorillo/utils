/**
 * HTTP request method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * HTTP request options
 */
export interface RequestOptions {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

/**
 * HTTP response interface
 */
export interface RequestResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/**
 * HTTP client interface
 */
export interface IHttpClient {
  request<T = any>(options: RequestOptions): Promise<RequestResponse<T>>;
  get<T = any>(url: string, options?: Omit<RequestOptions, 'url' | 'method'>): Promise<RequestResponse<T>>;
  post<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse<T>>;
  put<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse<T>>;
  delete<T = any>(url: string, options?: Omit<RequestOptions, 'url' | 'method'>): Promise<RequestResponse<T>>;
  patch<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'url' | 'method' | 'data'>): Promise<RequestResponse<T>>;
}