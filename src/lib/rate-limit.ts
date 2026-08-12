// Fixed-window in-memory rate limiter (per process/lambda instance) — a
// best-effort abuse guard, not a security boundary. The window is anchored
// at the key's first hit and resets once it elapses.
export function createRateLimiter(
  limit: number,
  windowMs: number,
  now: () => number = Date.now,
): (key: string) => boolean {
  const hits = new Map<string, { n: number; ts: number }>();
  return function isLimited(key: string): boolean {
    const t = now();
    const h = hits.get(key);
    if (!h || t - h.ts > windowMs) {
      hits.set(key, { n: 1, ts: t });
      return false;
    }
    h.n += 1;
    return h.n > limit;
  };
}
