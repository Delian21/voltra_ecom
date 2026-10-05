"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { formatNaira } from "@/components/product/PriceTag";
import type { Product } from "@/lib/types";

export function BulkCatalog({ products }: { products: Product[] }) {
  const add = useCart((s) => s.add);

  return (
    <div className="rounded-xl border border-line bg-bg1 p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-volt-text">
        Bulk order
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink-hi">
        Bulk pricing by product
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-6 text-ink-mid">
        Minimum order of 10 units per SKU. Prices shown are wholesale — lines
        are added to your cart in steps of 10.
      </p>

      <ul className="mt-6">
        {products.map((p, i) => (
          <li
            key={p.id}
            className={`flex flex-wrap items-center justify-between gap-3 py-4 ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-ink-hi">
                {p.name}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-ink-low">
                {formatNaira(p.wholesale)} / unit · min 10
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button
                size="sm"
                disabled={p.stock < 10}
                onClick={() => {
                  add(p.id, "wholesale");
                  toast.success(
                    `Added ×10 (wholesale) — ${formatNaira(p.wholesale)}/unit · ${p.name}`,
                  );
                }}
              >
                Add ×10
              </Button>
              {p.stock < 10 && (
                <span className="font-mono text-[10px] text-ink-low">
                  Min 10 units for wholesale
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <span className="font-mono text-[10.5px] text-ink-low">
          Wholesale lines step by 10 · trade credit available
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/retailer/quote"
            className="font-mono text-xs text-volt-text transition-colors hover:text-volt"
          >
            Request a quote instead →
          </Link>
          <Link
            href="/cart"
            className="font-mono text-xs text-volt-text transition-colors hover:text-volt"
          >
            View cart →
          </Link>
        </div>
      </div>
    </div>
  );
}