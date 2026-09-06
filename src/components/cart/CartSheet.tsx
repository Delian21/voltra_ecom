"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartLines } from "@/components/cart/CartLines";
import { useCartSummary } from "@/components/cart/useCartSummary";
import { formatNaira } from "@/components/product/PriceTag";

export function CartSheet() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { count, total, saved } = useCartSummary();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={`Open cart${count > 0 ? `, ${count} items` : ""}`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-bg1 text-ink-mid transition-colors hover:border-volt hover:text-ink-hi"
      >
        <ShoppingCart className="size-4" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-volt px-1 font-mono text-[9px] font-semibold text-volt-ink">
            {count}
          </span>
        )}
      </button>

      {/* Rendered via portal so no ancestor (sticky header with backdrop-blur,
          animated nav with transform) becomes the containing block for the
          fixed overlay — which would clip the sheet to the header strip. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50">
            <div
              aria-hidden
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs animate-in fade-in-0 duration-200"
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Your cart"
              onClickCapture={(e) => {
                // Navigating from a link inside the sheet (cross-sell cards,
                // "See full shop") must dismiss the sheet — it is portaled to
                // body, so it would otherwise stay open over the new page and
                // the body scroll-lock would follow the user there.
                if ((e.target as HTMLElement).closest("a[href]")) {
                  setOpen(false);
                }
              }}
              className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-line bg-bg1 shadow-2xl animate-in slide-in-from-right-10 ease-out duration-200"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-display text-lg text-ink-hi">Your cart</h2>
                <button
                  type="button"
                  aria-label="Close cart"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink-low transition-colors hover:bg-bg2 hover:text-ink-hi"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5">
                <CartLines />
              </div>
              {total > 0 && (
                <div className="border-t border-line bg-bg0 px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-ink-mid">Total</span>
                    <span className="font-mono text-lg font-semibold text-ink-hi">
                      {formatNaira(total)}
                    </span>
                  </div>
                  {saved > 0 && (
                    <p className="mb-2 font-mono text-[10px] text-good">
                      Saving {formatNaira(saved)} vs. retail
                    </p>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      router.push("/checkout");
                    }}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </aside>
          </div>,
          document.body,
        )}
    </>
  );
}
