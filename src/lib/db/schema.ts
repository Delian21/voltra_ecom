/**
 * Voltra schema — derived 1:1 from src/lib/types.ts (PLAN.md §4 mock-data seam).
 *
 * Scope: products (catalog swap) and orders (real-order checkout phase).
 * Later steps add users, credit ledger, restock plans — same file, same
 * conventions.
 */
import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";

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

/** Orders created server-side; the client never sends prices or a total. */
export const orders = pgTable("orders", {
  /** Human-facing id, e.g. ORD-…; generated in data/orders.server.ts. */
  id: text("id").primaryKey(),
  status: text("status").notNull().default("pending_payment"),
  paymentMethod: text("payment_method").notNull().default("bank_transfer"),
  buyerName: text("buyer_name").notNull(),
  buyerPhone: text("buyer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  /** Order total in whole ₦, computed from DB prices at creation. */
  total: integer("total").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderLines = pgTable(
  "order_lines",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    /** Product id snapshot — deliberately NOT a foreign key so history survives product deletion. */
    productId: text("product_id").notNull(),
    /** Product name snapshot at purchase time. */
    name: text("name").notNull(),
    mode: text("mode").notNull(),
    qty: integer("qty").notNull(),
    /** Unit price paid in whole ₦, snapshotted from the DB row. */
    unitPrice: integer("unit_price").notNull(),
  },
  (t) => [index("order_lines_order_id_idx").on(t.orderId)],
);

export type OrderRow = typeof orders.$inferSelect;
export type NewOrderRow = typeof orders.$inferInsert;
export type OrderLineRow = typeof orderLines.$inferSelect;
export type NewOrderLineRow = typeof orderLines.$inferInsert;
