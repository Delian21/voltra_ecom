/**
 * Smoke test: prove DATABASE_URL reaches Supabase Postgres before any schema work.
 * Prints pass/fail only — never the connection string.
 * Run: node scripts/smoke-db.mjs
 */
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("FAIL: DATABASE_URL not set (is .env.local present at project root?)");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15_000,
});

try {
  await client.connect();
  const { rows } = await client.query("select version(), current_database(), now()");
  const v = rows[0].version.split(" ").slice(0, 2).join(" ");
  console.log(`PASS: connected — ${v}, db=${rows[0].current_database}, server time=${rows[0].now.toISOString()}`);
} catch (err) {
  console.error(`FAIL: ${err.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
