/**
 * GET /api/products — full catalog list.
 * Serves the bundled seed through the data layer.
 */
import { NextResponse } from "next/server";

import { listProducts } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ products });
}
