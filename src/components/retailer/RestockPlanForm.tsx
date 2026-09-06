"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRestock, selectPlanCount } from "@/lib/store/restock";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function RestockPlanForm({ products }: { products: Product[] }) {
  const [shopName, setShopName] = useState("");
  const [day, setDay] = useState("Tuesday");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const plans = useRestock((s) => s.plans);
  const planCount = useRestock(selectPlanCount);
  const addPlan = useRestock((s) => s.addPlan);

  const toggleSku = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const save = () => {
    if (!shopName.trim() || selected.size === 0) {
      toast("Add a shop name and pick a product");
      return;
    }
    addPlan({
      shopName: shopName.trim(),
      day,
      skus: [...selected],
    });
    toast.success("Restock plan saved — we'll remind you before you run out");
    setShopName("");
    setSelected(new Set());
  };

  return (
    <div className="rounded-xl border border-line bg-bg1 p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-volt-text">
        Restock plan
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink-hi">
        Set up an auto-restock plan
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-6 text-ink-mid">
        We'll check your stock and remind you before you run out.
      </p>

      <div className="mt-7 space-y-6">
        <div>
          <label
            htmlFor="rs-shop"
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low"
          >
            Shop name
          </label>
          <input
            id="rs-shop"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="e.g. Emeka Electronics"
            className="h-10 w-full rounded-lg border border-line-strong bg-bg2 px-3 text-sm text-ink-hi outline-none transition-colors placeholder:text-ink-low focus-visible:border-volt focus-visible:ring-3 focus-visible:ring-volt/50"
          />
        </div>

        <div>
          <label
            htmlFor="rs-day"
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low"
          >
            Preferred check-in day
          </label>
          <select
            id="rs-day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="h-10 w-full rounded-lg border border-line-strong bg-bg2 px-3 text-sm text-ink-hi outline-none transition-colors focus-visible:border-volt focus-visible:ring-3 focus-visible:ring-volt/50"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-low">
            Products to track
          </p>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => {
              const active = selected.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleSku(p.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-volt bg-volt/10 text-volt-text"
                      : "border-line-strong bg-bg2 text-ink-mid hover:border-ink-low hover:text-ink-hi",
                  )}
                >
                  {p.name.replace("Voltra ", "")}
                </button>
              );
            })}
          </div>
        </div>

        <Button className="w-full" onClick={save}>
          Save restock plan
        </Button>
      </div>

      {planCount > 0 && (
        <div className="mt-8 border-t border-line pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
            Your saved plans ({planCount})
          </p>
          <ul className="mt-3 space-y-2.5">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-line bg-bg2 px-4 py-3"
              >
                <span className="text-[13px] text-ink-hi">
                  {plan.shopName} — every {plan.day}
                </span>
                <span className="font-mono text-[10.5px] text-ink-low">
                  {plan.skus.length} SKU{plan.skus.length === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}