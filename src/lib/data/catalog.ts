import type { Product } from "@/lib/types";

import pb20k1 from "./images/pb-20k.jpg";
import pb20k2 from "./images/pb-20k-2.jpg";
import pb20k3 from "./images/pb-20k-3.jpg";
import pb10k1 from "./images/pb-10k.jpg";
import pb10k2 from "./images/pb-10k-2.jpg";
import pb10k3 from "./images/pb-10k-3.jpg";
import earPro1 from "./images/ear-pro.jpg";
import earPro2 from "./images/ear-pro-2.jpg";
import earPro3 from "./images/ear-pro-3.jpg";
import earLite1 from "./images/ear-lite.jpg";
import earLite2 from "./images/ear-lite-2.jpg";
import earLite3 from "./images/ear-lite-3.jpg";
import headset1 from "./images/headset.jpg";
import headset2 from "./images/headset-2.jpg";
import headset3 from "./images/headset-3.jpg";
import cable1 from "./images/cable.jpg";
import cable2 from "./images/cable-2.jpg";
import cable3 from "./images/cable-3.jpg";
import adapter1 from "./images/adapter.jpg";
import adapter2 from "./images/adapter-2.jpg";
import adapter3 from "./images/adapter-3.jpg";
import case1 from "./images/case.jpg";
import case2 from "./images/case-2.jpg";
import case3 from "./images/case-3.jpg";

/**
 * DEMO IMAGERY — sourced from Pexels (free license, no attribution required,
 * credited voluntarily in imageCredits.ts). Swap for original product shots
 * before launch; every consumer reads from this catalog, nothing else.
 */
const PRODUCTS: Product[] = [
  {
    id: "pb-20k",
    slug: "voltra-20000mah-power-bank",
    name: "Voltra 20,000mAh Power Bank",
    category: "Power Banks",
    meta: "18W fast charge · dual USB-C",
    desc: "A high-capacity power bank built for all-day reliability. Dual USB-C ports let you charge two devices at once, with 18W fast-charge support cutting typical charge time by nearly half.",
    price: 26500,
    wholesale: 22000,
    stock: 220,
    glyph: "🔋",
    image: pb20k1,
    gallery: [pb20k1, pb20k2, pb20k3],
    specs: ["20,000mAh capacity", "18W USB-C fast charge", "Dual output ports", "LED charge display"],
  },
  {
    id: "pb-10k",
    slug: "voltra-10000mah-power-bank",
    name: "Voltra 10,000mAh Power Bank",
    category: "Power Banks",
    meta: "Slim, pocket-size · single USB-C",
    desc: "A slim, pocket-friendly power bank for everyday carry — enough charge for a full phone top-up without the bulk of a larger unit.",
    price: 15800,
    wholesale: 12500,
    stock: 180,
    glyph: "🔋",
    image: pb10k1,
    gallery: [pb10k1, pb10k2, pb10k3],
    specs: ["10,000mAh capacity", "Single USB-C output", "Slim 15mm profile", "LED charge display"],
  },
  {
    id: "ear-pro",
    slug: "voltra-earbuds-pro",
    name: "Voltra Earbuds Pro",
    category: "Earphones",
    meta: "Active noise cancelling",
    desc: "Premium wireless earbuds with active noise cancelling, built for commuting through busy streets and markets.",
    price: 18900,
    wholesale: 14500,
    stock: 84,
    glyph: "🎧",
    image: earPro1,
    gallery: [earPro1, earPro2, earPro3],
    specs: ["Active noise cancelling", "Bluetooth 5.3", "28hr total battery", "IPX5 sweat resistant"],
  },
  {
    id: "ear-lite",
    slug: "voltra-earbuds-lite",
    name: "Voltra Earbuds Lite",
    category: "Earphones",
    meta: "Wireless, 20hr battery",
    desc: "A reliable, budget-friendly wireless earbud for everyday listening — simple pairing, solid battery life.",
    price: 11200,
    wholesale: 8600,
    stock: 260,
    glyph: "🎧",
    image: earLite1,
    gallery: [earLite1, earLite2, earLite3],
    specs: ["Bluetooth 5.1", "20hr total battery", "Touch controls", "IPX4 splash resistant"],
  },
  {
    id: "headset-1",
    slug: "voltra-over-ear-headset",
    name: "Voltra Over-Ear Headset",
    category: "Headsets",
    meta: "Bluetooth 5.3 · built-in mic",
    desc: "Over-ear comfort with a built-in mic — well suited for calls, remote work, and long listening sessions.",
    price: 24000,
    wholesale: 19000,
    stock: 95,
    glyph: "🎧",
    image: headset1,
    gallery: [headset1, headset2, headset3],
    specs: ["Bluetooth 5.3", "Built-in mic", "35hr battery life", "Foldable design"],
  },
  {
    id: "cable-3",
    slug: "fast-charge-cable-set-3",
    name: "Fast-Charge Cable Set (3)",
    category: "Accessories",
    meta: "USB-C · Lightning · Micro-USB",
    desc: "One set, every connector — covers USB-C, Lightning, and Micro-USB devices, reinforced at the connector point.",
    price: 7200,
    wholesale: 5400,
    stock: 510,
    glyph: "🔌",
    image: cable1,
    gallery: [cable1, cable2, cable3],
    specs: ["3 cables included", "1.2m length each", "Braided, reinforced connectors"],
  },
  {
    id: "adapter-1",
    slug: "65w-gan-fast-charger",
    name: "65W GaN Fast Charger",
    category: "Accessories",
    meta: "Dual-port wall adapter",
    desc: "Compact GaN fast charger with dual ports — charge a laptop and a phone simultaneously.",
    price: 12500,
    wholesale: 9800,
    stock: 12,
    glyph: "⚡",
    image: adapter1,
    gallery: [adapter1, adapter2, adapter3],
    specs: ["65W total output", "Dual-port (USB-C + USB-A)", "GaN compact design"],
  },
  {
    id: "case-1",
    slug: "shockproof-phone-case",
    name: "Shockproof Phone Case",
    category: "Accessories",
    meta: "Universal fit, 3 sizes",
    desc: "Everyday drop protection without adding bulk — available in three universal size fits.",
    price: 4500,
    wholesale: 3100,
    stock: 400,
    glyph: "📱",
    image: case1,
    gallery: [case1, case2, case3],
    specs: ["Shockproof corners", "3 universal sizes", "Raised camera lip"],
  },
];

export const CATEGORIES = ["All", "Power Banks", "Earphones", "Headsets", "Accessories"] as const;

export async function listProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function listCategories(): Promise<string[]> {
  return [...CATEGORIES];
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.slug === slug);
}

/**
 * Synchronous lookup — by slug first (page routes), with id as a fallback
 * (client-side cart math against the mock catalog).
 */
export function getProductSync(slugOrId: string): Product | undefined {
  return (
    PRODUCTS.find((p) => p.slug === slugOrId) ??
    PRODUCTS.find((p) => p.id === slugOrId)
  );
}

export const getAllProductsSync = (): Product[] => PRODUCTS;
