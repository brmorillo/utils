import { RequestUtils } from '../../src/services/request.service';

/**
 * Unit tests for the RequestUtils class.
 * These tests verify the behavior of each method individually.
 */
describe('RequestUtils - Unit Tests', () => {
  describe('extractRequestData', () => {
    it('should extract data from a complete request object', () => {
      const mockRequest = {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          referer: 'https://example.com/referrer',
          origin: 'https://example.com',
          host: 'api.example.com',
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
          'x-real-ip': '192.168.1.1',
        },
        ip: '127.0.0.1',
      };

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result.userAgent).toBe(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );
      expect(result.ipAddress).toBe('127.0.0.1');
      expect(result.xForwardedFor).toBe('192.168.1.1');
      expect(result.xRealIp).toBe('192.168.1.1');
      expect(result.referer).toBe('https://example.com/referrer');
      expect(result.origin).toBe('https://example.com');
      expect(result.host).toBe('api.example.com');
      expect(result.browser).toBe('Chrome');
      expect(result.os).toBe('Windows');
      expect(result.device).toBeUndefined(); // Desktop is not identified as a specific device
    });

    it('should handle a request object without headers', () => {
      const mockRequest = {};

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result.userAgent).toBeUndefined();
      expect(result.ipAddress).toBeUndefined();
      expect(result.xForwardedFor).toBeUndefined();
      expect(result.xRealIp).toBeUndefined();
      expect(result.referer).toBeUndefined();
      expect(result.origin).toBeUndefined();
      expect(result.host).toBeUndefined();
      expect(result.browser).toBeUndefined();
      expect(result.os).toBeUndefined();
      expect(result.device).toBeUndefined();
    });

    it('should handle empty headers', () => {
      const mockRequest = {
        headers: {},
      };

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result.userAgent).toBeUndefined();
      expect(result.ipAddress).toBeUndefined();
      expect(result.xForwardedFor).toBeUndefined();
      expect(result.xRealIp).toBeUndefined();
      expect(result.referer).toBeUndefined();
      expect(result.origin).toBeUndefined();
      expect(result.host).toBeUndefined();
      expect(result.browser).toBeUndefined();
      expect(result.os).toBeUndefined();
      expect(result.device).toBeUndefined();
    });

    it('should correctly extract the first IP from x-forwarded-for with multiple IPs', () => {
      const mockRequest = {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
        },
      };

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result.xForwardedFor).toBe('192.168.1.1');
    });

    it('should correctly identify the browser and operating system of a mobile device', () => {
      const mockRequest = {
        headers: {
          'user-agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        },
      };

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result.browser).toBe('Mobile Safari');
      expect(result.os).toBe('iOS');
      expect(result.device).toBe('mobile');
    });

    it('should correctly identify the browser and operating system of a tablet', () => {
      const mockRequest = {
        headers: {
          'user-agent':
            'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        },
      };

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result.browser).toBe('Mobile Safari');
      expect(result.os).toBe('iOS');
      expect(result.device).toBe('tablet');
    });

    it('should handle an unknown user-agent', () => {
      const mockRequest = {
        headers: {
          'user-agent': 'Unknown/1.0',
        },
      };

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result.userAgent).toBe('Unknown/1.0');
      expect(result.browser).toBeUndefined();
      expect(result.os).toBeUndefined();
      expect(result.device).toBeUndefined();
    });
  });
});
