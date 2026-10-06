/**
 * Voltra seed data — the single source of the demo catalog.
 *
 * Image fields use stable string keys ("pb-20k", "ear-pro"...), resolved to
 * bundled StaticImageData by data/images.ts.
 */
export interface SeedProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  meta: string;
  desc: string;
  price: number;
  wholesale: number;
  stock: number;
  glyph: string;
  imageKey: string;
  galleryKeys: string[];
  specs: string[];
  /** Catalog display order — the old mock-array order is a UI contract. */
  displayOrder: number;
}

export const SEED_PRODUCTS: SeedProduct[] = [
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
    imageKey: "pb-20k",
    galleryKeys: ["pb-20k", "pb-20k-2", "pb-20k-3"],
    specs: ["20,000mAh capacity", "18W USB-C fast charge", "Dual output ports", "LED charge display"],
    displayOrder: 0,
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
    imageKey: "pb-10k",
    galleryKeys: ["pb-10k", "pb-10k-2", "pb-10k-3"],
    specs: ["10,000mAh capacity", "Single USB-C output", "Slim 15mm profile", "LED charge display"],
    displayOrder: 1,
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
    imageKey: "ear-pro",
    galleryKeys: ["ear-pro", "ear-pro-2", "ear-pro-3"],
    specs: ["Active noise cancelling", "Bluetooth 5.3", "28hr total battery", "IPX5 sweat resistant"],
    displayOrder: 2,
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
    imageKey: "ear-lite",
    galleryKeys: ["ear-lite", "ear-lite-2", "ear-lite-3"],
    specs: ["Bluetooth 5.1", "20hr total battery", "Touch controls", "IPX4 splash resistant"],
    displayOrder: 3,
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
    imageKey: "headset",
    galleryKeys: ["headset", "headset-2", "headset-3"],
    specs: ["Bluetooth 5.3", "Built-in mic", "35hr battery life", "Foldable design"],
    displayOrder: 4,
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
    imageKey: "cable",
    galleryKeys: ["cable", "cable-2", "cable-3"],
    specs: ["3 cables included", "1.2m length each", "Braided, reinforced connectors"],
    displayOrder: 5,
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
    imageKey: "adapter",
    galleryKeys: ["adapter", "adapter-2", "adapter-3"],
    specs: ["65W total output", "Dual-port (USB-C + USB-A)", "GaN compact design"],
    displayOrder: 6,
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
    imageKey: "case",
    galleryKeys: ["case", "case-2", "case-3"],
    specs: ["Shockproof corners", "3 universal sizes", "Raised camera lip"],
    displayOrder: 7,
  },
];

export const CATEGORIES = ["All", "Power Banks", "Earphones", "Headsets", "Accessories"] as const;
