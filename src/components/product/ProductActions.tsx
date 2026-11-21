"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
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
  const updateQty = useCart((s) => s.updateQty);
  const saveTotal = product.price * 10 - product.wholesale * 10;
  const savePct = savingsPercent(product.price, product.wholesale);
  const outOfStock = product.stock <= 0;
  const wholesaleBlocked = product.stock < 10;
  const [qty, setQty] = useState(1);
  const maxQty = Math.max(1, product.stock);
  const atMax = qty >= maxQty;

  function addToCart() {
    add(product.id, "unit");
    // The store steps unit lines by one, so top up to the chosen quantity.
    if (qty > 1) updateQty(product.id, qty - 1);
    toast(`Added ×${qty} — ${formatNaira(product.price)} each · ${product.name}`, {
      action: {
        label: "Undo",
        onClick: () => {
          remove(product.id);
          toast.success(`Undid — ${product.name}`);
        },
      },
    });
  }

  function addWholesale() {
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
  }

  const stepper = (
    <div className="flex h-12 items-stretch rounded-lg border border-line bg-bg1">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={qty <= 1}
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className="grid w-10 place-items-center text-ink-mid transition-colors hover:text-volt-text disabled:opacity-35 disabled:hover:text-ink-mid"
      >
        <Minus className="size-4" />
      </button>
      <span
        aria-live="polite"
        className="grid w-9 place-items-center font-mono text-sm text-ink-hi"
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={atMax}
        onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
        className="grid w-10 place-items-center text-ink-mid transition-colors hover:text-volt-text disabled:opacity-35 disabled:hover:text-ink-mid"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile add-to-cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-bg0/95 backdrop-blur-sm sm:hidden">
        <div className="flex items-center gap-2.5 py-3 pl-4 pr-[76px]">
          {stepper}
          <Button
            className="h-12 flex-1 font-semibold"
            disabled={outOfStock}
            onClick={addToCart}
          >
            {outOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>

      {/* Desktop: quantity + actions */}
      <div className="mt-7 hidden sm:block">
        <div className="flex flex-wrap gap-2.5">
          {stepper}
          <Button
            className="h-12 flex-1 px-6 text-[15px] font-semibold"
            disabled={outOfStock}
            onClick={addToCart}
          >
            {outOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button
            variant="ghost"
            className="h-10 border border-line px-4 text-[13px] text-ink-hi hover:bg-bg2"
            disabled={wholesaleBlocked}
            onClick={addWholesale}
          >
            Add ×10 at wholesale
          </Button>
          {wholesaleBlocked ? (
            <span className="font-mono text-[10.5px] text-ink-low">
              Min 10 units for wholesale
            </span>
          ) : (
            <button
              type="button"
              onClick={() => toast("You will be notified if stock runs low")}
              className="text-[13px] text-ink-mid underline-offset-4 transition-colors hover:text-volt-text hover:underline"
            >
              Notify me if this runs low
            </button>
          )}
        </div>
      </div>

      {/* Wholesale savings note */}
      <div className="mt-4 rounded-xl border border-line bg-bg2 p-4">
        <p className="text-[13px] leading-6 text-ink-mid">
          Buy 10 at {formatNaira(product.wholesale)}/unit and save{" "}
          <span className="font-medium text-good">
            {formatNaira(saveTotal)} ({savePct}%)
          </span>{" "}
          vs. retail.
        </p>
        <p className="mt-1 text-[13px] leading-6 text-ink-low">
          {deliveryEstimate(product.stock)}
        </p>
      </div>
    </>
  );
}
