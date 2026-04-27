import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export const sql = neon(process.env.DATABASE_URL, {
  fetch: (url: string, options?: RequestInit) => {
    // Strip the Next.js abort signal to prevent "NeonDbError: AbortError" on page refresh
    const { signal: _signal, ...restOptions } = options || {};
    return fetch(url, restOptions);
  }
} as any);
