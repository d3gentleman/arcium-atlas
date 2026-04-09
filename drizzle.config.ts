import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Use the unpooled connection for migrations (DDL statements
    // should bypass the connection pooler).
    url: process.env.POSTGRES_DATABASE_URL_UNPOOLED!,
  },
});
