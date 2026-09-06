"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/components/product/PriceTag";
import { useCart } from "@/lib/store/cart";
import type { Product } from "@/lib/types";

function savingsPercent(retail: number, wholesale: number): number {
  return Math.round(((retail - wholesale) / retail) * 100);
}

function deliveryEstimate(stock: number): string {
  if (stock > 150) return "Ships today · Lagos + 1–2 days nationwide";
  if (stock > 60) return "Ships within 2 days · Lagos + 1–3 days nationwide";
  return "Ships within 5 days · Lagos + 3–7 days nationwide";
}

export function ProductActions({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const saveTotal = product.price * 10 - product.wholesale * 10;
  const savePct = savingsPercent(product.price, product.wholesale);

  return (
    <>
      {/* Sticky mobile add-to-cart bar with savings preview */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-bg0/95 backdrop-blur-sm sm:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-ink-low">Wholesale saves</span>
            <span className="font-mono text-sm font-semibold text-good">
              ₦{saveTotal.toLocaleString("en-NG")} ({savePct}%) on ×10
            </span>
          </div>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => {
              add(product.id, "unit");
              toast(
                `Added — ${formatNaira(product.price)} · ${product.name}`,
                {
                  action: {
                    label: "Undo",
                    onClick: () => {
                      remove(product.id);
                      toast.success(`Undid — ${product.name}`);
                    },
                  },
                },
              );
            }}
          >
            Add to cart
          </Button>
        </div>
      </div>

      {/* Desktop: actions */}
      <div className="mt-7 hidden sm:flex flex-wrap gap-3">
        <Button
          size="lg"
          onClick={() => {
            add(product.id, "unit");
            toast(
              `Added — ${formatNaira(product.price)} · ${product.name}`,
              {
                action: {
                  label: "Undo",
                  onClick: () => {
                    remove(product.id);
                    toast.success(`Undid — ${product.name}`);
                  },
                },
              },
            );
          }}
        >
          Add to cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => {
            add(product.id, "wholesale");
            toast(
              `Added ×10 (wholesale) — ${formatNaira(product.wholesale)}/unit · ${product.name}`,
              {
                action: {
                  label: "Undo",
                  onClick: () => {
                    remove(product.id);
                    toast.success(`Undid ×10 — ${product.name}`);
                  },
                },
              },
            );
          }}
        >
          Add ×10 at wholesale
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => toast("You will be notified if stock runs low")}
        >
          Notify me if this runs low
        </Button>
      </div>

      {/* Wholesale savings display */}
      <div className="mt-4 rounded-xl border border-line bg-bg2 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
            Wholesale savings
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
            Delivery
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-ink-mid">
              Buy 10 at wholesale: {formatNaira(product.wholesale)}/unit
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-good">
              You save {formatNaira(saveTotal)} ({savePct}%) vs. retail
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-ink-mid">{deliveryEstimate(product.stock)}</p>
          </div>
          <Button
            size="lg"
            className="flex-shrink-0"
            onClick={() => {
              add(product.id, "wholesale");
              toast(
                `Added ×10 (wholesale) — ${formatNaira(product.wholesale)}/unit · ${product.name}`,
                {
                  action: {
                    label: "Undo",
                    onClick: () => {
                      remove(product.id);
                      toast.success(`Undid ×10 — ${product.name}`);
                    },
                  },
                },
              );
            }}
          >
            Add ×10
          </Button>
        </div>
      </div>
    </>
  );
}