"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Mock auth (PLAN.md §4 seam). No backend yet — signing in just records a
 * name in this browser. The real phase swaps this for sessions; the
 * guest→account cart merge exercises the seam now.
 */
interface AuthState {
  user: string | null;
  signIn: (name: string) => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (name) => set({ user: name.trim() }),
      signOut: () => set({ user: null }),
    }),
    { name: "voltra-auth" },
  ),
);