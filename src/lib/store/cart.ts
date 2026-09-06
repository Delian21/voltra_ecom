"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuth } from "@/lib/store/auth";
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
          const line: CartLine = {
            id,
            mode,
            qty: (existing?.qty ?? 0) + stepFor(mode),
          };
          return scope === "account"
            ? { account: { ...s.account, [id]: line } }
            : { guest: { ...s.guest, [id]: line } };
        }),
      updateQty: (id, delta) =>
        set((s) => {
          const scope = activeScope();
          const entry = s[scope][id];
          if (!entry) return s;
          const qty = entry.qty + delta;
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
            merged[id] = existing
              ? { ...existing, qty: existing.qty + line.qty }
              : line;
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