/**
 * POST /api/orders — create a retail order server-side.
 *
 * The client sends buyer details and line quantities only; prices and the
 * total are computed from DB rows inside createOrder.
 */
import { NextResponse } from "next/server";

import { createOrder } from "@/lib/data/orders.server";

export async function POST(request: Request) {
  // Kill switch: ordering stays closed until ORDERS_ENABLED is explicitly true.
  if (process.env.ORDERS_ENABLED !== "true") {
    return NextResponse.json({ error: "Ordering is not open yet" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await createOrder(
    body as {
      buyerName: string;
      buyerPhone: string;
      deliveryAddress: string;
      lines: { productId: string; qty: number }[];
    },
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(
    { orderId: result.orderId, total: result.total },
    { status: 201 },
  );
}
