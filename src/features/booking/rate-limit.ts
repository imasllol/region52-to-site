/**
 * BookingRateLimiter: не больше 3 заявок за 10 минут с одного IP.
 * Счетчики хранятся в памяти процесса и сбрасываются при перезапуске.
 */
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT_MAX = 3;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, now: number = Date.now()): boolean {
  for (const [k, times] of hits) {
    const fresh = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (fresh.length > 0) hits.set(k, fresh);
    else hits.delete(k);
  }

  const times = hits.get(key) ?? [];
  if (times.length >= RATE_LIMIT_MAX) return false;
  times.push(now);
  hits.set(key, times);
  return true;
}

export function resetRateLimit(): void {
  hits.clear();
}
