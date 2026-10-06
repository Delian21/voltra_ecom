/**
 * Catalog data module — the PLAN.md §4 seam in action.
 *
 * Reads only the bundled seed (data/catalog.shared.ts). No database, no
 * network; the async signatures exist so pages keep their data seam and a
 * future backend can swap in behind them.
 */
import type { Product } from "@/lib/types";

import { MOCK_PRODUCTS, CATEGORIES } from "./catalog.shared";

export { CATEGORIES, getProductSync, getAllProductsSync } from "./catalog.shared";

export async function listProducts(): Promise<Product[]> {
  return MOCK_PRODUCTS;
}

export async function listCategories(): Promise<string[]> {
  return [...CATEGORIES];
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
