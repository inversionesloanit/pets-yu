import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = {
      message: 'Too many requests, please try again later.',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...options,
    };

    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private getKey(req: Request): string {
    // Use IP address as key, but you can customize this
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();
      const windowMs = this.options.windowMs;

      // Initialize or get existing record
      if (!this.store[key]) {
        this.store[key] = {
          count: 0,
          resetTime: now + windowMs,
        };
      }

      const record = this.store[key];

      // Reset if window has expired
      if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + windowMs;
      }

      // Check if limit exceeded
      if (record.count >= this.options.max) {
        const remainingTime = Math.ceil((record.resetTime - now) / 1000);
        
        res.set({
          'X-RateLimit-Limit': this.options.max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
          'Retry-After': remainingTime.toString(),
        });

        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: this.options.message,
          retryAfter: remainingTime,
        });
      }

      // Increment counter
      record.count++;

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': this.options.max.toString(),
        'X-RateLimit-Remaining': (this.options.max - record.count).toString(),
        'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
      });

      next();
    };
  }
}

// Pre-configured rate limiters
export const generalLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});

export const strictLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests, please slow down.',
});

export default RateLimiter;
