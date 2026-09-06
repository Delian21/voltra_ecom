"use client";

import { CreditCard, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { usePrefs } from "@/lib/store/prefs";

const CHANNELS = [
  {
    key: "whatsapp" as const,
    label: "WhatsApp",
    desc: "Order updates and restock reminders, delivered to your WhatsApp.",
  },
  {
    key: "sms" as const,
    label: "SMS",
    desc: "Text alerts when it matters — low stock and delivery confirmations.",
  },
  {
    key: "email" as const,
    label: "Email",
    desc: "Invoices, order receipts, and account notices.",
  },
];

const PAYMENTS = [
  { name: "Paystack", note: "Card, transfer & USSD" },
  { name: "Flutterwave", note: "Card, bank & mobile money" },
  { name: "Cash / POS on delivery", note: "Pay when it arrives" },
];

export function SettingsPage() {
  const prefs = usePrefs();

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-volt-text">
        Account & preferences
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-hi md:text-4xl">
        Settings
      </h1>

      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="size-4 text-ink-low" />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
            Restock & order notifications
          </h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-bg1">
          {CHANNELS.map((ch, i) => (
            <div
              key={ch.key}
              className={`flex items-center justify-between gap-4 px-5 py-4 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-ink-hi">{ch.label}</p>
                <p className="mt-0.5 text-xs text-ink-mid">{ch.desc}</p>
              </div>
              <Switch
                checked={prefs[ch.key]}
                onCheckedChange={() => prefs.toggle(ch.key)}
                aria-label={`${ch.label} notifications`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="size-4 text-ink-low" />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
            Payment methods
          </h2>
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-bg1">
          {PAYMENTS.map((p, i) => (
            <div
              key={p.name}
              className={`flex items-center justify-between px-5 py-4 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-ink-hi">{p.name}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-ink-low">
                  {p.note}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10.5px] text-ink-low">
          Saved payment methods come with the backend — this prototype lists
          the channels Voltra will accept.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
          Account
        </h2>
        <div className="rounded-xl border border-line bg-bg1 px-5 py-4">
          <p className="text-sm text-ink-mid">
            Sign-in & account management — not part of this prototype
          </p>
        </div>
      </section>
    </div>
  );
}