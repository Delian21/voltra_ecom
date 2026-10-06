/**
 * Client-safe catalog data — bundled seed only, zero server imports.
 *
 * Client components (cart math, product pickers) and server components alike
 * resolve against the bundled seed.
 */
import type { Product } from "@/lib/types";

import { resolveImage } from "./images";
import { SEED_PRODUCTS } from "./seed";

function seedToProduct(s: (typeof SEED_PRODUCTS)[number]): Product {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    category: s.category,
    meta: s.meta,
    desc: s.desc,
    price: s.price,
    wholesale: s.wholesale,
    stock: s.stock,
    glyph: s.glyph,
    image: resolveImage(s.imageKey),
    gallery: s.galleryKeys.map(resolveImage),
    specs: [...s.specs],
  };
}

export const MOCK_PRODUCTS: Product[] =
  [...SEED_PRODUCTS].sort((a, b) => a.displayOrder - b.displayOrder).map(seedToProduct);

export { CATEGORIES } from "./seed";

/** Synchronous lookup — slug first (page routes), id fallback (cart math). */
export function getProductSync(slugOrId: string): Product | undefined {
  return (
    MOCK_PRODUCTS.find((p) => p.slug === slugOrId) ??
    MOCK_PRODUCTS.find((p) => p.id === slugOrId)
  );
}

export const getAllProductsSync = (): Product[] => MOCK_PRODUCTS;
