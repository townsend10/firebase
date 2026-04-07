interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Clean expired entries periodically
setInterval(() => {
  const now = Date.now();
  store.forEach((value, key) => {
    if (value.resetAt <= now) store.delete(key);
  });
}, CLEANUP_INTERVAL);

export function rateLimit(
  key: string,
  maxRequests: number = 3,
  windowMs: number = 10 * 60 * 1000,
): { allowed: true } | { allowed: false; remainingMinutes: number } {
  const now = Date.now();
  const entry = store.get(key);

  // New or expired entry
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  // Already exceeded the limit
  if (entry.count >= maxRequests) {
    const remainingMs = entry.resetAt - now;
    const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 1000 / 60));
    return { allowed: false, remainingMinutes };
  }

  // Still within limit
  entry.count++;
  return { allowed: true };
}
