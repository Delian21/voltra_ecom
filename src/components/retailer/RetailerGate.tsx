"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRetailer } from "@/lib/store/retailer";
import type { ReactNode } from "react";

const BUSINESS_TYPES = [
  "Electronics kiosk",
  "Retail store",
  "Online reseller",
  "Phone & accessory stand",
  "Other",
];

const VOLUMES = ["1–5 cartons", "6–20 cartons", "20+ cartons"];

const EYEBROW =
  "font-mono text-[10px] uppercase tracking-[0.16em] text-volt-text";
const LABEL =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low";
const FIELD =
  "h-10 w-full rounded-lg border border-line-strong bg-bg2 px-3 text-sm text-ink-hi outline-none transition-colors placeholder:text-ink-low focus-visible:border-volt focus-visible:ring-3 focus-visible:ring-volt/50";

function GateShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <p className={EYEBROW}>Retailer console · B2B</p>
      <div className="mt-4 rounded-xl border border-line bg-bg1 p-6 md:p-8">
        {children}
      </div>
      <p className="mt-5 font-mono text-[10.5px] leading-5 text-ink-low">
        Prototype gate — no real review happens. Your application lives in this
        browser only.
      </p>
    </div>
  );
}

export function RetailerGate({ children }: { children: ReactNode }) {
  const status = useRetailer((s) => s.status);

  if (status === "approved") return <>{children}</>;

  return (
    <GateShell>
      {status === "none" && <ApplicationForm />}
      {status === "applied" && <PendingScreen />}
      {status === "rejected" && <RejectedScreen />}
    </GateShell>
  );
}

function ApplicationForm() {
  const apply = useRetailer((s) => s.apply);
  const [shopName, setShopName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [monthlyVolume, setMonthlyVolume] = useState(VOLUMES[0]);
  const [requestCredit, setRequestCredit] = useState(true);

  const submit = () => {
    if (!shopName.trim() || !whatsapp.trim()) {
      toast("Add your shop name and WhatsApp number");
      return;
    }
    apply({
      shopName: shopName.trim(),
      whatsapp: whatsapp.trim(),
      businessType,
      monthlyVolume,
      requestCredit,
    });
    toast.success("Application submitted — we'll review it shortly");
  };

  return (
    <>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink-hi">
        Become a Voltra retailer
      </h1>
      <p className="mt-2 text-sm leading-6 text-ink-mid">
        Wholesale pricing from 10 units, trade credit on account, and restock
        plans that watch your stock. Approval takes about a day.
      </p>

      <div className="mt-7 space-y-5">
        <div>
          <label htmlFor="rg-shop" className={LABEL}>
            Shop name
          </label>
          <input
            id="rg-shop"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="e.g. Emeka Electronics"
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="rg-whatsapp" className={LABEL}>
            WhatsApp number
          </label>
          <input
            id="rg-whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="e.g. 0801 234 5678"
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="rg-type" className={LABEL}>
            Business type
          </label>
          <select
            id="rg-type"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className={FIELD}
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rg-volume" className={LABEL}>
            Monthly order volume
          </label>
          <select
            id="rg-volume"
            value={monthlyVolume}
            onChange={(e) => setMonthlyVolume(e.target.value)}
            className={FIELD}
          >
            {VOLUMES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            checked={requestCredit}
            onChange={(e) => setRequestCredit(e.target.checked)}
            className="mt-0.5 size-4 accent-volt"
          />
          <span className="text-[13px] leading-5 text-ink-mid">
            Request trade credit (30-day terms) — the exact limit is set at
            approval.
          </span>
        </label>

        <Button className="w-full" onClick={submit}>
          Apply for wholesale access
        </Button>
      </div>
    </>
  );
}

function PendingScreen() {
  const app = useRetailer((s) => s.application);
  const approve = useRetailer((s) => s.approve);
  const reject = useRetailer((s) => s.reject);
  const reset = useRetailer((s) => s.reset);

  return (
    <>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink-hi">
        Application received
      </h1>
      <p className="mt-2 text-sm leading-6 text-ink-mid">
        Thanks, {app?.shopName}. We&apos;re reviewing your application — most
        retailers hear back within 24–48 hours on WhatsApp.
      </p>

      <dl className="mt-6 space-y-0 overflow-hidden rounded-lg border border-line">
        {[
          ["Shop", app?.shopName],
          ["WhatsApp", app?.whatsapp],
          ["Business type", app?.businessType],
          ["Monthly volume", app?.monthlyVolume],
          ["Trade credit", app?.requestCredit ? "Requested" : "Not requested"],
        ].map(([k, v], i) => (
          <div
            key={k}
            className={`flex items-center justify-between gap-3 px-4 py-3 ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low">
              {k}
            </dt>
            <dd className="text-right text-[13px] font-medium text-ink-hi">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 space-y-2">
        <Button className="w-full" onClick={approve}>
          Approve application (demo)
        </Button>
        <Button className="w-full" variant="secondary" onClick={reject}>
          Decline (demo)
        </Button>
        <button
          type="button"
          onClick={() => reset()}
          className="w-full pt-1 text-center font-mono text-[11px] text-ink-low transition-colors hover:text-ink-hi"
        >
          Edit application details
        </button>
      </div>

      <p className="mt-5 font-mono text-[10.5px] leading-5 text-ink-low">
        In production this screen would sit with the Voltra team — approvals are
        manual and come with a credit limit.
      </p>
    </>
  );
}

function RejectedScreen() {
  const reset = useRetailer((s) => s.reset);

  return (
    <>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink-hi">
        Not approved this time
      </h1>
      <p className="mt-2 text-sm leading-6 text-ink-mid">
        Thanks for applying. We&apos;re not able to extend wholesale terms to this
        shop right now — you can still shop the catalog at retail, and we&apos;ll
        revisit applications as volumes grow.
      </p>
      <div className="mt-7 space-y-2">
        <Button
          className="w-full"
          onClick={() => {
            reset();
            toast("Starting a new application");
          }}
        >
          Apply again
        </Button>
        <Button className="w-full" variant="secondary" asChild>
          <Link href="/shop">Browse at retail instead</Link>
        </Button>
      </div>
    </>
  );
}