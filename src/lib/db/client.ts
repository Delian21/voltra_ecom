/**
 * DB client — the ONLY module allowed to import the driver.
 *
 * Netlify constraint: functions are stateless, so the client is created per
 * call, never cached across invocations. Supabase transaction pooler (port
 * 6543) is the required connection mode — direct :5432 exhausts connections.
 *
 * When DATABASE_URL is absent (local dev without .env.local, preview builds),
 * dbAvailable() returns false and the data layer falls back to mock data.
 */
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export function dbAvailable(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set — call dbAvailable() first");
  return drizzle(url, { schema });
}
