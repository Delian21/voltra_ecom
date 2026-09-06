"use client";

import { useMemo } from "react";
import { useCart } from "@/lib/store/cart";
import { useAuth } from "@/lib/store/auth";
import { getProductSync } from "@/lib/data/catalog";
import type { CartLine, Product } from "@/lib/types";

export interface CartSummaryLine {
  line: CartLine;
  product: Product;
  unitPrice: number;
  lineTotal: number;
  retailTotal: number;
  saved: number;
}

export function useCartSummary() {
  const user = useAuth((s) => s.user);
  const scope = useCart((s) => (user ? s.account : s.guest));

  return useMemo(() => {
    const items = Object.values(scope)
      .map((line): CartSummaryLine | null => {
        const product = getProductSync(line.id);
        if (!product) return null;
        const unitPrice =
          line.mode === "wholesale" ? product.wholesale : product.price;
        const unitPriceRetail = product.price;
        const lineTotal = unitPrice * line.qty;
        const retailTotal = unitPriceRetail * line.qty;
        const saved = retailTotal - lineTotal;
        return { line, product, unitPrice, lineTotal, retailTotal, saved };
      })
      .filter((x): x is CartSummaryLine => x !== null);

    const count = items.reduce((n, i) => n + i.line.qty, 0);
    const total = items.reduce((n, i) => n + i.lineTotal, 0);
    const saved = items.reduce((n, i) => n + i.saved, 0);
    return { items, count, total, saved };
  }, [scope]);
}

export function buyerDisplayName(): string | null {
  return useAuth.getState().user ?? null;
}