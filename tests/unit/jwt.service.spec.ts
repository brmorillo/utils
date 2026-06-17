import { JWTUtils } from '../../src/services/jwt.service';

/**
 * Unit tests for the JWTUtils class.
 * These tests verify the behavior of each method individually.
 */
describe('JWTUtils - Unit Tests', () => {
  const secretKey = 'test-secret-key-for-jwt-utils';
  const payload = { userId: '123', role: 'admin' };

  describe('generate', () => {
    it('should generate a valid JWT token', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      // Verifies that it is a string
      expect(typeof token).toBe('string');

      // Verifies that it has the correct JWT format (three parts separated by a dot)
      expect(token.split('.')).toHaveLength(3);

      // Verifies that it can be decoded
      const decoded = JWTUtils.decode({ token });
      expect(decoded).toHaveProperty('userId', '123');
      expect(decoded).toHaveProperty('role', 'admin');
    });

    it('should generate a token with expiration when specified', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' },
      });

      const decoded = JWTUtils.decode({ token }) as any;
      expect(decoded).toHaveProperty('exp');
      expect(typeof decoded.exp).toBe('number');
    });

    it('should throw an error for an invalid payload', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        JWTUtils.generate({ payload: null, secretKey });
      }).toThrow('Invalid payload');
    });

    it('should throw an error for an invalid secretKey', () => {
      expect(() => {
        // @ts-ignore - Intentionally testing with invalid value
        JWTUtils.generate({ payload, secretKey: '' });
      }).toThrow('Invalid secretKey');
    });
  });

  describe('verify', () => {
    it('should verify a valid JWT token', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      const decoded = JWTUtils.verify({
        token,
        secretKey,
      });

      expect(decoded).toHaveProperty('userId', '123');
      expect(decoded).toHaveProperty('role', 'admin');
    });

    it('should throw an error for an invalid token', () => {
      expect(() => {
        JWTUtils.verify({
          token: 'invalid-token',
          secretKey,
        });
      }).toThrow();
    });

    it('should throw an error for an incorrect secretKey', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      expect(() => {
        JWTUtils.verify({
          token,
          secretKey: 'wrong-secret-key',
        });
      }).toThrow();
    });
  });

  describe('decode', () => {
    it('should decode a JWT token without verifying the signature', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      const decoded = JWTUtils.decode({ token });
      expect(decoded).toHaveProperty('userId', '123');
      expect(decoded).toHaveProperty('role', 'admin');
    });

    it('should return the header and payload when complete=true', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      const decoded = JWTUtils.decode({ token, complete: true }) as any;
      expect(decoded).toHaveProperty('header');
      expect(decoded).toHaveProperty('payload');
      expect(decoded.payload).toHaveProperty('userId', '123');
      expect(decoded.header).toHaveProperty('alg');
    });

    it('should throw an error for an invalid token', () => {
      expect(() => {
        JWTUtils.decode({ token: 'not-a-jwt-token' });
      }).toThrow();
    });
  });

  describe('refresh', () => {
    it('should refresh an expired token', () => {
      // Creates a token that expires in 1 second
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1s' },
      });

      // Waits for the token to expire
      return new Promise<void>(resolve => {
        setTimeout(() => {
          // Refreshes the token
          const newToken = JWTUtils.refresh({
            token,
            secretKey,
            options: { expiresIn: '1h' },
          });

          // Verifies that the new token is different from the old one
          expect(newToken).not.toBe(token);

          // Verifies that the new token can be verified
          const decoded = JWTUtils.verify({
            token: newToken,
            secretKey,
          }) as any;

          // Verifies that the payload was preserved
          expect(decoded).toHaveProperty('userId', '123');
          expect(decoded).toHaveProperty('role', 'admin');

          resolve();
        }, 1100);
      });
    });

    it('should throw an error for an invalid token', () => {
      expect(() => {
        JWTUtils.refresh({
          token: 'invalid-token',
          secretKey,
        });
      }).toThrow();
    });
  });

  describe('isExpired', () => {
    it('should return false for a non-expired token', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' },
      });

      const isExpired = JWTUtils.isExpired({ token });
      expect(isExpired).toBe(false);
    });

    it('should return true for an expired token', () => {
      // Creates a token that expires immediately (in the past)
      const pastTime = Math.floor(Date.now() / 1000) - 10; // 10 seconds in the past
      const expiredToken = JWTUtils.generate({
        payload: { ...payload, exp: pastTime },
        secretKey,
      });

      // Verifies that the token is already expired
      const isExpired = JWTUtils.isExpired({ token: expiredToken });
      expect(isExpired).toBe(true);
    });

    it('should throw an error for a token without expiration', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      expect(() => {
        JWTUtils.isExpired({ token });
      }).toThrow('missing expiration claim');
    });
  });

  describe('getExpirationTime', () => {
    it('should return the remaining time in seconds', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1h' },
      });

      const remainingTime = JWTUtils.getExpirationTime({ token });
      
      // The remaining time should be close to 3600 seconds (1 hour)
      // We use a margin of error of 10 seconds for the test
      expect(remainingTime).toBeGreaterThan(3590);
      expect(remainingTime).toBeLessThanOrEqual(3600);
    });

    it('should return 0 for an expired token', () => {
      // Creates a token that expires in 1 second
      const token = JWTUtils.generate({
        payload,
        secretKey,
        options: { expiresIn: '1s' },
      });

      // Waits for the token to expire
      return new Promise<void>(resolve => {
        setTimeout(() => {
          const remainingTime = JWTUtils.getExpirationTime({ token });
          expect(remainingTime).toBe(0);
          resolve();
        }, 1100);
      });
    });

    it('should throw an error for a token without expiration', () => {
      const token = JWTUtils.generate({
        payload,
        secretKey,
      });

      expect(() => {
        JWTUtils.getExpirationTime({ token });
      }).toThrow('missing expiration claim');
    });
  });

  /**
   * Additional edge/error branch coverage.
   * Targets previously uncovered lines:
   * 44-45 (generate catch), 79 (verify empty token),
   * 83 (verify empty secretKey), 125 (decode empty token),
   * 212 (isExpired empty token), 247 (getExpirationTime empty token).
   */
  describe('edge cases and error branches', () => {
    describe('generate - underlying sign failure (lines 44-45)', () => {
      it('should wrap an error thrown by jwt.sign into a descriptive Error', () => {
        // An invalid expiresIn string causes jsonwebtoken to throw inside the
        // try/catch, exercising the error-message extraction and re-throw.
        expect(() => {
          JWTUtils.generate({
            payload,
            secretKey,
            options: { expiresIn: 'not-a-valid-duration' as any },
          });
        }).toThrow('Failed to generate JWT token');
      });
    });

    describe('verify - input validation (lines 79, 83)', () => {
      it('should throw for an empty token (line 79)', () => {
        expect(() => {
          JWTUtils.verify({ token: '', secretKey });
        }).toThrow('Invalid token: must be a non-empty string.');
      });

      it('should throw for a non-string token (line 79)', () => {
        expect(() => {
          // @ts-ignore - Intentionally testing with invalid value
          JWTUtils.verify({ token: 12345, secretKey });
        }).toThrow('Invalid token: must be a non-empty string.');
      });

      it('should throw for an empty secretKey (line 83)', () => {
        const token = JWTUtils.generate({ payload, secretKey });
        expect(() => {
          JWTUtils.verify({ token, secretKey: '' });
        }).toThrow('Invalid secretKey: must be a non-empty string.');
      });

      it('should throw for an expired token', () => {
        const pastTime = Math.floor(Date.now() / 1000) - 10;
        const expiredToken = JWTUtils.generate({
          payload: { ...payload, exp: pastTime },
          secretKey,
        });
        expect(() => {
          JWTUtils.verify({ token: expiredToken, secretKey });
        }).toThrow('Failed to verify JWT token');
      });

      it('should throw for a malformed token', () => {
        expect(() => {
          JWTUtils.verify({ token: 'a.b.c', secretKey });
        }).toThrow('Failed to verify JWT token');
      });
    });

    describe('decode - input validation and complete option (line 125)', () => {
      it('should throw for an empty token (line 125)', () => {
        expect(() => {
          JWTUtils.decode({ token: '' });
        }).toThrow('Invalid token: must be a non-empty string.');
      });

      it('should throw for a non-string token (line 125)', () => {
        expect(() => {
          // @ts-ignore - Intentionally testing with invalid value
          JWTUtils.decode({ token: null });
        }).toThrow('Invalid token: must be a non-empty string.');
      });

      it('should throw for a malformed token that cannot be decoded', () => {
        expect(() => {
          JWTUtils.decode({ token: 'malformed', complete: true });
        }).toThrow('Failed to decode JWT token');
      });

      it('should decode header and payload with complete=true', () => {
        const token = JWTUtils.generate({ payload, secretKey });
        const decoded = JWTUtils.decode({ token, complete: true }) as any;
        expect(decoded).toHaveProperty('header');
        expect(decoded).toHaveProperty('signature');
        expect(decoded.payload).toHaveProperty('userId', '123');
      });
    });

    describe('refresh - valid round-trip and error path', () => {
      it('should refresh a valid (non-expired) token preserving the payload', () => {
        const token = JWTUtils.generate({
          payload,
          secretKey,
          options: { expiresIn: '1h' },
        });

        const newToken = JWTUtils.refresh({
          token,
          secretKey,
          options: { expiresIn: '2h' },
        });

        const decoded = JWTUtils.verify({ token: newToken, secretKey }) as any;
        expect(decoded).toHaveProperty('userId', '123');
        expect(decoded).toHaveProperty('role', 'admin');
        // Standard claims should be regenerated, not carried over verbatim.
        expect(decoded).toHaveProperty('iat');
        expect(decoded).toHaveProperty('exp');
      });

      it('should throw when refreshing with the wrong secret', () => {
        const token = JWTUtils.generate({ payload, secretKey });
        expect(() => {
          JWTUtils.refresh({ token, secretKey: 'wrong-secret' });
        }).toThrow('Failed to refresh JWT token');
      });
    });

    describe('isExpired - input validation (line 212)', () => {
      it('should throw for an empty token (line 212)', () => {
        expect(() => {
          JWTUtils.isExpired({ token: '' });
        }).toThrow('Invalid token: must be a non-empty string.');
      });

      it('should throw for a non-string token (line 212)', () => {
        expect(() => {
          // @ts-ignore - Intentionally testing with invalid value
          JWTUtils.isExpired({ token: undefined });
        }).toThrow('Invalid token: must be a non-empty string.');
      });

      it('should return true for a token with a past exp claim', () => {
        const expiredToken = JWTUtils.generate({
          payload: { ...payload, exp: Math.floor(Date.now() / 1000) - 5 },
          secretKey,
        });
        expect(JWTUtils.isExpired({ token: expiredToken })).toBe(true);
      });

      it('should throw for a malformed token', () => {
        expect(() => {
          JWTUtils.isExpired({ token: 'not-a-jwt' });
        }).toThrow('Failed to check JWT token expiration');
      });
    });

    describe('getExpirationTime - input validation (line 247)', () => {
      it('should throw for an empty token (line 247)', () => {
        expect(() => {
          JWTUtils.getExpirationTime({ token: '' });
        }).toThrow('Invalid token: must be a non-empty string.');
      });

      it('should throw for a non-string token (line 247)', () => {
        expect(() => {
          // @ts-ignore - Intentionally testing with invalid value
          JWTUtils.getExpirationTime({ token: 0 });
        }).toThrow('Invalid token: must be a non-empty string.');
      });

      it('should return 0 for a token whose exp is already in the past', () => {
        const expiredToken = JWTUtils.generate({
          payload: { ...payload, exp: Math.floor(Date.now() / 1000) - 5 },
          secretKey,
        });
        expect(JWTUtils.getExpirationTime({ token: expiredToken })).toBe(0);
      });

      it('should throw for a malformed token', () => {
        expect(() => {
          JWTUtils.getExpirationTime({ token: 'not-a-jwt' });
        }).toThrow('Failed to get JWT token expiration time');
      });
    });
  });
});