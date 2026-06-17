import { JWTUtils } from '../../src/services/jwt.service';

/**
 * Benchmark tests for the JWTUtils class.
 * These tests verify the class's performance in high-frequency operations.
 */
describe('JWTUtils - Benchmark Tests', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (fn: () => void): number => {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };

  const secretKey = 'benchmark-test-secret-key';
  const payload = { userId: '123', role: 'user', data: 'benchmark test payload' };

  describe('Generating tokens in bulk', () => {
    it('should generate 1,000 JWT tokens in a reasonable time', () => {
      const count = 1000;
      const tokens: string[] = [];
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          tokens.push(JWTUtils.generate({
            payload: { ...payload, unique: i },
            secretKey,
            options: { expiresIn: '1h' }
          }));
        }
      });
      
      console.log(
        `Time to generate ${count} JWT tokens: ${executionTime.toFixed(2)}ms`,
      );

      // Check whether all tokens are different
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(count);

      // The average time per token should be less than 1ms
      const avgTimePerToken = executionTime / count;
      console.log(
        `Average time per JWT token: ${avgTimePerToken.toFixed(2)}ms`,
      );
      expect(avgTimePerToken).toBeLessThan(1);
    });
  });

  describe('Verifying tokens in bulk', () => {
    it('should verify 1,000 JWT tokens in a reasonable time', () => {
      const count = 1000;

      // Generate a token to verify repeatedly
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          JWTUtils.verify({
            token,
            secretKey
          });
        }
      });
      
      console.log(
        `Time to verify ${count} JWT tokens: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per verification should be less than 1ms
      const avgTimePerVerification = executionTime / count;
      console.log(
        `Average time per JWT token verification: ${avgTimePerVerification.toFixed(2)}ms`,
      );
      expect(avgTimePerVerification).toBeLessThan(1);
    });
  });

  describe('Decoding tokens in bulk', () => {
    it('should decode 10,000 JWT tokens in a reasonable time', () => {
      const count = 10000;

      // Generate a token to decode repeatedly
      const token = JWTUtils.generate({
        payload,
        secretKey
      });
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          JWTUtils.decode({
            token
          });
        }
      });
      
      console.log(
        `Time to decode ${count} JWT tokens: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per decoding should be less than 0.1ms
      const avgTimePerDecode = executionTime / count;
      console.log(
        `Average time per JWT token decoding: ${avgTimePerDecode.toFixed(2)}ms`,
      );
      expect(avgTimePerDecode).toBeLessThan(0.1);
    });
  });

  describe('Verifying expiration in bulk', () => {
    it('should check the expiration of 10,000 JWT tokens in a reasonable time', () => {
      const count = 10000;

      // Generate a token with expiration to check repeatedly
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      const executionTime = measureExecutionTime(() => {
        for (let i = 0; i < count; i++) {
          JWTUtils.isExpired({
            token
          });
        }
      });
      
      console.log(
        `Time to check expiration of ${count} JWT tokens: ${executionTime.toFixed(2)}ms`,
      );

      // The average time per expiration check should be less than 0.1ms
      const avgTimePerCheck = executionTime / count;
      console.log(
        `Average time per expiration check: ${avgTimePerCheck.toFixed(2)}ms`,
      );
      expect(avgTimePerCheck).toBeLessThan(0.1);
    });
  });

  describe('Refreshing tokens in bulk', () => {
    it('should refresh 1,000 JWT tokens in a reasonable time', () => {
      const count = 1000;

      // Generate a token to refresh repeatedly
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1s' }
      });
      
      // Wait for the token to expire
      return new Promise<void>(resolve => {
        setTimeout(() => {
          const executionTime = measureExecutionTime(() => {
            for (let i = 0; i < count; i++) {
              JWTUtils.refresh({
                token,
                secretKey,
                options: { expiresIn: '1h' }
              });
            }
          });
          
          console.log(
            `Time to refresh ${count} JWT tokens: ${executionTime.toFixed(2)}ms`,
          );

          // The average time per refresh should be less than 1ms
          const avgTimePerRefresh = executionTime / count;
          console.log(
            `Average time per JWT token refresh: ${avgTimePerRefresh.toFixed(2)}ms`,
          );
          expect(avgTimePerRefresh).toBeLessThan(1);

          resolve();
        }, 1100); // Wait 1.1 seconds to ensure the token has expired
      });
    });
  });

  describe('Algorithm comparison', () => {
    it('should compare the performance of different signing algorithms', () => {
      const count = 100;
      const algorithms = ['HS256', 'HS384', 'HS512'];
      const results: Record<string, number> = {};
      
      for (const algorithm of algorithms) {
        const executionTime = measureExecutionTime(() => {
          for (let i = 0; i < count; i++) {
            JWTUtils.generate({
              payload,
              secretKey,
              options: { 
                algorithm: algorithm as any,
                expiresIn: '1h'
              }
            });
          }
        });
        
        results[algorithm] = executionTime / count;
        console.log(
          `Average time per token with ${algorithm}: ${results[algorithm].toFixed(2)}ms`,
        );
      }

      // Check whether the results were recorded
      expect(Object.keys(results).length).toBe(algorithms.length);

      // All algorithms should have reasonable performance
      for (const algorithm of algorithms) {
        expect(results[algorithm]).toBeLessThan(1);
      }
    });
  });
});