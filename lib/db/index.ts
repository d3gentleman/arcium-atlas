import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Creates a Drizzle database client backed by the Neon serverless driver.
 *
 * Uses the **pooled** connection URL (POSTGRES_DATABASE_URL) which is
 * optimal for serverless / edge function workloads on Vercel.
 *
 * The unpooled URL (POSTGRES_DATABASE_URL_UNPOOLED) is reserved for
 * migrations via drizzle-kit, where DDL statements need a direct connection.
 */
function createDb() {
  const connectionString = process.env.POSTGRES_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'POSTGRES_DATABASE_URL is not set. ' +
        'Run `vercel env pull .env.development.local` to fetch credentials.'
    );
  }

  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

// Re-use a single instance across hot-reloads in development
const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined;
};

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
