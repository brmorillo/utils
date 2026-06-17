/**
 * Mock axios as a callable function. The AxiosClient does `require('axios')`
 * in its constructor and then calls the imported value as a function, so the
 * mock factory returns the jest.fn directly.
 */
const mockAxios = jest.fn();

jest.mock('axios', () => mockAxios, { virtual: true });

import { AxiosClient } from '../../src/clients/axios-client';

/**
 * Unit tests for the AxiosClient.
 * axios is fully mocked so no real HTTP requests are made.
 */
describe('AxiosClient - Unit Tests', () => {
  let client: AxiosClient;

  const fakeResponse = {
    data: { ok: true },
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.mockResolvedValue(fakeResponse);
    client = new AxiosClient();
  });

  describe('request', () => {
    it('should forward all options to axios and shape the response', async () => {
      const result = await client.request({
        url: 'https://api.test/resource',
        method: 'GET',
        headers: { 'x-test': '1' },
        params: { q: 'a' },
        data: { foo: 'bar' },
        timeout: 1000,
        responseType: 'json',
      });

      expect(mockAxios).toHaveBeenCalledWith({
        url: 'https://api.test/resource',
        method: 'GET',
        headers: { 'x-test': '1' },
        params: { q: 'a' },
        data: { foo: 'bar' },
        timeout: 1000,
        responseType: 'json',
      });
      expect(result).toEqual({
        data: { ok: true },
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });

    it('should default responseType to json when omitted', async () => {
      await client.request({ url: 'https://api.test', method: 'GET' });
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({ responseType: 'json' }),
      );
    });

    it('should return the error response when the server responds with an error status', async () => {
      mockAxios.mockRejectedValueOnce({
        response: {
          data: { error: 'bad request' },
          status: 400,
          headers: { 'content-type': 'application/json' },
        },
      });

      const result = await client.request({
        url: 'https://api.test',
        method: 'GET',
      });

      expect(result).toEqual({
        data: { error: 'bad request' },
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    });

    it('should rethrow errors without a response (e.g. network errors)', async () => {
      const networkError = new Error('Network Error');
      mockAxios.mockRejectedValueOnce(networkError);

      await expect(
        client.request({ url: 'https://api.test', method: 'GET' }),
      ).rejects.toThrow('Network Error');
    });
  });

  describe('get', () => {
    it('should issue a GET request', async () => {
      await client.get('https://api.test', { headers: { a: 'b' } });
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test',
          method: 'GET',
          headers: { a: 'b' },
        }),
      );
    });
  });

  describe('post', () => {
    it('should issue a POST request with a body', async () => {
      await client.post('https://api.test', { name: 'bruno' });
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test',
          method: 'POST',
          data: { name: 'bruno' },
        }),
      );
    });
  });

  describe('put', () => {
    it('should issue a PUT request with a body', async () => {
      await client.put('https://api.test', { name: 'bruno' });
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test',
          method: 'PUT',
          data: { name: 'bruno' },
        }),
      );
    });
  });

  describe('delete', () => {
    it('should issue a DELETE request', async () => {
      await client.delete('https://api.test');
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test',
          method: 'DELETE',
        }),
      );
    });
  });

  describe('patch', () => {
    it('should issue a PATCH request with a body', async () => {
      await client.patch('https://api.test', { name: 'bruno' });
      expect(mockAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.test',
          method: 'PATCH',
          data: { name: 'bruno' },
        }),
      );
    });
  });
});
