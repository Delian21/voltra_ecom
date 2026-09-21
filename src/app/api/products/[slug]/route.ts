/**
 * GET /api/products/[slug] — one product by slug.
 * 404 when unknown. Falls back to mock data when DATABASE_URL is absent.
 */
import { NextResponse } from "next/server";

import { getProduct } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}
