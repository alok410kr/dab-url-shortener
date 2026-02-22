import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

export const db = drizzle(process.env.DATABASE_URL)
export default db;