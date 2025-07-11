// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql', // Use dialect instead of driver
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;