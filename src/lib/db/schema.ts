/**
 * Voltra schema — derived 1:1 from src/lib/types.ts (PLAN.md §4 mock-data seam).
 *
 * T-004 scope: products only (catalog swap). Later steps add users, orders,
 * credit ledger, restock plans — same file, same conventions.
 */
import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  meta: text("meta").notNull(),
  desc: text("desc").notNull(),
  /** Retail price in ₦. */
  price: integer("price").notNull(),
  /** Wholesale price in ₦, minimum 10 units per SKU. */
  wholesale: integer("wholesale").notNull(),
  stock: integer("stock").notNull(),
  /** Category glyph fallback if the photo fails to load. */
  glyph: text("glyph").notNull(),
  /** Static import path of the primary photo, e.g. "pb-20k" — resolved to the
   *  bundled StaticImageData client-side (DB stores no binaries). */
  imageKey: text("image_key").notNull(),
  /** JSON array of gallery image keys, primary first. */
  galleryKeys: text("gallery_keys").array().notNull(),
  /** JSON array of spec strings. */
  specs: text("specs").array().notNull(),
  /** Catalog display order — matches the bundled seed order (the old mock-array
   *  order is a UI contract; e2e depends on it). */
  displayOrder: integer("display_order").notNull(),
});

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
