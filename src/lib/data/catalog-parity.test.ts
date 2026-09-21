/**
 * Catalog parity guard — the DB seed script (scripts/seed-db.mjs) and the
 * bundled seed module (src/lib/data/seed.ts) must carry identical rows, or the
 * mock fallback and the DB disagree and the swap lies to us.
 *
 * Reads the .mjs source and asserts each row matches the TS seed 1:1.
 * Run with: npx tsx --test src/lib/data/catalog-parity.test.ts
 */
import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

import { SEED_PRODUCTS } from "./seed";

/** Split a JS array-literal body on top-level commas, respecting quotes and nesting. */
function splitTopLevel(s: string): string[] {
  const fields: string[] = [];
  let depth = 0;
  let cur = "";
  let inStr = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '"' && s[i - 1] !== "\\") inStr = !inStr;
    if (!inStr) {
      if (ch === "[" || ch === "(") depth++;
      if (ch === "]" || ch === ")") depth--;
      if (ch === "," && depth === 0) {
        fields.push(cur.trim());
        cur = "";
        continue;
      }
    }
    cur += ch;
  }
  fields.push(cur.trim());
  return fields;
}

function unquote(s: string): string {
  return s.replace(/^"|"$/g, "").replace(/\\"/g, '"');
}

function parseSeedRows(source: string): string[][] {
  const rows: string[][] = [];
  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();
    if (!line.startsWith('["')) continue;
    const inner = line.replace(/\],?$/, "").replace(/^\[/, "");
    rows.push(splitTopLevel(inner));
  }
  return rows;
}

test("DB seed script rows match bundled seed module", () => {
  const source = readFileSync(new URL("../../../scripts/seed-db.mjs", import.meta.url), "utf8");
  const rows = parseSeedRows(source);
  assert.equal(rows.length, SEED_PRODUCTS.length, "row count differs");

  SEED_PRODUCTS.forEach((p, i) => {
    const r = rows[i];
    assert.equal(unquote(r[0]), p.id, `row ${i} id`);
    assert.equal(unquote(r[1]), p.slug, `row ${i} slug`);
    assert.equal(unquote(r[2]), p.name, `row ${i} name`);
    assert.equal(unquote(r[3]), p.category, `row ${i} category`);
    assert.equal(unquote(r[4]), p.meta, `row ${i} meta`);
    assert.equal(unquote(r[5]), p.desc, `row ${i} desc`);
    assert.equal(Number(r[6]), p.price, `row ${i} price`);
    assert.equal(Number(r[7]), p.wholesale, `row ${i} wholesale`);
    assert.equal(Number(r[8]), p.stock, `row ${i} stock`);
    assert.equal(unquote(r[9]), p.glyph, `row ${i} glyph`);
    assert.equal(unquote(r[10]), p.imageKey, `row ${i} imageKey`);
    const gallery = splitTopLevel(r[11].replace(/^\[|\]$/g, "")).map(unquote);
    assert.deepEqual(gallery, p.galleryKeys, `row ${i} galleryKeys`);
    const specs = splitTopLevel(r[12].replace(/^\[|\]$/g, "")).map(unquote);
    assert.deepEqual(specs, p.specs, `row ${i} specs`);
    assert.equal(Number(r[13]), p.displayOrder, `row ${i} displayOrder`);
  });
});
