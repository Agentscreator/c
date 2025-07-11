// lib/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Get database URL from environment variables
const sql = neon(process.env.DATABASE_URL!);

// Create drizzle instance
export const db = drizzle(sql, { schema });

// Export schema for use in other files
export { schema };

