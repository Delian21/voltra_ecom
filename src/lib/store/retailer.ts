"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RetailerApplication, RetailerStatus } from "@/lib/types";

/**
 * Mock phase-2 retailer gate (PLAN.md §2, audience model). No backend: the
 * application lifecycle lives in this browser, mirroring the sample-data
 * approach of the rest of the prototype. Backend phase replaces this with
 * API calls; components never change.
 */
interface RetailerState {
  status: RetailerStatus;
  application: RetailerApplication | null;
  apply: (app: Omit<RetailerApplication, "appliedAt">) => void;
  approve: () => void;
  reject: () => void;
  reset: () => void;
}

export const useRetailer = create<RetailerState>()(
  persist(
    (set) => ({
      status: "none",
      application: null,
      apply: (app) =>
        set({
          status: "applied",
          application: { ...app, appliedAt: Date.now() },
        }),
      approve: () => set({ status: "approved" }),
      reject: () => set({ status: "rejected" }),
      reset: () => set({ status: "none", application: null }),
    }),
    { name: "voltra-retailer" },
  ),
);