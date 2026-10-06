/**
 * SERVER-ONLY order creation. It pulls in the Postgres driver, so it must
 * never be imported by client components. Prices and the total are always
 * computed from DB rows; the caller supplies only product ids and quantities.
 */
import { and, eq, gte, inArray, sql } from "drizzle-orm";

import { dbAvailable, getDb } from "@/lib/db/client";
import { orderLines, orders, products } from "@/lib/db/schema";
import { validateOrderInput } from "@/lib/data/order-validation";

/** Expected, user-facing failure — as opposed to an unexpected DB error. */
class OrderError extends Error {}

/** `ORD-` + time + 3 random base-36 chars, matching the localStorage id scheme. */
function freshOrderId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `ORD-${time}${random}`;
}

export type CreateOrderResult =
  | { ok: true; orderId: string; total: number }
  | { ok: false; error: string };

export async function createOrder(input: {
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  lines: { productId: string; qty: number }[];
}): Promise<CreateOrderResult> {
  if (!dbAvailable()) {
    return { ok: false, error: "Ordering is unavailable right now" };
  }

  const parsed = validateOrderInput(input);
  if (!parsed.ok) return { ok: false, error: parsed.error };
  const { buyerName, buyerPhone, deliveryAddress, lines } = parsed.value;

  try {
    return await getDb().transaction(async (tx) => {
      const ids = lines.map((line) => line.productId);
      const rows = await tx
        .select()
        .from(products)
        .where(inArray(products.id, ids))
        .for("update");

      const byId = new Map(rows.map((row) => [row.id, row]));
      let total = 0;
      const resolved = lines.map((line) => {
        const row = byId.get(line.productId);
        if (!row) throw new OrderError("One of the products is no longer available");
        if (row.stock < line.qty) {
          throw new OrderError(`${row.name} only has ${row.stock} left`);
        }
        total += row.price * line.qty;
        return { line, row };
      });

      const orderId = freshOrderId();

      await tx.insert(orders).values({
        id: orderId,
        buyerName,
        buyerPhone,
        deliveryAddress,
        total,
      });

      await tx.insert(orderLines).values(
        resolved.map(({ line, row }) => ({
          orderId,
          productId: row.id,
          name: row.name,
          mode: "unit",
          qty: line.qty,
          unitPrice: row.price,
        })),
      );

      for (const { line } of resolved) {
        const updated = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${line.qty}` })
          .where(and(eq(products.id, line.productId), gte(products.stock, line.qty)))
          .returning({ id: products.id });
        if (updated.length === 0) {
          throw new OrderError("Stock changed while placing the order — please try again");
        }
      }

      return { ok: true as const, orderId, total };
    });
  } catch (err) {
    if (err instanceof OrderError) return { ok: false, error: err.message };
    // Log only the message — never the buyer's phone or address.
    console.error("[orders] createOrder failed:", err instanceof Error ? err.message : err);
    return { ok: false, error: "Could not place the order right now" };
  }
}
