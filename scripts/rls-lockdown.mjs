/**
 * RLS lockdown: products table.
 *
 * Policy intent (T-004, pre-auth):
 *   - ENABLE + FORCE RLS on products.
 *   - Public SELECT: the storefront catalog is browsable by anyone, including
 *     anonymous visitors.
 *   - Writes (INSERT/UPDATE/DELETE): NO policy for app-facing roles — nobody
 *     through the anon / authenticated API keys. Writes happen only via the
 *     postgres role / direct connection (seed scripts), which bypasses RLS
 *     as table owner.
 *
 * RLS quirks this script verifies FUNCTIONALLY (behavior, not catalog metadata):
 *   - Blocked UPDATE/DELETE do NOT error — they simply affect 0 rows.
 *   - Blocked INSERT DOES error (no WITH CHECK policy to satisfy).
 *   - Public SELECT keeps working.
 *
 * Idempotent: drops and recreates the policy.
 * Run: node --env-file=.env.local scripts/rls-lockdown.mjs
 */
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("FAIL: DATABASE_URL not set");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

/** Functional checks, each in its own transaction (an aborted tx poisons the rest). */
async function functionalChecks() {
  // UPDATE must touch 0 rows.
  await client.query("BEGIN");
  await client.query("SET LOCAL ROLE anon");
  const upd = await client.query("UPDATE products SET stock = 0 WHERE id = 'pb-20k'");
  await client.query("COMMIT");
  if (upd.rowCount !== 0) throw new Error(`anon UPDATE touched ${upd.rowCount} rows`);

  // DELETE must touch 0 rows.
  await client.query("BEGIN");
  await client.query("SET LOCAL ROLE anon");
  const del = await client.query("DELETE FROM products");
  await client.query("COMMIT");
  if (del.rowCount !== 0) throw new Error(`anon DELETE touched ${del.rowCount} rows`);

  // INSERT must error (and leave no probe row behind).
  await client.query("BEGIN");
  await client.query("SET LOCAL ROLE anon");
  let insertErrored = false;
  try {
    await client.query(
      `INSERT INTO products (id, slug, name, category, meta, "desc", price, wholesale, stock, glyph, image_key, gallery_keys, specs, display_order)
       VALUES ('rls-probe','rls-probe','Probe','X','m','d',1,1,1,'g','pb-20k','{}','{}',99)`
    );
  } catch {
    insertErrored = true;
  }
  await client.query("COMMIT").catch(() => {});
  if (!insertErrored) throw new Error("anon INSERT succeeded");

  // SELECT must still work, and no probe row may exist.
  const probe = await client.query("SELECT count(*)::int AS n FROM products WHERE id = 'rls-probe'");
  if (probe.rows[0].n > 0) throw new Error("rls-probe row exists — INSERT went through");
  const count = await client.query("SELECT count(*)::int AS n FROM products");
  if (count.rows[0].n < 1) throw new Error("public SELECT broke — catalog unreadable");

  console.log("      functional: anon UPDATE/DELETE touch 0 rows, INSERT errors, SELECT works");
}

try {
  await client.connect();

  await client.query("BEGIN");
  await client.query(`ALTER TABLE products ENABLE ROW LEVEL SECURITY`);
  await client.query(`ALTER TABLE products FORCE ROW LEVEL SECURITY`);
  await client.query(`DROP POLICY IF EXISTS products_public_select ON products`);
  await client.query(`
    CREATE POLICY products_public_select ON products
    FOR SELECT
    TO anon, authenticated
    USING (true)
  `);
  await client.query("COMMIT");

  // ---- Catalog-metadata verification ----
  const rl = await client.query(`
    SELECT relrowsecurity, relforcerowsecurity
    FROM pg_class WHERE relname = 'products'
  `);
  const { relrowsecurity: rls, relforcerowsecurity: force } = rl.rows[0];
  if (!rls || !force) throw new Error("RLS or FORCE RLS not enabled on products");

  const pols = await client.query(`
    SELECT policyname, cmd FROM pg_policies WHERE tablename = 'products'
  `);
  const writes = pols.rows.filter((p) => p.cmd !== "SELECT");
  if (writes.length > 0) {
    throw new Error(`Unexpected write policy on products: ${writes.map((w) => w.policyname).join(", ")}`);
  }
  if (pols.rows.length !== 1) {
    throw new Error(`Expected exactly one SELECT policy, found ${pols.rows.length}`);
  }

  console.log("PASS: products locked down — FORCE RLS on, public SELECT only, zero write policies");
  console.log(`      policies: ${pols.rows.map((p) => `${p.policyname}(${p.cmd})`).join(", ")}`);

  // ---- Functional verification ----
  await functionalChecks();
  console.log("PASS: lockdown verified functionally");
} catch (err) {
  console.error(`FAIL: ${err.message}`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
