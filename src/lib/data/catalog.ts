/**
 * Catalog data module — the PLAN.md §4 seam in action. SERVER-ONLY.
 *
 * Reads the DB (Supabase via Drizzle) when DATABASE_URL is set; otherwise
 * falls back to the bundled seed (data/catalog.shared.ts) the app shipped with.
 * DB and seed carry identical rows (catalog-parity test guards this).
 *
 * Client components must NOT import this file (drizzle/pg leak into browser
 * bundles). They import data/catalog.shared.ts instead.
 */
import { asc } from "drizzle-orm";

import type { Product } from "@/lib/types";

import { dbAvailable, getDb } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import type { ProductRow } from "@/lib/db/schema";

import { MOCK_PRODUCTS, CATEGORIES } from "./catalog.shared";
import { resolveImage } from "./images";

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    meta: row.meta,
    desc: row.desc,
    price: row.price,
    wholesale: row.wholesale,
    stock: row.stock,
    glyph: row.glyph,
    image: resolveImage(row.imageKey),
    gallery: row.galleryKeys.map(resolveImage),
    specs: [...row.specs],
  };
}

export { CATEGORIES, getProductSync, getAllProductsSync } from "./catalog.shared";

export async function listProducts(): Promise<Product[]> {
  if (dbAvailable()) {
    try {
      const rows = await getDb().select().from(products).orderBy(asc(products.displayOrder));
      if (rows.length > 0) return rows.map(rowToProduct);
    } catch {
      // DB hiccup — degrade to bundled seed, never crash the page.
      console.error("[catalog] DB read failed, serving mock fallback");
    }
  }
  return MOCK_PRODUCTS;
}

export async function listCategories(): Promise<string[]> {
  return [...CATEGORIES];
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (dbAvailable()) {
    try {
      const rows = await getDb().select().from(products);
      const row = rows.find((r) => r.slug === slug);
      if (row) return rowToProduct(row);
    } catch {
      console.error("[catalog] DB read failed, serving mock fallback");
    }
  }
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
