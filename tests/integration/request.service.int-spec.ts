import { RequestUtils } from '../../src/services/request.service';

/**
 * Integration tests for the RequestUtils class.
 * These tests verify more complex scenarios involving multiple methods.
 */
describe('RequestUtils - Integration Tests', () => {
  describe('Real-world usage scenarios', () => {
    it('should process requests from different types of clients', () => {
      // Scenario: Process requests from different devices
      const requests = [
        // Desktop Windows/Chrome
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            referer: 'https://example.com/page1',
            origin: 'https://example.com',
            host: 'api.example.com',
            'x-forwarded-for': '192.168.1.1',
          },
          ip: '127.0.0.1',
        },
        // Mobile iOS/Safari
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            referer: 'https://m.example.com/page1',
            origin: 'https://m.example.com',
            host: 'api.example.com',
            'x-forwarded-for': '192.168.2.1',
          },
          ip: '127.0.0.2',
        },
        // Tablet Android/Chrome
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Linux; Android 11; SM-T510) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36',
            referer: 'https://example.com/page2',
            origin: 'https://example.com',
            host: 'api.example.com',
            'x-forwarded-for': '192.168.3.1',
          },
          ip: '127.0.0.3',
        },
      ];

      // Process each request
      const results = requests.map(request =>
        RequestUtils.extractRequestData({ request }),
      );

      // Assertions for the Desktop client
      expect(results[0].browser).toBe('Chrome');
      expect(results[0].os).toBe('Windows');
      expect(results[0].device).toBeUndefined();
      expect(results[0].xForwardedFor).toBe('192.168.1.1');

      // Assertions for the Mobile client
      expect(results[1].browser).toBe('Mobile Safari');
      expect(results[1].os).toBe('iOS');
      expect(results[1].device).toBe('mobile');
      expect(results[1].xForwardedFor).toBe('192.168.2.1');

      // Assertions for the Tablet client
      expect(results[2].browser).toBe('Chrome');
      expect(results[2].os).toBe('Android');
      expect(results[2].device).toBe('tablet');
      expect(results[2].xForwardedFor).toBe('192.168.3.1');
    });

    it('should process requests with different proxy configurations', () => {
      // Scenario: Process requests with different proxy configurations
      const requests = [
        // No proxy
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
            host: 'api.example.com',
          },
          ip: '192.168.1.1',
        },
        // With X-Forwarded-For
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
            host: 'api.example.com',
            'x-forwarded-for': '203.0.113.1, 192.168.1.2',
          },
          ip: '192.168.1.2',
        },
        // With X-Real-IP
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
            host: 'api.example.com',
            'x-real-ip': '203.0.113.2',
          },
          ip: '192.168.1.3',
        },
        // With both X-Forwarded-For and X-Real-IP
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
            host: 'api.example.com',
            'x-forwarded-for': '203.0.113.3, 192.168.1.4',
            'x-real-ip': '203.0.113.3',
          },
          ip: '192.168.1.4',
        },
      ];

      // Process each request
      const results = requests.map(request =>
        RequestUtils.extractRequestData({ request }),
      );

      // Assertions for request without proxy
      expect(results[0].ipAddress).toBe('192.168.1.1');
      expect(results[0].xForwardedFor).toBeUndefined();
      expect(results[0].xRealIp).toBeUndefined();

      // Assertions for request with X-Forwarded-For
      expect(results[1].ipAddress).toBe('192.168.1.2');
      expect(results[1].xForwardedFor).toBe('203.0.113.1');
      expect(results[1].xRealIp).toBeUndefined();

      // Assertions for request with X-Real-IP
      expect(results[2].ipAddress).toBe('192.168.1.3');
      expect(results[2].xForwardedFor).toBeUndefined();
      expect(results[2].xRealIp).toBe('203.0.113.2');

      // Assertions for request with both X-Forwarded-For and X-Real-IP
      expect(results[3].ipAddress).toBe('192.168.1.4');
      expect(results[3].xForwardedFor).toBe('203.0.113.3');
      expect(results[3].xRealIp).toBe('203.0.113.3');
    });

    it('should process requests with different origins and referers', () => {
      // Scenario: Process requests with different origins and referers
      const requests = [
        // Direct request
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
            host: 'api.example.com',
          },
        },
        // Request from a website
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
            host: 'api.example.com',
            origin: 'https://example.com',
            referer: 'https://example.com/page1',
          },
        },
        // Request from another website
        {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
            host: 'api.example.com',
            origin: 'https://otherdomain.com',
            referer: 'https://otherdomain.com/page2',
          },
        },
      ];

      // Process each request
      const results = requests.map(request =>
        RequestUtils.extractRequestData({ request }),
      );

      // Assertions for direct request
      expect(results[0].origin).toBeUndefined();
      expect(results[0].referer).toBeUndefined();
      expect(results[0].host).toBe('api.example.com');

      // Assertions for request from a website
      expect(results[1].origin).toBe('https://example.com');
      expect(results[1].referer).toBe('https://example.com/page1');
      expect(results[1].host).toBe('api.example.com');

      // Assertions for request from another website
      expect(results[2].origin).toBe('https://otherdomain.com');
      expect(results[2].referer).toBe('https://otherdomain.com/page2');
      expect(results[2].host).toBe('api.example.com');
    });
  });
});
