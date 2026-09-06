"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RestockPlan } from "@/lib/types";

interface RestockState {
  plans: RestockPlan[];
  addPlan: (plan: Omit<RestockPlan, "id">) => void;
}

export const useRestock = create<RestockState>()(
  persist(
    (set) => ({
      plans: [],
      addPlan: (plan) =>
        set((s) => ({
          plans: [...s.plans, { ...plan, id: Date.now() }],
        })),
    }),
    { name: "voltra-restock" },
  ),
);

export const selectPlanCount = (s: RestockState) => s.plans.length;