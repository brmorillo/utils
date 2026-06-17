import { JWTUtils } from '../../src/services/jwt.service';

/**
 * Integration tests for the JWTUtils class.
 * These tests verify more complex scenarios involving multiple methods.
 */
describe('JWTUtils - Integration Tests', () => {
  const secretKey = 'integration-test-secret-key';

  describe('Real-world usage scenarios', () => {
    it('should simulate a complete JWT authentication flow', () => {
      // 1. Generate a token for a user (simulating login)
      const userData = {
        id: '12345',
        username: 'testuser',
        role: 'user',
        permissions: ['read', 'write']
      };
      
      const token = JWTUtils.generate({
        payload: userData,
        secretKey,
        options: { expiresIn: '15m' }
      });
      
      // 2. Verify the token (simulating validation of an authenticated request)
      const decoded = JWTUtils.verify({
        token,
        secretKey,
      }) as any;
      
      expect(decoded.id).toBe(userData.id);
      expect(decoded.username).toBe(userData.username);
      expect(decoded.role).toBe(userData.role);
      expect(decoded.permissions).toEqual(userData.permissions);
      
      // 3. Verify that the token is not expired
      const isExpired = JWTUtils.isExpired({ token });
      expect(isExpired).toBe(false);

      // 4. Check the remaining validity time
      const remainingTime = JWTUtils.getExpirationTime({ token });
      expect(remainingTime).toBeGreaterThan(0);
      expect(remainingTime).toBeLessThanOrEqual(15 * 60); // 15 minutes in seconds

      // 5. Refresh the token (simulating token refresh)
      const refreshedToken = JWTUtils.refresh({
        token,
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      // 6. Verify that the refreshed token retains the user's data
      const refreshedDecoded = JWTUtils.verify({
        token: refreshedToken,
        secretKey
      }) as any;
      
      expect(refreshedDecoded.id).toBe(userData.id);
      expect(refreshedDecoded.username).toBe(userData.username);
      expect(refreshedDecoded.role).toBe(userData.role);
      expect(refreshedDecoded.permissions).toEqual(userData.permissions);
      
      // 7. Verify that the refreshed token has a longer expiration time
      const refreshedRemainingTime = JWTUtils.getExpirationTime({ token: refreshedToken });
      expect(refreshedRemainingTime).toBeGreaterThan(remainingTime);
    });

    it('should simulate a role- and permission-based authorization scenario', () => {
      // 1. Create tokens for different types of users
      const adminToken = JWTUtils.generate({
        payload: {
          id: 'admin123',
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'admin']
        },
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      const userToken = JWTUtils.generate({
        payload: {
          id: 'user456',
          role: 'user',
          permissions: ['read', 'write']
        },
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      const guestToken = JWTUtils.generate({
        payload: {
          id: 'guest789',
          role: 'guest',
          permissions: ['read']
        },
        secretKey,
        options: { expiresIn: '1h' }
      });
      
      // 2. Simulated authorization check function
      const checkAuthorization = (token: string, requiredPermission: string): boolean => {
        try {
          const decoded = JWTUtils.verify({ token, secretKey }) as any;
          return decoded.permissions && decoded.permissions.includes(requiredPermission);
        } catch {
          return false;
        }
      };
      
      // 3. Check permissions for different users

      // Admin should have all permissions
      expect(checkAuthorization(adminToken, 'read')).toBe(true);
      expect(checkAuthorization(adminToken, 'write')).toBe(true);
      expect(checkAuthorization(adminToken, 'delete')).toBe(true);
      expect(checkAuthorization(adminToken, 'admin')).toBe(true);
      
      // Regular user should have limited permissions
      expect(checkAuthorization(userToken, 'read')).toBe(true);
      expect(checkAuthorization(userToken, 'write')).toBe(true);
      expect(checkAuthorization(userToken, 'delete')).toBe(false);
      expect(checkAuthorization(userToken, 'admin')).toBe(false);
      
      // Guest should have minimal permissions
      expect(checkAuthorization(guestToken, 'read')).toBe(true);
      expect(checkAuthorization(guestToken, 'write')).toBe(false);
      expect(checkAuthorization(guestToken, 'delete')).toBe(false);
      expect(checkAuthorization(guestToken, 'admin')).toBe(false);
    });

    it('should simulate an expired token and renewal scenario', () => {
      // 1. Create a token that has already expired (in the past)
      const userData = {
        id: 'user123',
        username: 'quickexpire'
      };
      
      const pastTime = Math.floor(Date.now() / 1000) - 10; // 10 seconds in the past
      const expiredToken = JWTUtils.generate({
        payload: { ...userData, exp: pastTime },
        secretKey
      });
      
      // 2. Verify that the token is expired
      const isExpired = JWTUtils.isExpired({ token: expiredToken });
      expect(isExpired).toBe(true);

      // 3. Try to verify the token (should fail)
      expect(() => {
        JWTUtils.verify({ token: expiredToken, secretKey });
      }).toThrow();
      
      // 4. Refresh the token
      const refreshedToken = JWTUtils.refresh({
        token: expiredToken,
        secretKey,
        options: { expiresIn: '10s' }
      });
      
      // 5. Verify that the new token is valid
      const decoded = JWTUtils.verify({
        token: refreshedToken,
        secretKey
      }) as any;
      
      expect(decoded.id).toBe(userData.id);
      expect(decoded.username).toBe(userData.username);
      
      // 6. Verify that the new token is not expired
      const newIsExpired = JWTUtils.isExpired({ token: refreshedToken });
      expect(newIsExpired).toBe(false);
    });
  });
});