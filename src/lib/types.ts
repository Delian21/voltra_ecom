/** Core domain types for Voltra (PLAN.md §4 — the mock-first data seam). */
import type { StaticImageData } from "next/image";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  meta: string;
  desc: string;
  /** Retail price in ₦. */
  price: number;
  /** Wholesale price in ₦, minimum 10 units per SKU. */
  wholesale: number;
  stock: number;
  /** Placeholder art until real product imagery exists (PLAN §4). Also used as fallback if the photo fails to load. */
  glyph: string;
  /** Primary product photo (Pexels demo imagery; see src/lib/data/imageCredits.ts). */
  image: StaticImageData;
  /** Gallery angles for the detail page (includes the primary photo). */
  gallery: StaticImageData[];
  specs: string[];
}

export type PricingMode = "unit" | "wholesale";

export interface CartLine {
  id: string;
  qty: number;
  mode: PricingMode;
}

export interface RestockPlan {
  id: number;
  shopName: string;
  day: string;
  skus: string[];
}

export interface NotificationPrefs {
  whatsapp: boolean;
  sms: boolean;
  email: boolean;
}

export interface RetailerAccount {
  /** Outstanding trade-credit balance in ₦. */
  balance: number;
  /** Days until the balance is due. */
  balanceDueDays: number;
  ordersThisMonth: number;
  totalSpent90: number;
}

export interface Order {
  id: string;
  date: string;
  items: string;
  total: number;
  status: string;
  /** Mock-phase buyer identifier: signed-in name when available, otherwise the delivery phone used at checkout. */
  buyer: string | null;
}

/** Itemized line on a wholesale quote request (RFQ flow). */
export interface QuoteLine {
  productId: string;
  name: string;
  /** Wholesale unit price in ₦, snapshotted at request time. */
  wholesale: number;
  qty: number;
}

/** A submitted quote request (mock, no backend — stored per-browser). */
export interface QuoteRequest {
  id: string;
  company: string;
  whatsapp: string;
  notes: string;
  lines: QuoteLine[];
  status: "submitted";
  createdAt: number;
}

/** Retailer application lifecycle for the phase-2 gate (mock, no backend). */
export type RetailerStatus = "none" | "applied" | "approved" | "rejected";

export interface RetailerApplication {
  shopName: string;
  whatsapp: string;
  businessType: string;
  monthlyVolume: string;
  requestCredit: boolean;
  appliedAt: number;
}

/**
 * Prototype in-site messaging shapes (mock inbox phase).
 *
 * Today this is a small local thread + message model for the demo inbox.
 * Backend phase replaces storage; the shapes stay similar.
 */

export interface ThreadParticipant {
  id: string;
  name: string;
  role: "customer" | "retailer" | "support";
}

export interface Message {
  id: string;
  /** Local, human-readable timestamp for the prototype. */
  sentAt: string;
  authorId: string;
  text: string;
}

export interface Thread {
  id: string;
  /** When the thread was created, as a readable string in this prototype. */
  createdAt: string;
  participants: ThreadParticipant[];
  topic: string;
  status: "open" | "closed";
}