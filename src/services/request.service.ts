import { UAParser } from 'ua-parser-js';
import { ValidationError } from '../errors';

/**
 * Minimal shape of an incoming HTTP request this utility understands.
 *
 * Header values may be a single string, an array of strings (Node lists
 * duplicate headers as arrays), or undefined.
 */
export interface HttpRequestLike {
  headers?: Record<string, string | string[] | undefined>;
  ip?: string;
  [key: string]: unknown;
}

export class RequestUtils {
  /**
   * Normalizes a header value (which may be a `string[]`) into a single string.
   * For array values the first entry is used; everything else is returned as-is.
   */
  private static firstHeaderValue(
    value: string | string[] | undefined,
  ): string | undefined {
    if (Array.isArray(value)) {
      return value[0];
    }
    return value ?? undefined;
  }

  /**
   * Extracts all possible relevant data from the HTTP request object.
   *
   * @remarks
   * SECURITY: The `x-forwarded-for` and `x-real-ip` headers are
   * client-controlled and trivially spoofable. They are only trustworthy when
   * your application sits behind a trusted reverse proxy that overwrites them.
   * Do NOT use these values for authorization, rate-limiting, or audit logging
   * unless you have validated the proxy chain.
   *
   * @param request The incoming HTTP request object.
   * @returns An object containing extracted data such as user agent, IP address, and headers.
   * @throws {ValidationError} If `request` is null or undefined.
   * @example
   * const requestData = RequestUtils.extractRequestData({ request });
   */
  public static extractRequestData({
    request,
  }: {
    request: HttpRequestLike;
  }): {
    userAgent: string | undefined;
    ipAddress: string | undefined;
    xForwardedFor: string | undefined;
    xRealIp: string | undefined;
    referer: string | undefined;
    origin: string | undefined;
    host: string | undefined;
    browser: string | undefined;
    os: string | undefined;
    device: string | undefined;
  } {
    if (request === null || request === undefined) {
      throw ValidationError.required('request');
    }

    // Extract basic headers, normalizing any array-valued headers to a string.
    const headers = request.headers || {};
    const userAgent =
      RequestUtils.firstHeaderValue(headers['user-agent']) || undefined;
    const referer =
      RequestUtils.firstHeaderValue(headers['referer']) || undefined;
    const origin =
      RequestUtils.firstHeaderValue(headers['origin']) || undefined;
    const host = RequestUtils.firstHeaderValue(headers['host']) || undefined;

    // Extract IP address information.
    // NOTE: xForwardedFor / xRealIp are client-controlled (see @remarks above).
    const ipAddress = request.ip || undefined;
    const forwardedForRaw = RequestUtils.firstHeaderValue(
      headers['x-forwarded-for'],
    );
    const xForwardedFor =
      forwardedForRaw?.split(',')[0]?.trim() || undefined;
    const xRealIp =
      RequestUtils.firstHeaderValue(headers['x-real-ip']) || undefined;

    // Parse the User-Agent string
    const parser = new UAParser(userAgent);
    const uaResult = parser.getResult();
    const browser = uaResult.browser.name || undefined;
    const os = uaResult.os.name || undefined;
    const device = uaResult.device.type || undefined;

    return {
      userAgent,
      ipAddress,
      xForwardedFor,
      xRealIp,
      referer,
      origin,
      host,
      browser,
      os,
      device,
    };
  }
}
