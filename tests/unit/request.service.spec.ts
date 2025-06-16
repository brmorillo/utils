import { RequestUtils } from '../../src/services/request.service';

/**
 * Testes unitários para a classe RequestUtils.
 * Estes testes verificam o comportamento de cada método individualmente.
 */
describe('RequestUtils - Testes Unitários', () => {
  describe('extractRequestData', () => {
    it('deve extrair dados de um objeto de requisição completo', () => {
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
      expect(result.device).toBeUndefined(); // Desktop não é identificado como device específico
    });

    it('deve lidar com objeto de requisição sem headers', () => {
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

    it('deve lidar com headers vazios', () => {
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

    it('deve extrair corretamente o primeiro IP de x-forwarded-for com múltiplos IPs', () => {
      const mockRequest = {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
        },
      };

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result.xForwardedFor).toBe('192.168.1.1');
    });

    it('deve identificar corretamente o navegador e sistema operacional de um dispositivo móvel', () => {
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

    it('deve identificar corretamente o navegador e sistema operacional de um tablet', () => {
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

    it('deve lidar com user-agent desconhecido', () => {
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
