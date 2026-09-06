"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuoteLine, QuoteRequest } from "@/lib/types";

/**
 * Mock-phase quote requests (RFQ flow). No backend: drafts and submissions
 * live in this browser, mirroring the sample-data approach of the rest of
 * the prototype. The backend phase replaces storage; components never change.
 */
interface QuotesState {
  /** Draft quantities keyed by product id (absent = not requested). */
  draft: Record<string, number>;
  submissions: QuoteRequest[];
  setQty: (productId: string, qty: number) => void;
  submit: (
    meta: { company: string; whatsapp: string; notes: string },
    lines: QuoteLine[],
  ) => void;
}

export const useQuotes = create<QuotesState>()(
  persist(
    (set) => ({
      draft: {},
      submissions: [],
      setQty: (productId, qty) =>
        set((s) => {
          const next = { ...s.draft };
          if (qty > 0) next[productId] = qty;
          else delete next[productId];
          return { draft: next };
        }),
      submit: (meta, lines) =>
        set((s) => ({
          submissions: [
            {
              id: `QR-${Date.now().toString(36).toUpperCase()}`,
              ...meta,
              lines,
              status: "submitted",
              createdAt: Date.now(),
            },
            ...s.submissions,
          ],
          draft: {},
        })),
    }),
    { name: "voltra-quotes" },
  ),
);
