/**
 * GET /api/products — full catalog list.
 * Reads from the DB via the data layer; falls back to the same mock seed the
 * app used pre-backend, so preview builds without DATABASE_URL still work.
 */
import { NextResponse } from "next/server";

import { listProducts } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ products });
}
