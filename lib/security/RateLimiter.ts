/**
 * RateLimiter - Client-side rate limiting for API calls
 * Prevents abuse and excessive requests
 */
type RateLimitEntry = {
  count: number;
  resetTime: number;
};

export class RateLimiter {
  private static limits: Map<string, RateLimitEntry> = new Map();
  private static readonly DEFAULT_WINDOW_MS = 60000; // 1 minute
  private static readonly DEFAULT_MAX_REQUESTS = 10;

  /**
   * Checks if a request is allowed based on rate limit
   */
  static isAllowed(
    key: string,
    maxRequests: number = this.DEFAULT_MAX_REQUESTS,
    windowMs: number = this.DEFAULT_WINDOW_MS
  ): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Gets remaining requests for a key
   */
  static getRemaining(
    key: string,
    maxRequests: number = this.DEFAULT_MAX_REQUESTS
  ): number {
    const entry = this.limits.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests;
    }
    return Math.max(0, maxRequests - entry.count);
  }

  /**
   * Clears rate limit for a key
   */
  static clear(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clears all rate limits
   */
  static clearAll(): void {
    this.limits.clear();
  }
}

