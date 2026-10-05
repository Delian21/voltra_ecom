/**
 * Mock order seam (checkout flow phase).
 *
 * Today: localStorage-backed store of mock-placed orders for this browser session.
 * Backend phase: same signatures, fetch-based implementations; call sites
 * never change.
 *
 * Orders are created by the checkout flow and rendered on the retailer
 * dashboard as recent orders. The retailer dashboard keeps its existing
 * sample-data disclaimer; newly placed prototype orders simply extend the
 * same list.
 */



import type { Order } from "@/lib/types";

const ORDERS_KEY = "voltra-orders";

function readOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // Storage full or unavailable — fail silently for the prototype.
  }
}

function freshId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `ORD-${time}${random}`;
}

function formattedDate(): string {
  return new Date().toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Persist a completed mock order and return it. */
export function recordOrder(order: Omit<Order, "id" | "date">): Order {
  const placed: Order = {
    ...order,
    id: freshId(),
    date: formattedDate(),
  };

  writeOrders([placed, ...readOrders()]);
  return placed;
}

/**
 * Recent orders visible on the retailer dashboard.
 *
 * The dashboard mixes the existing illustrative sample orders with any
 * mock-placed orders from this browser session.
 */
export function listMockOrders(): ReadonlyArray<Order> {
  return readOrders();
}

/** Clear persisted mock orders (useful for tests/dev resets). */
export function clearMockOrders(): void {
  writeOrders([]);
}
