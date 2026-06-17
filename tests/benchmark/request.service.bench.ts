import { RequestUtils } from '../../src/services/request.service';

/**
 * Benchmark tests for the RequestUtils class.
 * These tests verify the performance of the class in high-frequency operations.
 */
describe('RequestUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  describe('extractRequestData', () => {
    it('should process 10,000 simple requests in a reasonable time', () => {
      const mockRequest = {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36',
          host: 'api.example.com',
        },
        ip: '127.0.0.1',
      };

      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          RequestUtils.extractRequestData({ request: mockRequest });
        }
      });

      console.log(
        `Time to process ${count} simple requests: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per extraction should be less than 0.5ms
      const avgTimePerExtraction = executionTime / count;
      expect(avgTimePerExtraction).toBeLessThan(0.5);
    });

    it('should process 1,000 complex requests in a reasonable time', () => {
      const mockRequest = {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          referer: 'https://example.com/referrer',
          origin: 'https://example.com',
          host: 'api.example.com',
          'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
          'x-real-ip': '192.168.1.1',
          'accept-language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
          'accept-encoding': 'gzip, deflate, br',
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          dnt: '1',
          'upgrade-insecure-requests': '1',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
        },
        ip: '127.0.0.1',
        connection: {
          remoteAddress: '127.0.0.1',
          encrypted: true,
        },
        protocol: 'https',
      };

      const count = 1000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          RequestUtils.extractRequestData({ request: mockRequest });
        }
      });

      console.log(
        `Time to process ${count} complex requests: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per extraction should be less than 1ms
      const avgTimePerExtraction = executionTime / count;
      expect(avgTimePerExtraction).toBeLessThan(1);
    });

    it('should process 10,000 requests with different user-agents in a reasonable time', () => {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59 Safari/537.36',
        'Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18',
      ];

      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          const userAgent = userAgents[i % userAgents.length];
          RequestUtils.extractRequestData({
            request: {
              headers: {
                'user-agent': userAgent,
                host: 'api.example.com',
              },
            },
          });
        }
      });

      console.log(
        `Time to process ${count} requests with different user-agents: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per extraction should be less than 0.5ms
      const avgTimePerExtraction = executionTime / count;
      expect(avgTimePerExtraction).toBeLessThan(0.5);
    });

    it('should process 1,000 requests with different IPs and proxies in a reasonable time', () => {
      const count = 1000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          // Generate different IPs for each iteration
          const ip1 = `192.168.${i % 256}.${i % 100}`;
          const ip2 = `10.0.${i % 256}.${i % 100}`;
          const ip3 = `172.16.${i % 256}.${i % 100}`;

          RequestUtils.extractRequestData({
            request: {
              headers: {
                'user-agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
                host: 'api.example.com',
                'x-forwarded-for': `${ip1}, ${ip2}, ${ip3}`,
                'x-real-ip': ip1,
              },
              ip: '127.0.0.1',
            },
          });
        }
      });

      console.log(
        `Time to process ${count} requests with different IPs and proxies: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per extraction should be less than 1ms
      const avgTimePerExtraction = executionTime / count;
      expect(avgTimePerExtraction).toBeLessThan(1);
    });

    it('should process 10,000 requests without user-agent in a reasonable time', () => {
      const count = 10000;

      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          RequestUtils.extractRequestData({
            request: {
              headers: {
                host: 'api.example.com',
              },
              ip: '127.0.0.1',
            },
          });
        }
      });

      console.log(
        `Time to process ${count} requests without user-agent: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per extraction should be less than 0.1ms
      const avgTimePerExtraction = executionTime / count;
      expect(avgTimePerExtraction).toBeLessThan(0.1);
    });
  });
});
