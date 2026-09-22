/**
 * PATCH /api/admin/products — edit catalog stock/prices from the admin page.
 *
 * Guard: requires the `x-admin-key` header to match the ADMIN_KEY env var.
 * Fails closed when ADMIN_KEY is unset (no auth system exists yet, so this
 * is the minimal gate; the real phase swaps in sessions). The connection
 * uses the postgres role, which bypasses RLS as table owner — the anon-key
 * lockdown in scripts/rls-lockdown.mjs is unaffected.
 */
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { dbAvailable, getDb } from "@/lib/db/client";
import { products } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

type PatchBody = {
  id?: unknown;
  stock?: unknown;
  price?: unknown;
  wholesale?: unknown;
};

const NUMERIC_FIELDS = ["stock", "price", "wholesale"] as const;
type NumericField = (typeof NUMERIC_FIELDS)[number];

function isNonNegInt(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

/** POST /api/admin/products — list the catalog for the admin table (same guard). */
export async function POST(req: Request) {
  const key = process.env.ADMIN_KEY;
  const provided = req.headers.get("x-admin-key");
  if (!key || !provided || provided !== key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!dbAvailable()) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 503 });
  }

  try {
    const rows = await getDb()
      .select({
        id: products.id,
        name: products.name,
        category: products.category,
        price: products.price,
        wholesale: products.wholesale,
        stock: products.stock,
      })
      .from(products)
      .orderBy(asc(products.displayOrder));
    return NextResponse.json({ products: rows });
  } catch (err) {
    console.error("[admin] catalog list failed:", err);
    return NextResponse.json({ error: "List failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const key = process.env.ADMIN_KEY;
  const provided = req.headers.get("x-admin-key");
  if (!key || !provided || provided !== key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!dbAvailable()) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 503 });
  }

  let body: PatchBody;
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id } = body;
  if (typeof id !== "string" || id.length === 0) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const updates: Partial<Record<NumericField, number>> = {};
  for (const field of NUMERIC_FIELDS) {
    const v = body[field];
    if (v === undefined) continue;
    if (!isNonNegInt(v)) {
      return NextResponse.json(
        { error: `${field} must be a non-negative integer` },
        { status: 400 },
      );
    }
    updates[field] = v;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const updated = await getDb()
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning({
        id: products.id,
        stock: products.stock,
        price: products.price,
        wholesale: products.wholesale,
      });

    if (updated.length === 0) {
      return NextResponse.json({ error: `Unknown product id: ${id}` }, { status: 404 });
    }
    return NextResponse.json({ product: updated[0] });
  } catch (err) {
    console.error("[admin] product update failed:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
