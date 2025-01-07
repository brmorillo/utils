import { RequestUtils } from './request.service';

// Mock UAParser como um módulo
jest.mock('ua-parser-js', () => {
  const mockUAParser = jest.fn().mockImplementation((userAgent) => ({
    getUA: jest.fn(() => userAgent),
    getResult: jest.fn(() => {
      if (!userAgent) {
        return {
          browser: { name: undefined, version: undefined },
          os: { name: undefined, version: undefined },
          device: { type: undefined, vendor: undefined, model: undefined },
          cpu: { architecture: undefined },
        };
      }
      return mockUAParserResult;
    }),
    getBrowser: jest.fn(() =>
      userAgent
        ? mockUAParserResult.browser
        : { name: undefined, version: undefined },
    ),
    getOS: jest.fn(() =>
      userAgent
        ? mockUAParserResult.os
        : { name: undefined, version: undefined },
    ),
    getDevice: jest.fn(() =>
      userAgent
        ? mockUAParserResult.device
        : { type: undefined, vendor: undefined, model: undefined },
    ),
    getCPU: jest.fn(() =>
      userAgent ? mockUAParserResult.cpu : { architecture: undefined },
    ),
  }));
  return { UAParser: mockUAParser };
});

const mockUAParserResult = {
  ua: 'Mocked UA',
  browser: { name: 'Chrome', version: '91.0.4472.124' },
  os: { name: 'Windows', version: '10' },
  device: { type: 'desktop', vendor: undefined, model: undefined },
  cpu: { architecture: undefined },
};

describe('RequestUtils', () => {
  describe('extractRequestData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should extract request data correctly', () => {
      const mockRequest = {
        headers: {
          'user-agent': 'Mocked UA',
          referer: 'https://example.com',
          origin: 'https://origin-example.com',
          host: 'example.com',
          'x-forwarded-for': '192.168.1.1, 192.168.1.2',
          'x-real-ip': '192.168.1.3',
        },
        ip: '192.168.1.4',
      };

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result).toEqual({
        userAgent: 'Mocked UA',
        ipAddress: '192.168.1.4',
        xForwardedFor: '192.168.1.1',
        xRealIp: '192.168.1.3',
        referer: 'https://example.com',
        origin: 'https://origin-example.com',
        host: 'example.com',
        browser: 'Chrome',
        os: 'Windows',
        device: 'desktop',
      });
    });

    it('should handle missing headers gracefully', () => {
      const mockRequest = {
        headers: {},
        ip: '192.168.1.4',
      };

      const result = RequestUtils.extractRequestData({ request: mockRequest });

      expect(result).toEqual({
        userAgent: undefined,
        ipAddress: '192.168.1.4',
        xForwardedFor: undefined,
        xRealIp: undefined,
        referer: undefined,
        origin: undefined,
        host: undefined,
        browser: undefined,
        os: undefined,
        device: undefined,
      });
    });
  });
});
