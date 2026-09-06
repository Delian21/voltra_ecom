"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotificationPrefs } from "@/lib/types";

interface PrefsState extends NotificationPrefs {
  toggle: (key: keyof NotificationPrefs) => void;
}

const DEFAULTS: NotificationPrefs = {
  whatsapp: true,
  sms: false,
  email: true,
};

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      toggle: (key) => set((s) => ({ ...s, [key]: !s[key] })),
    }),
    { name: "voltra-prefs" },
  ),
);