/**
 * Seed: push the demo catalog (src/lib/data/seed.ts) into Supabase.
 * Plain .mjs — inlines the seed rows to avoid a TS->JS build step in scripts.
 * Kept in sync with src/lib/data/seed.ts; typecheck compares both (catalog.test).
 * Idempotent — upserts on product id. Safe to re-run.
 * Run: node --env-file=.env.local scripts/seed-db.mjs
 */
import pg from "pg";

const SEED = [
  ["pb-20k", "voltra-20000mah-power-bank", "Voltra 20,000mAh Power Bank", "Power Banks", "18W fast charge · dual USB-C", "A high-capacity power bank built for all-day reliability. Dual USB-C ports let you charge two devices at once, with 18W fast-charge support cutting typical charge time by nearly half.", 26500, 22000, 220, "🔋", "pb-20k", ["pb-20k", "pb-20k-2", "pb-20k-3"], ["20,000mAh capacity", "18W USB-C fast charge", "Dual output ports", "LED charge display"], 0],
  ["pb-10k", "voltra-10000mah-power-bank", "Voltra 10,000mAh Power Bank", "Power Banks", "Slim, pocket-size · single USB-C", "A slim, pocket-friendly power bank for everyday carry — enough charge for a full phone top-up without the bulk of a larger unit.", 15800, 12500, 180, "🔋", "pb-10k", ["pb-10k", "pb-10k-2", "pb-10k-3"], ["10,000mAh capacity", "Single USB-C output", "Slim 15mm profile", "LED charge display"], 1],
  ["ear-pro", "voltra-earbuds-pro", "Voltra Earbuds Pro", "Earphones", "Active noise cancelling", "Premium wireless earbuds with active noise cancelling, built for commuting through busy streets and markets.", 18900, 14500, 84, "🎧", "ear-pro", ["ear-pro", "ear-pro-2", "ear-pro-3"], ["Active noise cancelling", "Bluetooth 5.3", "28hr total battery", "IPX5 sweat resistant"], 2],
  ["ear-lite", "voltra-earbuds-lite", "Voltra Earbuds Lite", "Earphones", "Wireless, 20hr battery", "A reliable, budget-friendly wireless earbud for everyday listening — simple pairing, solid battery life.", 11200, 8600, 260, "🎧", "ear-lite", ["ear-lite", "ear-lite-2", "ear-lite-3"], ["Bluetooth 5.1", "20hr total battery", "Touch controls", "IPX4 splash resistant"], 3],
  ["headset-1", "voltra-over-ear-headset", "Voltra Over-Ear Headset", "Headsets", "Bluetooth 5.3 · built-in mic", "Over-ear comfort with a built-in mic — well suited for calls, remote work, and long listening sessions.", 24000, 19000, 95, "🎧", "headset", ["headset", "headset-2", "headset-3"], ["Bluetooth 5.3", "Built-in mic", "35hr battery life", "Foldable design"], 4],
  ["cable-3", "fast-charge-cable-set-3", "Fast-Charge Cable Set (3)", "Accessories", "USB-C · Lightning · Micro-USB", "One set, every connector — covers USB-C, Lightning, and Micro-USB devices, reinforced at the connector point.", 7200, 5400, 510, "🔌", "cable", ["cable", "cable-2", "cable-3"], ["3 cables included", "1.2m length each", "Braided, reinforced connectors"], 5],
  ["adapter-1", "65w-gan-fast-charger", "65W GaN Fast Charger", "Accessories", "Dual-port wall adapter", "Compact GaN fast charger with dual ports — charge a laptop and a phone simultaneously.", 12500, 9800, 12, "⚡", "adapter", ["adapter", "adapter-2", "adapter-3"], ["65W total output", "Dual-port (USB-C + USB-A)", "GaN compact design"], 6],
  ["case-1", "shockproof-phone-case", "Shockproof Phone Case", "Accessories", "Universal fit, 3 sizes", "Everyday drop protection without adding bulk — available in three universal size fits.", 4500, 3100, 400, "📱", "case", ["case", "case-2", "case-3"], ["Shockproof corners", "3 universal sizes", "Raised camera lip"], 7],
];

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("FAIL: DATABASE_URL not set");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  for (const s of SEED) {
    await client.query(
      `INSERT INTO products (id, slug, name, category, meta, "desc", price, wholesale, stock, glyph, image_key, gallery_keys, specs, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET
         slug=EXCLUDED.slug, name=EXCLUDED.name, category=EXCLUDED.category, meta=EXCLUDED.meta,
         "desc"=EXCLUDED."desc", price=EXCLUDED.price, wholesale=EXCLUDED.wholesale, stock=EXCLUDED.stock,
         glyph=EXCLUDED.glyph, image_key=EXCLUDED.image_key, gallery_keys=EXCLUDED.gallery_keys, specs=EXCLUDED.specs,
         display_order=EXCLUDED.display_order`,
      [s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9], s[10], s[11], s[12], s[13]]
    );
  }
  const { rows } = await client.query("SELECT count(*)::int AS n FROM products");
  console.log(`PASS: seeded — ${rows[0].n} products in DB (expected ${SEED.length})`);
  if (rows[0].n < SEED.length) process.exitCode = 1;
} catch (err) {
  console.error(`FAIL: ${err.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
