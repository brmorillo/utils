import * as jwt from 'jsonwebtoken';
import { handleError } from '../utils/error.util';

export class JWTUtils {
  /**
   * Generates a JWT token.
   * @param {object} params - The parameters for the method.
   * @param {object} params.payload - The data to be encoded in the token.
   * @param {string} params.secretKey - The secret key used to sign the token.
   * @param {object} [params.options] - Optional JWT sign options.
   * @param {string | number} [params.options.expiresIn] - Expiration time for the token (e.g., '1h', '7d', 3600).
   * @param {string} [params.options.issuer] - The issuer of the token.
   * @param {string} [params.options.audience] - The audience of the token.
   * @param {string} [params.options.subject] - The subject of the token.
   * @returns {string} The generated JWT token.
   * @throws {Error} If token generation fails.
   * @example
   * const token = JWTUtils.generate({
   *   payload: { userId: '123', role: 'admin' },
   *   secretKey: 'your-secret-key',
   *   options: { expiresIn: '1h' }
   * });
   */
  public static generate({
    payload,
    secretKey,
    options = {},
  }: {
    payload: object;
    secretKey: string;
    options?: jwt.SignOptions;
  }): string {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload: must be a non-empty object.');
    }

    if (!secretKey || typeof secretKey !== 'string') {
      throw new Error('Invalid secretKey: must be a non-empty string.');
    }

    try {
      return jwt.sign(payload, secretKey, options);
    } catch (error) {
      return handleError('Failed to generate JWT token', error);
    }
  }

  /**
   * Verifies a JWT token.
   * @param {object} params - The parameters for the method.
   * @param {string} params.token - The JWT token to verify.
   * @param {string} params.secretKey - The secret key used to verify the token.
   * @param {object} [params.options] - Optional JWT verify options.
   * @param {string | string[]} [params.options.issuer] - The required issuer of the token.
   * @param {string | string[]} [params.options.audience] - The required audience of the token.
   * @param {string} [params.options.subject] - The required subject of the token.
   * @returns {object} The decoded token payload if verification succeeds.
   * @throws {Error} If token verification fails.
   * @example
   * const decoded = JWTUtils.verify({
   *   token: 'your-jwt-token',
   *   secretKey: 'your-secret-key'
   * });
   * console.log(decoded.userId); // '123'
   */
  public static verify({
    token,
    secretKey,
    options = {},
  }: {
    token: string;
    secretKey: string;
    options?: jwt.VerifyOptions;
  }): object {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token: must be a non-empty string.');
    }

    if (!secretKey || typeof secretKey !== 'string') {
      throw new Error('Invalid secretKey: must be a non-empty string.');
    }

    try {
      return jwt.verify(token, secretKey, options) as object;
    } catch (error) {
      return handleError('Failed to verify JWT token', error);
    }
  }

  /**
   * Decodes a JWT token without verifying its signature.
   * @param {object} params - The parameters for the method.
   * @param {string} params.token - The JWT token to decode.
   * @param {boolean} [params.complete=false] - If true, returns the decoded header and payload; otherwise, returns only the payload.
   * @returns {object} The decoded token payload (or complete token if complete=true).
   * @throws {Error} If token decoding fails.
   * @example
   * const decoded = JWTUtils.decode({
   *   token: 'your-jwt-token'
   * });
   * console.log(decoded.userId); // '123'
   *
   * const decodedComplete = JWTUtils.decode({
   *   token: 'your-jwt-token',
   *   complete: true
   * });
   * console.log(decodedComplete.header); // { alg: 'HS256', typ: 'JWT' }
   * console.log(decodedComplete.payload); // { userId: '123', ... }
   */
  public static decode({
    token,
    complete = false,
  }: {
    token: string;
    complete?: boolean;
  }): object {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token: must be a non-empty string.');
    }

    try {
      const decoded = jwt.decode(token, { complete }) as object;
      if (!decoded) {
        throw new Error('Invalid token format.');
      }
      return decoded;
    } catch (error) {
      return handleError('Failed to decode JWT token', error);
    }
  }

  /**
   * Refreshes a JWT token by generating a new one with the same payload and updated expiration.
   * @param {object} params - The parameters for the method.
   * @param {string} params.token - The JWT token to refresh.
   * @param {string} params.secretKey - The secret key used to verify the old token and sign the new one.
   * @param {object} [params.options] - Optional JWT sign options for the new token.
   * @param {string | number} [params.options.expiresIn] - Expiration time for the new token (e.g., '1h', '7d', 3600).
   * @returns {string} The new JWT token.
   * @throws {Error} If token refresh fails.
   * @example
   * const newToken = JWTUtils.refresh({
   *   token: 'your-expired-token',
   *   secretKey: 'your-secret-key',
   *   options: { expiresIn: '1h' }
   * });
   */
  public static refresh({
    token,
    secretKey,
    options = {},
  }: {
    token: string;
    secretKey: string;
    options?: jwt.SignOptions;
  }): string {
    try {
      // Force verification to ensure the token was valid (just expired)
      const decoded = jwt.verify(token, secretKey, {
        ignoreExpiration: true,
      }) as object;

      // Remove standard claims that should be regenerated
      const payload = { ...decoded };

      // Generate a new token with the same payload
      return JWTUtils.generate({
        payload,
        secretKey,
        options,
      });
    } catch (error) {
      return handleError('Failed to refresh JWT token', error);
    }
  }

  /**
   * Checks if a JWT token is expired.
   * @param {object} params - The parameters for the method.
   * @param {string} params.token - The JWT token to check.
   * @returns {boolean} `true` if the token is expired, otherwise `false`.
   * @throws {Error} If token parsing fails.
   * @example
   * const isExpired = JWTUtils.isExpired({
   *   token: 'your-jwt-token'
   * });
   * console.log(isExpired); // true or false
   */
  public static isExpired({ token }: { token: string }): boolean {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token: must be a non-empty string.');
    }

    try {
      const decoded = jwt.decode(token) as { exp?: number };
      if (!decoded || !decoded.exp) {
        throw new Error('Invalid token or missing expiration claim.');
      }

      // Compare expiration timestamp with current time
      const currentTimestamp = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTimestamp;
    } catch (error) {
      return handleError('Failed to check JWT token expiration', error);
    }
  }

  /**
   * Gets the remaining time until a JWT token expires.
   * @param {object} params - The parameters for the method.
   * @param {string} params.token - The JWT token to check.
   * @returns {number} The remaining time in seconds until the token expires. Returns 0 if the token is already expired.
   * @throws {Error} If token parsing fails.
   * @example
   * const remainingSeconds = JWTUtils.getExpirationTime({
   *   token: 'your-jwt-token'
   * });
   * console.log(remainingSeconds); // e.g., 3600 for 1 hour
   */
  public static getExpirationTime({ token }: { token: string }): number {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token: must be a non-empty string.');
    }

    try {
      const decoded = jwt.decode(token) as { exp?: number };
      if (!decoded || !decoded.exp) {
        throw new Error('Invalid token or missing expiration claim.');
      }

      const currentTimestamp = Math.floor(Date.now() / 1000);
      const remainingTime = decoded.exp - currentTimestamp;

      return remainingTime > 0 ? remainingTime : 0;
    } catch (error) {
      return handleError('Failed to get JWT token expiration time', error);
    }
  }
}
