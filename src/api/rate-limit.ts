/**
 * Limitar el ritmo EN ORIGEN. Reintentar con backoff no arregla pasarse de cuota;
 * espaciar las peticiones si. Copia estos tres helpers al cliente de tu API real.
 */
export function createRateLimiter(opts: { unitsPerSecond: number; unitsPerCall?: number }) {
  const gapMs = Math.ceil(1000 / (opts.unitsPerSecond / (opts.unitsPerCall ?? 1)));
  let nextSlot = 0;
  return async function limited<R>(fn: () => Promise<R>): Promise<R> {
    const now = Date.now();
    const slot = Math.max(now, nextSlot);
    nextSlot = slot + gapMs;
    if (slot > now) await new Promise((r) => setTimeout(r, slot - now));
    return fn();
  };
}

export async function mapLimited<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = 5,
): Promise<R[]> {
  const out: R[] = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i] as T);
    }
  });
  await Promise.all(workers);
  return out;
}

export async function withRetry<R>(
  fn: () => Promise<R>,
  opts: { attempts?: number; isRetryable?: (err: unknown) => boolean } = {},
): Promise<R> {
  const attempts = opts.attempts ?? 4;
  const isRetryable = opts.isRetryable ?? (() => true);
  let waitMs = 1000;
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (!isRetryable(err) || i >= attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, waitMs));
      waitMs *= 2;
    }
  }
}
