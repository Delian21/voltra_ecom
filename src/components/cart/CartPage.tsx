"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { CartLines } from "@/components/cart/CartLines";
import { useCartSummary } from "@/components/cart/useCartSummary";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/components/product/PriceTag";

export function CartPage() {
  const { items, count, total, saved } = useCartSummary();

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-volt-text transition-colors hover:text-volt"
      >
        <ArrowLeft className="size-3.5" /> Continue shopping
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-hi md:text-4xl">
        Your cart
      </h1>

      {total === 0 ? (
        <CartLines />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="border-t border-line">
            <CartLines />
          </div>
          <aside className="h-fit rounded-xl border border-line bg-bg1 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
              Order summary
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink-mid">Items</dt>
                <dd className="font-mono text-ink-hi">{count}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-mid">Subtotal</dt>
                <dd className="font-mono text-ink-hi">{formatNaira(total)}</dd>
              </div>
              {saved > 0 && (
                <div className="flex items-center justify-between border-t border-line">
                  <dt className="text-ink-mid">You&apos;re saving</dt>
                  <dd className="font-mono text-ink-hi text-good">
                    {formatNaira(saved)}
                    <span className="text-[10px] text-ink-low"> vs. retail</span>
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-line pt-3">
                <dt className="font-medium text-ink-hi">Total</dt>
                <dd className="font-mono text-xl font-semibold text-ink-hi">
                  {formatNaira(total)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 font-mono text-[10px] text-ink-low">
              Wholesale lines step by 10
            </p>
            {/* Desktop checkout button */}
            <div className="hidden sm:block">
              <Button
                className="mt-5 w-full"
                onClick={() =>
                  toast("Checkout is a prototype — the payment backend comes later")
                }
              >
                Checkout (prototype — not live)
              </Button>
              <p className="mt-3 text-center text-[11px] text-ink-low">
                Paystack · Flutterwave · Cash/POS on delivery — coming with the
                backend.
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Sticky mobile checkout footer */}
      {total > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-bg0/95 backdrop-blur-sm sm:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-ink-low">Total</span>
              <span className="font-mono text-lg font-semibold text-ink-hi">
                {formatNaira(total)}
              </span>
            </div>
            <Button
              size="lg"
              className="flex-1"
              onClick={() =>
                toast("Checkout is a prototype — the payment backend comes later")
              }
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}