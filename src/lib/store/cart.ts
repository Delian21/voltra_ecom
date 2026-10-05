"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuth } from "@/lib/store/auth";
import { getProductSync } from "@/lib/data/catalog.shared";
import type { CartLine, PricingMode } from "@/lib/types";

/**
 * Cart with guest/account scopes (PLAN.md §4). Signed-out visitors edit the
 * guest cart; on sign-in the guest cart merges into the account cart and
 * clears. Each action targets the scope implied by the auth store.
 */
interface CartState {
  guest: Record<string, CartLine>;
  account: Record<string, CartLine>;
  add: (id: string, mode: PricingMode) => void;
  updateQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  mergeGuestIntoAccount: () => void;
}

/** Prototype parity: wholesale lines step by 10, unit lines by 1. */
function stepFor(mode: PricingMode): number {
  return mode === "wholesale" ? 10 : 1;
}

/** Largest qty allowed in a mode: stock floored to the mode's step, or null when the product is unknown. */
function stockCap(id: string, mode: PricingMode): number | null {
  const product = getProductSync(id);
  if (!product) return null;
  const step = stepFor(mode);
  return Math.floor(product.stock / step) * step;
}

/** Clamp a requested qty to the mode's stock cap (no cap when the product is unknown). */
function capQty(qty: number, id: string, mode: PricingMode): number {
  const cap = stockCap(id, mode);
  return cap === null ? qty : Math.min(qty, cap);
}

/** Scope for writes: account while signed in, guest otherwise. */
function activeScope(): "guest" | "account" {
  return useAuth.getState().user ? "account" : "guest";
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      guest: {},
      account: {},
      add: (id, mode) =>
        set((s) => {
          const scope = activeScope();
          const existing = s[scope][id];
          // Switching mode resets the line — retail qty never carries into wholesale.
          const base = existing?.mode === mode ? existing.qty : 0;
          const qty = capQty(base + stepFor(mode), id, mode);
          const next = { ...s[scope] };
          if (qty <= 0) delete next[id];
          else next[id] = { id, mode, qty };
          return scope === "account" ? { account: next } : { guest: next };
        }),
      updateQty: (id, delta) =>
        set((s) => {
          const scope = activeScope();
          const entry = s[scope][id];
          if (!entry) return s;
          // Step by the line's own mode, never by whatever delta the UI sends.
          const moved = entry.qty + Math.sign(delta) * stepFor(entry.mode);
          const qty = capQty(moved, id, entry.mode);
          const next = { ...s[scope] };
          if (qty <= 0) delete next[id];
          else next[id] = { ...entry, qty };
          return scope === "account" ? { account: next } : { guest: next };
        }),
      remove: (id) =>
        set((s) => {
          const scope = activeScope();
          const next = { ...s[scope] };
          delete next[id];
          return scope === "account" ? { account: next } : { guest: next };
        }),
      clear: () =>
        set(() => {
          const scope = activeScope();
          return scope === "account" ? { account: {} } : { guest: {} };
        }),
      mergeGuestIntoAccount: () =>
        set((s) => {
          const merged = { ...s.account };
          for (const [id, line] of Object.entries(s.guest)) {
            const existing = merged[id];
            if (!existing) {
              const qty = capQty(line.qty, id, line.mode);
              if (qty > 0) merged[id] = { ...line, qty };
              continue;
            }
            // A mode conflict keeps the account line and drops the guest line.
            if (existing.mode !== line.mode) continue;
            const qty = capQty(existing.qty + line.qty, id, existing.mode);
            if (qty > 0) merged[id] = { ...existing, qty };
            else delete merged[id];
          }
          return { account: merged, guest: {} };
        }),
    }),
    {
      name: "voltra-cart",
      version: 2,
      migrate: (persisted, version) => {
        const p = persisted as Record<string, unknown>;
        if (version < 2) {
          // Pre-merge carts stored a single `items` map — adopt it as guest.
          const legacy = p.items as Record<string, CartLine> | undefined;
          return { guest: legacy ?? {}, account: {} };
        }
        return p;
      },
    },
  ),
);