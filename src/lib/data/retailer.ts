/**
 * Retailer data seam (PLAN.md §4). Figures are illustrative sample data for
 * the prototype — flagged as such in the UI. Backend phase replaces these
 * implementations; call sites never change.
 */
import type { Order, RetailerAccount } from "@/lib/types";
import { listMockOrders } from "./orders";

const SAMPLE_ORDERS: ReadonlyArray<Order> = [
  {
    id: "ORD-1042",
    date: "Aug 22, 2026",
    items: "20 × Power Bank, 10 × Earbuds Pro",
    total: 585000,
    status: "Delivered",
    buyer: null,
  },
  {
    id: "ORD-1031",
    date: "Aug 15, 2026",
    items: "15 × Earbuds Lite, 20 × Cable Set",
    total: 273000,
    status: "Delivered",
    buyer: null,
  },
  {
    id: "ORD-1019",
    date: "Aug 8, 2026",
    items: "10 × Over-Ear Headset",
    total: 190000,
    status: "Delivered",
    buyer: null,
  },
];

export async function getRetailerAccount(): Promise<RetailerAccount> {
  return {
    balance: 48000,
    balanceDueDays: 6,
    ordersThisMonth: 3,
    totalSpent90: 1048000,
  };
}

export async function listRecentOrders(): Promise<Order[]> {
  const mock = [...listMockOrders()];
  return mock.length > 0 ? [...mock, ...SAMPLE_ORDERS] : [...SAMPLE_ORDERS];
}

/**
 * Optional richer query for surfaces that want to render the buyer field
 * alongside the sample orders. Kept separate so the default retailer data
 * seam stays focused on the current dashboard shape.
 */
export async function listRecentOrdersWithBuyer(): Promise<
  Array<Order & { buyer: string | null }>
> {
  const mock = [...listMockOrders()];
  return mock.length > 0
    ? [...mock, ...SAMPLE_ORDERS.map((o) => ({ ...o, buyer: null }))]
    : SAMPLE_ORDERS.map((o) => ({ ...o, buyer: null }));
}
