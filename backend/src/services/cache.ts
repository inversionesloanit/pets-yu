interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  set<T>(key: string, data: T, ttl: number = 300000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries
    };
  }
}

// Cache key generators
export const cacheKeys = {
  products: {
    all: (params?: any) => `products:all:${JSON.stringify(params || {})}`,
    byId: (id: string) => `products:id:${id}`,
    byCategory: (categoryId: string, params?: any) => `products:category:${categoryId}:${JSON.stringify(params || {})}`,
    search: (query: string, params?: any) => `products:search:${query}:${JSON.stringify(params || {})}`,
  },
  categories: {
    all: () => 'categories:all',
    byId: (id: string) => `categories:id:${id}`,
  },
  users: {
    byId: (id: string) => `users:id:${id}`,
    byEmail: (email: string) => `users:email:${email}`,
  },
  cart: {
    byUserId: (userId: string) => `cart:user:${userId}`,
  },
  testimonials: {
    all: () => 'testimonials:all',
  },
};

// Cache TTL constants (in milliseconds)
export const cacheTTL = {
  products: 10 * 60 * 1000,      // 10 minutes
  categories: 30 * 60 * 1000,    // 30 minutes
  users: 15 * 60 * 1000,         // 15 minutes
  cart: 5 * 60 * 1000,           // 5 minutes
  testimonials: 60 * 60 * 1000,  // 1 hour
};

// Global cache instance
export const cache = new MemoryCache();

// Cache middleware for Express routes
export function withCache<T>(keyGenerator: (...args: any[]) => string, ttl?: number) {
  return async (req: any, res: any, next: any) => {
    const key = keyGenerator(req.params, req.query);
    const cached = cache.get<T>(key);

    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true
      });
    }

    // Store original res.json to intercept response
    const originalJson = res.json;
    res.json = function(data: any) {
      if (data.success && data.data) {
        cache.set(key, data.data, ttl);
      }
      return originalJson.call(this, data);
    };

    next();
  };
}

// Cache invalidation helpers
export function invalidateProductCache(productId?: string) {
  if (productId) {
    cache.delete(cacheKeys.products.byId(productId));
  }
  // Invalidate all product-related caches
  cache.delete(cacheKeys.products.all());
  // Note: In a real app, you'd want to invalidate category-specific caches too
}

export function invalidateCategoryCache() {
  cache.delete(cacheKeys.categories.all());
}

export function invalidateUserCache(userId: string) {
  cache.delete(cacheKeys.users.byId(userId));
  cache.delete(cacheKeys.cart.byUserId(userId));
}

export function invalidateCartCache(userId: string) {
  cache.delete(cacheKeys.cart.byUserId(userId));
}

export default cache;
