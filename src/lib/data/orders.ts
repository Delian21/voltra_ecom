/**
 * Mock order seam (checkout flow phase).
 *
 * Today: in-memory store of mock-placed orders for this browser session.
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

let nextId = 1000;

function freshId(): string {
  nextId += 1;
  return `ORD-${String(nextId).padStart(4, "0")}`;
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
 * 오늘도 mock-first: the dashboard mixes the existing illustrative sample
 * orders with any mock-placed orders from this browser session.
 */
export function listMockOrders(): ReadonlyArray<Order> {
  return readOrders();
}

/** Clear persisted mock orders (useful for tests/dev resets). */
export function clearMockOrders(): void {
  writeOrders([]);
}
