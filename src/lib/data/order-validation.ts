/**
 * Pure order-input validation and normalisation — no database imports, so it
 * is safe to unit-test and to reuse from server code.
 */

export interface OrderLineInput {
  productId: string;
  qty: number;
}

export interface CreateOrderInput {
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  lines: OrderLineInput[];
}

export interface NormalisedOrderInput {
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  lines: OrderLineInput[];
}

export type ValidationResult =
  | { ok: true; value: NormalisedOrderInput }
  | { ok: false; error: string };

const PHONE_LOCAL = /^0\d{10}$/;
const PHONE_INTL = /^\+234\d{10}$/;
const MIN_NAME = 2;
const MAX_NAME = 80;
const MIN_ADDRESS = 5;
const MAX_ADDRESS = 300;
const MIN_LINES = 1;
const MAX_LINES = 20;
const MIN_QTY = 1;
const MAX_QTY = 50;

/** Normalise a Nigerian phone number to 0XXXXXXXXXX, or null when invalid. */
export function normalisePhone(raw: string): string | null {
  const value = raw.trim();
  if (PHONE_LOCAL.test(value)) return value;
  if (PHONE_INTL.test(value)) return "0" + value.slice(4);
  return null;
}

/** Merge duplicate product ids by summing qty, preserving first-seen order. */
export function mergeLines(lines: OrderLineInput[]): OrderLineInput[] {
  const merged = new Map<string, number>();
  for (const line of lines) {
    merged.set(line.productId, (merged.get(line.productId) ?? 0) + line.qty);
  }
  return [...merged].map(([productId, qty]) => ({ productId, qty }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Validate untrusted input and return a normalised order, or a user-facing error. */
export function validateOrderInput(input: unknown): ValidationResult {
  if (!isRecord(input)) return { ok: false, error: "Invalid order payload" };

  const buyerName = typeof input.buyerName === "string" ? input.buyerName.trim() : "";
  if (buyerName.length < MIN_NAME || buyerName.length > MAX_NAME) {
    return { ok: false, error: `Name must be ${MIN_NAME}–${MAX_NAME} characters` };
  }

  const buyerPhone =
    typeof input.buyerPhone === "string" ? normalisePhone(input.buyerPhone) : null;
  if (!buyerPhone) {
    return { ok: false, error: "Enter a valid Nigerian phone number" };
  }

  const deliveryAddress =
    typeof input.deliveryAddress === "string" ? input.deliveryAddress.trim() : "";
  if (deliveryAddress.length < MIN_ADDRESS || deliveryAddress.length > MAX_ADDRESS) {
    return { ok: false, error: `Address must be ${MIN_ADDRESS}–${MAX_ADDRESS} characters` };
  }

  if (!Array.isArray(input.lines) || input.lines.length < MIN_LINES || input.lines.length > MAX_LINES) {
    return { ok: false, error: `Order must have ${MIN_LINES}–${MAX_LINES} lines` };
  }

  const validated: OrderLineInput[] = [];
  for (const entry of input.lines) {
    if (!isRecord(entry)) return { ok: false, error: "Invalid order line" };
    const productId = typeof entry.productId === "string" ? entry.productId.trim() : "";
    if (!productId) return { ok: false, error: "Invalid product id" };
    if (
      typeof entry.qty !== "number" ||
      !Number.isInteger(entry.qty) ||
      entry.qty < MIN_QTY ||
      entry.qty > MAX_QTY
    ) {
      return { ok: false, error: `Quantity must be a whole number ${MIN_QTY}–${MAX_QTY}` };
    }
    validated.push({ productId, qty: entry.qty });
  }

  const lines = mergeLines(validated);
  if (lines.length < MIN_LINES || lines.length > MAX_LINES) {
    return { ok: false, error: `Order must have ${MIN_LINES}–${MAX_LINES} lines` };
  }

  return { ok: true, value: { buyerName, buyerPhone, deliveryAddress, lines } };
}
