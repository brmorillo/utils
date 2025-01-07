import { UAParser } from 'ua-parser-js';
export class RequestUtils {
  /**
   * Extracts all possible relevant data from the HTTP request object.
   * @param request The incoming HTTP request object.
   * @returns An object containing extracted data such as user agent, IP address, and headers.
   * @example
   * const requestData = RequestUtils.extractRequestData({ request });
   */
  public static extractRequestData({ request }: { request: any }): {
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
    // Extract basic headers
    const headers = request.headers || {};
    const userAgent = headers['user-agent'] || undefined;
    const referer = headers['referer'] || undefined;
    const origin = headers['origin'] || undefined;
    const host = headers['host'] || undefined;

    // Extract IP address information
    const ipAddress = request.ip || undefined;
    const xForwardedFor =
      headers['x-forwarded-for']?.split(',')[0]?.trim() || undefined;
    const xRealIp = headers['x-real-ip'] || undefined;

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
